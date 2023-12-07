<script>
	import { t } from '$lib/i18n';
</script>

<div class="w-full min-h-[40vh] flex flex-col items-center justify-center">
	<img src="/assets/img/nodata.svg" alt="" class="w-[70px] lg:w-[100px] dark:opacity-50" />
	<div class="my-3 text-center w-full">
		<p class="text-[--font-gray-color] text-lg font-medium">{$t('common.no_data')}</p>
		<p class="text-[--font-gray-color] text-sm">{$t('common.no_record')}</p>
	</div>
</div>
