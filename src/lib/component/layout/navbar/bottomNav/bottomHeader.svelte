<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { menuList } from '../../menu';

	const gotoPage = (target?: any) => {
		if (target !== undefined && target !== '') {
			goto(target.url);
		}
	};
</script>

<div
	class="navbar w-full flex bg-[--card-bg-color] justify-between p-2 px-7 pt-2 lg:hidden z-20 sticky bottom-[-1.5%] transition border border-gray-300 dark:border-gray-700"
>
	{#each menuList as menu}
		<button
			class="flex items-center flex-col gap-x-5 text-[--font-color]"
			on:click={() => gotoPage(menu)}
		>
			<Icon icon={menu.icon} class="text-xl" />
			<p class="text-[11px]">{menu.label}</p>
		</button>
	{/each}
</div>

<style scoped>
	.navbar {
		box-shadow: 35px 0px 60px -15px rgba(0, 0, 0, 0.3);
	}
</style>
