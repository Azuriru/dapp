<script lang="ts">
	import { goto } from '$app/navigation';
	import Modal from '$lib/component/modal/modal.svelte';
	import { clearUserData, connectedAddress } from '$lib/utils/wallet';
	import Icon from '@iconify/svelte';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { menuList } from '../../menu';
	import { truncateString } from '$lib/helper/helper';
	import { storeAccessToken } from '$lib/stores/storeLocal';
	import { parseJwt } from '$lib/utils/utils';
	import { t } from '$lib/i18n';
	import { storeUserInfo } from '$lib/stores/storeUser';

	const drawerStore = getDrawerStore();
	let showModal = false;

	const gotoPage = (target?: any) => {
		if (target !== undefined && target !== '') {
			goto(target.url);
			drawerStore.close();
		}
	};
</script>

<div class="flex flex-row antialiased">
	<div
		class="w-full h-screen md:block shadow-xl px-6 overflow-x-hidden transition-transform duration-100 ease-in-out"
	>
		<div class="space-y-6 md:space-y-10 mt-10">
			<h1
				class="hidden md:block font-bold text-sm md:text-xl text-center text-primary text-[#264079] dark:text-white"
			>
				Infinite <span class="text-[#F0AE34]">Winner</span>
			</h1>
			<div id="profile" class="space-y-3">
				<img
					src={$storeUserInfo.has_earlybird === 1
						? '/assets/img/profile/ranking/rank3.png'
						: '/assets/img/profile/avatar/1.png'}
					alt="Avatar user"
					class="w-24 md:w-32 rounded-md mx-auto"
				/>
				<div>
					<h2 class="font-medium text-xs md:text-sm text-center text-[#0049CE]">
						{truncateString(connectedAddress, 5, 5)}
					</h2>
					<p class="text-xs text-gray-500 text-center">
						@{parseJwt($storeAccessToken.access_token).extend.id}
					</p>
				</div>
			</div>
			<div class="flex flex-col space-y-2">
				{#each menuList as menu}
					<button
						class="flex items-center w-full font-medium text-secondary py-2 px-2 hover:bg-[#0049CE] hover:text-white rounded-md transition duration-150 ease-in-out text-left space-x-3"
						on:click={() => gotoPage(menu)}
					>
						<Icon icon={menu.icon} class="text-2xl" />
						<span class="">{$t(`common.menu.${menu.label}`)}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>

<Modal bind:showModal>
	<p slot="header">Confirm Logout</p>
	<div>
		<p class="my-5">Are you sure you want to logout?</p>
		<div class="flex w-full items-center justify-center gap-x-2">
			<button class="btn border rounded-lg" on:click={() => clearUserData()}>Confirm</button>
			<button class="btn border rounded-lg" on:click={() => (showModal = false)}>Cancel</button>
		</div>
	</div>
</Modal>
