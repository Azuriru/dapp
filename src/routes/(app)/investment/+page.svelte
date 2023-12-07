<script lang="ts">
	import Chart from '$lib/component/chart/chart.svelte';
	import BottomHeader from '$lib/component/layout/navbar/bottomNav/bottomHeader.svelte';
	import Icon from '@iconify/svelte';
	import { options } from './config';
	import { onMount } from 'svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import Modal from '$lib/component/modal/modal.svelte';
	import { goto } from '$app/navigation';
	import howData from '$lib/i18n/en/investment.json';
	import { t } from '$lib/i18n';
	import Timeline from './timeline/Timeline.svelte';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { showToast } from '$lib/component/toasts/toast';
	import { apiWithToken } from '$lib/plugins/http';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'top'
	};

	let showModal: any = false,
		faqData: any = [],
		data: any = [],
		investAmount: any = '',
		walletBalance: any,
		isChecked: any = false,
		error: any;

	const generateDateLabels = (numDays: number): string[] => {
		const today = new Date();
		const dateLabels = [];

		for (let i = numDays - 1; i >= 0; i--) {
			const date = new Date(today);
			date.setDate(today.getDate() - i);

			const month = date.toLocaleString('en-us', { month: 'short' });
			const day = date.getDate();
			const year = date.getFullYear();

			const formattedDate = `${month} ${day}, ${year}`;
			dateLabels.push(formattedDate);
		}

		return dateLabels;
	};
	const filterData = () => {
		if (howData) {
			// Extract the FAQ data
			const listObject: any = howData.how.list;
			const faqObject: any = howData.faq.list;

			// Convert the FAQ object into an array of items
			data = Object.keys(listObject).map((key) => ({
				list: key
			}));
			faqData = Object.keys(faqObject).map((key) => ({
				question: key
			}));
		}
	};

	const getWalletBalance = async () => {
		let resp = await apiWithToken('GET', '/walletInfo/wallet', {
			wallet: 'CAPITAL'
		});
		if (resp.success) {
			walletBalance = resp.data.amount;
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
	};

	const onInvest = async () => {
		showToast($t('common.toast.coming_soon'), 'orange');
		investAmount = '';
		showModal = false;
		// let resp = await apiWithToken('POST', '/package/invest', {
		// 	amount: investAmount
		// });
		// if (resp.success) {
		// 	investAmount = '';
		// 	showModal = false;
		// 	showToast($t('common.toast.invest_success'), 'green');
		// 	getWalletBalance();
		// } else {
		// 	for (let i = 0; i < resp.data.length; i++) {
		// 		showToast($t(`common.error.${resp.data[i]}`), 'red');
		// 	}
		// }
	};

	$: {
		if (isChecked) {
			if (investAmount === '' || +investAmount < 100) {
				error = $t('common.toast.min_100');
				isChecked = false;
			}
		}
	}

	$: {
		if (!showModal || +investAmount > 100 || investAmount == '') {
			error = '';
		}
	}
	onMount(() => {
		filterData();
		options.xaxis.categories = generateDateLabels(7);
		getWalletBalance();
	});
</script>

<div class="">
	<div class="dark:bg-[#0E1422] bg-white py-20 px-5 lg:px-0 w-full">
		<div class=" lg:max-w-[1300px] mx-auto relative flex">
			<div class="space-y-5 lg:w-1/2">
				<div class="space-y-3">
					<p class="text-4xl font-bold">{$t('investment.title')}</p>
					<div class="flex lg:flex-row flex-col gap-x-5 gap-y-2">
						<div class="flex items-center gap-x-2 text-[--font-gray-color] text-sm">
							<Icon icon="subway:tick" class="text-green-400 text-xs" />
							<p>{$t('investment.benefits.benefits1')}</p>
						</div>
						<div class="flex items-center gap-x-2 text-[--font-gray-color] text-sm">
							<Icon icon="subway:tick" class="text-green-400 text-xs" />
							<p>{$t('investment.benefits.benefits2')}</p>
						</div>
						<div class="flex items-center gap-x-2 text-[--font-gray-color] text-sm">
							<Icon icon="subway:tick" class="text-green-400 text-xs" />
							<p>{$t('investment.benefits.benefits3')}</p>
						</div>
					</div>
				</div>

				<div class="flex gap-x-10">
					<div class="">
						<p class="text-3xl font-semibold">7.2K</p>
						<p class="text-sm font-light text-[--font-gray-color]">
							{$t('investment.total_people_invested')}
						</p>
					</div>
					<div class="">
						<p class="text-3xl font-semibold text-green-500">50% ~ 87%</p>
						<p class="text-sm font-light text-[--font-gray-color]">
							{$t('investment.Estimated APR')}
						</p>
					</div>
				</div>

				<div class="flex gap-x-5">
					<button
						class="btn rounded bg-[--button-color] text-white"
						on:click={() => (showModal = true)}
					>
						{$t('investment.invest_now')}
					</button>
					<button
						class="btn rounded border border-[--button-color] text-[--button-color]"
						on:click={() => goto('/investment/portfolio')}
					>
						{$t('investment.portfolio')}
					</button>
				</div>
			</div>
			<div class="w-1/2 relative hidden lg:block">
				<img
					src="/assets/img/investment/bg.png"
					class="absolute top-[-30%] right-0 translate-x-[-50%] w-[300px] h-[350px]"
					alt=""
				/>
			</div>

			<Icon
				icon="cryptocurrency-color:usdt"
				class="block lg:hidden text-[150px] top-[0] right-[-25vw] absolute"
			/>
		</div>
	</div>

	<div
		class="bg-[--background-color] py-20 px-5 lg:px-0 w-full font-[--font-color] border border-[--border-color] dark:border-none rounded-t text-[--font-color]"
	>
		<div class="lg:max-w-[1300px] mx-auto space-y-14">
			<div class="flex flex-col lg:flex-row justify-between gap-10">
				<div class="space-y-5 lg:w-1/2">
					<p class="text-4xl font-bold">{$t('investment.what.title')}</p>
					<p class="text-[--font-gray-color] text-sm">
						{$t('investment.what.desc')}
					</p>
					<img src="/assets/img/investment/2ndImg.png" class="lg:w-[50%]" alt="" />
				</div>
				<div class="lg:w-1/2">
					<p class="text-4xl font-bold lg:ml-5 mb-5 lg:mb-0">7 {$t('investment.Days APR')}</p>
					<Chart {options} />
				</div>
			</div>
			<!-- <div class="">
				<div>
					<p class="text-4xl font-bold">{$t('investment.how.title')}</p>
				</div>
				<div class="mb-20 mt-8">
					<ul class="list-disc ml-5 space-y-4 text-lg">
						{#each data as list}
							<li>
								{$t(`investment.how.list.${list.list}`)}
							</li>
						{/each}
					</ul>
				</div>
			</div> -->
			<p class="text-4xl font-bold">Strategic Planning Of Winner Fund</p>
			<Timeline />
			<div class="flex flex-nowrap overflow-x-scroll gap-x-5 pt-10">
				<div
					class="dark:bg-[#1F2433] bg-gray-200 border border-[--border-color] rounded-lg p-5 lg:w-1/3 w-full flex flex-col items-center"
				>
					<div class="h-[100px] flex items-center">
						<img src="/assets/img/investment/test1.png" class="w-[128px]" alt="" />
					</div>
					<div class="flex flex-col items-center text-center mb-5 space-y-2 w-[250px]">
						<div class="flex gap-x-2 items-center">
							<p
								class="text-white bg-[--button-color] w-[25px] h-[25px] rounded-full flex items-center justify-center"
							>
								1
							</p>
							<p class="text-lg">{$t(`investment.steps.bind_upline.title`)}</p>
						</div>
						<p class="text-sm text-[--font-gray-color]">
							{$t(`investment.steps.bind_upline.desc`)}
						</p>
					</div>
					<button
						class="text-lg font-bold underline rounded-lg text-[--button-color] flex items-center"
						on:click={() => goto('/profile?tabSet=3')}
					>
						{$t(`investment.steps.bind_upline.go_bind_upline`)}
						<Icon icon="material-symbols:chevron-right" />
					</button>
				</div>
				<div
					class="dark:bg-[#1F2433] bg-gray-200 border border-[--border-color] rounded-lg p-5 lg:w-1/3 w-full flex flex-col items-center"
				>
					<div class="h-[100px] flex items-center">
						<img src="/assets/img/investment/test2.png" class="w-[128px] mb-5" alt="" />
					</div>
					<div class="flex flex-col items-center text-center mb-5 space-y-2 w-[250px]">
						<div class="flex gap-x-2 items-center">
							<p
								class="text-white bg-[--button-color] w-[25px] h-[25px] rounded-full flex items-center justify-center"
							>
								2
							</p>
							<p class="text-lg">{$t(`investment.steps.deposit_usdt.title`)}</p>
						</div>
						<p class="text-sm text-[--font-gray-color]">
							{$t(`investment.steps.deposit_usdt.desc`)}
						</p>
					</div>
					<button
						class="text-lg font-bold underline rounded-lg text-[--button-color] flex items-center"
						on:click={() => goto('/wallet')}
					>
						{$t(`investment.steps.deposit_usdt.deposit_now`)}
						<Icon icon="material-symbols:chevron-right" />
					</button>
				</div>
				<div
					class="dark:bg-[#1F2433] bg-gray-200 border border-[--border-color] rounded-lg p-5 lg:w-1/3 w-full flex flex-col items-center"
				>
					<div class="h-[100px] flex items-center">
						<img src="/assets/img/investment/test3.png" class="w-[128px]" alt="" />
					</div>
					<div class="flex flex-col items-center text-center mb-5 space-y-2 w-[250px]">
						<div class="flex gap-x-2 items-center">
							<p
								class="text-white bg-[--button-color] w-[25px] h-[25px] rounded-full flex items-center justify-center"
							>
								3
							</p>
							<p class="text-lg">{$t(`investment.steps.buy_investment_package.title`)}</p>
						</div>
						<p class="text-sm text-[--font-gray-color]">
							{$t(`investment.steps.buy_investment_package.desc`)}
						</p>
					</div>
					<button
						class="text-lg font-bold underline rounded-lg text-[--button-color] flex items-center"
						on:click={() => (showModal = true)}
					>
						{$t(`investment.steps.buy_investment_package.invest_now`)}
						<Icon icon="material-symbols:chevron-right" />
					</button>
				</div>
			</div>
		</div>
	</div>
	<div class="dark:bg-[#1E2026] bg-white py-20 px-5 lg:px-0 w-full text-[--font-color]">
		<div class="max-w-[1300px] mx-auto">
			<p class="text-4xl font-bold">{$t(`investment.faq.title`)}</p>
			<Accordion class="my-5 ">
				{#each faqData as faq}
					<AccordionItem padding="px-2 py-5" class="border-b border-[--border-color]">
						<svelte:fragment slot="summary"
							><p class="text-xl">
								{$t(`investment.faq.list.${faq.question}.title`)}
							</p></svelte:fragment
						>
						<svelte:fragment slot="content">
							<p class="text-[--font-gray-color]">
								{$t(`investment.faq.list.${faq.question}.answer`)}
							</p>
						</svelte:fragment>
					</AccordionItem>
				{/each}
			</Accordion>
		</div>
	</div>
</div>
<BottomHeader />

<Modal bind:showModal closeState={true}>
	<div class="bg-[--button-color] rounded-lg p-5 z-10" data-popup="popupClick">
		<p class="max-w-[300px]">{$t('investment.modal.rules')}</p>
		<div class="arrow variant-filled-primary" />
	</div>
	<!-- header -->
	<p slot="header" class="text-2xl font-bold p-3">{$t('investment.modal.title')}</p>
	<div class="w-[90vw] lg:w-[800px] p-3 space-y-5 border-t border-[--border-color]">
		<div class="flex flex-col lg:flex-row lg:items-end gap-x-2">
			<p class="text-4xl font-bold text-green-500">50% ~ 87%</p>
			<div class="flex gap-x-2">
				<span class="text-[--font-gray-color] text-lg font-medium"
					>{$t('investment.modal.estimated_apr')}</span
				>
				<button class="btn p-0 text-[--font-gray-color]" use:popup={popupClick}
					><Icon icon="material-symbols:help" /></button
				>
			</div>
		</div>

		<div class="space-y-1">
			<div class="flex justify-between">
				<p class="text-[--font-gray-color] text-lg">{$t('investment.modal.amount')}</p>
				<p class="text-gray-500">
					{$t('investment.modal.available_balance')}: {Number(walletBalance).toFixed(2) || 0}
				</p>
			</div>
			<div class="relative">
				<input
					type="text"
					bind:value={investAmount}
					class="bg-gray-800 w-full rounded-lg border-none p-3 placeholder:text-gray-500"
					placeholder="Please enter an amount..."
				/>
				{#if error}
					<span class="text-sm text-red-500">{error}</span>
				{/if}
				<div class="flex items-center absolute top-[20%] right-[1%]">
					<p class="px-3 border-r border-gray-600">USDT</p>
					<button
						class="text-[--button-color] btn px-2 py-0"
						on:click={() => (investAmount = walletBalance)}>MAX</button
					>
				</div>
			</div>
		</div>
		<div class="flex items-start gap-x-5">
			<input
				disabled
				class="checkbox w-[15px] h-[15px] mt-1"
				type="checkbox"
				bind:checked={isChecked}
			/>
			<p class="text-gray-300 text-sm lg:text-md">
				{$t('investment.modal.confirm')}
			</p>
		</div>
		<button
			disabled={!isChecked}
			class="bg-[--button-color] btn rounded-lg w-full text-xl"
			on:click={onInvest}
		>
			<!-- {$t('common.button.confirm')} -->
			{$t('common.toast.coming_soon')}
		</button>
	</div>
</Modal>

<!-- 
<style>
	ul {
		line-height: 1.5em;
		margin: 5px 0 15px;
		padding: 0;
	}

	li {
		list-style: none;
		position: relative;
		padding: 0 0 0 20px;
	}

	li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 10px;
		width: 7px;
		height: 7px;
		background-color: var(--button-color);
	}
</style> -->
