import { error, redirect } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";


// sign out user and remove session token from cookies
export const POST: RequestHandler = async ({ locals }) => {
    const { error: err } = await locals.supabase.auth.signOut();

    if (err) {
        console.log("Logout error.");
        throw error(500, "Something went wrong");
    }

    throw redirect(303, "/");
}