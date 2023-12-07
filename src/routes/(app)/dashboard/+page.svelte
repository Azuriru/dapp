<script lang="ts">
	import { goto } from '$app/navigation';
	import BottomHeader from '$lib/component/layout/navbar/bottomNav/bottomHeader.svelte';
	import Modal from '$lib/component/modal/modal.svelte';
	import Placeholder from '$lib/component/placeholder/Placeholder.svelte';
	import Progressbar from '$lib/component/progressbar/bar.svelte';
	import { showToast } from '$lib/component/toasts/toast';
	import { t } from '$lib/i18n';
	import { apiWithToken } from '$lib/plugins/http';
	import { storeUserInfo } from '$lib/stores/storeUser';
	import Icon from '@iconify/svelte';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import Faq from './FAQ/FAQ.svelte';
	import { checkUserInfo } from '$lib/utils/utils';

	let showModal = false,
		isConfirmed = false,
		usdtBalance: any,
		totalAmount: any,
		series: any | null = [],
		securityLvl: any = [],
		completeState: any;

	$: if (!showModal) isConfirmed = false;

	const getWalletList = async () => {
		series = [];
		let resp = await apiWithToken('GET', '/walletInfo/walletList');
		const color = ['#FFC107', '#4CAF50', '#FF0000'];
		if (resp.success) {
			totalAmount = resp.data.reduce((acc: any, item: any) => acc + parseFloat(item.amount), 0);
			resp.data.forEach((item: any, i: any) => {
				if (item.code === 'CAPITAL') {
					usdtBalance = item.amount;
				}
				const percentage = (parseFloat(item.amount) / totalAmount) * 100;
				series.push({
					name: item.code,
					perc: percentage,
					amount: item.amount,
					color: color[i]
				});
			});
			series = series;
		}
	};

	const buyEarlyBird = async () => {
		let resp: any;
		if (usdtBalance >= 5000) {
			resp = await apiWithToken('POST', '/package/earlyBird');
			showModal = false;

			if (resp.success) {
				showToast($t('common.toast.subscribed_earlybird'), 'green');
			} else {
				for (let i = 0; i < resp.data.length; i++) {
					showToast($t(`common.error.${resp.data[i]}`), 'red');
				}
			}
		} else {
			showModal = false;
			showToast($t('common.toast.not_enough_balance'), 'red');
		}

		await checkUserInfo();
		getWalletList();
	};

	const getCurrentDate = () => {
		const options: any = { day: 'numeric', month: 'long', year: 'numeric' };
		const currentDate = new Date();
		return currentDate.toLocaleDateString('en-US', options);
	};

	const getBarValue = async () => {
		await checkUserInfo();
		let list = [$storeUserInfo.has_profile, $storeUserInfo.has_password, $storeUserInfo.has_upline];
		list.forEach((value: any) => {
			console.log(value);
			if (value > 0) {
				securityLvl.push(100);
			}
		});
		securityLvl = securityLvl;
	};

	onMount(async () => {
		await getWalletList();
		await getBarValue();
		completeState =
			$storeUserInfo.has_password == 0 ||
			$storeUserInfo.has_profile == 0 ||
			$storeUserInfo.has_upline == 0;
	});
</script>

<div
	class="lg:max-w-[1300px] lg:h-full flex flex-col mx-auto py-5 px-3 gap-y-10 text-[--font-color]"
>
	<div class="flex flex-col lg:flex-row gap-x-5">
		<div class="lg:w-1/2 flex flex-col gap-y-5">
			<div
				class="rounded-lg min-h-[260px] p-5 bg-cover bg-no-repeat bg-[url('/assets/img/dashboard/cardblue.jpg')] text-white shadow-xl"
			>
				<div class="flex items-start justify-between">
					<div class="space-y-2 mb-5">
						<p class="text-3xl font-bold">{$t('dashboard.my_asset')}</p>
						<p class="text-md text-gray-400">{getCurrentDate()}</p>
					</div>
					<button on:click={() => goto('/wallet')} class=" flex items-center">
						<Icon icon="solar:wallet-bold" class="text-3xl" />
					</button>
				</div>
				{#if series && series.length > 0}
					<div class="flex items-center gap-x-2 text-4xl font-thin">
						<Icon icon="cryptocurrency-color:usdt" />
						{Number(totalAmount).toFixed(2) || Number(0).toFixed(2)} USDT
					</div>
					<Progressbar {series} />
				{:else}
					<Placeholder />
				{/if}
			</div>
			<div class="w-full">
				<div
					class="bg-[--card-bg-color] rounded-lg dark:border border-gray-700 overflow-hidden shadow-xl"
				>
					<div class="flex gap-x-2 dark:border-b border-gray-700 p-5">
						<div class="w-[25%] hidden lg:block">
							<img src="/assets/img/dashboard/earlybird.png" alt="" />
						</div>
						<div class="lg:w-[75%]">
							<div class="flex justify-between mb-2">
								<p class="text-lg">{$t('dashboard.early_bird.title')}</p>
								<div class="gap-x-2 flex items-center">
									<Icon icon="cryptocurrency-color:usdt" class="text-xl mb-1" />
									<p>5000 USDT</p>
								</div>
							</div>
							<p class="text-[14px] text-[--font-gray-color] text-justify">
								{$t('dashboard.early_bird.desc')}
							</p>
						</div>
					</div>
					<button
						class="btn {$storeUserInfo.has_earlybird === 1 || $storeUserInfo.has_upline === 0
							? 'dark:bg-gray-500 bg-gray-800'
							: $storeUserInfo.has_upline === 1
							  ? 'bg-[--button-color]'
							  : ''} rounded-none text-sm w-full font-bold text-white"
						disabled={$storeUserInfo.has_earlybird === 1}
						on:click={() =>
							$storeUserInfo.has_upline === 1 ? (showModal = true) : goto('/profile?tabSet=3')}
						>{$storeUserInfo.has_earlybird === 1
							? $t('dashboard.early_bird.joined')
							: $storeUserInfo.has_upline === 1
							  ? $t('dashboard.early_bird.join_now')
							  : $t('dashboard.early_bird.required_upline')}</button
					>
				</div>
			</div>

			<div
				class="bg-[--card-bg-color] shadow-xl rounded-lg flex flex-col gap-x-10 text-center lg:text-left dark:border border-gray-700 overflow-hidden"
			>
				<div class="p-[1rem]">
					<div class="lg:flex justify-between items-center w-full">
						<p class="text-xl lg:w-1/3 font-semibold text-left">
							{$t('dashboard.equity_activation.title')}
						</p>
						<div class="flex gap-x-2 lg:w-2/3 lg:justify-end">
							{#if completeState}
								<p class="text-[--font-gray-color]">
									{$t('dashboard.equity_activation.completed')}:
								</p>
								<div class="flex justify-end items-center gap-x-2 w-1/3">
									<ProgressBar
										value={securityLvl[0] | 0}
										meter="bg-green-500"
										rounded="rounded-none"
									/>
									<ProgressBar
										value={securityLvl[1] | 0}
										meter="bg-green-500"
										rounded="rounded-none"
									/>
									<ProgressBar
										value={securityLvl[2] | 0}
										meter="bg-green-500"
										rounded="rounded-none"
										class="mb-[1.5px]"
									/>
								</div>
							{:else}
								<button
									on:click={() => goto('/profile?tabSet=4')}
									class="text-sm underline flex items-center"
									>{$t('dashboard.equity_activation.view_equity_account')}
									<Icon icon="material-symbols:chevron-right" />
								</button>
							{/if}
						</div>
					</div>
					<div class="mt-5 space-y-5">
						<div class="flex items-center">
							<div class="w-2/3 text-left">
								<p>{$t('dashboard.equity_activation.profile_verification.title')}</p>
								<p class="text-[--font-gray-color] text-xs lg:text-sm">
									{$t('dashboard.equity_activation.profile_verification.desc')}
								</p>
							</div>
							<div class="w-1/3 flex justify-end">
								{#if $storeUserInfo.has_profile === 0}
									<button
										class="flex items-center justify-end gap-x-2 text-sm text-[--font-gray-color]"
										on:click={() => goto('/profile?tabSet=0')}
									>
										<Icon icon="bi:x-circle-fill" class=" text-lg " />
										{$t('dashboard.equity_activation.not_set')}
										<Icon
											icon="material-symbols:chevron-right"
											class="text-[--font-gray-color] text-lg"
										/>
									</button>
								{:else}
									<div class="flex items-center gap-x-2 text-green-500 mr-[26px] text-sm">
										<Icon icon="icon-park-solid:check-one" class=" text-xl " />
										<p>{$t('dashboard.equity_activation.done')}</p>
									</div>
								{/if}
							</div>
						</div>
						<div class="flex items-center">
							<div class="w-2/3 text-left">
								<p>{$t('dashboard.equity_activation.security_password.title')}</p>
								<p class="text-[--font-gray-color] text-xs lg:text-sm">
									{$t('dashboard.equity_activation.security_password.desc')}
								</p>
							</div>
							<div class="w-1/3 flex justify-end">
								{#if $storeUserInfo.has_password === 0}
									<button
										class="flex items-center justify-end gap-x-2 text-sm text-[--font-gray-color]"
										on:click={() => goto('/profile?tabSet=1')}
									>
										<Icon icon="bi:x-circle-fill" class=" text-lg " />
										{$t('dashboard.equity_activation.not_set')}
										<Icon
											icon="material-symbols:chevron-right"
											class="text-[--font-gray-color] text-lg"
										/>
									</button>
								{:else}
									<div class="flex items-center gap-x-2 text-green-500 mr-[26px] text-sm">
										<Icon icon="icon-park-solid:check-one" class=" text-xl " />
										<p>{$t('dashboard.equity_activation.done')}</p>
									</div>
								{/if}
							</div>
						</div>
						<div class="flex items-center">
							<div class="w-2/3 text-left">
								<div class="flex items-center gap-x-2 relative">
									<p>{$t('dashboard.equity_activation.bind_an_upline.title')}</p>
								</div>
								<p class="text-[--font-gray-color] text-xs lg:text-sm">
									{$t('dashboard.equity_activation.bind_an_upline.desc')}
								</p>
							</div>
							<div class="w-1/3 flex justify-end">
								{#if $storeUserInfo.has_upline === 0}
									<button
										class="flex items-center justify-end gap-x-2 text-sm text-[--font-gray-color]"
										on:click={() => goto('/profile?tabSet=3')}
									>
										<Icon icon="bi:x-circle-fill" class=" text-lg " />
										{$t('dashboard.equity_activation.not_set')}
										<Icon
											icon="material-symbols:chevron-right"
											class="text-[--font-gray-color] text-lg"
										/>
									</button>
								{:else}
									<div class="flex items-center gap-x-2 text-green-500 mr-[26px] text-sm">
										<Icon icon="icon-park-solid:check-one" class="text-xl" />
										<p>{$t('dashboard.equity_activation.done')}</p>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="lg:w-1/2 mt-5 lg:mt-0">
			<Faq />
		</div>
	</div>
</div>
<BottomHeader />

<Modal bind:showModal closeState={true}>
	<p slot="header"></p>
	<div class="w-[90vw] lg:w-[500px] my-2 flex flex-col items-center lg:px-5">
		<img src="/assets/img/dashboard/earlybird.png" class="w-[140px] lg:w-[200px]" alt="" />
		<div class="space-y-1 w-full text-center flex flex-col items-center">
			<p class="font-bold text-sm lg:text-lg">{$t('dashboard.modal.title')}</p>
			<p class="text-[--font-gray-color] text-xs lg:text-sm text-center lg:max-w-[70%]">
				{$t('dashboard.modal.desc')}
			</p>
		</div>
		<div class="my-5 space-y-1 text-xs lg:text-sm">
			<div class=" flex items-center gap-x-2 px-4 py-2 text-[#70cefa] rounded-full">
				<Icon icon="mdi:hand-coin-outline" class="text-2xl" />

				{$t('dashboard.modal.benefit1')}
			</div>
			<div class=" flex items-center gap-x-2 px-4 py-2 text-[#70cefa] rounded-full">
				<Icon icon="iconoir:coins" class="text-2xl" />
				{$t('dashboard.modal.benefit2')}
			</div>
			<div class=" flex items-center gap-x-2 px-4 py-2 text-[#70cefa] rounded-full">
				<Icon icon="tabler:pig-money" class="text-2xl" />
				{$t('dashboard.modal.benefit3')}
			</div>
		</div>
		<div class="w-full text-center space-y-5 flex flex-col items-center">
			<div class="flex gap-x-2 items-center">
				<Icon icon="cryptocurrency-color:usdt" class="text-3xl" />
				<p class="text-2xl font-bold">5,000 USDT</p>
			</div>

			<button
				disabled={!isConfirmed}
				class="btn w-full flex flex-col items-center justify-center text-lg px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg"
				on:click={() => buyEarlyBird()}
			>
				{$t('dashboard.early_bird.join_now')}
			</button>
			<label class="flex items-start space-x-3 ml-2">
				<input
					class="checkbox w-[15px] h-[15px] mt-1"
					type="checkbox"
					bind:checked={isConfirmed}
					on:click={() => (isConfirmed = !isConfirmed)}
				/>
				<p class="text-sm text-left text-[--font-gray-color]">
					{$t('dashboard.modal.confirm')}
				</p>
			</label>
		</div>
		<div class="text-xs lg:text-sm space-y-2">
			<div class="my-3 w-full flex items-center">
				<div class="w-[35%] bg-gray-500 h-[1px]" />
				<div class="w-[30%] text-center text-xs lg:text-sm font-semibold text-gray-400">
					{$t('dashboard.modal.requirements')}
				</div>
				<div class="w-[35%] bg-gray-500 h-[1px]" />
			</div>
			<p class="text-[--font-gray-color]">
				- {$t('dashboard.modal.req1')}
			</p>
			<p class="text-[--font-gray-color]">
				- {$t('dashboard.modal.req2')}
			</p>
		</div>
	</div>
</Modal>
