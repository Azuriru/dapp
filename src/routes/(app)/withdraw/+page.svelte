<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import CryptoWithdraw from './crypto/CryptoWithdraw.svelte';
	let wallet: any;

	onMount(() => {
		wallet = $page.url.searchParams.get('wallet');
	});
</script>

<div class="max-w-[1300px] mx-auto my-5 space-y-7 px-4 text-[--font-color]">
	<div class="flex items-center gap-x-2">
		<button class=" w-[25px] overflow-hidden" on:click={() => goto(`/wallet/details?wallet=${wallet}`)}
			><Icon icon="material-symbols:chevron-left" class="text-3xl text-[--button-color]" /></button
		>
		<p class="text-2xl font-semibold">Withdraw</p>
	</div>

	<CryptoWithdraw />
</div>
