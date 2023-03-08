import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';


// Verify user is authenticated an redicrect to login if not
export const load: PageLoad = async ({ parent }) => {
    const { session } = await parent();

    if (!session) {
        throw redirect(303, '/');
    }

    return {
        user: session.user,
    };
};