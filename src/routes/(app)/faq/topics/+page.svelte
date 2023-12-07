<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import BackButton from '$lib/component/backbutton/BackButton.svelte';
	import { t } from '$lib/i18n';
	import faqList from '$lib/i18n/en/faq.json';
	import { onMount } from 'svelte';

	let faqItems: any = [],
		topic: string | any;

	const filterData = (name: string | null) => {
		if (faqList && name) {
			const faqObject: any = faqList;
			const matchingKey = Object.keys(faqObject).find((key) => key === name);
			if (matchingKey) {
				faqItems = Object.keys(faqObject[matchingKey].questions).map((key) => ({
					question: key
				}));
			}
		}
	};

	onMount(() => {
		topic = $page.url.searchParams.get('name');
		topic.toString();
		filterData(topic);
	});
</script>

<div class="max-w-[1300px] h-full flex flex-col mx-auto py-5 px-3 gap-y-2 text-[--font-color]">
	<BackButton title={$t('faq.faq_topics')} backTo={'/faq'} />

	<div
		class="bg-[--card-bg-color] p-5 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 space-y-10"
	>
		<p class="text-2xl">{$t(`faq.${topic}.title`)}</p>
		<div class="flex lg:flex-row flex-col">
			<div class="space-y-10 lg:w-1/2">
				{#each faqItems as { question }, i}
					{#if i < faqItems.length / 2}
						<button
							class="text-lg hover:text-[--button-color] cursor-pointer transition text-left w-full underline"
							on:click={() => goto(`/faq/topics/detail?name=${topic}&&question=${question}`)}
							>{`Q${i + 1}.`}
							{$t(`faq.${topic}.questions.${question}.title`)}
						</button>
					{/if}
				{/each}
			</div>
			<div class="space-y-10 lg:w-1/2">
				{#each faqItems as { question }, i}
					{#if i >= faqItems.length / 2}
						<button
							class="text-lg hover:text-[--button-color] cursor-pointer transition text-left w-full underline"
							on:click={() => goto(`/faq/topics/detail?name=${topic}&&question=${question}`)}
							>{`Q${i + 1}.`}
							{$t(`faq.${topic}.questions.${question}.title`)}
						</button>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>
