<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import Nodata from '../nodata/Nodata.svelte';
	import Spinner from '../spinner/spinner.svelte';

	export let headers: any[] = [];
	export let rows: any;
	let wallet: any;

	onMount(() => {
		wallet = $page.url.searchParams.get('wallet');
	});
</script>

<!-- Desktop -->
<div class="hidden lg:block overflow-hidden">
	<table class="table-fixed w-[1300px] text-left my-1">
		<thead class="border-b border-[--border-color]">
			<tr class="">
				{#each headers as header}
					<th class="font-bold text-sm dark:text-gray-300 px-6 py-4"
						>{$t(`common.table.${header.name}`)}</th
					>
				{/each}
			</tr>
		</thead>

		{#if rows.length > 0}
			<tbody class="font-normal text-sm text-gray-700 dark:text-gray-300">
				{#each rows as row}
					<tr
						class="h-[50px] dark:hover:bg-gray-600 hover:bg-gray-200 cursor-pointer rounded-lg"
						on:click={() => goto(`/wallet/transactiondetail?wallet=${wallet}&&id=${row.id}`)}
					>
						{#each headers as header}
							{#if row.hasOwnProperty(header.key)}
								<!-- remove the css condition if want to reuse -->
								{#if header.key === 'amount'}
									<td
										class="truncate px-6 {row[header.key].includes('-')
											? 'text-red-500'
											: 'text-green-500'}"
									>
										{Number(row[header.key]).toFixed(2)}
									</td>
								{:else}
									<td
										class="truncate px-6 {(header.key === 'status' &&
											row[header.key] === 'success') ||
										row[header.key] === 'accepted'
											? 'text-green-500'
											: row[header.key] === 'failed' || row[header.key] === 'rejected'
											  ? 'text-red-500'
											  : row[header.key] === 'pending' || row[header.key] === 'processing'
											    ? 'text-orange-500'
											    : ''}"
										>{header.key === 'status'
											? $t(`common.status.${row[header.key]}`)
											: header.key === 'type'
											  ? $t(`common.transaction_type.${row[header.key]}`)
											  : row[header.key] || '-'}</td
									>
								{/if}
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		{/if}
	</table>
</div>
{#if rows.length > 0}
	<!-- Mobile -->
	{#each rows as row}
		<button
			class="flex items-center p-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 lg:hidden space-y-1 h-full"
			on:click={() => goto(`/wallet/transactiondetail?wallet=${wallet}&&id=${row.id}`)}
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
			<div
				class="w-[10%] h-[35px] flex items-center justify-center text-2xl translate-y-[-2px] text-[--font-gray-color]"
			>
				<Icon icon="material-symbols-light:chevron-right" />
			</div>
		</button>
	{/each}
{:else}
	<Nodata />
{/if}
