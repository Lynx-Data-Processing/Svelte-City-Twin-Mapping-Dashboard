<div class="bg-dark navbar flex flex-col ">
	<button title="Lynx" class="bg-dark hover:bg-zinc-800 text-white flex flex-row gap-2 p-4 w-full">
		<i class="fa-solid text-xl fa-location-arrow" aria-hidden="true" />
	</button>
	<slot />
	<form action="/logout" method="POST" class="mt-auto">
		<button
			title="Logout"
			type="submit"
			class="bg-dark hover:bg-zinc-800 text-white flex flex-row gap-2 p-4 w-full"
		>
			<i class="fa-solid fa-right-from-bracket " />
		</button>
	</form>
</div>
