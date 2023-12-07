import { persisted } from 'svelte-persisted-store';
import { zeroAddress, type Address } from 'viem';

interface IUserInfo {
	address: Address;
	chainid: string;
	has_upline: number;
	has_earlybird: number;
	has_password: number;
	has_profile: number;
	upline_address: string;
}

export const emptyUserInfo: IUserInfo = {
	address: zeroAddress,
	chainid: '',
	has_upline: 0,
	has_earlybird: 0,
	has_password: 0,
	has_profile: 0,
	upline_address: ''
};

export const storeUserInfo = persisted<IUserInfo>('storeUserInfo', emptyUserInfo);

export type { IUserInfo };
