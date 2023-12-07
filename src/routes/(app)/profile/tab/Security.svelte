<script lang="ts">
	import { showToast } from '$lib/component/toasts/toast';
	import { t } from '$lib/i18n';
	import { apiWithToken } from '$lib/plugins/http';
	import { storeUserInfo } from '$lib/stores/storeUser';
	import { checkUserInfo } from '$lib/utils/utils';
	import Icon from '@iconify/svelte';
	let isChecked = false;
	let data: any = {
		old_password: '',
		new_password: '',
		confirm_password: ''
	};

	let showPassword = {
		old: false,
		new: false,
		confirm: false
	};
	$: {
		if (isChecked) {
			if (data['confirm_password'] === '' || data['new_password'] === '') {
				showToast($t('common.toast.fill_password'), 'red');
				isChecked = false;
			}
		}
	}
	function onInput(event: any, field: any) {
		data[field] = event.target.value;
	}

	const postPw = async () => {
		let resp = await apiWithToken('POST', '/user/password', data);
		if (resp.success) {
			showToast('Password has been updated !', 'green');
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
		data = {
			old_password: '',
			new_password: '',
			confirm_password: ''
		};

		showPassword = {
			old: false,
			new: false,
			confirm: false
		};
		checkUserInfo();
	};
</script>

<div class="w-full flex flex-col items-center lg:space-y-3 space-y-10  lg:pb-10">
	<div class="w-full flex justify-between items-center">
		<div>
			<p class="text-lg">{$t('profile.security.title')}</p>
			<p class="text-[--font-gray-color] text-xs">{$t('profile.security.desc')}</p>
		</div>
	</div>
	<div class="flex flex-col items-center w-full lg:w-[50%] space-y-10 lg:space-y-5">
		<div class="w-full space-y-5">
			<div class="w-full">
				<p class="text-lg">
					{$storeUserInfo.has_password === 0
						? $t('profile.security.change_password.title2')
						: $t('profile.security.change_password.title1')}
				</p>
				<p class="text-[--font-gray-color] text-xs">
					{$t('profile.security.change_password.desc')}
				</p>
			</div>
			{#if $storeUserInfo.has_password === 1}
				<div class="space-y-1">
					<div class="relative">
						<input
							required
							type={showPassword.old ? 'text' : 'password'}
							class="border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-[#131B2E] rounded-lg w-full"
							on:input={() => onInput(event, 'old_password')}
							placeholder={$t('profile.security.old_password')}
						/>
						<button
							on:click={() => (showPassword.old = !showPassword.old)}
							class="absolute top-[30%] right-[2%]"
						>
							<Icon icon={showPassword.old ? 'mdi:eye' : 'mdi:eye-off'} />
						</button>
					</div>
				</div>
			{/if}
			<div class="space-y-1">
				<div class="relative">
					<input
						required
						type={showPassword.new ? 'text' : 'password'}
						class="border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-[#131B2E] rounded-lg w-full"
						on:input={() => onInput(event, 'new_password')}
						placeholder={$t('profile.security.new_password')}
					/>
					<button
						on:click={() => (showPassword.new = !showPassword.new)}
						class="absolute top-[30%] right-[2%]"
					>
						<Icon icon={showPassword.new ? 'mdi:eye' : 'mdi:eye-off'} />
					</button>
				</div>
			</div>
			<div class="space-y-1">
				<div class="relative">
					<input
						required
						type={showPassword.confirm ? 'text' : 'password'}
						class="border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-[#131B2E] rounded-lg w-full"
						on:input={() => onInput(event, 'confirm_password')}
						placeholder={$t('profile.security.confirm_password')}
					/>
					<button
						on:click={() => (showPassword.confirm = !showPassword.confirm)}
						class="absolute top-[30%] right-[2%]"
					>
						<Icon icon={showPassword.confirm ? 'mdi:eye' : 'mdi:eye-off'} />
					</button>
				</div>
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
				{$t('profile.security.confirm')}
			</p>
		</label>

		<div class="flex flex-col lg:flex-row w-full gap-2">
			<button
				disabled={!isChecked}
				type="submit"
				class="btn rounded-lg bg-[--button-color] text-white"
				on:click={postPw}
			>
				{$t('common.button.save')}
			</button>
		</div>
	</div>
</div>
