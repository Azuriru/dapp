<script lang="ts">
	import { urlList } from '$lib/configs/settings';
	import { storeUserInfo } from '$lib/stores/storeUser';
	import { QRCodeSVG } from '@cheprasov/qrcode';

	export let refUrl: any = `${urlList.dev.domainURL}?upline=${$storeUserInfo.address}`;

	const qrSVG = new QRCodeSVG(refUrl, {
		level: 'Q',
		image: {
			source: '/assets/img/logo/logoOnlyDark.png',
			width: '30%',
			height: '30%',
			x: 'center',
			y: 'center'
		}
	});
	const xmlWithQRCode = qrSVG.toString();
</script>

<div>{@html xmlWithQRCode}</div>
