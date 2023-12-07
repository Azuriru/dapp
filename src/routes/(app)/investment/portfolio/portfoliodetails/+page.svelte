<script lang="ts">
	import { page } from '$app/stores';
	import BackButton from '$lib/component/backbutton/BackButton.svelte';
	import Modal from '$lib/component/modal/modal.svelte';
	import { showToast } from '$lib/component/toasts/toast';
	import ToggleSwitch from '$lib/component/toggleSwitch/ToggleSwitch.svelte';
	import { t } from '$lib/i18n';
	import { apiWithToken } from '$lib/plugins/http';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	let isChecked: any = false,
		showModal = false,
		sn: any,
		packageDetails: any,
		confirm = false;

	const getDetails = async () => {
		let resp = await apiWithToken('GET', '/packageInfo/packageDetails', {
			sn: sn
		});
		if (resp.success) {
			packageDetails = resp.data;
			console.log(packageDetails);
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
	};
	$: {
		if (isChecked) {
			isChecked = false;
			showToast($t('common.toast.coming_soon'), 'orange');
		}
	}
	const openModal = () => {
		if (!isChecked) {
			showModal = true;
		} else {
			isChecked = false;
			confirm = false;
		}
	};

	const closeModal = () => {
		showModal = false;
		isChecked = false;
	};

	const handleConfirm = () => {
		confirm = true;
		showModal = false;
	};
	onMount(() => {
		sn = $page.url.searchParams.get('sn');
		getDetails();
	});
</script>

<div class="dark:bg-[#0E1422] min-h-[100vh] text-[--font-color]">
	<div class="max-w-[1300px] mx-auto py-5 px-3 space-y-5">
		<!-- Back Button -->
		<BackButton title={$t('portfolio.portfolio_details.title')} backTo={'/investment/portfolio'} />
		<div class="bg-[--card-bg-color] w-full rounded-lg p-5 border border-[--border-color]">
			<div class="flex items-center justify-between">
				<p class={packageDetails ? 'text-2xl font-medium' : 'placeholder w-[50%] animate-pulse'}>
					{packageDetails ? $t(`portfolio.package.${packageDetails.package}`) : ''}
				</p>
				<p
					class={packageDetails
						? packageDetails.is_active == 'inactive'
							? 'text-red-500'
							: 'text-green-500'
						: 'placeholder w-[60px] animate-pulse'}
				>
					{packageDetails ? $t(`portfolio.tab.${packageDetails.is_active}`) : ''}
				</p>
			</div>
			<div class="my-5">
				<p class="text-[--font-gray-color]">{$t('portfolio.portfolio_details.amount')}</p>
				<p class=" {packageDetails ? 'text-2xl font-medium' : 'placeholder w-[50%] animate-pulse'}">
					{packageDetails ? Number(packageDetails.package_price).toFixed(2) + ' USDT' : ''}
				</p>
			</div>
			<div class="space-y-2 mb-5">
				<div class="flex justify-between">
					<p class="text-[--font-gray-color] text-sm lg:text-md">
						{$t('portfolio.portfolio_details.daily_roi')}
					</p>
					<p class={packageDetails ? 'text-sm lg:text-md' : 'placeholder w-[60px] animate-pulse'}>
						{packageDetails ? packageDetails.roi + '%' : ''}
					</p>
				</div>
				<div class="flex justify-between">
					<p class="text-[--font-gray-color] text-sm lg:text-md">
						{$t('portfolio.title_value.market_maker')}
					</p>
					<p class={packageDetails ? 'text-sm lg:text-md' : 'placeholder w-[60px] animate-pulse'}>
						{packageDetails ? Number(packageDetails.sales_amount).toFixed(2) + '%' : ''}
					</p>
				</div>
				<div class="flex justify-between">
					<p class="text-[--font-gray-color] text-sm lg:text-md">
						{$t('portfolio.title_value.equity_fund')}
					</p>
					<p class={packageDetails ? 'text-sm lg:text-md' : 'placeholder w-[60px] animate-pulse'}>
						{packageDetails ? Number(packageDetails.invest).toFixed(2) + '%' : ''}
					</p>
				</div>
				<div class="flex justify-between">
					<p class="text-[--font-gray-color] text-sm lg:text-md">
						{$t('portfolio.portfolio_details.date_purchased')}
					</p>
					<p class={packageDetails ? 'text-sm lg:text-md' : 'placeholder w-[60px] animate-pulse'}>
						{packageDetails ? packageDetails.created_at : ''}
					</p>
				</div>
				<div class="flex justify-between">
					<p class="text-[--font-gray-color] text-sm lg:text-md">
						{$t('portfolio.portfolio_details.date_activated')}
					</p>
					<p class={packageDetails ? 'text-sm lg:text-md' : 'placeholder w-[60px] animate-pulse'}>
						{packageDetails?.valid_at || '-'}
					</p>
				</div>
				<div class="flex justify-between">
					<p class="text-[--font-gray-color] text-sm lg:text-md">
						{$t('portfolio.portfolio_details.current_day_count')}
					</p>
					<p class={packageDetails ? 'text-sm lg:text-md' : 'placeholder w-[60px] animate-pulse'}>
						{packageDetails ? packageDetails.count_day : ''}
					</p>
				</div>
				<div class="flex justify-between">
					<p class="text-[--font-gray-color] text-sm lg:text-md">
						{$t('portfolio.portfolio_details.accumulated_commission')}
					</p>
					<p class={packageDetails ? 'text-sm lg:text-md' : 'placeholder w-[60px] animate-pulse'}>
						{packageDetails ? packageDetails.commission : ''}
					</p>
				</div>
			</div>

			<div class="border border-[--border-color] rounded-lg p-3 flex items-center">
				<div class="w-full">
					<p class="text-sm lg:text-md">{$t('portfolio.portfolio_details.auto_subscribed')}</p>
					<p class="text-[--font-gray-color] text-xs lg:text-sm">
						{$t('portfolio.portfolio_details.desc')}
					</p>
				</div>
				<button class="w-[20%] flex justify-end">
					<ToggleSwitch bind:checked={isChecked} />
				</button>
			</div>
			{#if confirm}
				<button
					disabled
					class="btn rounded-lg w-full text-white bg-red-500 cursor-pointer mt-5 flex flex-col items-center"
				>
					{$t('common.button.terminate')}
					<p class="text-xs">Countdown: 5d 15h 20m 15s</p>
				</button>
			{/if}
			<div class="flex justify-between mt-2 ml-2">
				<p class="text-[--font-gray-color] text-sm lg:text-md">
					{$t('portfolio.remark')}
				</p>
			</div>
		</div>
	</div>
</div>

<Modal bind:showModal>
	<p slot="header" class="text-lg">Confirmation</p>
	<div class=" w-[400px] pt-5">
		<p class="text-lg">Are you sure you want to turn on Auto-Subscribe ?</p>
		<div class="mt-5 flex gap-x-2">
			<button
				class="btn rounded-lg border-2 border-[--button-color] text-[--button-color] w-1/2 cursor-pointer"
				on:click={closeModal}
			>
				Cancel
			</button>
			<button
				class="btn rounded-lg bg-[--button-color] w-1/2 cursor-pointer"
				on:click={() => handleConfirm()}
			>
				Confirm
			</button>
		</div>
	</div>
</Modal>
