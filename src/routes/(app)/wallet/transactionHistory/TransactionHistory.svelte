<script lang="ts">
	import { apiWithToken } from '$lib/plugins/http';
	import { type PaginationSettings, Paginator } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { headers } from '../details/config';
	import Table from '$lib/component/newTable/table.svelte';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	let wallet: any;

	let rows: any = [],
		totalCount: any;

	let pagination: any = 1,
		size: any = 10;

	let isMobile = false;
	const getTransactionHistory = async (transactiontype?: any) => {
		let params: any = {
			size: size,
			page: pagination,
			wallet: wallet
		};
		if (transactiontype !== undefined) {
			params.transaction_type = transactiontype;
		}
		let resp = await apiWithToken('GET', '/walletInfo/transaction', params);
		totalCount = resp.data.count;
		rows = resp.data.data;
	};

	let paginationSettings = {
		page: 0,
		limit: 10,
		size: totalCount,
		amounts: [1, 3, 5, 10]
	} satisfies PaginationSettings;

	$: paginationSettings.size = totalCount;

	const onPageChange = (e: CustomEvent): void => {
		pagination = e.detail + 1;
		getTransactionHistory();
	};

	const onAmountChange = (e: CustomEvent): void => {
		size = e.detail;
		getTransactionHistory();
	};

	onMount(() => {
		wallet = $page.url.searchParams.get('wallet');

		getTransactionHistory();
	});
</script>

<div
	class="bg-[--card-bg-color] shadow-xl border border-gray-300 dark:border-gray-700 rounded-lg p-5 w-full space-y-5"
>
	<p class="font-bold text-[18px]">{$t('wallet.Transaction History')}</p>
	<Table {headers} {rows} />
</div>
<div class="hidden lg:block">
	<Paginator
		on:page={onPageChange}
		on:amount={onAmountChange}
		bind:settings={paginationSettings}
		showNumerals
		controlVariant="bg-[--card-bg-color] border border-[--border-color]"
		showFirstLastButtons={true}
		showPreviousNextButtons={true}
		active="bg-[--button-color]"
	></Paginator>
</div>

<div class="block lg:hidden">
	<Paginator
		on:page={onPageChange}
		on:amount={onAmountChange}
		bind:settings={paginationSettings}
		controlVariant="bg-[--card-bg-color] border border-[--border-color]"
		showFirstLastButtons={true}
		showPreviousNextButtons={true}
		active="bg-[--button-color]"
	></Paginator>
</div>
