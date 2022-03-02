<script>
    import {Draw} from "$lib/graphing";
    import { onMount, setContext } from 'svelte';
    import {TestSide} from "$lib/graphing_utils";
    let canvas;

    export let alpha;
    export let test_side;
    export let alternate_hypothesis;
    export let null_hypothesis;
    export let sigma;
    export let n;

    onMount(() => {
        const ctx = canvas.getContext('2d');
        canvas.height = 260;
        canvas.width = 640;
        Draw(ctx, alpha, test_side, alternate_hypothesis, null_hypothesis, sigma, n);
    })
</script>

<canvas bind:this={canvas}></canvas>
