import { redirect } from "@sveltejs/kit";
import { PUBLIC_RECAPTCHA_KEY } from '$env/static/public';

export const POST = async (event) => {
    const data = await event.request.json();

    const res = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${PUBLIC_RECAPTCHA_KEY}&response=${data.recaptchaToken}`,
    {
        method: 'POST',
    });

    const status: {success: boolean} = await res.json();

    if (!status.success) {
        throw redirect(303, `${data.recaptchaToken}`);
    } 

    return new Response('success');
}