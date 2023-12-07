export const urlList = {
	dev: {
		domainURL: 'https://staging_dapp.iwinfund.com/',
		baseUrl: 'https://staging_core.iwinfund.com/dapp',
		apiBase: 'https://staging_core.iwinfund.com/dapp',
		wsBase: 'wss://market.xxx.xxx/',
		apiLoginRequest: '/api/auth/request',
		apiLoginVerify: '/api/auth/verify',
		apiUserInfo: '/api/users/info',
		apiEditName: '/dapp/user/editname',
		apiStrategy: '/dapp/user/editname'
	},
	live: {
		domainURL: 'https://staging_core.iwinfund.com',
		baseUrl: 'https://staging_core.iwinfund.com/dapp',
		apiBase: 'https://staging_core.iwinfund.com/dapp',
		wsBase: 'wss://market.xxx.xxx/',
		apiLoginRequest: '/api/auth/request',
		apiLoginVerify: '/api/auth/verify',
		apiUserInfo: '/api/users/info',
		apiEditName: '/dapp/user/editname',
		apiStrategy: '/dapp/user/editname'
	}
};

export const urls = process.env.NODE_ENV == 'development' ? urlList.dev : urlList.live;
