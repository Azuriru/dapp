<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Chart from '$lib/component/chart/chart.svelte';
	import { showToast } from '$lib/component/toasts/toast';
	import { truncateString } from '$lib/helper/helper';
	import { t } from '$lib/i18n';
	import { apiWithToken } from '$lib/plugins/http';
	import { connectedAddress } from '$lib/utils/wallet';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import TransactionHistory from '../transactionHistory/TransactionHistory.svelte';
	import { options } from './config';
	interface Coin {
		name: string;
		amount: string;
		debit: number;
		credit: number;
		is_deposit: number;
		is_swap: number;
		is_transfer: number;
		is_withdraw: number;
	}

	let wallet: string | null, walletData: Coin | null, weeklyDebit: any, weeklyCredit: any;

	const getCoinBalance = async () => {
		let resp = await apiWithToken('GET', '/walletInfo/wallet', {
			wallet: wallet
		});
		console.log(resp);
		if (resp.success) {
			walletData = resp.data;
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
	};

	const getGraphData = async () => {
		let resp = await apiWithToken('GET', '/walletInfo/transactionGraph', {
			wallet: wallet
		});
		if (resp.success) {
			// Extract dates and sort them
			const datesArray = Object.keys(resp.data).sort();
			// Assign sorted dates to xaxis
			options.xaxis.categories = datesArray;

			const debitArray = datesArray.map((date) => Number(resp.data[date].debit).toFixed(0));
			options.series[0].data = debitArray;

			const creditArray = datesArray.map((date) => Number(resp.data[date].credit).toFixed(0));
			options.series[1].data = creditArray;
			weeklyDebit = debitArray.reduce((sum, item) => sum + parseFloat(item), 0);
			weeklyCredit = creditArray.reduce((sum, item) => sum + parseFloat(item), 0);
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
	};

	onMount(async () => {
		wallet = $page.url.searchParams.get('wallet');
		getCoinBalance();
		getGraphData();
	});
</script>

<div class="max-w-[1300px] mx-auto my-5 space-y-7 px-4 text-[--font-color]">
	<!-- PORTFOLIO AND BALANCE -->
	<div>
		<div class="flex items-center gap-x-2">
			<button class=" w-[25px] overflow-hidden" on:click={() => goto('/wallet')}
				><Icon
					icon="material-symbols:chevron-left"
					class="text-3xl text-[--button-color]"
				/></button
			>
			<p class="text-2xl font-semibold">{$t(`common.wallets.${wallet}`)}</p>
		</div>

		<div class="flex flex-col lg:flex-row gap-5 w-full mt-6">
			<div
				class="lg:w-[60%] lg:h-[230px] bg-[--card-bg-color] shadow-xl border border-gray-300 dark:border-gray-700 rounded-lg p-5 text-center flex flex-col items-center"
			>
				<div class="w-full text-left">
					<p class="font-bold text-[18px]">{$t('wallet.portfolio.title')}</p>
				</div>
				<div
					class="w-full grid grid-cols-2 lg:flex flex-col lg:flex-row justify-center items-center gap-2 mt-10"
				>
					<button
						class="btn border-2 rounded-lg text-sm text-[#14B8A6] border-[#14B8A6] flex items-center gap-x-2 {walletData &&
						walletData.is_deposit === 1
							? 'block'
							: 'hidden'}"
						on:click={() => goto(`/deposit?wallet=${wallet}`)}
					>
						<Icon icon="vaadin:money-deposit" class="text-xl translate-y-[3px]" />
						{$t('wallet.portfolio.Deposit')}</button
					>
					<button
						class="btn border-2 rounded-lg text-sm text-red-400 border-red-400 flex items-center gap-x-2 {walletData &&
						walletData.is_withdraw === 1
							? 'block'
							: 'hidden'} "
						on:click={() => goto(`/withdraw?wallet=${wallet}`)}
					>
						<Icon icon="vaadin:money-withdraw" class="text-xl translate-y-[-2px] " />
						{$t('wallet.portfolio.Withdraw')}</button
					>
					<button
						class="btn border-2 rounded-lg text-sm text-[#F59E0B] border-[#F59E0B] flex items-center gap-x-2 {walletData &&
						walletData.is_transfer === 1
							? 'block'
							: 'hidden'}"
						on:click={() => goto(`/transfer?wallet=${wallet}`)}
					>
						<Icon icon="fa6-solid:money-bill-transfer" class="text-xl translate-y-[1px]" />
						{$t('wallet.portfolio.Transfer')}</button
					>
					<button
						class="btn border-2 rounded-lg text-sm text-[#ac89fc] border-[#8B5CF6] flex items-center gap-x-2 {walletData &&
						walletData.is_swap === 1
							? 'block'
							: 'hidden'}"
						on:click={() => goto(`/swap?wallet=${wallet}`)}
					>
						<Icon icon="vaadin:money-deposit" class="text-xl translate-y-[2px]" />
						{$t('wallet.portfolio.Swap')}</button
					>
				</div>
				<div class="text-xs text-gray-400 max-w-[300px] mt-4">
					{$t('wallet.portfolio.Monitor your wallet and transactions conveniently in one place.')}
				</div>
			</div>
			<div
				class="lg:w-[40%] bg-[--card-bg-color] shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg p-5"
			>
				<div class="w-full text-left">
					<p class="font-bold text-[18px]">{$t('wallet.balance.title')}</p>
				</div>
				<div class="mt-4 mb-5">
					{#if walletData}
						<p class="text-3xl font-semibold font-sans">
							{Number(walletData.amount).toFixed(2)}
							USDT
						</p>
					{:else}
						<div class="placeholder w-[100px]"></div>
					{/if}
					<p class="text-sm text-[--font-gray-color] font-sans">
						{truncateString(connectedAddress, 8, 8)}
					</p>
				</div>
				<div class="space-y-2 w-full font-sans">
					<div class="flex justify-between w-full">
						<div class="w-1/2 space-y-2">
							<p class="text-sm dark:text-[--font-gray-color] text-black">{$t('wallet.balance.daily_debit')}</p>
							{#if walletData}
								<div class="flex items-center gap-x-2">
									<div
										class="dark:bg-gray-600 bg-gray-300 w-[40px] h-[40px] rounded-full items-center justify-center hidden lg:flex"
									>
										<Icon icon="ri:arrow-right-up-line" class="text-[#14B8A6] text-lg" />
									</div>
									<p class="text-[--font-color] font-sans font-medium">
										+ {walletData?.debit === 0
											? (0).toFixed(2)
											: Number(walletData?.debit).toFixed(2)}
									</p>
								</div>
							{:else}
								<div class="placeholder w-[50%]"></div>
							{/if}
						</div>
						<div class="w-1/2 space-y-2">
							<p class="text-sm dark:text-[--font-gray-color] text-black">{$t('wallet.balance.daily_credit')}</p>
							{#if walletData}
								<div class="flex items-center gap-x-2">
									<div
										class="dark:bg-gray-600 bg-gray-300 w-[40px] h-[40px] rounded-full hidden lg:flex items-center justify-center"
									>
										<Icon icon="ri:arrow-right-down-line" class="text-red-400 text-lg" />
									</div>
									<p class="text-[--font-color] font-sans font-medium">
										- {walletData?.credit === 0
											? (0).toFixed(2)
											: Number(walletData?.credit).toFixed(2)}
									</p>
								</div>
							{:else}
								<div class="placeholder w-[50%]"></div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- GRAPH -->
	<div
		class="bg-[--card-bg-color] border border-gray-300 dark:border-gray-700 rounded-lg p-5 shadow-xl"
	>
		<div class="flex flex-col lg:flex-row justify-between gap-5 w-full">
			<div class="lg:w-[15%] space-y-5">
				<p class="font-bold text-[18px]">{$t('wallet.weekly_summary.title')}</p>

				<div class="border border-gray-300 dark:border-gray-500 rounded-lg space-y-1">
					<div class="border-b border-gray-300 dark:border-gray-500 p-3">
						<p class="text-gray-400 text-sm">{$t('wallet.weekly_summary.debit')}</p>
						{#if walletData}
							<p class="text-[#14B8A6] text-md font-semibold font-sans">
								+ {Number(weeklyDebit).toFixed(2)}
								USDT
							</p>
						{:else}
							<div class="placeholder w-[50%]"></div>
						{/if}
					</div>
					<div class="p-3">
						<p class="text-gray-400 text-sm">{$t('wallet.weekly_summary.credit')}</p>
						{#if walletData}
							<p class="text-red-400 text-md font-semibold font-sans">
								- {Number(weeklyCredit).toFixed(2)}
								USDT
							</p>
						{:else}
							<div class="placeholder w-[50%]"></div>
						{/if}
					</div>
				</div>
			</div>
			<div class="lg:w-[80%]">
				<Chart {options} />
			</div>
		</div>
	</div>
	<!-- Transaction History -->
	<TransactionHistory />
</div>
