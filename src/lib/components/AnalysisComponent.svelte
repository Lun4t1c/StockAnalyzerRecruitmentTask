<script lang="ts">
	import { getLinesFromCSVFile } from "$lib/helpers";
	import { onMount } from "svelte";

    export let file: File;

    onMount(() => {
        performAnalysis(file);
    })

    async function performAnalysis(file: File) {
        const lines: string[] = await getLinesFromCSVFile(file);
        
        for (const s of lines) {
            console.log('line: ', s);
        }
    }
</script>

<div>
    analysis: {file.name}
</div>