// Game session types
export interface GameSession {
    id: string;
    name: string;
    createdAt: number;
    createdBy: string;
    currentIssue: string | null;
    votesRevealed: boolean;
    hostId: string;
}

export interface Participant {
    id: string;
    name: string;
    avatar: string;
    color: string;
    joinedAt: number;
    isHost: boolean;
    isSpectator?: boolean;
}

export interface Vote {
    participantId: string;
    value: string;
    submittedAt: number;
}

export interface Issue {
    id: string;
    title: string;
    description?: string;
    estimate?: string;
    createdAt: number;
    isEstimated: boolean;
    order: number;
}

export interface EmojiThrow {
    id: string;
    fromId: string;
    toId: string;
    emoji: string;
    timestamp: number;
}

// Voting card values
export type VoteValue = '0' | '1' | '2' | '3' | '5' | '8' | '13' | '21' | '34' | '?' | '☕';

export const VOTE_VALUES: VoteValue[] = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '?', '☕'];

// Color palette for participant avatars
export const PARTICIPANT_COLORS = [
    '#ef4444', // red
    '#f59e0b', // amber
    '#10b981', // emerald  
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
];

// Avatar styles (simple initials-based)
export const getAvatarColor = (index: number): string => {
    return PARTICIPANT_COLORS[index % PARTICIPANT_COLORS.length];
};

export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};
