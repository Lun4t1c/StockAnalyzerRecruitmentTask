<script lang="ts">
	import AnalysisComponent from '$lib/components/AnalysisComponent.svelte';
	import { Dropzone } from 'flowbite-svelte';

	let file: File | undefined = undefined;

	function handleDrop(event: any): void {
		event.preventDefault();

		if (event.dataTransfer.items) {
			[...event.dataTransfer.items].forEach((item) => {
				if (item.kind === 'file') {
					file = item.getAsFile();
				}
			});
		}
	}

	function handleChange(event: any): void {
		const files = event.target.files;
		if (files.length > 0) {
			file = files[0];
		}
	}
</script>

<div class="flex h-screen flex-col items-center justify-center gap-3">
	<Dropzone
		on:drop={handleDrop}
		on:change={handleChange}
		on:dragover={(event: any) => event.preventDefault()}
		class="h-auto w-auto bg-black p-5 hover:bg-slate-900"
	>
		<p>Przeciągnij i upuść tutaj plik .CSV</p>
	</Dropzone>

	{#if file}
		<AnalysisComponent {file}></AnalysisComponent>
	{/if}
</div>
