<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n';
	import Icon from '@iconify/svelte';

	export let faqList: any = [];
</script>

<div>
	<h4 class="dark:text-[--font-color] font-medium flex items-center gap-x-1">
		<Icon icon="wpf:faq" />FAQs
	</h4>
	{#each faqList as faq}
		<button
			type="button"
			class="w-full dark:hover:bg-[--light-bg] hover:bg-[--light-table-hover] hover:text-[--button-color] rounded-md px-2 py-2 flex items-start"
			on:click={() => goto(`${faq.url}`)}
		>
			<div class="mt-1">
				<Icon icon={faq.icon} />
			</div>
			<div class="ml-2 text-left">
				{$t(`faq.${faq.type}.questions.${faq.question}.title`)}
			</div>
		</button>
	{/each}
</div>
