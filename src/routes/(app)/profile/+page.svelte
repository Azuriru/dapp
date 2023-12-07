<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import BottomHeader from '$lib/component/layout/navbar/bottomNav/bottomHeader.svelte';
	import Modal from '$lib/component/modal/modal.svelte';
	import Qrcode from '$lib/component/qrcode/qrcode.svelte';
	import { showToast } from '$lib/component/toasts/toast';
	import { truncateString } from '$lib/helper/helper';
	import { t } from '$lib/i18n';
	import { storeUserInfo } from '$lib/stores/storeUser';
	import { connectedAddress } from '$lib/utils/wallet';
	import Icon from '@iconify/svelte';
	import { Tab, TabGroup, clipboard } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import EquityAcc from './tab/EquityAcc.svelte';
	import Profile from './tab/Profile.svelte';
	import Referral from './tab/Referral.svelte';
	import Security from './tab/Security.svelte';
	import { urlList } from '$lib/configs/settings';
	import Spinner from '$lib/component/spinner/spinner.svelte';
	let tabContainer;
	let tabSet = 0;
	let showModal = false;
	let loading: any;
	let qrCodeSrc = '';
	let refUrl: any = `${urlList.dev.domainURL}?upline=${$storeUserInfo.address}`;
	const generateQRCode = () => {
		loading = true;
		qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${refUrl}`;
		setTimeout(() => {
			loading = false;
		}, 2500);
	};

	const scrollToTab = (tabName: any) => {
		const tabElement = document.getElementsByName(tabName)[0];
		if (tabElement) {
			tabElement.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
				inline: 'center'
			});
		}
	};

	onMount(() => {
		let tab = Number($page.url.searchParams.get('tabSet'));
		scrollToTab(`tab4`);
		if (tab) {
			tabSet = tab;
		}
	});
</script>

<div class="min-h-[100vh] py-5 px-3 lg:max-w-[1300px] mx-auto space-y-5">
	<div class="flex items-center gap-x-2">
		<button class=" w-[25px] overflow-hidden" on:click={() => goto('/dashboard')}
			><Icon icon="material-symbols:chevron-left" class="text-3xl text-[--button-color]" /></button
		>
		<p class="text-2xl font-semibold">{$t('profile.title')}</p>
	</div>

	<div class="flex justify-between items-center">
		<div class="flex gap-x-4">
			<div class="w-[65px] overflow-hidden flex items-center justify-center">
				<img
					src={$storeUserInfo.has_earlybird === 1
						? '/assets/img/profile/ranking/rank3.png'
						: '/assets/img/profile/avatar/1.png'}
					class="rounded-full object-cover w-full"
					alt=""
				/>
			</div>

			<div class="space-y-1">
				<div class="flex items-center gap-x-2 text-md">
					<p class="lg:hidden block">{truncateString(connectedAddress, 5, 5)}</p>
					<p class="lg:block hidden">{connectedAddress}</p>
					<button
						class="btn p-0"
						use:clipboard={connectedAddress}
						on:click={() => showToast($t('common.toast.address_copied'), 'green')}
					>
						<Icon icon="bxs:copy" />
					</button>
				</div>
				<div class="flex gap-x-2 text-sm text-white">
					<div class="px-2 py-1 bg-orange-500 bg-opacity-80 rounded">{$t('profile.rank')} 1</div>
					<div
						class=" px-2 py-1 rounded {$storeUserInfo.has_upline === 1
							? 'bg-green-600 bg-opacity-50'
							: 'bg-gray-500'}"
					>
						{$storeUserInfo.has_upline === 1
							? $t('profile.profile.verified')
							: $t('profile.profile.unverified')}
					</div>
					{#if $storeUserInfo.has_earlybird === 1}
						<div class="w-[30px]">
							<img src="/assets/img/profile/avatar/early_bird.png" alt="" />
						</div>
					{/if}
				</div>
			</div>
		</div>
		<button
			class="btn rounded-lg text-2xl p-2 bg-[--button-color] text-white"
			on:click={() => ((showModal = true), generateQRCode())}
		>
			<Icon icon="ic:baseline-qrcode" />
		</button>
	</div>

	<TabGroup
		bind:this={tabContainer}
		class="bg-[--card-bg-color] overflow-x-auto snap-x scroll-smooth p-5 rounded-lg text-[--font-color] shadow-xl border-gray-300 border dark:border-gray-700"
	>
		<Tab bind:group={tabSet} name="tab1" value={0} on:click={() => scrollToTab('tab1')}>
			<div class="flex items-center gap-x-2">
				<Icon icon="gg:profile" class="text-2xl" />
				<span>{$t('profile.tab.profile')}</span>
			</div>
		</Tab>
		<Tab bind:group={tabSet} name="tab2" value={1} on:click={() => scrollToTab('tab2')}
			><div class="flex items-center gap-x-2">
				<Icon icon="material-symbols:security" class="text-2xl" />
				<span>{$t('profile.tab.security')}</span>
			</div></Tab
		>
		<!-- <Tab bind:group={tabSet} name="tab3" value={2} class="snap-center"
			><div class="flex items-center gap-x-2">
				<Icon icon="uil:setting" class="text-2xl" />
				<span>2 Factor Auth</span>
			</div></Tab
		> -->
		<Tab bind:group={tabSet} name="tab3" value={3} on:click={() => scrollToTab('tab3')}
			><div class="flex items-center gap-x-2">
				<Icon icon="fluent-mdl2:add-friend" class="text-2xl" />
				<span>{$t('profile.tab.referral')}</span>
			</div></Tab
		>
		<Tab bind:group={tabSet} name="tab4" value={4} on:click={() => scrollToTab('tab4')}
			><div class="flex items-center gap-x-2">
				<Icon icon="ic:outline-account-balance" class="text-2xl" />
				<span>{$t('profile.equity_account.title')} </span>
			</div></Tab
		>
		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			{#if tabSet === 0}
				<Profile />
			{:else if tabSet === 1}
				<Security />
				<!-- {:else if tabSet === 2}
				<TwoFactorAuth /> -->
			{:else if tabSet === 3}
				<Referral />
			{:else if tabSet === 4}
				<EquityAcc bind:tabSet />
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>
<BottomHeader />

<Modal bind:showModal>
	<div class="rounded-lg text-center relative py-4 w-[300px] lg:w-[400px] space-y-5">
		<div class="flex flex-col items-center space-y-5">
			<div>
				<p class="font-bold text-white text-lg">{$t('profile.qrcode.title')}</p>
			</div>
			<div class="bg-white w-[250px] h-[250px] rounded-lg flex items-center justify-center">
				{#if !loading}
					<img src={qrCodeSrc} class="w-[230px]" alt="" />
				{:else}
					<div class="w-full h-full bg-black bg-opacity-80 flex items-center justify-center">
						<Spinner />
					</div>
				{/if}
			</div>
			<div class="bg-gray-600 w-[90%] p-3 truncate rounded-lg flex">
				<div class="truncate w-[90%]">
					{refUrl}
				</div>
				<button
					use:clipboard={refUrl}
					on:click={() => showToast($t('common.toast.referral_url_copied'), 'green')}
					class="w-[10%] btn p-0 rounded-none flex items-center justify-center"
				>
					<Icon icon="bxs:copy" />
				</button>
			</div>
			<p class="text-sm text-[--font-gray-color]">
				{$t('profile.qrcode.desc')}
			</p>
		</div>
		<button class="btn w-full rounded-lg bg-[--button-color]" on:click={() => (showModal = false)}>
			{$t('common.button.close')}
		</button>
	</div>
</Modal>
