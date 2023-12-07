<script lang="ts">
	import MaintenanceSvg from './maintenancesvg.svelte';
</script>

<div
	class="mx-auto max-w-[1300px] flex flex-col justify-center items-center min-h-[100vh] space-y-5"
>
	<MaintenanceSvg />
	<div class="text-center space-y-3">
		<p class="text-2xl lg:text-4xl font-bold">Down For Maintenance.</p>
	</div>
	<div class="flex flex-col items-center text-[--font-gray-color] space-y-5">
		<p class="">We are down for planned maintenance. We'll be back soon.</p>
	</div>
</div>
