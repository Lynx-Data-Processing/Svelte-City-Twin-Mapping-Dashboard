<script lang="ts">
    import { PUBLIC_RECAPTCHA_URL } from '$env/static/public';
    import { onMount } from 'svelte';

    export let recaptcha: Boolean;

    onMount(() => {
        // Add reCaptcha callback to be read by recaptcha script
        window.handleCaptchaCallback = handleCaptchaCallback;

        // Reset recaptcha on component mount
        grecaptcha.reset();
    });

    // Callback function for recaptcha/google api (backend verification)
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

        const data = await res.json();

        recaptcha = data.success;
    };
    
</script>

<!-- ***class must be 'g-recaptcha' to interact with recaptcha api*** -->
<div 
    class="g-recaptcha" 
    style="transform: scale(.75); align-self: center;"
    data-sitekey={PUBLIC_RECAPTCHA_URL}
    data-callback="handleCaptchaCallback"
/>
