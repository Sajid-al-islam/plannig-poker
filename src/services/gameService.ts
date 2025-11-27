import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    onSnapshot,
    type Unsubscribe,
    deleteDoc,
    getDocs,
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../config/firebase';
import type { GameSession, Participant } from '../types';
import { generateGameId, generateParticipantId } from '../utils/helpers';
import { getAvatarColor } from '../types';

/**
 * Create a new game session
 */
export const createGameSession = async (
    hostName: string,
    isSpectator: boolean = false
): Promise<{ gameId: string; participantId: string }> => {
    const gameId = generateGameId();
    const participantId = generateParticipantId();
    const now = Date.now();

    // Create game session
    const gameSession: GameSession = {
        id: gameId,
        name: `${hostName}'s Planning Poker`,
        createdAt: now,
        createdBy: participantId,
        currentIssue: null,
        votesRevealed: false,
        hostId: participantId,
    };

    // Create host participant
    const host: Participant = {
        id: participantId,
        name: hostName,
        avatar: hostName.charAt(0).toUpperCase(),
        color: getAvatarColor(0),
        joinedAt: now,
        isHost: true,
        isSpectator,
    };

    // Save to Firestore
    await setDoc(doc(db, COLLECTIONS.GAME_SESSIONS, gameId), gameSession);
    await setDoc(
        doc(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.PARTICIPANTS, participantId),
        host
    );

    return { gameId, participantId };
};

/**
 * Join an existing game session
 */
export const joinGameSession = async (
    gameId: string,
    participantName: string,
    isSpectator: boolean = false
): Promise<{ participantId: string; success: boolean; error?: string }> => {
    try {
        // Check if game exists
        const gameDoc = await getDoc(doc(db, COLLECTIONS.GAME_SESSIONS, gameId));
        if (!gameDoc.exists()) {
            return { participantId: '', success: false, error: 'Game not found' };
        }

        // Get existing participants to determine color
        const participantsRef = collection(
            db,
            COLLECTIONS.GAME_SESSIONS,
            gameId,
            COLLECTIONS.PARTICIPANTS
        );
        const participantsSnap = await getDocs(participantsRef);
        const participantCount = participantsSnap.size;

        const participantId = generateParticipantId();
        const participant: Participant = {
            id: participantId,
            name: participantName,
            avatar: participantName.charAt(0).toUpperCase(),
            color: getAvatarColor(participantCount),
            joinedAt: Date.now(),
            isHost: false,
            isSpectator,
        };

        await setDoc(
            doc(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.PARTICIPANTS, participantId),
            participant
        );

        return { participantId, success: true };
    } catch (error) {
        console.error('Error joining game:', error);
        return { participantId: '', success: false, error: 'Failed to join game' };
    }
};

/**
 * Get game session data
 */
export const getGameSession = async (gameId: string): Promise<GameSession | null> => {
    try {
        const gameDoc = await getDoc(doc(db, COLLECTIONS.GAME_SESSIONS, gameId));
        if (!gameDoc.exists()) return null;
        return gameDoc.data() as GameSession;
    } catch (error) {
        console.error('Error getting game session:', error);
        return null;
    }
};

/**
 * Listen to game session updates
 */
export const listenToGameSession = (
    gameId: string,
    callback: (session: GameSession | null) => void
): Unsubscribe => {
    return onSnapshot(
        doc(db, COLLECTIONS.GAME_SESSIONS, gameId),
        (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data() as GameSession);
            } else {
                callback(null);
            }
        },
        (error) => {
            console.error('Error listening to game session:', error);
            callback(null);
        }
    );
};

/**
 * Listen to participants in game session
 */
export const listenToParticipants = (
    gameId: string,
    callback: (participants: Participant[]) => void
): Unsubscribe => {
    const participantsRef = collection(
        db,
        COLLECTIONS.GAME_SESSIONS,
        gameId,
        COLLECTIONS.PARTICIPANTS
    );

    return onSnapshot(
        participantsRef,
        (snapshot) => {
            const participants = snapshot.docs.map(doc => doc.data() as Participant);
            callback(participants);
        },
        (error) => {
            console.error('Error listening to participants:', error);
            callback([]);
        }
    );
};

/**
 * Update game session
 */
export const updateGameSession = async (
    gameId: string,
    updates: Partial<GameSession>
): Promise<void> => {
    try {
        await updateDoc(doc(db, COLLECTIONS.GAME_SESSIONS, gameId), updates);
    } catch (error) {
        console.error('Error updating game session:', error);
        throw error;
    }
};

/**
 * Leave game session (remove participant)
 */
export const leaveGameSession = async (
    gameId: string,
    participantId: string
): Promise<void> => {
    try {
        await deleteDoc(
            doc(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.PARTICIPANTS, participantId)
        );
    } catch (error) {
        console.error('Error leaving game:', error);
        throw error;
    }
};

/**
 * Set current issue being voted on
 */
export const setCurrentIssue = async (
    gameId: string,
    issueId: string | null
): Promise<void> => {
    await updateGameSession(gameId, { currentIssue: issueId });
};

/**
 * Reveal votes
 */
export const revealVotes = async (gameId: string): Promise<void> => {
    await updateGameSession(gameId, { votesRevealed: true });
};

/**
 * Reset votes for new round
 */
export const resetVotingRound = async (gameId: string): Promise<void> => {
    // Reset revealed state
    await updateGameSession(gameId, { votesRevealed: false });

    // Delete all votes
    const votesRef = collection(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.VOTES);
    const votesSnap = await getDocs(votesRef);
    const deletePromises = votesSnap.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
};
