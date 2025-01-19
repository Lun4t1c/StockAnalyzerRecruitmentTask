<script lang="ts">
	import {
		countDeclinePeriods,
		findLargestDailyDecline,
		getRowsDataFromCSVFile
	} from '$lib/utils/analysis';
	import { formatNumberToMoneyString } from '$lib/utils/helpers';
	import type { StockRowDataModel } from '$lib/utils/types';
	import { onMount } from 'svelte';

	export let file: File;

	let largestDailyDeclineString: string | null = null;
	let declinePeriodsString: string | null = null;

	onMount(() => {
		performAnalysis(file);
	});

	async function performAnalysis(file: File) {
		const rows: StockRowDataModel[] = await getRowsDataFromCSVFile(file);

		await Promise.all([
			(async () => {
				largestDailyDeclineString = formatNumberToMoneyString(await findLargestDailyDecline(rows));
			})(),
			(async () => {
				declinePeriodsString = (await countDeclinePeriods(rows)).toString();
			})()
		]);
	}
</script>

<div class="flex flex-col">
	<div>analysis: {file.name}</div>

	<div>Największy dzienny spadek: {largestDailyDeclineString}</div>
	<div>Ilość okresów spadku: {declinePeriodsString}</div>
</div>
