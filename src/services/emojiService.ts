import {
    collection,
    addDoc,
    onSnapshot,
    type Unsubscribe,
    query,
    orderBy,
    limit,
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../config/firebase';
import type { EmojiThrow } from '../types';
import { RATE_LIMITS, isActionAllowed, getCooldownRemaining } from '../config/rateLimits';

/**
 * Throw an emoji to another participant (with rate limiting)
 */
export const throwEmoji = async (
    gameId: string,
    fromId: string,
    toId: string,
    emoji: string
): Promise<{ success: boolean; error?: string; cooldown?: number }> => {
    // Check rate limiting
    const rateLimitKey = `emoji-${gameId}-${fromId}`;

    // Check cooldown FIRST (before isActionAllowed adds a timestamp)
    const cooldown = getCooldownRemaining(rateLimitKey, RATE_LIMITS.EMOJI_THROW_COOLDOWN);
    if (cooldown > 0) {
        return {
            success: false,
            error: 'Please wait before sending another emoji',
            cooldown,
        };
    }

    // Check per-minute limit (this adds a timestamp to the tracker)
    if (!isActionAllowed(rateLimitKey, RATE_LIMITS.MAX_EMOJIS_PER_MINUTE)) {
        return {
            success: false,
            error: `You can only send ${RATE_LIMITS.MAX_EMOJIS_PER_MINUTE} emojis per minute`,
        };
    }

    try {
        const emojiThrow: Omit<EmojiThrow, 'id'> = {
            fromId,
            toId,
            emoji,
            timestamp: Date.now(),
        };

        const emojisRef = collection(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.EMOJIS);
        await addDoc(emojisRef, emojiThrow);

        return { success: true };
    } catch (error) {
        console.error('Error throwing emoji:', error);
        return { success: false, error: 'Failed to send emoji' };
    }
};

/**
 * Listen to emoji throws in real-time
 * Only listens to recent emojis (last 10) to reduce reads
 */
export const listenToEmojis = (
    gameId: string,
    callback: (emojis: EmojiThrow[]) => void
): Unsubscribe => {
    const emojisRef = collection(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.EMOJIS);

    // Only get recent emojis to reduce reads
    const emojisQuery = query(
        emojisRef,
        orderBy('timestamp', 'desc'),
        limit(10)
    );

    return onSnapshot(
        emojisQuery,
        (snapshot) => {
            const emojis = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as EmojiThrow));
            callback(emojis);
        },
        (error) => {
            console.error('Error listening to emojis:', error);
            callback([]);
        }
    );
};

/**
 * Get cooldown time remaining for emoji throws
 */
export const getEmojiCooldown = (gameId: string, participantId: string): number => {
    const rateLimitKey = `emoji-${gameId}-${participantId}`;
    return getCooldownRemaining(rateLimitKey, RATE_LIMITS.EMOJI_THROW_COOLDOWN);
};
