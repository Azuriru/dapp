<script lang="ts">
	import { showToast } from '$lib/component/toasts/toast';
	import { t } from '$lib/i18n';
	import { apiWithToken } from '$lib/plugins/http';
	import { storeUserInfo } from '$lib/stores/storeUser';
	import { checkUserInfo } from '$lib/utils/utils';
	import { onMount } from 'svelte';
	let isChecked = false;
	let uplineAddress: any = '';
	let error: string;

	$: {
		if (isChecked) {
		if (uplineAddress === '') {
				showToast($t('common.toast.empty_upline'), 'red');
				isChecked = false;
			}
		}
	}
	const bindUpline = async () => {
		if (uplineAddress === '' || uplineAddress === undefined) {
			return (error = 'Please enter a valid address');
		} else {
			let resp = await apiWithToken('POST', '/user/bindUpline', {
				upline_address: uplineAddress
			});
			if (resp.success) {
				showToast('Upline has been binded !', 'green');
			} else {
				for (let i = 0; i < resp.data.length; i++) {
					showToast($t(`common.error.${resp.data[i]}`), 'red');
				}
			}
			isChecked = false;
			checkUserInfo();
		}
	};
	onMount(() => {
		checkUserInfo();
	});
</script>

<div class="w-full flex flex-col items-center lg:space-y-3 space-y-10  lg:pb-10">
	<div class="w-full flex justify-between items-center">
		<div>
			<p class="text-lg">{$t('profile.referral.title')}</p>
			<p class="text-[--font-gray-color] text-xs">{$t('profile.referral.desc')}</p>
		</div>
	</div>
	<div class="flex flex-col items-center w-full lg:w-[50%] space-y-10 lg:space-y-5">
		{#if $storeUserInfo.has_upline === 1}
			<div class="w-full space-y-5">
				<div class="w-full">
					<p class="text-lg">{$t('profile.referral.your_upline.title')}</p>
					<p class="text-[--font-gray-color] text-xs">{$t('profile.referral.your_upline.desc')}</p>
				</div>
				<div
					class="border border-gray-300 dark:border-gray-700 bg-[--input-disabled-color] rounded-lg w-full p-3 text-[--font-gray-color]"
				>
					{$storeUserInfo.upline_address}
				</div>
			</div>
		{/if}
		{#if $storeUserInfo.has_upline === 0}
			<div class="w-full space-y-5">
				<div class="w-full">
					<p class="text-lg">{$t('profile.referral.referral_address.title')}</p>
					<p class="text-[--font-gray-color] text-xs">
						{$t('profile.referral.referral_address.desc')}
					</p>
				</div>
				<div class="space-y-1">
					<input
						type="text"
						bind:value={uplineAddress}
						class="border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-[#131B2E] rounded-lg w-full"
						placeholder="User Address"
					/>
					{#if error}
						<span class="text-red-500 text-sm">{error}</span>
					{/if}
				</div>
			</div>
			<label class="flex items-center space-x-3 ml-2 w-full">
				<input
					required
					class="checkbox w-[15px] h-[15px]"
					type="checkbox"
					bind:checked={isChecked}
					on:click={() => (isChecked = !isChecked)}
				/>
				<p class="text-sm text-[--font-gray-color]">
					{$t('profile.referral.confirm')}
				</p>
			</label>
			<div class="flex items-center gap-x-2 w-full">
				<button
					disabled={!isChecked}
					class="btn rounded-lg bg-[--button-color] text-white w-full"
					on:click={() => bindUpline()}>{$t('common.button.confirm')}</button
				>
			</div>
		{:else}
			<div class="w-full">
				<p class="text-[--font-gray-color]">{$t('profile.referral.success')}</p>
			</div>
		{/if}
	</div>
</div>
