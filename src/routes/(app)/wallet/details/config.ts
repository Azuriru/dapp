export let options: any = {
	series: [
		{
			name: 'Debit',
			data: []
		},
		{
			name: 'Credit',
			data: []
		}
	],
	colors: ['#14B8A6', '#D5575E'],
	chart: {
		type: 'bar',
		height: 350,
		foreColor: '#9CA3AF'
	},
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: '55%',
			endingShape: 'rounded'
		}
	},
	dataLabels: {
		enabled: false
	},
	stroke: {
		show: true,
		width: 2,
		colors: ['transparent']
	},
	xaxis: {
		categories: []
	},
	yaxis: {
		title: {
			text: '$ (USDT)'
		}
	},
	fill: {
		opacity: 1
	},
	tooltip: {
		foreColor: '#000000',
		y: {
			formatter: function (val: any) {
				return val + ' USDT';
			}
		}
	}
};

export let headers: any = [
	{
		name: 'Date',
		key: 'date'
	},
	{
		name: 'Serial Number',
		key: 'sn'
	},
	{
		name: 'Transaction Type',
		key: 'type'
	},
	{
		name: 'Status',
		key: 'status'
	},
	{
		name: 'Amount',
		key: 'amount'
	}
];
