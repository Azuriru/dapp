import { persisted } from 'svelte-persisted-store';

interface IAccessToken {
	access_token: string;
	expires_in: number;
	refresh_token: 0;
}
interface IStoreLocal {
	lang: 'zh' | 'en' | 'zh-tw';
}
export const emptyAccessToken: IAccessToken = {
	access_token: '',
	expires_in: 0,
	refresh_token: 0
};

export const emptyData: IStoreLocal = {
	lang: 'en'
};

export const storeAccessToken = persisted<IAccessToken>('storeAccessToken', emptyAccessToken);
export const storeLocal = persisted<IStoreLocal>('storeLocal', emptyData);

// custom
export const storeIntroducer = persisted<any>('storeIntroducer', '');

export type { IStoreLocal };
