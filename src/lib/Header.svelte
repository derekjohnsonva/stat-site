<script>
	import { page } from '$app/stores';
	let pages = [
		{ name: "Mean",       path: "/mean"      },
		{ name: "Population", path: "/population"},
		{ name: "Variance",   path: "/variance"  },
	];
</script>

<header class="p-9 pb-0 border-b-2 border-black">
	<div class="mr-20">
		<h1 class="text-5xl font-medium mb-8">One Population Hypothesis Test</h1>
	</div>
	<nav class="flex space-x-4 boarder max-w-xl border-black justify-between">
		{#each pages as {name, path}}
		<!-- TODO: Determine why text color is not working -->
			<a class={`text-3xl  py-3 border-b-4 border-transparent hover:border-black ${$page.url.pathname === path ? '' : 'text-gray-500'}`} href={path}>{name}</a>
		{/each}
	</nav>
</header>

