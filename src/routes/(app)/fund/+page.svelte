<script lang="ts">
	import { goto } from '$app/navigation';
	import BottomHeader from '$lib/component/layout/navbar/bottomNav/bottomHeader.svelte';
	import Table from '$lib/component/newTable/table.svelte';
	import { t } from '$lib/i18n';
	import Icon from '@iconify/svelte';
	import { headers } from './config';

	let rows: any = [];
</script>

<div class="max-w-[1300px] min-h-[100vh] mx-auto py-5 px-3 space-y-5 text-[--font-color]">
	<p class="text-2xl font-semibold">{$t('funds.Your Funds')}</p>
	<div class="bg-[--card-bg-color] w-full rounded-lg p-5 space-y-2 border border-[--border-color]">
		<p class="text-2xl font-semibold">{$t('portfolio.summary')}</p>
		<div class="flex lg:flex-row flex-col justify-between gap-y-4">
			<div class="lg:w-1/3">
				<p class="text-[--font-gray-color]">{$t('funds.total_asset_value')}</p>
				<div class="flex flex-row lg:flex-col items-center lg:items-start gap-x-1">
					<p class="text-3xl lg:text-2xl">0.00</p>
					<p class="lg:text-xs text-[--font-gray-color]">USD</p>
				</div>
			</div>
			<div class="flex gap-x-5 lg:w-2/3 lg:justify-between">
				<div class="lg:w-1/2">
					<p class="text-[--font-gray-color]">{$t('funds.floating')}</p>
					<div class="flex flex-row lg:flex-col items-center lg:items-start gap-x-1">
						<p class="lg:text-2xl">0.00</p>
						<p class="text-xs text-[--font-gray-color]">USD</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div
		class="bg-[--card-bg-color] min-h-[50vh] rounded-lg p-5 border border-[--border-color] shadow-xl"
	>
		<!-- <Table {headers} {rows} />
		{#each rows as row}
			<div
				class="flex items-center p-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 lg:hidden space-y-1 h-full"
			>
				<div class="w-[92%]">
					<div class="flex items-center justify-between w-full">
						<p class="text-white text-sm">{$t(`common.transaction_type.${row.type}`)}</p>
						<p class="text-sm">{Number(row.amount).toFixed(2)}</p>
					</div>
					<div class="flex items-center justify-between w-full">
						<p class="text-[--font-gray-color] text-sm">{row.date}</p>
						<p
							class="text-sm {row.status === 'success' || row.status === 'accepted'
								? 'text-green-500'
								: row.status === 'pending' || row.status === 'processing'
								  ? 'text-orange-500'
								  : row.status === 'failed' || row.status === 'rejected'
								    ? 'text-red-500'
								    : ''}"
						>
							{$t(`common.status.${row.status}`)}
						</p>
					</div>
				</div>
			</div>
		{/each} -->
		<div class="w-full flex flex-col items-center justify-center min-h-[40vh]">
			<Icon icon="fluent-mdl2:market" class="text-[100px] text-[--font-gray-color]" />
			<p class="text-[--font-gray-color] text-xl">{$t('common.toast.coming_soon').toUpperCase()}</p>
			<p class="text-[--font-gray-color] text-sm">{$t('common.stay_tuned')}</p>
		</div>
	</div>
</div>

<BottomHeader />
