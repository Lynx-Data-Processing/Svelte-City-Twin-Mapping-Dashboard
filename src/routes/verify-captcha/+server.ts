import { PUBLIC_RECAPTCHA_KEY } from '$env/static/public';

// Check recapcha token with google api
export const POST = async (event) => {
    const data = await event.request.json();

    const res = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${PUBLIC_RECAPTCHA_KEY}&response=${data.recaptchaToken}`,
    {
        method: 'POST',
    });

    const status: {success: boolean} = await res.json();

    if (!status.success) {
        return new Response(JSON.stringify({
            status: 400,
            success: false
        }));
    } 

    return new Response(JSON.stringify({
        status: 200,
        success: true
    }));
}