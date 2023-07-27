

export const fetchAuth = () => {
    // get sb-auth-token from cookies
    const sbAuthToken = document.cookie.match(new RegExp('(^| )' + 'sb-auth-token' + '=([^;]+)'));

    if (sbAuthToken) {
        return sbAuthToken[2];
    }

    return null;
}
