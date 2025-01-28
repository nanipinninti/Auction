import { useState, useEffect } from "react";

export default function useFetch(url, method = "GET", options = {}) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(url, {
                    method,
                    ...options, // Spread any additional options like headers or body
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };

        if (url) fetchData();
    }, [url, method, options]);

    return { data, isLoading, error };
}
