<script lang="ts">
	import { showToast } from '$lib/component/toasts/toast';
	import { t } from '$lib/i18n';
	import { apiWithToken } from '$lib/plugins/http';
	import { storeUserInfo } from '$lib/stores/storeUser';
	import { onMount } from 'svelte';
	let isChecked = false;
	let showCheckbox = true;
	let profileData: { [key: string]: { value: string; editable: boolean } } = {
		email: { value: '', editable: true },
		nickname: { value: '', editable: true },
		facebook_url: { value: '', editable: true },
		instagram_url: { value: '', editable: true },
		twitter_url: { value: '', editable: true },
		telegram_url: { value: '', editable: true }
	};

	const getProfileData = async () => {
		let resp = await apiWithToken('GET', '/user/profileInfo');
		if (resp.success) {
			// Update profileData with values from resp.data
			Object.keys(profileData).forEach((key) => {
				if (resp.data[key] !== '') {
					profileData[key].value = resp.data[key];
					profileData[key].editable = resp.data[key] === '';
				}
			});
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
	};

	const postProfileData = async () => {
		const postData: any = {};

		Object.keys(profileData).forEach((key) => {
			postData[key] = profileData[key].value;
		});
		let resp = await apiWithToken('POST', '/user/profileInfo', postData);
		if (resp.success) {
			showToast($t('common.toast.userinfo_updated'), 'green');
			isChecked = false;
			getProfileData();
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
	};
	$: {
		if (isChecked) {
			if (profileData.email.value === '' || profileData.nickname.value === '') {
				showToast($t('common.toast.empty_email_nickname'), 'red');
				isChecked = false;
			}
		}
	}
	$: {
		showCheckbox = Object.values(profileData).some((data) => data.editable);
	}

	onMount(() => {
		getProfileData();
	});
</script>

<form
	on:submit={postProfileData}
	class="w-full flex flex-col items-center lg:space-y-3 space-y-10 lg:pb-10"
>
	<!-- Title -->
	<div class="w-full flex justify-between items-center">
		<div>
			<p class="text-lg">{$t('profile.profile.title')}</p>
			<p class="text-[--font-gray-color] text-xs">{$t('profile.profile.desc')}</p>
		</div>
	</div>
	<div class="flex flex-col items-center w-full lg:w-[50%] space-y-10 lg:space-y-5">
		<!-- Profile -->
		<div class="w-full space-y-5">
			<div class="w-full">
				<p class="text-lg">{$t('profile.profile.profile_info.title')}</p>
				<p class="text-[--font-gray-color] text-xs">{$t('profile.profile.profile_info.desc')}</p>
			</div>
			<div class="space-y-1">
				<p class="text-sm text-[--font-gray-color]">{$t('profile.profile.email')}</p>
				<input
					required
					disabled={!profileData.email.editable}
					type="email"
					class="border border-gray-300 dark:border-gray-700 {!profileData.email.editable
						? 'bg-[--input-disabled-color] text-[--font-gray-color]'
						: 'bg-[--input-color]'} rounded-lg w-full"
					bind:value={profileData.email.value}
					placeholder={$t('profile.profile.email')}
				/>
			</div>
			<div class="space-y-1">
				<p class="text-sm text-[--font-gray-color]">{$t('profile.profile.nickname')}</p>
				<input
					required
					disabled={!profileData.nickname.editable}
					type="text"
					class="border border-gray-300 dark:border-gray-700 rounded-lg w-full bg-[--input-color] {!profileData
						.nickname.editable
						? 'bg-[--input-disabled-color] text-[--font-gray-color]'
						: 'bg-[--input-color]'}"
					bind:value={profileData.nickname.value}
					placeholder={$t('profile.profile.nickname')}
				/>
			</div>
		</div>
		<!-- Social Profile -->
		<div class="w-full space-y-5">
			<div class="w-full">
				<p class="text-lg">{$t('profile.profile.social_profile.title')}</p>
				<p class="text-[--font-gray-color] text-xs">{$t('profile.profile.social_profile.desc')}</p>
			</div>
			<div class="flex flex-col lg:flex-row justify-between gap-4">
				<div class="space-y-1 w-full lg:w-1/2">
					<p class="text-sm text-[--font-gray-color]">
						{$t('profile.profile.social_profile.facebook')}
					</p>
					<input
						disabled={!profileData.facebook_url.editable}
						type="text"
						class="border border-gray-300 dark:border-gray-700 {!profileData.facebook_url.editable
							? 'bg-[--input-disabled-color] text-[--font-gray-color]'
							: 'bg-[--input-color]'} rounded-lg w-full"
						bind:value={profileData.facebook_url.value}
						placeholder={$t('profile.profile.social_profile.facebook') + ' URL'}
					/>
					<span class="text-xs text-[--font-gray-color]">Eg: facebook.com/yourname</span>
				</div>
				<div class="space-y-1 w-full lg:w-1/2">
					<p class="text-sm text-[--font-gray-color]">
						{$t('profile.profile.social_profile.twitter')}
					</p>
					<input
						disabled={!profileData.twitter_url.editable}
						type="text"
						class="border border-gray-300 dark:border-gray-700 {!profileData.twitter_url.editable
							? 'bg-[--input-disabled-color] text-[--font-gray-color]'
							: 'bg-[--input-color]'} rounded-lg w-full"
						bind:value={profileData.twitter_url.value}
						placeholder={$t('profile.profile.social_profile.twitter') + ' URL'}
					/>
					<span class="text-xs text-[--font-gray-color]">Eg: twitter.com/yourusername</span>
				</div>
			</div>
			<div class="flex flex-col lg:flex-row justify-between gap-4">
				<div class="space-y-1 w-full lg:w-1/2">
					<p class="text-sm text-[--font-gray-color]">
						{$t('profile.profile.social_profile.instagram')}
					</p>
					<input
						disabled={!profileData.instagram_url.editable}
						type="text"
						class="border border-gray-300 dark:border-gray-700 {!profileData.instagram_url.editable
							? 'bg-[--input-disabled-color] text-[--font-gray-color]'
							: 'bg-[--input-color]'} rounded-lg w-full"
						bind:value={profileData.instagram_url.value}
						placeholder={$t('profile.profile.social_profile.instagram') + ' URL'}
					/>
					<span class="text-xs text-[--font-gray-color]">Eg: instagram.com/yourusername</span>
				</div>
				<div class="space-y-1 w-full lg:w-1/2">
					<p class="text-sm text-[--font-gray-color]">
						{$t('profile.profile.social_profile.telegram')}
					</p>
					<input
						disabled={!profileData.telegram_url.editable}
						type="text"
						class="border border-gray-300 dark:border-gray-700 {!profileData.telegram_url.editable
							? 'bg-[--input-disabled-color] text-[--font-gray-color]'
							: 'bg-[--input-color]'} rounded-lg w-full"
						bind:value={profileData.telegram_url.value}
						placeholder={$t('profile.profile.social_profile.telegram') + ' URL'}
					/>
					<span class="text-xs text-[--font-gray-color]">Eg: t.me/yourusername</span>
				</div>
			</div>
			{#if showCheckbox}
				<label class="flex items-center space-x-3 ml-2">
					<input
						required
						class="checkbox w-[15px] h-[15px]"
						type="checkbox"
						bind:checked={isChecked}
						on:click={() => (isChecked = !isChecked)}
					/>
					<p class="text-sm text-[--font-gray-color]">
						{$t('profile.profile.social_profile.confirm')}
					</p>
				</label>
			{/if}
		</div>
		<div class="flex flex-col lg:flex-row w-full gap-2">
			<button
				disabled={!isChecked}
				type="submit"
				class="btn rounded-lg bg-[--button-color] text-white">{$t('common.button.save')}</button
			>
		</div>
	</div>
</form>
