<script lang="ts">
	import { onMount } from 'svelte';

	export let options: any[];

	let ApexCharts: any;
	let loaded = false;

	const chart = (node: any, options: any) => {
		if (!loaded) return;

		let myChart = new ApexCharts(node, options);
		myChart.render();

		return {
			update(options: any) {
				myChart.updateOptions(options);
			},
			destroy() {
				myChart.destroy();
			}
		};
	};

	onMount(async () => {
		const module = await import('apexcharts');
		ApexCharts = module.default;
		window.ApexCharts = ApexCharts;
		loaded = true;
	});
</script>

{#if loaded}
	<div id="chartContainer" use:chart={options}></div>
{/if}


