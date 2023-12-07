<script lang="ts">
	import { goto } from '$app/navigation';
	import BottomHeader from '$lib/component/layout/navbar/bottomNav/bottomHeader.svelte';
	import Spinner from '$lib/component/spinner/spinner.svelte';
	import { showToast } from '$lib/component/toasts/toast';
	import { t } from '$lib/i18n';
	import { apiWithToken } from '$lib/plugins/http';
	import { onMount } from 'svelte';
	let walletList: any[] = [],
		totalBalance: number;

	const getCoinList = async () => {
		const resp = await apiWithToken('GET', '/walletInfo/walletList');
		if (resp.success) {
			walletList = resp.data;
			totalBalance = walletList.reduce((sum, item) => sum + parseFloat(item.amount), 0);
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
	};
	onMount(() => {
		getCoinList();
	});
</script>

<div class="max-w-[1300px] min-h-[100vh] mx-auto py-5 px-3">
	<div
		class="flex flex-col lg:flex-row items-center lg:justify-between gap-2 bg-[--card-bg-color] rounded-lg p-6 text-[20px] text-[--font-color] shadow-xl"
	>
		<p class=" font-medium">{$t('wallet.Estimated Balance')}</p>
		<div class="text-2xl">
			{#if totalBalance != null}
				<p><span class="text-gray-400">≈</span> {Number(totalBalance).toFixed(2)} USDT</p>
			{:else}
				<div class="placeholder w-[100px]"></div>
			{/if}
		</div>
	</div>
	<div class="mt-5">
		<div
			class="flex justify-between text-sm dark:text-gray-400 px-4 mb-2 text-black drop-shadow-2xl"
		>
			<p>{$t('wallet.WALLET')}</p>
			<div class="flex gap-x-4">
				<p class="w-[80px] lg:w-[120px] text-center">{$t('wallet.BALANCE')}</p>
				<p class="w-[70px] text-center">{$t('wallet.ACTION')}</p>
			</div>
		</div>
		{#if walletList.length > 0}
			{#each walletList as coin}
				<div
					class="bg-[--card-bg-color] shadow-md rounded-lg border border-gray-300 mb-2 dark:border-gray-700 px-4 py-3 flex items-center justify-between"
				>
					<div class="flex items-center gap-x-3">
						<img
							src={`/assets/img/wallet/${coin.code.toLowerCase()}.png`}
							alt=""
							class="object-contain w-[50px] h-[50px]"
						/>
						<div class="w-[90px] lg:w-[250px]">
							<p class="truncate">
								{$t(`common.wallets.${coin.code}`).split(' ')[0]}
								{coin && coin.code === 'EQUITY_PROFIT' ? ' Profit' : ''}
							</p>
							<p class="text-xs text-[--font-gray-color]">{$t('wallet.WALLET')}</p>
						</div>
					</div>
					<div class="flex items-center gap-x-4 text-[--font-gray-color] text-sm">
						<p class="w-[80px] truncate lg:w-[120px] text-center text-white text-[15px]">
							{Number(coin.amount).toFixed(2)}
						</p>
						<div class="w-[70px] text-center">
							<button
								class="btn text-sm bg-[--button-color] rounded-lg text-white"
								on:click={() => goto(`/wallet/details?wallet=${coin.code}`)}
								>{$t('common.button.View')}</button
							>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<div class="w-full flex justify-center items-center min-h-[30vh]">
				<Spinner />
			</div>
		{/if}
	</div>
</div>
<BottomHeader></BottomHeader>
