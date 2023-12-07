<script lang="ts">
	import { t } from '$lib/i18n';
	import ProgressBar from '@okrad/svelte-progressbar';
	export let series: any = [];
</script>

<div class="mt-6 space-y-5">
	{#if series}
		<ProgressBar {series} showProgressValue={false} style="thin " height={5} />

		<div class="flex gap-x-10 flex-wrap gap-y-4">
			{#each series as list}
				<div class="flex gap-2 items-start">
					<div
						class="bg-gray-500 w-[30px] lg:w-[40px] p-2 flex items-center justify-center rounded-lg"
					>
						<div class="w-3 h-3 lg:w-5 lg:h-5 rounded" style="background-color: {list.color};" />
					</div>
					<div class="w-full">
						<p class="text-sm lg:text-md">{$t(`common.wallets.${list.name}`)}</p>
						<div class="flex items-center gap-x-1 text-md">
							<p class=" truncate">{Number(list.amount).toFixed(2)}</p>
							USDT
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
