<script>
	import * as am5 from '@amcharts/amcharts5';
	import * as am5xy from '@amcharts/amcharts5/xy';
	import { onMount } from 'svelte';

	// @ts-ignore
	let chart;

	onMount(() => {
		const root = am5.Root.new('chartdiv');

		chart = root.container.children.push(
			am5xy.XYChart.new(root, {
				panX: true,
				panY: true,
				wheelX: 'panX',
				wheelY: 'zoomX'
			})
		);

		const data = [
			{
				axis: 'X',
				value: 0.629218
			},
			{
				axis: 'Y',
				value: -0.503865
			},
			{
				axis: 'Z',
				value: -0.029572
			}
		];

		const xAxis = chart.xAxes.push(
			// @ts-ignore
			am5xy.CategoryAxis.new(root, { categoryField: 'axis' })
		);
		// @ts-ignore
		xAxis.renderer.set('minGridDistance', 20);

		const yAxis = chart.yAxes.push(
			// @ts-ignore
			am5xy.ValueAxis.new(root, { title: 'Acceleration' })
		);

		const series = chart.series.push(
			am5xy.ColumnSeries.new(root, {
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: 'value',
				categoryXField: 'axis'
			})
		);

		series.columns.template.setAll({
			tooltipText: '{categoryX}: {valueY}',
			width: am5.percent(80)
		});

		// @ts-ignore
		chart.data.setAll(data);

		return () => {
			// @ts-ignore
			if (chart) {
				chart.dispose();
			}
		};
	});
</script>

<div id="chartdiv" style="width: 100%; height: 400px;" />
