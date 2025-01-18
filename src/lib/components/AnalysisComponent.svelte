<script lang="ts">
	import { findLargestDailyDecline, getLinesFromCSVFile } from "$lib/utils/analysis";
	import { formatNumberToMoneyString } from "$lib/utils/helpers";
	import { onMount } from "svelte";

    export let file: File;

    let largestDailyDeclineString: string = 'Brak danych';

    onMount(() => {
        performAnalysis(file);
    })

    async function performAnalysis(file: File) {
        const lines: string[] = await getLinesFromCSVFile(file);

        await Promise.all([
            (async () => {
                largestDailyDeclineString = formatNumberToMoneyString(await findLargestDailyDecline(lines));
            })(),
        ])
    }
</script>

<div class="flex flex-col">
    <div>analysis: {file.name}</div>

    <div>Największy dzienny spadek: {largestDailyDeclineString}</div>
</div>