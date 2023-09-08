<script lang="ts">
	import { BRAND_COLOR, BRAND_COLOR_DARK } from '$lib/constants';
	import Recaptcha from '$lib/features/auth/ReCaptcha.svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import { Auth } from '@supabase/auth-ui-svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	export let data: PageData;
	// Recaptcha status for ReCaptcha component
	let recaptcha = false;
	$: recaptchaStatus = recaptcha;
	// Learn more visibility
	let learnMoreVisible = false;
	const toggleLearnMore = () => {
		learnMoreVisible = !learnMoreVisible;
	};

</script>

<svelte:head>
	<title>Login</title>
	<script src="https://www.google.com/recaptcha/api.js" async defer></script>
</svelte:head>

<main class="bg-grid flex flex-col bg-dark bg-topography h-screen w-screen relative">
	<div class="absolute top-0 left-0 h-full w-full bg-black bg-opacity-50 z-10" />

	<div class="m-auto grid grid-cols-2 h-[30rem] w-[40rem] rounded-md overflow-hidden z-20">
		<div
			class="flex flex-col gap-4 col-span-1 h-full bg-zinc-900 text-white justify-center align-middle px-8"
		>
			<p class="text-4xl font-bold"><i class="fa-solid fa-location-arrow mr-2" />USARs</p>
			<p>Cloud-based software to create and share interactive web maps.</p>

		</div>

		<div
			class="flex flex-col gap-1 col-span-1 h-full bg-white justify-center text-center align-middle px-8"
		>
			<p class="text-xl">Login</p>
			{#if recaptchaStatus}
				<span in:fade={{ duration: 500 }}>
					<Auth
						supabaseClient={data.supabase}
						view="magic_link"
						redirectTo={`${data.url}/login?redirect=/map`}
						showLinks={false}
						appearance={{
							theme: ThemeSupa,
							variables: {
								default: {
									colors: {
										brand: BRAND_COLOR,
										brandAccent: BRAND_COLOR_DARK
									}
								}
							},
							style: { input: 'color: #000', label: 'display: none' }
						}}
					/>
				</span>
			{/if}

			{#if !recaptchaStatus}
				<Recaptcha bind:recaptcha />
			{/if}

			<button class="text-center hover:underline" on:click={toggleLearnMore}>
				<p>Why a link? Learn More</p>
			</button>

			{#if learnMoreVisible}
				<span class="mt-4" in:fade={{ duration: 500 }}
					>The magic link grants authorized users access to the application without the need for a
					password.</span
				>
			{/if}
		</div>
	</div>
</main>
