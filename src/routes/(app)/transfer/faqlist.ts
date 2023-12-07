import FAQdata from '$lib/i18n/en/faq.json';

export let transferFaqList: any = [];

export const filterData = (type: any) => {
	if (FAQdata) {
		const faqObject: any = FAQdata;
		const matchingKey = Object.keys(faqObject).find((key) => key === type);
		if (matchingKey) {
			transferFaqList = Object.keys(faqObject[matchingKey].questions).map((key) => ({
				question: key,
				type: type,
				icon: 'bx:file',
				url: `/faq/topics/detail?name=${type}&&question=${key}&&redirect=1`
			}));
		}
	}
};
filterData('transfer');
