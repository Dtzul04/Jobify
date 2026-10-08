import { useState } from "react";

export function useAsync() {

    const [failed, setFailed] = useState(false);
    // Message to show the user, null when nothing went wrong
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);

    async function run(q:() => Promise<void>) {
        // Clear the last error so a retry starts fresh
        setFailed(false);
        setError(null);
        setLoading(true);

        try {
            await q();
        } catch (e) {
            console.error(e);
            setFailed(true);
            // Only real Error objects have .message
            setError(e instanceof Error ? e.message: 'Something went wrong')
        } finally {
            setLoading(false);
        }
    } 
    
    return { loading, failed, error, run };
}