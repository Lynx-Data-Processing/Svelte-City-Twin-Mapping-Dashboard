<script lang="ts">
	import '../../styles/style.css';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	$: {
		const redirectTo = $page.url.searchParams.get('redirect');

		// check if user has been set in session store then redirect
		if (browser && data.session) {
			goto(redirectTo ?? '/lynx-city-twin');
		}
	}
</script>

<main>
	<div class="w-screen h-screen flex flex-col items-center justify-center bg-black">
		<div class="text-white">
			<h1 class="font-sans text-6xl uppercase "><i class="fa-solid fa-location-arrow mr-5"/>lynx</h1>
			<p class="text-lg">Authenticating. Please wait.</p>
			<span class="loader mt-5"></span>
		</div>
	</div>
</main>