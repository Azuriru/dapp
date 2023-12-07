<script lang="ts">
	// Drawer
	import { Drawer } from '@skeletonlabs/skeleton';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	// Content
	import UserMenu from './drawerContent/userMenu.svelte';
	import LangMenu from './drawerContent/langMenu.svelte';

	const drawerStore = getDrawerStore();
</script>

<Drawer>
	{#if $drawerStore.id === 'user-menu'}
		<UserMenu />
	{:else if $drawerStore.id === 'lang-menu'}
		<LangMenu />
	{:else}
		<!-- (fallback contents) -->
	{/if}
</Drawer>
