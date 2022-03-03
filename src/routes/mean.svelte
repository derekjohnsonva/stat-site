<script context="module">
	import { browser, dev } from '$app/env';
	import { Draw } from '$lib/graphing';
	import { onMount } from 'svelte';
	import { TestSide } from '$lib/graphing_utils';
	import NumberInput from '$lib/NumberInput.svelte';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	// export const prerender = true;
	// Data for the graph
	let alpha = 0.1;
	let test_side = TestSide.TwoSided;
	let alternate_hypothesis = 0.3;
	let null_hypothesis = 0;
	let sigma = 1;
	let n = 30;
</script>

<!-- svelte-ignore module-script-reactive-declaration -->
<script>
	// Canvas element
	let canvas;
	function valid_data() {
		if (alpha <= 0) {
			return false;
		}
	}

	function render_graph() {
		// First check that the data supplied will work

		const ctx = canvas.getContext('2d');
		Draw(ctx, alpha, test_side, alternate_hypothesis, null_hypothesis, sigma, n);
	}

	onMount(() => {
		render_graph();
	});
</script>

<svelte:head>
	<title>Mean</title>
</svelte:head>
<div>
	<form on:change={render_graph} class="w-max text-2xl">
		<select bind:value={test_side} class="w-full rounded-lg m-4 text-gray-600 text-center">
			<option value={TestSide.TwoSided}>Two Sided Test</option>
			<option value={TestSide.Lower}>Lower Sided Test</option>
			<option value={TestSide.Upper}>Upper Sided Test</option>
		</select>
		<!-- Make a NumberInput for each value -->
		<NumberInput bind:value={null_hypothesis} display="H_0 : \mu =" />
		<NumberInput bind:value={alternate_hypothesis} display="H_1 : \mu =" />
		<NumberInput bind:value={n} display="N =" />
		<NumberInput bind:value={sigma} display="S =" />
		<NumberInput bind:value={alpha} display="\alpha =" />
	</form>
</div>

<canvas class="bg-light-background" bind:this={canvas} height={260} width={640} />
