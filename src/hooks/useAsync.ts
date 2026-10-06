import { useState } from "react";

export function useAsync() {

    const [failed, setFailed] = useState(false);
    const [loading, setLoading] = useState(false);

    async function run(q:() => Promise<void>) {
        setFailed(false);
        setLoading(true);

        try {
            await q();
        } catch (error) {
            console.error(error);
            setFailed(true);
        } finally {
            setLoading(false);
        }
    } 
    
    return { loading, failed, run };
}