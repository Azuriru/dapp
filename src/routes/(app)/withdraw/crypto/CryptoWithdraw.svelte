<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FaqCard from '$lib/component/card/FaqCard.svelte';
	import Dropdown from '$lib/component/dropdown/Dropdown.svelte';
	import Success from '$lib/component/success/success.svelte';
	import { showToast } from '$lib/component/toasts/toast';
	import { filterInput } from '$lib/helper/helper';
	import { t } from '$lib/i18n';
	import { apiWithToken } from '$lib/plugins/http';
	import { connectedAddress } from '$lib/utils/wallet';
	import { onMount } from 'svelte';
	import { withdrawFaqList } from './faqlist';
	let coinList: any,
		selectedCoin: any,
		selectedCoinSetting: any,
		withdrawalFee: any,
		wallet: any,
		withdrawAmount: number | any,
		isConfirmed = false,
		withdrawalState = false;

	function handleSelectCoin(event: CustomEvent) {
		selectedCoin = event.detail;
	}

	const getCoinList = async () => {
		const resp = await apiWithToken('GET', '/setting/coinList', {
			wallet: wallet
		});
		if (resp.success) {
			return (coinList = resp.data);
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
	};

	const getCoinSetting = async () => {
		const resp = await apiWithToken('GET', '/setting/withdraw', {
			coin: selectedCoin.code
		});
		withdrawalFee = await apiWithToken('GET', '/setting/withdrawSetting');
		console.log(withdrawalFee);
		if (resp.success) {
			return (selectedCoinSetting = resp.data);
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
	};

	$: if (selectedCoin) {
		getCoinSetting();
	}

	const filterAmount = (e: any) => {
		let value = filterInput(e);
		withdrawAmount = value;
	};

	const onWithdraw = async () => {
		let resp = await apiWithToken('POST', '/wallet/withdraw', {
			setting_withdraw_id: selectedCoinSetting.id,
			amount: withdrawAmount
		});
		if (resp.success) {
			withdrawalState = true;
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
		selectedCoin = '';
		withdrawAmount = null;
		isConfirmed = false;
	};

	$: {
		if (isConfirmed) {
			if (withdrawAmount <= 0 || selectedCoin == undefined) {
				showToast($t('common.toast.select_coin_amount'), 'red');
				isConfirmed = false;
			}
		}
	}

	onMount(() => {
		wallet = $page.url.searchParams.get('wallet');
		getCoinList();
	});
</script>

<div class="flex lg:flex-row flex-col gap-x-2 w-full">
	<div
		class="lg:w-2/3 bg-[--card-bg-color] rounded-lg p-5 border border-[--border-color] space-y-5"
	>
		{#if !withdrawalState}
			<div class="flex justify-between">
				<p class="text-[--font-gray-color] w-1/3 hidden lg:block">Select Coin</p>
				<div class="lg:w-2/3 w-full">
					<p class="text-[--font-gray-color] ml-1 mb-1 text-sm">Coin</p>
					<Dropdown
						id="wallet"
						items={coinList}
						selectedItem={selectedCoin}
						on:select={handleSelectCoin}
					/>
					{#if selectedCoin}
						<div class="flex justify-between items-center mt-1">
							<p class="text-[--font-gray-color] text-sm ml-1">
								Balance: {Number(selectedCoin.balance).toFixed(2)}
							</p>
						</div>
					{/if}
				</div>
			</div>
			<div class="flex justify-between">
				<p class="text-[--font-gray-color] w-1/3 hidden lg:block">Send To</p>
				<div class="lg:w-2/3 w-full">
					<p class="text-[--font-gray-color] ml-1 mb-1 text-sm">Address</p>
					<div class="bg-[--input-color] p-3 rounded-lg w-full border border-[--border-color]">
						<p class="truncate">{connectedAddress}</p>
					</div>
					<div class=" mt-5">
						<p class="text-[--font-gray-color] ml-1 mb-1 text-sm">Network</p>
						<div class="bg-[--input-color] p-3 rounded-lg w-full border border-[--border-color]">
							{#if selectedCoinSetting}
								{selectedCoinSetting.network}
							{:else}
								-
							{/if}
						</div>
					</div>
				</div>
			</div>
			<div class="flex justify-between">
				<p class="text-[--font-gray-color] lg:w-1/3 hidden lg:block">Withdraw Amount</p>
				<div class="w-full lg:w-2/3">
					<p class="text-[--font-gray-color] ml-1 mb-1 text-sm">Amount</p>
					<div>
						<input
							type="text"
							disabled={!selectedCoin}
							bind:value={withdrawAmount}
							on:input={filterAmount}
							class=" w-full rounded-lg border border-[--border-color] {!selectedCoin
								? 'dark:bg-gray-700 bg-gray-300'
								: 'bg-[--input-color]'}"
							placeholder="Enter an amount..."
						/>
						<div class="flex justify-between mx-1 mt-1 text-xs text-[--font-gray-color]">
							{#if withdrawAmount}
								<p class="">Processing Fee 2%</p>
								<p>
									{Number(withdrawAmount * (withdrawalFee.data.fee / 100)).toFixed(2) || ''}
									USDT
								</p>
							{/if}
						</div>
					</div>
				</div>
			</div>
			<label class="flex items-center space-x-3 ml-2">
				<input
					class="checkbox w-[15px] h-[15px]"
					type="checkbox"
					bind:checked={isConfirmed}
					on:click={() => (isConfirmed = !isConfirmed)}
				/>
				<p class="text-sm text-[--font-gray-color]">
					I confirm that the above details are accurate, and I authorize to withdraw the funds to my
					wallet.
				</p>
			</label>
			<button
				disabled={!isConfirmed}
				class="btn w-full bg-[--button-color] rounded-lg"
				on:click={() => onWithdraw()}
			>
				Withdraw
			</button>
		{:else}
			<div class="flex flex-col items-center justify-center lg:h-[39vh] space-y-6">
				<div class=" w-full flex items-center justify-center">
					<Success />
				</div>
				<div class="flex flex-col items-center">
					<p class="text-xl font-medium">Submitted</p>
					<p class="text-gray-400 text-center">Your withdrawal request has been submitted !</p>
					<div class="w-full flex justify-center gap-x-5 mt-10">
						<button
							class="btn border rounded-lg"
							on:click={() => goto(`/wallet/details?wallet=${wallet}`)}>My Wallet</button
						>
						<button class="btn border rounded-lg" on:click={() => goto(`/`)}>Homepage</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
	<div
		class="bg-[--card-bg-color] p-5 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 lg:w-1/3 h-fit mt-5 lg:mt-0"
	>
		<!--FAQ Section-->
		<FaqCard faqList={withdrawFaqList} />
	</div>
</div>
