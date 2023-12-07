<script lang="ts">
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { openDropdown } from './openDropdownStore';
	import { t } from '$lib/i18n';
	// Corrected import path

	export let items: any[] = []; // Added TypeScript type
	export let selectedItem: any | null = null; // Added TypeScript type
	export let id: string; // Unique identifier for the dropdown

	let isOpen = false;
	const dispatch = createEventDispatcher();

	function toggleDropdown() {
		isOpen = !isOpen;
		openDropdown.set(isOpen ? id : null);
	}

	function selectItem(item: any) {
		selectedItem = item;
		isOpen = false;
		openDropdown.set(null);
		dispatch('select', item);
	}

	function handleClickOutside(event: MouseEvent) {
		if (!(event.target as Element).closest('.dropdown-container')) {
			isOpen = false;
			openDropdown.set(null);
		}
	}

	// Subscribe to the openDropdown store
	const unsubscribe = openDropdown.subscribe((value) => {
		if (value !== id) {
			isOpen = false;
		}
	});

	onMount(() => {
		// Check if any item is selected by default
		const defaultSelectedItem = items.find((item) => item.selected);
		if (defaultSelectedItem) {
			selectedItem = defaultSelectedItem;
		}

		if (browser) {
			// Check if running in the browser
			window.addEventListener('click', handleClickOutside);
		}
	});

	onDestroy(() => {
		if (browser) {
			// Check if running in the browser
			window.removeEventListener('click', handleClickOutside);
		}
		unsubscribe();
	});
</script>

<div class={isOpen ? 'dropdown-container relative z-10' : 'dropdown-container relative'}>
	<!-- Dropdown Button-->
	<button
		class="w-full bg-[--input-color]
        border border-[--border-color] p-2 rounded-lg flex items-center justify-between
        {items.length === 0 ? '!cursor-not-allowed text-[--font-gray-color] ' : ''}"
		on:click={items.length > 0 ? toggleDropdown : undefined}
	>
		<div class="flex items-center">
			<!-- {#if selectedItem && selectedItem.image}
				<img src={selectedItem.image} alt={selectedItem.name} class="w-6 h-6 rounded-full mr-2" />
			{/if} -->
			<span class={selectedItem ? 'text-[--font-color]' : 'text-[--font-gray-color]'}
				>{selectedItem ? $t(`common.currency.${selectedItem.code}`) : 'Select an option'}</span
			>
		</div>
		<Icon icon="mingcute:down-line" />
	</button>

	<!-- Dropdown Selection-->
	{#if isOpen}
		<div
			class="absolute mt-2 w-full max-h-[162px] rounded-lg bg-[--card-bg-color] border border-[--border-color] overflow-y-auto shadow-xl"
		>
			{#each items as item}
				<button
					class="flex items-center px-4 py-2 cursor-pointer w-full hover:bg-blue-500"
					on:click={() => selectItem(item)}
				>
					{#if item.image}
						<img src={item.image} alt={item.name} class="w-6 h-6 rounded-full mr-2" />
					{/if}
					<span>{$t(`common.currency.${item.code}`)}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>
