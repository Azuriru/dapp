<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FaqCard from '$lib/component/card/FaqCard.svelte';
	import Success from '$lib/component/success/success.svelte';
	import { showToast } from '$lib/component/toasts/toast';
	import { filterInput, truncateString } from '$lib/helper/helper';
	import { t } from '$lib/i18n';
	import { apiWithToken } from '$lib/plugins/http';
	import { connectedAddress } from '$lib/utils/wallet';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { transferFaqList } from './faqlist';
	let wallet: any,
		transferAmount: any,
		transferAddress: any,
		balance: any,
		error: any = {
			address: '',
			amount: ''
		},
		transferState = false;
	let isConfirmed = false;

	const getCoinList = async () => {
		const resp = await apiWithToken('GET', '/walletInfo/walletList');
		if (resp.success) {
			resp.data.forEach((item: any) => {
				if (item.code === wallet) {
					balance = item.amount;
				}
			});
		} else {
			showToast('Failed to Fetch Coin List', 'red');
		}
	};
	const onTransfer = async () => {
		if (transferAmount < 0.01) {
			return showToast($t('common.toast.min_usdt'), 'red');
		}
		let resp = await apiWithToken('POST', '/wallet/transfer', {
			recipient: transferAddress,
			wallet: wallet,
			amount: transferAmount
		});
		if (resp.success) {
			transferState = true;
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
	};

	const filterAmount = (e: any) => {
		let value = filterInput(e);
		transferAmount = value;
	};

	const handleCheckboxChange = (event: any) => {
		isConfirmed = event.target.checked;
	};

	$: {
		if (
			transferAddress === '' ||
			transferAmount <= 0 ||
			transferAddress === undefined ||
			transferAmount === undefined
		) {
			isConfirmed = false;
		}
	}

	onMount(() => {
		wallet = $page.url.searchParams.get('wallet');
		if (!wallet) {
			showToast($t('common.wallet.wallet_not_found'), 'red');
		}
		getCoinList();
	});
</script>

<div class="lg:max-w-[1300px] min-h-[100vh] lg:h-full flex flex-col mx-auto py-5 px-3">
	<div class="flex items-center gap-x-2">
		<button
			class=" w-[25px] overflow-hidden"
			on:click={() => goto(`/wallet/details?wallet=${wallet}`)}
			><Icon icon="material-symbols:chevron-left" class="text-3xl text-[--button-color]" /></button
		>
		<p class="text-2xl font-semibold">Transfer</p>
	</div>
	<div class="flex flex-col lg:flex-row gap-x-5 my-5">
		<div
			class="bg-[--card-bg-color] p-5 rounded-lg shadow-lg border border-[--border-color] space-y-5 lg:w-2/3 h-fit"
		>
			{#if !transferState}
				<div class="lg:flex w-full justify-between items-center">
					<p class="text-xl w-1/2">Transfer Details</p>
					<div class="flex items-center gap-x-2">
						Balance: {Number(balance).toFixed(4)}
						<Icon icon="cryptocurrency-color:usdt" class="text-[20px]" />
					</div>
				</div>
				<div class="">
					<p class="text-[--font-gray-color] ml-1">User Address</p>
					<div class="relative">
						<div
							class="absolute left-[15px] top-[50%] translate-y-[-50%] dark:text-gray-500 placeholder:text-gray-400"
						>
							<Icon icon="ph:user" class="text-[20px]" />
						</div>
						<input
							required
							type="text"
							bind:value={transferAddress}
							on:input={() =>
								transferAddress === connectedAddress
									? (error.address = 'Cannot Transfer to own address')
									: ''}
							class="bg-[--input-color] pl-[45px] w-full rounded-lg py-3 dark:placeholder:text-gray-500 placeholder:text-gray-400 border border-[--border-color]"
							placeholder="Enter Target User Address..."
						/>
					</div>
				</div>
				<div>
					<p class="text-[--font-gray-color] ml-1">Transfer Amount</p>
					<div class="relative">
						<div
							class="absolute flex justify-between left-[15px] top-[50%] translate-y-[-50%] dark:text-gray-500 placeholder:text-gray-400"
						>
							<Icon icon="flat-color-icons:money-transfer" class="text-[20px]" />
						</div>
						<input
							required
							type="text"
							bind:value={transferAmount}
							on:input={filterAmount}
							class="bg-[--input-color] pl-[45px] w-full rounded-lg py-3 dark:placeholder:text-gray-500 placeholder:text-gray-400 border border-[--border-color]"
							placeholder="Enter Transfer Amount..."
						/>
					</div>
				</div>
				<label class="flex items-center space-x-3 ml-2">
					<input
						disabled={transferAddress === undefined ||
							transferAmount < 0 ||
							transferAddress === '' ||
							transferAmount === undefined}
						required
						class="checkbox w-[15px] h-[15px] {transferAddress === undefined ||
						transferAmount < 0 ||
						transferAddress === '' ||
						transferAmount === undefined
							? 'cursor-not-allowed'
							: ''}"
						type="checkbox"
						bind:checked={isConfirmed}
						on:click={handleCheckboxChange}
					/>
					<p class="text-sm text-[--font-gray-color]">
						I confirm that the above details are accurate, and I authorize the transfer of funds to
						the specified recipient .
					</p>
				</label>
				<button
					type="submit"
					class="btn rounded-lg w-full bg-[--button-color]"
					disabled={!isConfirmed}
					on:click={() => onTransfer()}
				>
					Transfer
				</button>
			{:else}
				<div class="flex flex-col items-center justify-center h-[39vh] space-y-6">
					<div class=" w-full flex items-center justify-center">
						<Success />
					</div>
					<div class="flex flex-col items-center">
						<p class="text-xl font-medium">Transfer Successful</p>
						<p class="text-gray-400 text-center">
							Your money has been transfer to
							{truncateString(transferAddress, 5, 5)} !
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
		<div
			class="bg-[--card-bg-color] p-5 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 lg:w-1/3 h-fit mt-5 lg:mt-0"
		>
			<!--FAQ Section-->
			<FaqCard faqList={transferFaqList} />
		</div>
	</div>
</div>
