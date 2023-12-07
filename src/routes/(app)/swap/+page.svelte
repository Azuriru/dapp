<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FaqCard from '$lib/component/card/FaqCard.svelte';
	import Modal from '$lib/component/modal/modal.svelte';
	import Success from '$lib/component/success/success.svelte';
	import { showToast } from '$lib/component/toasts/toast';
	import { filterInput } from '$lib/helper/helper';
	import { t } from '$lib/i18n';
	import { apiWithToken } from '$lib/plugins/http';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { swapFaqList } from './faqlist';

	let showDropdown: any,
		showModal = false,
		walletList: any[] = [],
		selectedWallet: any,
		swapAmount: any,
		capitalBalance: any,
		isConfirmed = false,
		wallet: any,
		swapState: any = false;

	function handleClickOutside(event: MouseEvent) {
		if (!(event.target as Element).closest('.dropdown-container')) {
			showDropdown = false;
		}
	}

	const filterAmount = (e: any) => {
		let value = filterInput(e);

		swapAmount = value;
	};

	const onSwap = async () => {
		if (swapAmount < 0.01) {
			return showToast($t('common.toast.min_usdt'), 'red');
		}
		let resp = await apiWithToken('POST', '/wallet/swap', {
			from_wallet: selectedWallet.code,
			to_wallet: 'CAPITAL',
			amount: swapAmount
		});
		if (resp.success) {
			swapState = true;
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
		swapAmount = '';
		isConfirmed = false;
	};

	const getWalletList = async () => {
		try {
			let resp = await apiWithToken('GET', '/walletInfo/walletList');

			if (resp.success) {
				walletList = resp.data;

				walletList.forEach((item: any) => {
					if (item.code === wallet) {
						selectedWallet = item;
					}
				});

				capitalBalance = walletList.find((item) => item.code === 'CAPITAL').amount;
			}
		} catch (error) {
			console.log(error);
		}
	};

	$: if (swapAmount === '' || swapAmount === undefined) {
		isConfirmed = false;
	}
	onMount(() => {
		wallet = $page.url.searchParams.get('wallet');
		if (browser) {
			window.addEventListener('click', handleClickOutside);
		}
		getWalletList();
	});
</script>

<div class="max-w-[1300px] mx-auto my-5 space-y-7 px-4 text-[--font-color]">
	<div class="flex items-center gap-x-2">
		<button
			class=" w-[25px] overflow-hidden"
			on:click={() => goto(`/wallet/details?wallet=${wallet}`)}
			><Icon icon="material-symbols:chevron-left" class="text-3xl text-[--button-color]" /></button
		>
		<p class="text-2xl font-semibold text-[--font-color]">SWAP</p>
	</div>
	<div class="flex flex-col lg:flex-row gap-5">
		<div class="lg:w-2/3 space-y-5">
			<div class="bg-[--card-bg-color] p-5 shadow-xl rounded-lg border border-[--border-color]">
				{#if !swapState}
					<div class="flex justify-between mb-5">
						<p class="text-2xl">Swap Details</p>
					</div>
					<div class="space-y-1">
						<div class="flex items-center justify-between relative">
							<h3 class="dark:text-[--font-color] font-medium ml-1">From</h3>

							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div
								class="dropdown-container btn p-0 flex items-center gap-x-2 cursor-pointer"
								on:click={() => (showModal = !showModal)}
							>
								{$t(`common.wallets.${selectedWallet ? selectedWallet.code : '-'}`)}
								<Icon icon="tabler:chevron-down" />
							</div>
						</div>

						<input
							required
							type="text"
							class="bg-[--input-color] rounded-lg border border-[--border-color] w-full"
							bind:value={swapAmount}
							on:input={filterAmount}
							placeholder="Enter an amount..."
						/>

						<div class="flex justify-between text-sm text-[--font-gray-color] mx-1">
							<p>
								{$t(`common.wallets.${selectedWallet ? selectedWallet.code : '-'}`)} Balance : {selectedWallet
									? Number(selectedWallet.amount).toFixed(2)
									: 0}
							</p>
							<div class="flex items-center gap-x-2">
								<Icon icon="cryptocurrency-color:usdt" class="text-lg" />
								USDT
							</div>
						</div>
					</div>
					<div class="w-full flex items-center justify-center text-2xl text-[--font-gray-color]">
						<Icon icon="ph:arrow-down" />
					</div>
					<div class="space-y-1">
						<h3 class="dark:text-[--font-color] font-medium ml-1">To</h3>
						<div class="bg-[--input-color] p-3 rounded-lg border border-[--border-color]">
							Capital Wallet
						</div>
						<div class="flex justify-between text-sm text-[--font-gray-color] mx-1">
							<p>Capital Wallet Balance : {Number(capitalBalance).toFixed(2) || 0}</p>
							<div class="flex items-center gap-x-2">
								<Icon icon="cryptocurrency-color:usdt" class="text-lg" />
								USDT
							</div>
						</div>
					</div>
					<label class="flex items-center space-x-3 ml-2 mt-5">
						<input
							disabled={swapAmount === '' || swapAmount == undefined}
							class="checkbox w-[15px] h-[15px] {swapAmount === '' ||
							swapAmount <= 0 ||
							swapAmount == undefined
								? 'cursor-not-allowed'
								: 'cursor-pointer'}"
							type="checkbox"
							bind:checked={isConfirmed}
							on:click={() => (isConfirmed = !isConfirmed)}
						/>
						<p class="text-sm text-[--font-gray-color]">
							I confirm that the above details are accurate, and I authorize the transfer of funds
							to Capital Wallet .
						</p>
					</label>
					<button
						disabled={!isConfirmed}
						on:click={() => onSwap()}
						class="btn rounded-lg text-center w-full bg-[--button-color] mt-5">Swap</button
					>
				{:else}
					<div class="flex flex-col items-center justify-center h-[39vh] space-y-6">
						<div class=" w-full flex items-center justify-center">
							<Success />
						</div>
						<div class="flex flex-col items-center">
							<p class="text-xl font-medium">Swap Successful</p>
							<p class="text-gray-400 text-center">
								Your money has been swap to {$t(
									`common.wallets.${selectedWallet ? selectedWallet.code : '-'}`
								)} !
							</p>
							<div class="w-full flex justify-center gap-x-5 mt-10">
								<button
									class="btn border rounded-lg"
									on:click={() => goto(`/wallet/details?wallet=${wallet}`)}>My Wallet</button
								>
								<button class="btn border rounded-lg" on:click={() => goto(`/dashboard`)}
									>Homepage</button
								>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div
			class="bg-[--card-bg-color] p-5 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 lg:w-1/3 h-fit"
		>
			<!--FAQ Section-->
			<FaqCard faqList={swapFaqList} />
		</div>
	</div>
</div>

<Modal bind:showModal>
	<p slot="header" class="font-semibold w-full text-center pb-3">Select Your Wallet</p>
	<div class="flex flex-col w-[300px] py-3 border-t border-[--border-color]">
		{#each walletList as wallet}
			{#if wallet.code != 'CAPITAL'}
				<div class="flex items-center">
					<button
						class="py-3 w-full text-left"
						on:click={() => ((selectedWallet = wallet), (showModal = false))}
						>{$t(`common.wallets.${wallet.code}`)}</button
					>
					{#if selectedWallet === wallet}
						<Icon icon="mdi:tick" class="text-green-500 text-xl" />
					{/if}
				</div>
			{/if}
		{/each}
	</div>
	<button class="btn rounded-lg bg-[--button-color] w-full" on:click={() => (showModal = false)}>
		Close
	</button>
</Modal>
