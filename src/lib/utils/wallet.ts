import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { showToast } from '$lib/component/toasts/toast';
import { api } from '$lib/plugins/http';
import { emptyAccessToken, storeAccessToken } from '$lib/stores/storeLocal';
import { emptyUserInfo, storeUserInfo, type IUserInfo } from '$lib/stores/storeUser';
import { get } from 'svelte/store';
import {
	createPublicClient,
	createWalletClient,
	custom,
	http,
	zeroAddress,
	type Address,
	type Chain
} from 'viem';
import { bscTestnet } from 'viem/chains';

export let walletClient: any;
export let connectedAddress: Address = get(storeUserInfo).address;
let signedMessage: string = '';
let message: string = '';
const targetNetwork: Chain = bscTestnet;
if (browser && window.ethereum) {
	walletClient = createWalletClient({
		chain: targetNetwork,
		transport: custom(window.ethereum)
	});
}

export const publicClient = createPublicClient({
	chain: targetNetwork,
	transport: http()
});

export const onConnectWallet = async () => {
	try {
		const accounts = await walletClient.requestAddresses();
		console.log(accounts);
		if (accounts) {
			const connectedChainId = await walletClient.getChainId();
			storeUserInfo.update((item: any): IUserInfo => {
				return {
					...item,
					address: accounts[0],
					chainid: connectedChainId
				};
			});
			connectedAddress = get(storeUserInfo).address;
			if (connectedChainId != targetNetwork.id) {
				await walletClient.addChain({ chain: targetNetwork });
				await walletClient.switchChain({ id: targetNetwork.id });
			}
			return true;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
};

export const onRequestSignMessage = async () => {
	try {
		if (connectedAddress === zeroAddress) {
			showToast('Please connect your wallet first!', 'red');
			return;
		} else {
			const res = await api('GET', '/auth/request', {
				address: connectedAddress
			});
			if (res.data) {
				message = res.data;
				signedMessage = await walletClient.signMessage({
					account: connectedAddress,
					message: message
				});
				let result = onVerifySignMessage();
				return result;
			}
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};

const onVerifySignMessage = async () => {
	try {
		if (!connectedAddress || !message || !signedMessage) {
			console.error('please request and sign message first');
			return;
		}

		const res = await api('POST', '/auth/verify', {
			address: connectedAddress,
			sign: signedMessage
		});
		console.log(res);
		if (!res.success) {
			showToast('Verify Sign Message Failed', 'red');
		} else {
			storeAccessToken.set({
				...storeAccessToken,
				access_token: res.data.access_token,
				refresh_token: res.data.refresh_token,
				expires_in: new Date().getTime() + res.data.expires_in * 1000
			});
			return { success: true };
		}
	} catch (error) {
		throw false;
	}
};

export const clearUserData = () => {
	storeAccessToken.set(emptyAccessToken);
	storeUserInfo.set(emptyUserInfo);
	goto('/');
};

export const onLogOut = async () => {
	clearUserData();
	await api('POST', '/auth/logout', {
		address: connectedAddress
	});
};
