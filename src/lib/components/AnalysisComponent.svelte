<script lang="ts">
	import {
		findAllPeriods,
		findBiggestDeclinePeriod,
		findDeclinePeriods,
		findLargestDailyDecline,
		getRowsDataFromCSVFile
	} from '$lib/utils/analysis';
	import { formatDate, formatNumberToMoneyString } from '$lib/utils/helpers';
	import type { StockRowDataModel } from '$lib/utils/types';
	import { onMount } from 'svelte';

	export let file: File;

	let largestDailyDeclineString: string | null = null;
	let declinePeriodsString: string | null = null;
	let largestDeclinePeriodString: string | null = null;

	onMount(() => {
		performAnalysis(file);
	});

	async function performAnalysis(file: File) {
		const rows: StockRowDataModel[] = await getRowsDataFromCSVFile(file);

		console.log(await findAllPeriods(rows));

		await Promise.all([
			(async () => {
				largestDailyDeclineString = formatNumberToMoneyString(await findLargestDailyDecline(rows));
			})(),

			(async () => {
				const declinePeriods: StockRowDataModel[][] = await findDeclinePeriods(rows);
				declinePeriodsString = declinePeriods.length.toString();

				largestDeclinePeriodString = getLargestDeclinePeriodString(
					await findBiggestDeclinePeriod(declinePeriods)
				);
			})()
		]);
	}

	function getLargestDeclinePeriodString(declinePeriod: StockRowDataModel[] | null): string {
		if (declinePeriod === null) return 'NaN';
		else {
			const formattedDateFrom: string = formatDate(declinePeriod[0].date);
			const formattedDateTo: string = formatDate(declinePeriod[declinePeriod.length - 1].date);
			return (
				formattedDateFrom +
				' - ' +
				formattedDateTo +
				` (${declinePeriod.length - 1} dni)` +
				': spadek ' +
				formatNumberToMoneyString(
					declinePeriod[0].value - declinePeriod[declinePeriod.length - 1].value
				)
			);
		}
	}
</script>

<div class="flex flex-col">
	<div>analysis: {file.name}</div>

	<div>Największy dzienny spadek: {largestDailyDeclineString}</div>
	<div>Ilość okresów spadku: {declinePeriodsString}</div>
	<div>Okres największego spadku: {largestDeclinePeriodString}</div>
</div>
