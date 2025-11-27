import { nanoid } from 'nanoid';

/**
 * Generate a unique game session ID
 */
export const generateGameId = (): string => {
    return nanoid(10); // 10 character ID
};

/**
 * Generate a unique participant ID
 */
export const generateParticipantId = (): string => {
    return nanoid(16);
};

/**
 * Generate a unique ID for issues, votes, emojis
 */
export const generateId = (): string => {
    return nanoid();
};

/**
 * Calculate voting statistics
 */
export interface VoteStats {
    average: number;
    median: number;
    mode: string[];
    distribution: Record<string, number>;
    consensus: boolean;
}

export const calculateVoteStats = (votes: { value: string }[]): VoteStats | null => {
    if (votes.length === 0) return null;

    // Filter out non-numeric votes (? and ☕)
    const numericVotes = votes.filter(v => !['?', '☕'].includes(v.value));
    const numericValues = numericVotes.map(v => parseInt(v.value));

    if (numericValues.length === 0) {
        // All votes are non-numeric
        return {
            average: 0,
            median: 0,
            mode: [],
            distribution: votes.reduce((acc, v) => {
                acc[v.value] = (acc[v.value] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
            consensus: false,
        };
    }

    // Calculate average
    const average = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;

    // Calculate median
    const sorted = [...numericValues].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];

    // Calculate distribution and mode
    const distribution = votes.reduce((acc, v) => {
        acc[v.value] = (acc[v.value] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const maxCount = Math.max(...Object.values(distribution));
    const mode = Object.keys(distribution).filter(key => distribution[key] === maxCount);

    // Check for consensus (all votes are the same)
    const consensus = mode.length === 1 && distribution[mode[0]] === votes.length;

    return {
        average: Math.round(average * 10) / 10,
        median,
        mode,
        distribution,
        consensus,
    };
};

/**
 * Format timestamp to readable string
 */
export const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Less than 1 minute
    if (diff < 60000) {
        return 'Just now';
    }

    // Less than 1 hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }

    // Less than 24 hours
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    // Format as date
    return date.toLocaleDateString();
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
};

/**
 * Get game URL for sharing
 */
export const getGameUrl = (gameId: string): string => {
    return `${window.location.origin}/game/${gameId}`;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};
