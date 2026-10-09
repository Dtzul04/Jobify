// Each IP can request 5 summaries per minute
const LIMIT = 5;
const WINDOW_MS = 60_000;

// IP -> how many requests it made and when its window started.
// Lives in server memory, so it resets when the server restarts.
const requests = new Map<string, { count: number; start: number}>();

export function isRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = requests.get(ip);

    // New IP, or its 1-minute window is over
    if (!entry || now - entry.start > WINDOW_MS) {
        requests.set(ip, { count: 1, start: now });
        return false;
    }

    // Count this request and block once it goes over the limit
    entry.count++;
    return entry.count > LIMIT;
}
