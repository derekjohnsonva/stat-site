<script context="module">
	import { browser, dev } from '$app/env';
	import { Draw } from '$lib/graphing';
	import { onMount } from 'svelte';
	import { TestSide } from '$lib/graphing_utils';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	export const prerender = true;
	// Data for the graph
	let alpha = 0.1;
	let test_side = TestSide.TwoSided;
	let alternate_hypothesis = 0.3;
	let null_hypothesis = 0;
	let sigma = 1;
	let n = 30;
</script>

<script>
	// Canvas element
	let canvas;

	function valid_data(){
		if (alpha <=0){return false}
	}

	function render_graph(){
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

<div class="content">
	<form on:change={render_graph}>
		<div>
			<select bind:value={test_side} name="">
				<option value={TestSide.TwoSided}>Two Sided</option>
				<option value={TestSide.Lower}>Lower Sided</option>
				<option value={TestSide.Upper}>Upper Sided</option>
			</select>
		</div>
		<div>
			<p>H_0 : mu =</p>
			<input type="number" bind:value={null_hypothesis} name="null hypothesis" />
		</div>
		<div>
			<p>H_1 : mu =</p>
			<input type="number" bind:value={alternate_hypothesis} name="alternate hypothesis" />
		</div>
		<div>
			<p>N =</p>
			<input type="number" bind:value={n} name="sample size" />
		</div>
		<div>
			<p>S =</p>
			<input type="number" bind:value={sigma} name="standard deviation" />
		</div>
		<div>
			<p>alpha =</p>
			<input type="number" bind:value={alpha} name="significance level" />
		</div>
	</form>
</div>

<canvas bind:this={canvas} height={260} width={640}/>
