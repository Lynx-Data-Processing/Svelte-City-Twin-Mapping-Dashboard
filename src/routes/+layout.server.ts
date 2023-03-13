import type { LayoutServerLoad } from './$types';

// get supabase session (server-side only)
export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
    return {
        session: getSession()
    };
};

