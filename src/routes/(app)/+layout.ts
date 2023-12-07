// import { browser } from '$app/environment';
// import { goto } from '$app/navigation';
// import { showToast } from '$lib/component/toasts/toast';
// import { storeAccessToken } from '$lib/stores/storeLocal';
// import { get } from 'svelte/store';

// export const load = async () => {
// 	if (browser && !get(storeAccessToken).access_token) {
// 		const now = Date.now();
// 		const timestamp = now - 30 * 60 * 1000;

// 		if (timestamp >= get(storeAccessToken).expires_in) {
// 			showToast('Session expired, please login again', 'orange');
// 			goto('/');
// 		}
// 	}

// 	return {};
// };
