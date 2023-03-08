import type { Handle } from '@sveltejs/kit';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';

export const handle: Handle = async ({ event, resolve }) => {

    // Create a supabase client session within server
    event.locals.supabase = createSupabaseServerClient({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event
    });

    // Retrive session token
    event.locals.getSession = async () => {
        const { data: { session } } = await event.locals.supabase.auth.getSession();

        return session;
    };

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range';
        }
    });
};