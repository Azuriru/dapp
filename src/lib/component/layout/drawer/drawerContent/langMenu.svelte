<script lang="ts">
	import { locale, locales, t } from '$lib/i18n';
	import { storeLocal } from '$lib/stores/storeLocal';
	import Icon from '@iconify/svelte';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();

	const onChange = (lang: any) => {
		$locale = lang;
		storeLocal.set({
			...$storeLocal,
			lang: lang
		});
		return drawerStore.close();
	};
</script>

<div class="flex flex-col antialiased p-6">
	<div class="flex items-center text-xl justify-between">
		<p class="">{$t('common.select_language')}</p>
		<button class="btn p-0 text-2xl" on:click={() => drawerStore.close()}>
			<Icon icon="material-symbols:chevron-right" />
		</button>
	</div>
	<div class="my-10 space-y-2">
		{#each $locales as language}
			<div class="w-full flex items-center justify-center">
				<button
					class="btn p-0 w-full rounded-lg h-[50px] text-md border border-[--button-color] relative"
					on:click={() => {
						onChange(language);
					}}
				>
					{language === 'en' ? 'English' : language === 'zh' ? 'Chinese' : 'Chinese Simplified'}
					<!-- <Icon
						icon={`circle-flags:${language === 'en' ? 'uk' : language === 'zh' ? 'cn' : 'tw'}`}
					/> -->
					{#if $locale === language}
						<div
							class="bg-[--button-color] w-[20px] h-[20px] rounded-full text-sm flex items-center justify-center absolute top-[50%] translate-y-[-50%] right-[5%] text-white"
						>
							<Icon icon="mdi:tick" />
						</div>
					{/if}
				</button>
			</div>
		{/each}
	</div>
	<!-- 
	<div>
		<img src="/assets/img/dashboard/languagePic.svg" alt="" />
	</div> -->
</div>
