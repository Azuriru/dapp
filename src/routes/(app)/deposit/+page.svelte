<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import CryptoDeposit from './crypto/CryptoDeposit.svelte';
	import FiatDeposit from './fiat/FiatDeposit.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let tabSet = 0;
	let wallet: any;
	onMount(() => {
		wallet = $page.url.searchParams.get('wallet');
	});
</script>

<div class="max-w-[1300px] min-h-[100vh] mx-auto lg:p-4 px-3 py-4 text-[--font-color]">
	<div class="flex items-center gap-x-2">
		<button
			class=" w-[25px] overflow-hidden"
			on:click={() => goto(`/wallet/details?wallet=${wallet}`)}
			><Icon icon="material-symbols:chevron-left" class="text-3xl text-[--button-color]" /></button
		>
		<p class="text-2xl font-semibold">Deposit</p>
	</div>
	<!-- <div class="flex justify-between items-center mt-5">
		<div class="flex gap-x-2 text-white">
			<button
				class="btn h-[40px] flex items-center justify-center rounded-lg {tabSet === 0
					? 'bg-[--button-color]'
					: ' border border-gray-500 text-gray-400'}"
				on:click={() => (tabSet = 0)}>Crypto</button
			>
			<button
				class="btn h-[40px] flex items-center justify-center rounded-lg {tabSet === 1
					? 'bg-[--button-color]'
					: ' border border-gray-500 text-gray-400'}"
				on:click={() => (tabSet = 1)}
			>
				Fiat
			</button>
		</div>
	</div> -->
	{#if tabSet === 0}
		<CryptoDeposit />
	{:else}
		<FiatDeposit />
	{/if}
</div>
