<script lang="ts">
	import ErrorSvg from '$lib/component/404/404svg.svelte';
</script>

<div
	class="mx-auto max-w-[1300px] flex flex-col justify-center items-center min-h-[100vh] space-y-5"
>
	<ErrorSvg />
	<div class="text-center space-y-3">
		<p class="text-2xl font-bold text-blue-500">404 Not Found</p>
		<p class="text-xl lg:text-4xl font-bold">Whoops! That page doesn't exist.</p>
	</div>
	<div class="flex flex-col items-center text-[--font-gray-color] space-y-5">
		<p class="text-sm lg:text-md">Here are some helpful links instead:</p>
		<div class="flex gap-x-2 underline text-xs lg:text-md">
			<a href="/dashboard">Dashboard</a>
			<a href="/investment">Investment</a>
			<a href="/wallet">Wallet</a>
			<a href="/fund">Fund</a>
			<a href="/commission">Commission</a>
		</div>
	</div>
</div>

<!-- <Maintenance/> -->
