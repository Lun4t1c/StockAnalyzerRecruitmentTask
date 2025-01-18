<script lang="ts">
	import AnalysisComponent from '$lib/components/AnalysisComponent.svelte';
	import { getLinesFromCSVFile } from '$lib/helpers';
    import { Dropzone } from 'flowbite-svelte';

    let file: File | undefined = undefined;

    function handleDrop(event: any) {
        event.preventDefault();

        if (event.dataTransfer.items) {
          [...event.dataTransfer.items].forEach((item, i) => {
            if (item.kind === 'file') {
              file = item.getAsFile();
              performAnalysis(file!);
            }
          });
        }
    }

    async function performAnalysis(file: File) {
        const lines: string[] = await getLinesFromCSVFile(file);
        
        for (const s of lines) {
            console.log('line: ', s);
        }
    }
</script>

<div class="flex items-center justify-center h-screen">
    {#if file}
        <AnalysisComponent file={file}></AnalysisComponent>
    {:else}
        <Dropzone on:drop={handleDrop} on:dragover={(event: any) => event.preventDefault()} class='w-auto p-5 bg-black hover:bg-slate-900'>
            <p>Przeciągnij i upuść tutaj plik .CSV</p>
        </Dropzone>
    {/if}
</div>
