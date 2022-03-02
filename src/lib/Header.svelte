<script>
	import { page } from '$app/stores';
	let pages = [
		{ name: "Mean",       path: "/mean"      },
		{ name: "Population", path: "/population"},
		{ name: "Variance",   path: "/variance"  },
	];
</script>

<header class="p-9">
	<div class="mr-20">
		<h1 class="text-5xl font-medium mb-8">One Population Hypothesis Test</h1>
	</div>
	<nav class="flex sm:justify-center space-x-4">
		{#each pages as {name, path}}
		<!-- TODO: Determine why text color is not working -->
		{console.log(page.path)}
			<a class={`text-3xl ${page.url === path ? 'text-gray-900' : 'text-gray-600'}`} href={path}>{name}</a>
		{/each}
	</nav>
</header>

