import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';


// verify user is authentication
export const load: PageLoad = async ({ parent }) => {
    // get session from layout.ts in parent route
    const { session } = await parent();

    // redirect if session does not exist
    if (!session) {
        throw redirect(303, '/');
    }

    return {
        user: session.user,
    };
};