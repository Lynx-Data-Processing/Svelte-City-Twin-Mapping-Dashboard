import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// check if the user is already logged in (server-side only)
export const load: PageServerLoad = async ({ parent, url }) => {
	const { session } = await parent();

    // if the users session token already exists, redirect to home page
	if (session) {
		throw redirect(303, '/map');
	}

	return { url: url.origin };
};