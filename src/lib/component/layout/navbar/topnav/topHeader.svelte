<script lang="ts">
	import Icon from '@iconify/svelte';
	import { AppBar, clipboard } from '@skeletonlabs/skeleton';
	// for drawer
	import type { DrawerSettings } from '@skeletonlabs/skeleton';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	// for light switch
	import { LightSwitch } from '@skeletonlabs/skeleton';
	// for popup
	import { goto } from '$app/navigation';
	import { showToast } from '$lib/component/toasts/toast';
	import { truncateString } from '$lib/helper/helper';
	import { storeUserInfo } from '$lib/stores/storeUser';
	import { clearUserData, connectedAddress, onLogOut } from '$lib/utils/wallet';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { popup, storePopup } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { api } from '$lib/plugins/http';
	import { storeLocal } from '$lib/stores/storeLocal';
	import { t } from '$lib/i18n';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	const drawerSettings: DrawerSettings = {
		id: 'user-menu',
		position: 'left',
		width: 'w-3/4 md:max-w-sm'
	};
	const languageSetting: DrawerSettings = {
		id: 'lang-menu',
		position: 'right',
		width: 'w-3/4 md:max-w-sm'
	};

	const drawerStore = getDrawerStore();

	const toggle = () => {
		if ($drawerStore.open) {
			drawerStore.close();
		} else {
			drawerStore.open(drawerSettings);
		}
	};
	const toggleLang = () => {
		if ($drawerStore.open) {
			drawerStore.close();
		} else {
			drawerStore.open(languageSetting);
		}
	};

	const popupSetting: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupSetting',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};

	onMount(() => {});
</script>

<div class="card p-5 w-72 shadow-xl" data-popup="popupSetting">
	<div class="flex flex-col items-center space-y-5">
		<div>
			<p class="text-sm font-semibold">{$t('common.account_address')}</p>
			<div class="flex items-center gap-x-2 text-sm text-[--font-gray-color]">
				<p class="">{truncateString($storeUserInfo.address, 5, 5)}</p>
				<button
					use:clipboard={$storeUserInfo.address}
					on:click={() => showToast($t('common.toast.address_copied'), 'green')}
					class="w-[10%] btn p-0 rounded-none flex items-center justify-center"
				>
					<Icon icon="bxs:copy" />
				</button>
			</div>
		</div>

		<button
			class="w-full btn rounded-lg bg-[--button-color] text-white"
			on:click={() => goto('/profile')}>{$t('common.profile')}</button
		>
		<hr class="bg-gray-800 w-full h-[1px]" />
		<button class="w-full btn rounded-lg bg-red-500 text-white" on:click={() => onLogOut()}
			>{$t('common.logout')}</button
		>
	</div>
</div>

<AppBar
	padding="px-5 lg:py-3 py-2 "
	class="shadow-lg border-b border-gray-300 dark:border-none"
	background="bg-[--card-bg-color] "
>
	<svelte:fragment slot="lead">
		<div class="flex">
			<button class="lg:flex 3xl:hidden items-center pr-4 hidden" on:click={toggle}>
				<Icon icon="game-icons:hamburger-menu" class="text-xl" />
			</button>
			<button class="flex items-center gap-x-2" on:click={() => goto('/dashboard')}>
				<img
					src="/assets/img/logo/logoOnlyDark.png"
					class="w-[40px] h-[30px] dark:hidden block"
					alt=""
				/>
				<img
					src="/assets/img/logo/logoOnlyLight.png"
					class="w-[40px] h-[30px] dark:block hidden"
					alt=""
				/>
				<p class="text-xl font-bold text-[#264079] dark:text-white lg:block hidden">
					Infinite <span class="text-[#F0AE34]">Winner</span>
				</p>
			</button>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<LightSwitch />
		<button class="btn p-0 w-[30px] h-[30px] text-[30px]" on:click={toggleLang}>
			<!-- <Icon
				icon={`circle-flags:${
					$storeLocal.lang === 'en' ? 'uk' : $storeLocal.lang === 'zh' ? 'cn' : 'tw'
				}`}
			/> -->
			<Icon icon="material-symbols:language" />
		</button>
		<button
			class="p-0 btn overflow-hidden rounded-full w-[35px] border border-gray-300 dark:border-none"
			use:popup={popupSetting}
		>
			<img
				src={$storeUserInfo.has_earlybird === 1
					? '/assets/img/profile/ranking/rank3.png'
					: '/assets/img/profile/avatar/1.png'}
				alt=""
			/>
		</button>
	</svelte:fragment>
</AppBar>
