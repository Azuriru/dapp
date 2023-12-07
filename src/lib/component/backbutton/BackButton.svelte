<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';

	export let title: any;
	export let backTo: any;
</script>

<div class="flex items-center gap-x-2 mb-5">
	{#if backTo}
		<button class="w-[25px] overflow-hidden" on:click={() => goto(`${backTo}`)}
			><Icon icon="material-symbols:chevron-left" class="text-3xl text-[--button-color]" /></button
		>
	{/if}
	<p class="text-2xl font-semibold">{title}</p>
</div>
