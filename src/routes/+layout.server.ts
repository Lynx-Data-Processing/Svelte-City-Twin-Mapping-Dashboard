import type { LayoutServerLoad } from './$types';

// Get supabase session
export const load: LayoutServerLoad = async ({ locals: { getSession } }) => {
    return {
        session: getSession()
    };
};

