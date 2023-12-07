<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$lib/component/modal/modal.svelte';
	import Spinner from '$lib/component/spinner/spinner.svelte';
	import { showToast } from '$lib/component/toasts/toast';
	import { truncateString } from '$lib/helper/helper';
	import { t } from '$lib/i18n';
	import { apiWithToken } from '$lib/plugins/http';
	import { storeAccessToken } from '$lib/stores/storeLocal';
	import { storeUserInfo } from '$lib/stores/storeUser';
	import { clearUserData, onConnectWallet, onRequestSignMessage } from '$lib/utils/wallet';
	import Icon from '@iconify/svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { zeroAddress } from 'viem';

	let upline: any;
	let isConnectedProvider: any;
	let showModal = false;
	let siginingMsg = false;

	const connectWallet = async () => {
		try {
			showModal = true;
			let resp = await onConnectWallet();
			if (resp) {
				showModal = false;
			} else {
				showModal = false;
			}
		} catch {
			showModal = false;
		}
	};

	const signMessage = async () => {
		siginingMsg = true;
		showModal = true;
		try {
			await onRequestSignMessage();

			if (upline && upline !== zeroAddress && $storeAccessToken.access_token) {
				let resp = await apiWithToken('POST', '/user/bindUpline', {
					upline_address: upline
				});
				if (resp.success) {
					showToast($t('common.toast.upline_binded'), 'green');
					goto('/profile?tabSet=3');
				} else {
					for (let i = 0; i < resp.data.length; i++) {
						showToast($t(`common.error.${resp.data[i]}`), 'red');
					}
					goto('/dashboard');
				}
			} else {
				showToast($t('common.toast.login_success'), 'green');
				goto('/dashboard');
			}
		} catch (error) {
			showToast($t('common.toast.rejected_request'), 'red');
			showModal = false;
		}
	};

	onMount(async () => {
		upline = $page.url.searchParams.get('upline');
		isConnectedProvider = window.ethereum ? true : false;
		window.ethereum.on('accountsChanged', async () => {
			await onConnectWallet();
		});

		if (upline && upline != zeroAddress && $storeAccessToken.access_token === '') {
			showToast($t('common.toast.login_first_bind'), 'orange');
		}
		if ($storeAccessToken.access_token != '') {
			showToast($t('common.toast.welcome_back'), 'green');
			goto('dashboard');
		}
	});
</script>

<div class="h-full w-full flex flex-col items-center justify-center max-w-[1300px] mx-auto px-3">
	<div class="flex items-center w-full">
		<div class="space-y-2 w-2/3 hidden lg:block">
			<h1 class="text-6xl font-bold text-[#264079] dark:text-white transition">
				Infinite <span class="text-[#F0AE34]">Winner</span>
			</h1>
			<p class="text-2xl font-bold text-[#264079] dark:text-gray-400 transition">
				{$t('login.invest_with_ease')}
			</p>
		</div>
		<div
			class="dark:bg-gray-700 bg-white dark:bg-opacity-50 p-7 lg:w-1/3 rounded-lg relative shadow-xl"
		>
			<div class="absolute right-[7%] top-[8%]">
				<LightSwitch />
			</div>

			<div class="w-full flex justify-center mb-7 mt-3 lg:hidden">
				<img
					src="/assets/img/logo/logoDarkWithFont.png"
					class="w-[100px] dark:block hidden"
					alt=""
				/>
				<img
					src="/assets/img/logo/logoLightWithFont.png"
					class="w-[100px] dark:hidden block"
					alt=""
				/>
			</div>

			<div class="text-center lg:text-left lg:mt-0">
				<p class="text-3xl text-[--font-color]">{$t('login.welcome_back')}</p>
				<p class="text-gray-400 text-sm">{$t('login.sign_in')}</p>
			</div>
			<div class="mt-5">
				{#if $storeUserInfo.address != zeroAddress}
					<div class="flex items-center gap-x-2 h-[40px] w-full mt-5 text-sm">
						<div
							class="w-[60%] text-center bg-[#35baf7] text-[#3fc2ff] bg-opacity-10 rounded-lg h-full flex justify-center items-center"
						>
							{truncateString($storeUserInfo.address, 5, 5)}
						</div>
						<div
							class="w-[30%] bg-[#8B5CF6] bg-opacity-10 text-[#b091fb] h-full flex items-center justify-center rounded-lg"
						>
							{$t('login.Chain Id')}
							{$storeUserInfo.chainid}
						</div>
						<button
							class="w-[15%] h-full btn flex items-center justify-center text-[#ff3052] bg-[#F43F5E] bg-opacity-10 rounded-lg p-0"
							on:click={() => clearUserData()}
						>
							<Icon icon="ph:x-bold" class="" />
						</button>
					</div>
				{/if}
				<div class="mt-2">
					{#if !isConnectedProvider}
						<button
							class="btn bg-blue-500 dark:bg-opacity-40 dark:text-[#89d6ff] text-white text-md gap-x-2 rounded-lg w-full h-[45px] cursor-pointer"
							on:click={() => {
								window.open('https://metamask.io/download/', '_blank');
							}}
						>
							<Icon icon="solar:wallet-linear" />
							{$t('login.wallet_extension')}
						</button>
					{:else if $storeUserInfo.address === zeroAddress}
						<button
							class="btn bg-[#14B8A6] text-white text-md gap-x-2 rounded-lg w-full h-[45px] cursor-pointer"
							on:click={() => connectWallet()}
						>
							<Icon icon="solar:wallet-linear" />
							{$t('login.connect_wallet')}
						</button>
					{:else}
						<button
							class="btn bg-[#14B8A6] text-white text-md gap-x-2 rounded-lg w-full h-[45px] cursor-pointer"
							on:click={() => signMessage()}
						>
							<Icon icon="lets-icons:sign-in-squre" />
							{$t('login.sign_in_with_wallet')}
						</button>
					{/if}

					<p class="text-xs mt-3 text-center text-[--font-gray-color]">
						{$t('login.Recommended to use Google Chrome, Firefox, Brave Browser')}
					</p>
				</div>
			</div>
			<div class="my-7 w-full flex items-center">
				<div class="w-[30%] bg-gray-500 h-[1px]" />
				<div class="w-[40%] text-center text-sm font-semibold text-gray-400">
					{$t('login.Access Trouble?')}
				</div>
				<div class="w-[30%] bg-gray-500 h-[1px]" />
			</div>

			<button
				class="btn bg-blue-500 dark:bg-opacity-40 dark:text-[#89d6ff] text-white text-md gap-x-2 rounded-lg w-full h-[45px] cursor-pointer"
			>
				<Icon icon="akar-icons:person-add" />
				{$t('login.Contact Customer Service')}
			</button>
			<p class="mt-3 text-center text-xs text-gray-400">
				{$t(
					'login.Please leave your message if customer service is away. Your patience is highly apprieciated.'
				)}
			</p>
		</div>
	</div>
</div>

<Modal bind:showModal>
	<p slot="header" class="text-center w-full">
		{siginingMsg ? 'Sigining Message' : 'Connecting Wallet'}
	</p>
	<div class="p-5">
		<div class="flex justify-center items-center w-full text-white">
			<Spinner />
		</div>
		<div class="text-center w-full">
			<p>{$t('login.Continue in Your Wallet')}</p>
			<p class="text-sm text-gray-400">
				{siginingMsg
					? $t('login.Please complete signing message in the wallet')
					: $t('login.Accept connection request in the wallet')}
			</p>
		</div>
	</div>
</Modal>
