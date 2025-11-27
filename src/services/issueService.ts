import {
    collection,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    type Unsubscribe,
    query,
    orderBy,
    getDocs,
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../config/firebase';
import type { Issue } from '../types';
import { generateId } from '../utils/helpers';

/**
 * Add a new issue to the game
 */
export const addIssue = async (
    gameId: string,
    title: string,
    description?: string
): Promise<string> => {
    try {
        const issueId = generateId();

        // Get current issue count for ordering
        const issuesRef = collection(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.ISSUES);
        const issuesSnap = await getDocs(issuesRef);
        const order = issuesSnap.size;

        const issue: Issue = {
            id: issueId,
            title,
            description,
            createdAt: Date.now(),
            isEstimated: false,
            order,
        };

        await setDoc(
            doc(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.ISSUES, issueId),
            issue
        );

        return issueId;
    } catch (error) {
        console.error('Error adding issue:', error);
        throw error;
    }
};

/**
 * Update an issue
 */
export const updateIssue = async (
    gameId: string,
    issueId: string,
    updates: Partial<Issue>
): Promise<void> => {
    try {
        await updateDoc(
            doc(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.ISSUES, issueId),
            updates
        );
    } catch (error) {
        console.error('Error updating issue:', error);
        throw error;
    }
};

/**
 * Mark issue as estimated
 */
export const markIssueEstimated = async (
    gameId: string,
    issueId: string,
    estimate: string
): Promise<void> => {
    await updateIssue(gameId, issueId, {
        estimate,
        isEstimated: true,
    });
};

/**
 * Delete an issue
 */
export const deleteIssue = async (gameId: string, issueId: string): Promise<void> => {
    try {
        await deleteDoc(
            doc(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.ISSUES, issueId)
        );
    } catch (error) {
        console.error('Error deleting issue:', error);
        throw error;
    }
};

/**
 * Get all issues for a game
 */
export const getIssues = async (gameId: string): Promise<Issue[]> => {
    try {
        const issuesRef = collection(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.ISSUES);
        const issuesQuery = query(issuesRef, orderBy('order'));
        const issuesSnap = await getDocs(issuesQuery);
        return issuesSnap.docs.map(doc => doc.data() as Issue);
    } catch (error) {
        console.error('Error getting issues:', error);
        return [];
    }
};

/**
 * Listen to issues in real-time
 */
export const listenToIssues = (
    gameId: string,
    callback: (issues: Issue[]) => void
): Unsubscribe => {
    const issuesRef = collection(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.ISSUES);
    const issuesQuery = query(issuesRef, orderBy('order'));

    return onSnapshot(
        issuesQuery,
        (snapshot) => {
            const issues = snapshot.docs.map(doc => doc.data() as Issue);
            callback(issues);
        },
        (error) => {
            console.error('Error listening to issues:', error);
            callback([]);
        }
    );
};

/**
 * Import issues from CSV text
 */
export const importIssuesFromCSV = async (
    gameId: string,
    csvText: string
): Promise<number> => {
    try {
        const lines = csvText.split('\n').filter(line => line.trim());
        let importedCount = 0;

        for (const line of lines) {
            const [title, description] = line.split(',').map(s => s.trim());
            if (title) {
                await addIssue(gameId, title, description);
                importedCount++;
            }
        }

        return importedCount;
    } catch (error) {
        console.error('Error importing issues:', error);
        throw error;
    }
};

/**
 * Export issues to CSV format
 */
export const exportIssuesToCSV = (issues: Issue[]): string => {
    const header = 'Title,Description,Estimate\n';
    const rows = issues.map(issue =>
        `"${issue.title}","${issue.description || ''}","${issue.estimate || ''}"`
    ).join('\n');
    return header + rows;
};
