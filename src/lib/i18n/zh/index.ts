const lang = 'zh';

export default [
	{
		locale: lang,
		key: 'common',
		loader: async () => (await import('./common.json')).default
	},
	{
		locale: lang,
		key: 'dashboard',
		loader: async () => (await import('./dashboard.json')).default
	}
];
