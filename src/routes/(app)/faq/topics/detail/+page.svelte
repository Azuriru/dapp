<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import BackButton from '$lib/component/backbutton/BackButton.svelte';
	import { t } from '$lib/i18n';
	import faqList from '$lib/i18n/en/faq.json';
	import { onMount } from 'svelte';
	let answers: any = [],
		topic: string | any,
		redirect: any,
		selectedQuestion: string | any,
		matchingKey: any;

	const filterData = (name: string | null) => {
		if (faqList && name) {
			const faqObject: any = faqList;
			matchingKey = Object.keys(faqObject).find((key) => key === name);
			if (matchingKey) {
				answers = faqObject[matchingKey].questions[selectedQuestion].list;
				console.log(answers);
			}
		}
	};
	const navigateTo = () => {
		if (redirect == '1') {
			history.back();
		} else {
			goto(`/faq/topics?name=${topic}`);
		}
	};
	onMount(() => {
		topic = $page.url.searchParams.get('name');
		selectedQuestion = $page.url.searchParams.get('question');
		redirect = $page.url.searchParams.get('redirect');
		topic.toString();
		filterData(topic);
	});
</script>

<div class="max-w-[1300px] h-full flex flex-col mx-auto py-5 px-3 gap-y-2 text-[--font-color]">
	<BackButton title={$t('faq.faq_articles')} backTo={`/faq/topics?name=${topic}`} />

	<div
		class="bg-[--card-bg-color] p-5 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700"
	>
		<p class="text-2xl font-medium">{$t(`faq.${topic}.questions.${selectedQuestion}.title`)}</p>
		<p class="my-5">
			{#if $t(`faq.${topic}.questions.${selectedQuestion}.desc`) !== `faq.${topic}.questions.${selectedQuestion}.desc`}
				{$t(`faq.${topic}.questions.${selectedQuestion}.desc`)}
			{/if}
		</p>
		<ol class="space-y-10 {Object.values(answers).length > 1 ? 'list-decimal ml-5' : 'list-none'} ">
			{#each Object.values(answers) as item}
				<li>{item}</li>
			{/each}
		</ol>
	</div>
	<div class="flex gap-x-2 mt-5">
		<button
			class="btn rounded-lg w-full border border-[--button-color] text-[--button-color]"
			on:click={() => navigateTo()}
		>
			{$t('faq.back')}
		</button>
		<button
			class="btn rounded-lg w-full bg-[--button-color] text-white"
			on:click={() => goto('/dashboard')}
		>
			{$t('faq.Go Dashboard')}
		</button>
	</div>
</div>
