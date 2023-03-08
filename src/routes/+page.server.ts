import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, url }) => {
	const { session } = await parent();

    // if the user is already logged in return them to the home page
	if (session) {
		throw redirect(303, '/lynx-city-twin');
	}

	return { url: url.origin };
};