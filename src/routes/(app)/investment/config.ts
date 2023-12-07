export var options: any = {
	series: [
		{
			name: 'MAX APR',
			data: [4.5, 4.5, 4.5, 4.5, 4.2, 4.5, 4.5]
		},
		{
			name: 'MIN APR',
			data: [4.2, 4.2, 4.2, 4.2, 4.5, 4.2, 4.2]
		}
	],
	chart: {
		height: 350,
		type: 'area',
		toolbar: {
			show: false
		}
	},
	dataLabels: {
		enabled: false
	},
	stroke: {
		curve: 'smooth'
	},
	xaxis: {
		type: 'datetime',
		labels: {
			style: {
				fontSize: '13px',
				colors: '#494F61'
			}
		},
		categories: []
	},
	grid: {
		borderColor: '#494F61',
		padding: {
			left: -5
		}
	},
	yaxis: {
		min: 3,
		max: 4.5,
		tickAmount: 6,
		labels: {
			offsetX: -15,
			style: {
				fontSize: '13px',
				colors: '#494F61'
			}
		}
	},
	tooltip: {
		x: {
			format: 'dd MMM yyyy'
		}
	}
};
