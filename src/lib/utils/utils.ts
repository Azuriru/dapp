import { usdtxAbi } from '$lib/component/contract/usdtAbi';
import { apiWithToken } from '$lib/plugins/http';
import type { Address } from 'abitype';
import { parseEther } from 'viem';
import { connectedAddress, publicClient, walletClient } from './wallet';
import { storeUserInfo, type IUserInfo } from '$lib/stores/storeUser';
import { writable } from 'svelte/store';
export let broadcastState = writable('Pending wallet signature...');

export const checkUserInfo = async () => {
	await checkUpline();
	await checkEarlyBird();
	await getProfileData();
	await checkPw();
};
const getProfileData = async () => {
	let resp = await apiWithToken('GET', '/user/profileInfo');
	if (resp.success) {
		if (resp.data.email !== '' && resp.data.nickname !== '') {
			storeUserInfo.update((item: any): IUserInfo => {
				return {
					...item,
					has_profile: 1
				};
			});
		}
	} else {
		console.log('error', resp);
	}
};

const checkUpline = async () => {
	const resp = await apiWithToken('GET', '/user/hasUpline', {
		address: connectedAddress
	});
	if (resp.success) {
		storeUserInfo.update((item: any): IUserInfo => {
			return {
				...item,
				has_upline: resp.data.has_upline,
				upline_address: resp.data.upline_address
			};
		});
	} else {
		console.log('error', resp);
	}
};

const checkEarlyBird = async () => {
	let resp = await apiWithToken('GET', '/package/hasEarlyBird');
	if (resp.success) {
		storeUserInfo.update((item: any): IUserInfo => {
			return {
				...item,
				has_earlybird: resp.data.has_early_bird
			};
		});
	}
};

const checkPw = async () => {
	let resp = await apiWithToken('GET', '/user/hasPassword');
	if (resp.success) {
		storeUserInfo.update((item: any): IUserInfo => {
			return {
				...item,
				has_password: resp.data.has_password
			};
		});
	}
};

export const parseJwt = (token: any) => {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	var jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join('')
	);
	return JSON.parse(jsonPayload);
};

export const sendTransaction = async (
	amount: number | string,
	token: 'usdt',
	contractAddress: any,
	toAddress: Address
) => {
	broadcastState.set('Pending wallet signature...');
	let hash: any;
	const gasPrice = await publicClient.getGasPrice();
	if (token == 'usdt') {
		const gasEstimate = await publicClient.estimateContractGas({
			address: contractAddress,
			abi: usdtxAbi,
			functionName: 'transfer',
			args: [toAddress, parseEther(amount.toString())],
			account: connectedAddress,
			gasPrice
		});
		const { request } = await publicClient.simulateContract({
			address: contractAddress,
			abi: usdtxAbi,
			functionName: 'transfer',
			args: [toAddress, parseEther(amount.toString())],
			account: connectedAddress,
			gas: gasEstimate,
			gasPrice: gasPrice
		});
		hash = await walletClient.writeContract(request);
	}

	if (hash) {
		broadcastState.set('Your transaction is being broadcast...');

		const transaction = await publicClient.waitForTransactionReceipt({
			// passedby 10 blocks because we need to make sure the transaction passed thru 10 blocks to confirm its in the blockchain already
			confirmations: 15,
			hash: hash
		});
		if (transaction) {
			broadcastState.set('Finalizing Transaction...');
			return { success: true, txid: hash };
		}
	} else {
		return { success: false };
	}
};
