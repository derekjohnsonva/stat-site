<script>
    export let value;
    export let display;
    import Katex from "$lib/Katex.svelte";
</script>

<div class="flex flex-row justify-end m-4">
    <Katex math={display}/>
    <input class="ml-3 rounded-lg text-gray-600" type="number" bind:value={value} name={display} />
</div>