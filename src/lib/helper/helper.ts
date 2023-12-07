export const truncateString = (str: string, startNum: number, endNum: number) => {
	if (!str) {
		return;
	}

	if (str.length <= startNum + endNum) {
		return str;
	}

	const startStr = str.slice(0, startNum);
	const endStr = str.slice(-endNum);

	return `${startStr}...${endStr}`;
};

export const filterInput = (event: any) => {
	// Remove non-numeric characters
	let sanitizedValue = event.target.value.replace(/[^0-9.]/g, '');

	// Check if there's more than one dot and remove extra dots
	const dotCount = sanitizedValue.split('.').length - 1;
	if (dotCount > 1) {
		sanitizedValue = sanitizedValue.replace(/\./g, (match: any, offset: number) =>
			offset < sanitizedValue.lastIndexOf('.') ? '' : match
		);
	}

	return sanitizedValue;
};
