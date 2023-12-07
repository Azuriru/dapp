<script lang="ts">
	import Nprogress from '$lib/component/nprogress/Nprogress.svelte';
	import Toast from '$lib/component/toasts/toast.svelte';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import '../app.postcss';
	import { showToast } from '$lib/component/toasts/toast';
	import { clearUserData } from '$lib/utils/wallet';
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n';

	initializeStores();

	const onChange = () => {
		window.ethereum.on('accountsChanged', async () => {
			// show toast here
			showToast($t('common.toast.account_changed'), 'orange');
			clearUserData();
			goto('/');
		});
		window.ethereum.on('chainChanged', async () => {
			// show toast here
			showToast($t('common.toast.network_changed'), 'orange');
			clearUserData();
			goto('/');
		});
	};
	onMount(() => {
		// if (
		// 	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		// ) {
		// 	// open the deeplink page
		// 	window.open('https://metamask.app.link/dapp/staging_dapp.iwinfund.com/');
		// } else {
		// 	// install metamask message
		// }
		onChange();
	});
</script>

<Nprogress />
<slot />
<Toast />
