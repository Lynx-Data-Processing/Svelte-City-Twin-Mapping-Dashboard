<script lang="ts">
    import { PUBLIC_RECAPTCHA_URL } from '$env/static/public';
    import { onMount } from 'svelte';

    onMount(() => {
        window.handleCaptchaCallback = handleCaptchaCallback;
    });

    const handleCaptchaCallback = async (token: string) => {
        const res = await fetch("verify-captcha", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recaptchaToken: token
            })
        });

        console.log(res.json());
    };
    
</script>

<div 
    class="g-recaptcha" 
    data-sitekey={PUBLIC_RECAPTCHA_URL}
    data-callback="handleCaptchaCallback"
/>
