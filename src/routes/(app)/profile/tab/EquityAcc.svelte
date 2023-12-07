<script lang="ts">
	import { showToast } from '$lib/component/toasts/toast';
	import { t } from '$lib/i18n';
	import { apiWithToken } from '$lib/plugins/http';
	import { storeUserInfo } from '$lib/stores/storeUser';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	export let tabSet: any;
	let isActive = false,
		count: number = 0,
		password: any,
		unlockState = false,
		username: any = 'John Doe';

	let activateState =
		$storeUserInfo.has_password === 1 &&
		$storeUserInfo.has_upline === 1 &&
		$storeUserInfo.has_profile === 1;

	const countCompleted = () => {
		let list = [$storeUserInfo.has_upline, $storeUserInfo.has_password, $storeUserInfo.has_profile];

		for (let i = 0; i < list.length; i++) {
			if (list[i] === 1) {
				count++;
			}
		}
	};

	const checkPassword = async () => {
		let resp = await apiWithToken('POST', '/user/verifyPassword', {
			password: password
		});
		if (resp.success) {
			getUserData();
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
	};
	const getUserData = async () => {
		let resp = await apiWithToken('GET', '/user/profileInfo');
		if (resp.success) {
			username = resp.data.nickname;
			unlockState = true;
		} else {
			console.log('error', resp);
		}
	};
	onMount(() => {
		countCompleted();
	});
</script>

<div class="w-full flex flex-col items-center lg:space-y-3 space-y-10 lg:pb-10">
	<div class="w-full flex justify-between items-center">
		<div>
			<p class="text-lg">{$t('profile.equity_account.title')}</p>
			<p class="text-[--font-gray-color] text-xs">{$t('profile.equity_account.desc')}</p>
		</div>
	</div>
	{#if !isActive}
		<div out:fly class="flex flex-col items-center w-full lg:w-[50%] space-y-5">
			<div class="w-full flex justify-between border-b border-[--border-color] pb-2">
				<div class="w-2/3">
					<p class="text-lg">{$t('profile.equity_account.requirements.title')}</p>
					<p class="text-[--font-gray-color] text-xs">
						{$t('profile.equity_account.requirements.desc')}
					</p>
				</div>
				<div class="w-1/3 text-sm text-[--font-gray-color] flex justify-end items-end text-right">
					{count} of 3 {$t('profile.equity_account.completed')}
				</div>
			</div>

			<div class="space-y-5 w-full">
				<div class="w-full flex justify-between">
					<div class="flex gap-x-2 w-2/3 items-center">
						<Icon
							icon="icon-park-solid:check-one"
							class="text-2xl {$storeUserInfo.has_profile === 1
								? 'text-green-500'
								: 'text-[--font-gray-color]'}"
						/>
						<div class="w-full">
							<p>{$t('profile.equity_account.profile_verification.title')}</p>
							<p class="text-sm text-[--font-gray-color]">
								{$t('profile.equity_account.profile_verification.desc')}
							</p>
						</div>
					</div>
					<div class="w-1/3 flex items-center justify-end">
						{#if $storeUserInfo.has_profile === 0}
							<button
								class="text-[--button-color] cursor-pointer flex items-center"
								on:click={() => (tabSet = 0)}
							>
								<p class="">{$t('profile.equity_account.set_now')}</p>
								<Icon icon="material-symbols:chevron-right" class="text-xl" />
							</button>
						{:else}
							<p class="text-green-500">{$t('profile.equity_account.done')}</p>
						{/if}
					</div>
				</div>
				<div class="w-full flex justify-between">
					<div class="flex gap-x-2 w-2/3 items-center">
						<Icon
							icon="icon-park-solid:check-one"
							class="text-2xl {$storeUserInfo.has_password === 1
								? 'text-green-500'
								: 'text-[--font-gray-color]'}"
						/>
						<div class="w-full">
							<p>{$t('profile.equity_account.security_password.title')}</p>
							<p class="text-sm text-[--font-gray-color]">
								{$t('profile.equity_account.security_password.desc')}
							</p>
						</div>
					</div>
					<div class="w-1/3 flex items-center justify-end">
						{#if $storeUserInfo.has_password === 0}
							<button
								class="text-[--button-color] cursor-pointer flex items-center"
								on:click={() => (tabSet = 1)}
							>
								<p class="">{$t('profile.equity_account.set_now')}</p>
								<Icon icon="material-symbols:chevron-right" class="text-xl" />
							</button>
						{:else}
							<p class="text-green-500">{$t('profile.equity_account.done')}</p>
						{/if}
					</div>
				</div>
				<div class="w-full flex justify-between">
					<div class="flex gap-x-2 w-2/3 items-center">
						<Icon
							icon="icon-park-solid:check-one"
							class="text-2xl {$storeUserInfo.has_upline === 1
								? 'text-green-500'
								: 'text-[--font-gray-color]'}"
						/>
						<div class="w-full">
							<p>{$t('profile.equity_account.bind_an_upline.title')}</p>
							<p class="text-sm text-[--font-gray-color]">
								{$t('profile.equity_account.bind_an_upline.desc')}
							</p>
						</div>
					</div>
					<div class="w-1/3 flex items-center justify-end">
						{#if $storeUserInfo.has_upline === 0}
							<button
								class="text-[--button-color] cursor-pointer flex items-center"
								on:click={() => (tabSet = 3)}
							>
								<p class="">{$t('profile.equity_account.bind_now')}</p>
								<Icon icon="material-symbols:chevron-right" class="text-xl" />
							</button>
						{:else}
							<p class="text-green-500">{$t('profile.equity_account.done')}</p>
						{/if}
					</div>
				</div>
			</div>
			<button
				disabled={!activateState}
				on:click={() => (isActive = true)}
				class=" w-full text-center btn bg-[--button-color] rounded-lg mt-5 text-white"
			>
				{$t('profile.equity_account.activate')}
			</button>
		</div>
	{:else}
		<div in:fly class="flex flex-col items-center w-full lg:w-[50%] space-y-5 relative">
			<div class="{unlockState ? 'blur-none' : 'blur-md'} w-full space-y-5">
				<div class=" w-full">
					<p class="text-lg">{$t('profile.equity_account.fund_account_info.title')}</p>
					<p class="text-[--font-gray-color] text-xs">
						{$t('profile.equity_account.fund_account_info.desc')}
					</p>
				</div>
				<div>
					<p class="text-sm text-[--font-gray-color]">
						{$t('profile.equity_account.fund_account_info.username')}
					</p>
					<div
						class="border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-[--input-color] p-3 px-4 flex justify-between"
					>
						<p>{username}</p>
					</div>
				</div>
				<div>
					<p class="text-sm text-[--font-gray-color]">
						{$t('profile.equity_account.fund_account_info.password')}
					</p>
					<div
						class="border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-[--input-color] p-3 px-4 flex justify-between"
					>
						<p>*******</p>
					</div>
				</div>
				<div>
					<p class="text-sm text-[--font-gray-color]">
						{$t('profile.equity_account.fund_account_info.fund_acc_url')}
					</p>
					<a href="/" class="underline text-[--button-color]">asdsadasdasdads</a>
					<!-- <div
						class="border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-[--input-color] p-3 px-4 flex justify-between"
					>
						<p>asdasdsad</p>
						<button
							use:clipboard={$storeUserInfo.address}
							on:click={() => showToast($t('common.toast.address_copied'), 'green')}
							class=" btn p-0 rounded-none flex items-center justify-center"
						>
							<Icon icon="bxs:copy" />
						</button>
					</div> -->
				</div>
			</div>
			<!-- Prompt Password -->
			<div
				out:fly
				class=" flex flex-col items-center absolute p-5 top-[50%] translate-y-[-50%] {unlockState
					? 'hidden'
					: 'block'}"
			>
				<Icon icon="material-symbols:lock" class="text-[80px] text-[--font-gray-color]" />
				<div class="w-full text-center my-5">
					<p class="font-bold">{$t('profile.equity_account.locked.title')}</p>
					<p class="text-[--font-gray-color] text-sm">
						{$t('profile.equity_account.locked.desc')}
					</p>
				</div>
				<form on:submit={checkPassword} class="relative">
					<input
						required
						type="password"
						bind:value={password}
						class="bg-[--input-color] rounded-lg border border-[--border-color]"
						placeholder={$t('profile.equity_account.locked.enter_your_password')}
					/>
					<button type="submit" class="absolute top-[15%] right-[2%] text-xl btn p-1">
						<Icon icon="ph:arrow-right" />
					</button>
				</form>
			</div>
		</div>
	{/if}
</div>
