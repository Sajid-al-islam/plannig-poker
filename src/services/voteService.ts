import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    type Unsubscribe,
    getDocs,
    deleteDoc,
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../config/firebase';
import type { Vote } from '../types';
import { debounce } from '../utils/helpers';
import { RATE_LIMITS } from '../config/rateLimits';

/**
 * Submit a vote (with debouncing to reduce Firestore writes)
 */
const submitVoteImmediate = async (
    gameId: string,
    participantId: string,
    value: string
): Promise<void> => {
    try {
        const vote: Vote = {
            participantId,
            value,
            submittedAt: Date.now(),
        };

        await setDoc(
            doc(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.VOTES, participantId),
            vote
        );
    } catch (error) {
        console.error('Error submitting vote:', error);
        throw error;
    }
};

// Debounced version to reduce writes
export const submitVote = debounce(submitVoteImmediate, RATE_LIMITS.VOTE_UPDATE_DEBOUNCE);

/**
 * Get all votes for current round
 */
export const getVotes = async (gameId: string): Promise<Vote[]> => {
    try {
        const votesRef = collection(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.VOTES);
        const votesSnap = await getDocs(votesRef);
        return votesSnap.docs.map(doc => doc.data() as Vote);
    } catch (error) {
        console.error('Error getting votes:', error);
        return [];
    }
};

/**
 * Listen to votes in real-time
 */
export const listenToVotes = (
    gameId: string,
    callback: (votes: Vote[]) => void
): Unsubscribe => {
    const votesRef = collection(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.VOTES);

    return onSnapshot(
        votesRef,
        (snapshot) => {
            const votes = snapshot.docs.map(doc => doc.data() as Vote);
            callback(votes);
        },
        (error) => {
            console.error('Error listening to votes:', error);
            callback([]);
        }
    );
};

/**
 * Delete a participant's vote
 */
export const deleteVote = async (gameId: string, participantId: string): Promise<void> => {
    try {
        await deleteDoc(
            doc(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.VOTES, participantId)
        );
    } catch (error) {
        console.error('Error deleting vote:', error);
        throw error;
    }
};

/**
 * Check if participant has voted
 */
export const hasVoted = (votes: Vote[], participantId: string): boolean => {
    return votes.some(vote => vote.participantId === participantId);
};

/**
 * Get vote value for participant
 */
export const getParticipantVote = (votes: Vote[], participantId: string): string | null => {
    const vote = votes.find(vote => vote.participantId === participantId);
    return vote?.value || null;
};
