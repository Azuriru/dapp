<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton';
	// Floating UI for Popups
	// TopHeader
	import TopHeader from '$lib/component/layout/navbar/topnav/topHeader.svelte';
	// Drawer
	import { goto } from '$app/navigation';
	import ShowDrawer from '$lib/component/layout/drawer/showDrawer.svelte';
	import { showToast } from '$lib/component/toasts/toast';
	import { t } from '$lib/i18n';
	import { storeAccessToken } from '$lib/stores/storeLocal';
	import { clearUserData } from '$lib/utils/wallet';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';

	// Drawer store and config
	const drawerStore = getDrawerStore();
	$: positionClasses =
		$drawerStore.id === 'user-menu' && $drawerStore.open ? 'md:translate-x-[384px]' : '';

	let checkerExpiry: any;

	const checkerDate = async () => {
		const current = new Date().getTime();
		if (current > $storeAccessToken.expires_in) {
			clearUserData();
			goto('/');
			showToast($t('common.toast.token_expired'), 'orange');
			clearInterval(checkerExpiry);
		}
	};

	onMount(() => {
		if ($storeAccessToken.access_token == '') {
			goto('/');
			showToast($t('common.toast.please_login'), 'red');
		}
		checkerExpiry = setInterval(checkerDate, 15000);
	});
	onDestroy(() => {
		clearInterval(checkerExpiry);
	});
</script>

<AppShell class="transition-transform {positionClasses}">
	<svelte:fragment slot="header">
		<TopHeader />
	</svelte:fragment>
	<slot />
</AppShell>
<ShowDrawer />
