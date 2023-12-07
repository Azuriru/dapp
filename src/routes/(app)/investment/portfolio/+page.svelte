<script lang="ts">
	import { goto } from '$app/navigation';
	import { showToast } from '$lib/component/toasts/toast';
	import { t } from '$lib/i18n';
	import { apiWithToken } from '$lib/plugins/http';
	import Icon from '@iconify/svelte';
	import { Tab, TabGroup, type PaginationSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { Paginator } from '@skeletonlabs/skeleton';
	import Nodata from '$lib/component/nodata/Nodata.svelte';
	import Spinner from '$lib/component/spinner/spinner.svelte';

	let tabSet: number = 0,
		packageList: any | undefined = { active: [], inactive: [] },
		loading: any = false,
		size: any = 10,
		pagination: any = 1,
		totalCount: any,
		summary: any;

	$: paginationSettings.size = totalCount;

	let paginationSettings = {
		page: 0,
		limit: 10,
		// counts of your items
		size: totalCount,
		// number of items to be shown
		amounts: [1, 3, 5, 10]
	} satisfies PaginationSettings;

	const getPackSummary = async () => {
		let resp = await apiWithToken('GET', '/packageInfo/packageSummary');
		if (resp.success) {
			summary = resp.data;
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
	};

	const getPackageList = async (status: any) => {
		loading = true;
		let resp = await apiWithToken('GET', '/packageInfo/packageList', {
			size: size,
			page: pagination,
			is_active: status
		});
		console.log(resp);

		if (resp.success) {
			if (status === 1) {
				packageList.active = resp.data.data;
				totalCount = resp.data.count;
			} else {
				packageList.inactive = resp.data.data;
				totalCount = resp.data.count;
			}
		} else {
			console.log(resp);
			// for (let i = 0; i < resp.data.length; i++) {
			// 	showToast($t(`common.error.${resp.data[i]}`), 'red');
			// }
		}
		loading = false;
	};

	const onPageChange = (e: CustomEvent): void => {
		pagination = e.detail + 1;
		getPackageList(tabSet === 0 ? 1 : 0);
	};

	const onAmountChange = (e: CustomEvent): void => {
		size = e.detail;
		getPackageList(tabSet === 0 ? 1 : 0);
	};
	onMount(() => {
		getPackSummary();
		getPackageList(tabSet === 0 ? 1 : 0);
		packageList = packageList;
	});
</script>

<div class="dark:bg-[#0E1422] min-h-[100vh] text-[--font-color]">
	<div class="max-w-[1300px] mx-auto py-5 px-3 space-y-5">
		<div class="flex items-center gap-x-2 mb-5">
			<button class=" w-[25px] overflow-hidden" on:click={() => goto(`/investment`)}
				><Icon
					icon="material-symbols:chevron-left"
					class="text-3xl text-[--button-color]"
				/></button
			>
			<p class="text-2xl font-semibold">{$t('portfolio.title')}</p>
		</div>

		<div
			class="bg-[--card-bg-color] w-full rounded-lg p-5 space-y-2 border border-[--border-color]"
		>
			<p class="text-2xl font-semibold">{$t('portfolio.summary')}</p>
			<div class="flex lg:flex-row flex-col justify-between gap-y-4">
				<div class="lg:w-1/3">
					<p class="text-[--font-gray-color]">{$t('portfolio.total_invested')}</p>
					<div class="flex flex-row lg:flex-col items-center lg:items-start gap-x-1">
						{#if summary}
							<p class="text-3xl lg:text-2xl">{Number(summary.total_invested).toFixed(2)}</p>
						{:else}
							<div class="placeholder animate-pulse w-[100px]"></div>
						{/if}
						<p class="lg:text-xs text-[--font-gray-color]">USDT</p>
					</div>
				</div>
				<div class="flex gap-x-5 lg:w-2/3 lg:justify-between">
					<div class="lg:w-1/2">
						<p class="text-[--font-gray-color]">{$t('portfolio.total_yields')}</p>
						<div class="flex flex-row lg:flex-col items-center lg:items-start gap-x-1">
							{#if summary}
								<p class="lg:text-2xl">{Number(summary.total_yield).toFixed(2)}</p>
							{:else}
								<div class="placeholder animate-pulse w-[100px]"></div>
							{/if}
							<p class="text-xs text-[--font-gray-color]">USDT</p>
						</div>
					</div>
					<div class="lg:w-1/2">
						<p class="text-[--font-gray-color]">{$t('portfolio.daily_yields')}</p>
						<div class="flex flex-row lg:flex-col items-center lg:items-start gap-x-1">
							{#if summary}
								<p class="lg:text-2xl">{Number(summary.daily_yield).toFixed(2)}</p>
							{:else}
								<div class="placeholder animate-pulse w-[100px]"></div>
							{/if}
							<p class="text-xs text-[--font-gray-color]">USDT</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div
			class="bg-[--card-bg-color] min-h-[50vh] rounded-lg p-2 lg:p-5 border border-[--border-color] shadow-xl"
		>
			<TabGroup active="border-b-2 border-[--button-color]">
				<Tab bind:group={tabSet} name="tab1" value={0} on:click={() => getPackageList(1)}
					>{$t('portfolio.tab.active')}</Tab
				>
				<Tab bind:group={tabSet} name="tab2" value={1} on:click={() => getPackageList(0)}
					>{$t('portfolio.tab.inactive')}</Tab
				>

				<svelte:fragment slot="panel">
					{#if tabSet === 0}
						{#if loading}
							<div class="w-full flex items-center justify-center min-h-[40vh]">
								<Spinner />
							</div>
						{:else if packageList.active.length > 0}
							{#each packageList.active as list}
								<div
									class="w-full flex items-center gap-x-2 p-2 pb-4 mb-3 rounded border-b border-[--border-color]"
								>
									<div class="items-center gap-x-2 lg:gap-x-5 w-full hidden lg:flex">
										<div class="w-full flex">
											<div class="w-1/4">
												<p class="text-md">{$t(`portfolio.package.${list.package}`)}</p>
												<p class="text-[--font-gray-color] text-xs">
													{list.created_at}
												</p>
											</div>
											<div class="w-1/4 text-center">
												<p class="text-sm">{list.package_price.toFixed(2)}</p>
												<p class="text-[--font-gray-color] text-xs">
													{$t('portfolio.title_value.total_amount')}
												</p>
											</div>
											<div class="w-1/4 text-center">
												<p class="text-sm">{Number(list.sales_amount).toFixed(2)}</p>
												<p class="text-[--font-gray-color] text-xs">
													{$t('portfolio.title_value.market_maker')}
												</p>
											</div>
											<div class="w-1/4 text-center">
												<p class="text-sm">{Number(list.invest).toFixed(2)}</p>
												<p class="text-[--font-gray-color] text-xs">
													{$t('portfolio.title_value.equity_fund')}
												</p>
											</div>
											<div class="w-1/4 text-center">
												<p class="text-sm">
													{list.count_day}
													{$t('portfolio.days')}
												</p>
												<p class="text-[--font-gray-color] text-xs">
													{$t('portfolio.title_value.current_day_count')}
												</p>
											</div>
										</div>
										<button
											class="btn bg-[--button-color] text-white rounded-lg hidden lg:block"
											on:click={() => goto(`/investment/portfolio/portfoliodetails?sn=${list.sn}`)}
											>{$t('common.button.View')}</button
										>
									</div>
									<div class="w-full block lg:hidden">
										<div class="flex justify-between items-start w-full">
											<div class="">
												<p class="text-md">{$t(`portfolio.package.${list.package}`)}</p>
												<p class="text-[--font-gray-color] text-xs text-right">
													{list.created_at}
												</p>
											</div>
											<button
												class="mt-2"
												on:click={() =>
													goto(`/investment/portfolio/portfoliodetails?sn=${list.sn}`)}
											>
												<Icon icon="octicon:arrow-right-16" class="text-lg" />
											</button>
										</div>
										<div class="flex justify-between mt-3">
											<p class="text-[--font-gray-color] text-sm">
												{$t('portfolio.title_value.total_amount')}
											</p>
											<p class="text-sm">{list.package_price.toFixed(2)}</p>
										</div>
										<div class="flex justify-between mt-2">
											<p class="text-[--font-gray-color] text-sm">
												{$t('portfolio.title_value.market_maker')}
											</p>
											<p class="text-sm">{Number(list.sales_amount).toFixed(2)}</p>
										</div>
										<div class="flex justify-between mt-2">
											<p class="text-[--font-gray-color] text-sm">
												{$t('portfolio.title_value.equity_fund')}
											</p>
											<p class="text-sm">{Number(list.invest).toFixed(2)}</p>
										</div>
									</div>
								</div>
							{/each}
						{:else if packageList.active.length == 0}
							<Nodata />
						{/if}
					{:else if tabSet === 1}
						{#if loading}
							<div class="w-full flex items-center justify-center min-h-[40vh]">
								<Spinner />
							</div>
						{:else if packageList.inactive.length > 0}
							{#each packageList.inactive as list}
								<div
									class="w-full flex items-center gap-x-2 p-2 pb-4 mb-3 rounded border-b border-[--border-color]"
								>
									<div class="items-center gap-x-2 lg:gap-x-5 w-full hidden lg:flex">
										<div class="w-full flex">
											<div class="w-1/4">
												<p class="text-md">{$t(`portfolio.package.${list.package}`)}</p>
												<p class="text-[--font-gray-color] text-xs">
													{list.created_at}
												</p>
											</div>
											<div class="w-1/4 text-center">
												<p class="text-sm">{list.package_price.toFixed(2)}</p>
												<p class="text-[--font-gray-color] text-xs">
													{$t('portfolio.title_value.total_amount')}
												</p>
											</div>
											<div class="w-1/4 text-center">
												<p class="text-sm">{Number(list.sales_amount).toFixed(2)}</p>
												<p class="text-[--font-gray-color] text-xs">
													{$t('portfolio.title_value.market_maker')}
												</p>
											</div>
											<div class="w-1/4 text-center">
												<p class="text-sm">{Number(list.invest).toFixed(2)}</p>
												<p class="text-[--font-gray-color] text-xs">
													{$t('portfolio.title_value.equity_fund')}
												</p>
											</div>
											<div class="w-1/4 text-center">
												<p class="text-sm">
													{list.count_day}
													{$t('portfolio.days')}
												</p>
												<p class="text-[--font-gray-color] text-xs">
													{$t('portfolio.title_value.current_day_count')}
												</p>
											</div>
										</div>
										<button
											class="btn bg-[--button-color] text-white rounded-lg hidden lg:block"
											on:click={() => goto(`/investment/portfolio/portfoliodetails?sn=${list.sn}`)}
											>{$t('common.button.View')}</button
										>
									</div>
									<div class="w-full block lg:hidden">
										<div class="flex justify-between items-start w-full">
											<div class="">
												<p class="text-md">{$t(`portfolio.package.${list.package}`)}</p>
												<p class="text-[--font-gray-color] text-xs text-right">
													{list.created_at}
												</p>
											</div>
											<button
												class="mt-2"
												on:click={() =>
													goto(`/investment/portfolio/portfoliodetails?sn=${list.sn}`)}
											>
												<Icon icon="octicon:arrow-right-16" class="text-lg" />
											</button>
										</div>
										<div class="flex justify-between mt-3">
											<p class="text-[--font-gray-color] text-sm">
												{$t('portfolio.title_value.total_amount')}
											</p>
											<p class="text-sm">{list.package_price.toFixed(2)}</p>
										</div>
										<div class="flex justify-between mt-2">
											<p class="text-[--font-gray-color] text-sm">
												{$t('portfolio.title_value.market_maker')}
											</p>
											<p class="text-sm">{Number(list.sales_amount).toFixed(2)}</p>
										</div>
										<div class="flex justify-between mt-2">
											<p class="text-[--font-gray-color] text-sm">
												{$t('portfolio.title_value.equity_fund')}
											</p>
											<p class="text-sm">{Number(list.invest).toFixed(2)}</p>
										</div>
									</div>
								</div>
							{/each}
						{:else if packageList.inactive.length === 0}
							<Nodata />
						{/if}
					{/if}
				</svelte:fragment>
			</TabGroup>
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
	</div>
</div>
