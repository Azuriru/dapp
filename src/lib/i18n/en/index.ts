const lang = 'en';

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
	},
	{
		locale: lang,
		key: 'profile',
		loader: async () => (await import('./profile.json')).default
	},
	{
		locale: lang,
		key: 'login',
		loader: async () => (await import('./login.json')).default
	},
	{
		locale: lang,
		key: 'wallet',
		loader: async () => (await import('./wallet.json')).default
	},
	{
		locale: lang,
		key: 'transactiondetails',
		loader: async () => (await import('./transactiondetails.json')).default
	},
	{
		locale: lang,
		key: 'investment',
		loader: async () => (await import('./investment.json')).default
	},
	{
		locale: lang,
		key: 'portfolio',
		loader: async () => (await import('./portfolio.json')).default
	},
	{
		locale: lang,
		key: 'faq',
		loader: async () => (await import('./faq.json')).default
	},
	{
		locale: lang,
		key: 'funds',
		loader: async () => (await import('./funds.json')).default
	}
];
