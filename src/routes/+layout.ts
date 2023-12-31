import { browser } from '$app/environment';
import { loadTranslations, locale, defaultLocale } from '$lib/i18n';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	const { pathname } = url;

	let targetLocale = defaultLocale;
	if (browser) {
		const getLocal = JSON.parse(localStorage.getItem('storeLocal') || '{}');
		if (getLocal.lang != undefined) targetLocale = getLocal.lang;
	}

	const initLocale = locale.get() || targetLocale;

	await loadTranslations(initLocale, pathname);
	return {};
};
