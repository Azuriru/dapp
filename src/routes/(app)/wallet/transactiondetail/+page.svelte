<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { showToast } from '$lib/component/toasts/toast';
	import { truncateString } from '$lib/helper/helper';
	import { t } from '$lib/i18n';
	import { apiWithToken } from '$lib/plugins/http';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	let id: any, wallet: string | null;
	let data: any;
	const getTransactionDetails = async () => {
		let resp = await apiWithToken('GET', '/walletInfo/transactionDetails', {
			id: id
		});
		if (resp.success) {
			data = resp.data;
			console.log(data);
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
	};

	onMount(() => {
		wallet = $page.url.searchParams.get('wallet');
		id = $page.url.searchParams.get('id');
		if (id) {
			getTransactionDetails();
		}
	});
</script>

<div class="max-w-[1300px] mx-auto my-5 space-y-5 px-4 text-[--font-color]">
	<div class="flex items-center gap-x-2">
		<button
			class=" w-[25px] overflow-hidden"
			on:click={() => goto(`/wallet/details?wallet=${wallet}`)}
			><Icon icon="material-symbols:chevron-left" class="text-3xl text-[--button-color]" /></button
		>
		<p class="text-2xl font-semibold font-sans">{$t('transactiondetails.title')}</p>
	</div>
	<div
		class="bg-[--card-bg-color] border border-gray-300 dark:border-gray-700 rounded-lg p-5 space-y-5 shadow-xl"
	>
		<div class="w-full flex items-center justify-center text-2xl my-5 gap-x-2">
			<Icon icon="cryptocurrency-color:usdt" class="text-3xl" />
			{Number(data?.amount).toFixed(2) + ' USDT' || '-'}
		</div>
		<div class="flex justify-between items-center">
			<p class="text-[--font-gray-color]">{$t('transactiondetails.Serial Number')}</p>
			<p class="text-[--font-color]">{data?.sn || '-'}</p>
		</div>
		<div class="flex justify-between items-center">
			<p class="text-[--font-gray-color]">Status</p>
			<p class="text-green-400">{$t(`common.status.${data?.status}`) || '-'}</p>
		</div>
		<div class="flex justify-between items-center">
			<p class="text-[--font-gray-color]">{$t('transactiondetails.Date / Time')}</p>
			<p class="text-[--font-color]">{data?.date || '-'}</p>
		</div>

		<div class="flex justify-between items-center">
			<p class="text-[--font-gray-color]">{$t('transactiondetails.Transaction Type')}</p>
			<p class="text-[--font-color]">{$t(`common.transaction_type.${data?.type}`) || '-'}</p>
		</div>
		<div class="flex justify-between items-center">
			<p class="text-[--font-gray-color]">{$t('transactiondetails.Network')}</p>
			<p class="text-[--font-color]">{data?.network || '-'}</p>
		</div>
		<div class="flex justify-between items-center">
			<p class="text-[--font-gray-color]">{$t('transactiondetails.Product')}</p>
			<p class="text-[--font-color]">{data?.product || '-'}</p>
		</div>
		<div class="flex justify-between items-center">
			<p class="text-[--font-gray-color]">{$t('transactiondetails.Payment')}</p>
			<p class="text-[--font-color]">{data?.payment || '-'}</p>
		</div>
	</div>
	<div
		class="bg-[--card-bg-color] border border-gray-300 dark:border-gray-700 rounded-lg p-5 space-y-5 shadow-xl"
	>
		<div class="flex justify-between items-center">
			<p class="text-[--font-gray-color]">{$t('transactiondetails.TXID')}</p>
			<p class="text-[--font-color]">{truncateString(data?.txid, 5, 5) || '-'}</p>
		</div>
		<div class="flex justify-between items-center">
			<p class="text-[--font-gray-color]">{$t('transactiondetails.To')}</p>
			<p class="text-[--font-color]">{truncateString(data?.to_address, 5, 5) || '-'}</p>
		</div>
		<div class="flex justify-between items-center">
			<p class="text-[--font-gray-color]">{$t('transactiondetails.Interacted With')}</p>
			<a
				href={`https://bscscan.com/address/${data?.token_address}`}
				target="_blank"
				class="text-[--font-color] underline">{truncateString(data?.token_address, 5, 5) || '-'}</a
			>
		</div>
	</div>

	<button
		class="btn bg-[--button-color] rounded-lg w-full block lg:hidden text-white"
		on:click={() => goto(`/wallet/details?wallet=${wallet}`)}>{$t('common.button.Go Back')}</button
	>
</div>
