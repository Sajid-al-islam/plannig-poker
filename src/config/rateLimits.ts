// Rate limiting configuration
// Adjust these values to control Firebase read/write costs

export const RATE_LIMITS = {
    // Emoji throwing cooldown (milliseconds between emoji throws per participant)
    EMOJI_THROW_COOLDOWN: 500, // 0.5 second

    // Maximum emojis per participant per minute
    MAX_EMOJIS_PER_MINUTE: 10,

    // Vote update debounce (milliseconds to wait before sending vote update)
    VOTE_UPDATE_DEBOUNCE: 500, // 0.5 seconds

    // Firestore listener throttle (milliseconds between Firestore updates)
    LISTENER_THROTTLE: 100, // 0.1 seconds

    // Maximum participants per game session
    MAX_PARTICIPANTS: 20,

    // Maximum issues per game session
    MAX_ISSUES: 50,
};

// Rate limit tracking
const rateLimitTrackers = new Map<string, number[]>();

/**
 * Check if an action is allowed based on rate limiting
 * @param key - Unique identifier for the action (e.g., userId + action type)
 * @param maxPerMinute - Maximum allowed actions per minute
 * @returns true if action is allowed, false otherwise
 */
export const isActionAllowed = (key: string, maxPerMinute: number): boolean => {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Get existing timestamps for this key
    const timestamps = rateLimitTrackers.get(key) || [];

    // Filter out timestamps older than 1 minute
    const recentTimestamps = timestamps.filter(ts => ts > oneMinuteAgo);

    // Check if limit is exceeded
    if (recentTimestamps.length >= maxPerMinute) {
        return false;
    }

    // Add current timestamp and update tracker
    recentTimestamps.push(now);
    rateLimitTrackers.set(key, recentTimestamps);

    return true;
};

/**
 * Get cooldown time remaining in milliseconds
 * @param key - Unique identifier for the action
 * @param cooldownMs - Cooldown duration in milliseconds
 * @returns Remaining cooldown time in ms, or 0 if action is allowed
 */
export const getCooldownRemaining = (key: string, cooldownMs: number): number => {
    const timestamps = rateLimitTrackers.get(key) || [];
    if (timestamps.length === 0) return 0;

    const lastTimestamp = timestamps[timestamps.length - 1];
    const now = Date.now();
    const elapsed = now - lastTimestamp;

    return Math.max(0, cooldownMs - elapsed);
};

/**
 * Clear rate limit tracking for a specific key
 * @param key - Unique identifier to clear
 */
export const clearRateLimit = (key: string): void => {
    rateLimitTrackers.delete(key);
};

/**
 * Clear all rate limit tracking (useful for cleanup)
 */
export const clearAllRateLimits = (): void => {
    rateLimitTrackers.clear();
};
