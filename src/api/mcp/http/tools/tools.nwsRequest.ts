const USER_AGENT = 'weather-app/1.0';

const makeNWSRequest = async <T>(url: string): Promise<T | null> => {
    const headers = {
        'User-Agent': USER_AGENT,
        Accept: 'application/geo+json'
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json()) as T;
    } catch (error: unknown) {
        console.error('Error making NWS request:', error);
        return null;
    }
};
export {
    makeNWSRequest
};