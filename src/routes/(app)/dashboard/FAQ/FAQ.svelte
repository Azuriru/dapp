<script lang="ts">
	import { t } from '$lib/i18n';
	import faqData from '$lib/i18n/en/dashboard.json';
	import { storeUserInfo } from '$lib/stores/storeUser';
	import Icon from '@iconify/svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	let faqItems: any = [];

	const filterData = () => {
		if (faqData) {
			// Extract the FAQ data
			const faqObject: any = faqData.FAQ;
			const faqEarlyBird: any = faqData.FAQ_earlybird;

			// Convert the FAQ object into an array of items
			if ($storeUserInfo.has_earlybird === 1) {
				faqItems = Object.keys(faqEarlyBird).map((key) => ({
					question: key
				}));
			} else {
				faqItems = Object.keys(faqObject).map((key) => ({
					question: key
				}));
			}
		}
	};
	filterData();
</script>

<div
	class="bg-[--card-bg-color] shadow-xl rounded-lg dark:border border-gray-700 p-5 lg:sticky top-[1vh]"
>
	<a href="/faq" class="text-xl font-semibold w-full flex justify-between items-center"
		><span class="hidden lg:block">{$t('common.FAQ')}</span>
		<span class="block lg:hidden">{$t('common.faqshort')}</span>
		<span class="text-sm text-[--font-gray-color] flex items-center font-medium"
			>{$t('common.more')}<Icon icon="material-symbols:chevron-right" class="text-xl" /></span
		></a
	>
	<div class="mt-4">
		<Accordion>
			<AccordionItem open>
				<svelte:fragment slot="summary"
					>{$t(
						`dashboard.${$storeUserInfo.has_earlybird === 0 ? 'FAQ' : 'FAQ_earlybird'}.${
							faqItems[0].question
						}.title`
					)}</svelte:fragment
				>
				<svelte:fragment slot="content">
					<p class="text-gray-400 text-justify">
						{$t(
							`dashboard.${$storeUserInfo.has_earlybird === 0 ? 'FAQ' : 'FAQ_earlybird'}.${
								faqItems[0].question
							}.answer`
						)}
					</p></svelte:fragment
				>
			</AccordionItem>
			{#each faqItems as list, i}
				{#if i != 0}
					<AccordionItem>
						<svelte:fragment slot="summary"
							>{$t(
								`dashboard.${$storeUserInfo.has_earlybird === 0 ? 'FAQ' : 'FAQ_earlybird'}.${
									list.question
								}.title`
							)}</svelte:fragment
						>
						<svelte:fragment slot="content">
							<p class="text-gray-400 text-justify">
								{$t(
									`dashboard.${$storeUserInfo.has_earlybird === 0 ? 'FAQ' : 'FAQ_earlybird'}.${
										list.question
									}.answer`
								)}
							</p></svelte:fragment
						>
					</AccordionItem>
				{/if}
			{/each}
		</Accordion>
	</div>
</div>
