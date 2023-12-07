<script lang="ts">
	import { goto } from '$app/navigation';
	import BackButton from '$lib/component/backbutton/BackButton.svelte';
	import { t } from '$lib/i18n';

	let menus = [
		{
			name: 'getting_started',
			img: 'https://public.bnbstatic.com/image/cms/playlist/202111/59931c4a82670bc2d9a65674601abeee.png',
			url: `/faq/topics?name=getting_started`
		},
		{
			name: 'early_bird',
			img: 'https://public.bnbstatic.com/image/cms/playlist/202111/d76a2bff88e2ca9ac660b437854e11b2.png',
			url: `/faq/topics?name=early_bird`
		},
		{
			name: 'deposit',
			img: 'https://public.bnbstatic.com/image/cms/playlist/202111/ff9161307f66f94e81d05f3f68655ae9.png',
			url: `/faq/topics?name=deposit`
		},
		{
			name: 'withdraw',
			img: 'https://public.bnbstatic.com/image/cms/playlist/202111/ff9161307f66f94e81d05f3f68655ae9.png',
			url: `/faq/topics?name=withdraw`
		},
		{
			name: 'transfer',
			img: 'https://public.bnbstatic.com/image/cms/playlist/202111/ff9161307f66f94e81d05f3f68655ae9.png',
			url: `/faq/topics?name=transfer`
		},
		{
			name: 'swap',
			img: 'https://public.bnbstatic.com/image/cms/playlist/202111/ff9161307f66f94e81d05f3f68655ae9.png',
			url: `/faq/topics?name=swap`
		}
	];
</script>

<div class="max-w-[1300px] h-full flex flex-col mx-auto py-5 px-3 gap-y-2 text-[--font-color]">
	<BackButton title={$t('common.faqshort')} backTo={'/dashboard'} />
	<div
		class="bg-[--card-bg-color] p-5 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 space-y-10"
	>
		<div class="space-y-10">
			<p class="text-2xl font-medium">{$t('faq.all_topics')}</p>
			<div class="grid lg:grid-cols-3 gap-5">
				{#each menus as menu}
					<button
						class="dark:bg-gray-600 p-5 rounded-lg flex items-center gap-x-5 btn justify-start"
						on:click={() => goto(`${menu.url}`)}
					>
						<img src={menu.img} class="w-[40px]" alt="" />
						<p class="text-lg">{$t(`faq.${menu.name}.title`)}</p>
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
