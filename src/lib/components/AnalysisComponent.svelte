<script lang="ts">
	import {
		findAllPeriods,
		findBiggestDeclinePeriod,
		findLargestDailyDecline,
		findLongestConstantValuePeriod,
		getRowsDataFromCSVFile,
		type Periods,
		type StockRowDataModel
	} from '$lib/utils/analysis';
	import { formatDate, formatNumberToMoneyString } from '$lib/utils/helpers';

	export let file: File;

	$: performAnalysis(file);

	let largestDailyDeclineString: string | null = null;
	let declinePeriodsAmountString: string | null = null;
	let largestDeclinePeriodString: string | null = null;
	let longestConstantPeriodString: string | null = null;

	async function performAnalysis(file: File) {
		const rows: StockRowDataModel[] = await getRowsDataFromCSVFile(file);

		await Promise.all([
			(async () => {
				const largestDailyDecline: number | null = await findLargestDailyDecline(rows);
				largestDailyDeclineString = formatNumberToMoneyString(largestDailyDecline);
			})(),

			(async () => {
				const periods: Periods = await findAllPeriods(rows);

				declinePeriodsAmountString = periods.decline.length.toString();

				await Promise.all([
					(async () => {
						largestDeclinePeriodString = getLargestDeclinePeriodString(
							await findBiggestDeclinePeriod(periods.decline)
						);
					})(),
					(async () => {
						longestConstantPeriodString = getLongestConstantPeriodString(
							await findLongestConstantValuePeriod(periods.constant)
						);
					})()
				]);
			})()
		]);
	}

	function getLargestDeclinePeriodString(declinePeriod: StockRowDataModel[] | null): string {
		if (!declinePeriod) return 'NaN';
		else {
			const formattedDateFrom: string = formatDate(declinePeriod[0].date);
			const formattedDateTo: string = formatDate(declinePeriod[declinePeriod.length - 1].date);

			return (
				formattedDateFrom +
				' - ' +
				formattedDateTo +
				` (${declinePeriod.length} dni)` +
				': spadek ' +
				formatNumberToMoneyString(
					declinePeriod[0].value - declinePeriod[declinePeriod.length - 1].value
				)
			);
		}
	}

	function getLongestConstantPeriodString(constantPeriod: StockRowDataModel[] | null): string {
		if (!constantPeriod) return 'NaN';
		else {
			const formattedDateFrom: string = formatDate(constantPeriod[0].date);
			const formattedDateTo: string = formatDate(constantPeriod[constantPeriod.length - 1].date);

			return formattedDateFrom + ' - ' + formattedDateTo + ` (${constantPeriod.length} dni)`;
		}
	}
</script>

<div class="flex flex-col gap-4 rounded-lg bg-transparent p-6 text-2xl text-gray-200">
	<div class="flex flex-col font-semibold">
		Analiza:
		<span class="font-normal">{file.name}</span>
	</div>

	<div class="flex flex-col">
		<span class="font-semibold">Największy dzienny spadek:</span>
		{largestDailyDeclineString}
	</div>

	<div class="flex flex-col">
		<span class="font-semibold">Ilość okresów spadku:</span>
		{declinePeriodsAmountString}
	</div>

	<div class="flex flex-col">
		<span class="font-semibold">Okres największego spadku:</span>
		{largestDeclinePeriodString}
	</div>

	<div class="flex flex-col">
		<span class="font-semibold">Najdłuższy okres stałej ceny:</span>
		{longestConstantPeriodString}
	</div>
</div>
