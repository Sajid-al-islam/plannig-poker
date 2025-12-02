import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { GameRoom } from '../GameRoom';
import * as router from 'react-router-dom';
import * as gameService from '../../services/gameService';
import * as voteService from '../../services/voteService';
import * as issueService from '../../services/issueService';
import * as emojiService from '../../services/emojiService';

// Mock dependencies
vi.mock('react-router-dom', () => ({
    useParams: vi.fn(),
    useNavigate: vi.fn(),
}));

vi.mock('../../services/gameService', () => ({
    listenToGameSession: vi.fn(),
    listenToParticipants: vi.fn(),
    listenToIssues: vi.fn(), // If it was exported from here
    leaveGameSession: vi.fn(),
    revealVotes: vi.fn(),
    resetVotingRound: vi.fn(),
    setCurrentIssue: vi.fn(),
}));

vi.mock('../../services/voteService', () => ({
    listenToVotes: vi.fn(),
    submitVote: vi.fn(),
    hasVoted: vi.fn(),
    getParticipantVote: vi.fn(),
}));

vi.mock('../../services/issueService', () => ({
    listenToIssues: vi.fn(),
    addIssue: vi.fn(),
}));

vi.mock('../../services/emojiService', () => ({
    listenToEmojis: vi.fn(),
    throwEmoji: vi.fn(),
}));

// Mock child components to simplify testing
vi.mock('../../components/game/VotingCards', () => ({
    VotingCards: () => <div data-testid="voting-cards">Voting Cards</div>
}));
vi.mock('../../components/game/ParticipantCard', () => ({
    ParticipantCard: ({ participant }) => <div data-testid={`participant-${participant.id}`}>{participant.name}</div>
}));
vi.mock('../../components/game/ResultsChart', () => ({
    ResultsChart: () => <div data-testid="results-chart">Results Chart</div>
}));
vi.mock('../../components/game/IssueSidebar', () => ({
    IssueSidebar: () => <div data-testid="issue-sidebar">Issue Sidebar</div>
}));

describe('GameRoom', () => {
    const mockNavigate = vi.fn();
    const gameId = 'test-game-id';
    const participantId = 'user-123';

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(router, 'useNavigate').mockReturnValue(mockNavigate);
        vi.spyOn(router, 'useParams').mockReturnValue({ gameId });

        // Default mocks for listeners (return unsubscribe function)
        (gameService.listenToGameSession as any).mockReturnValue(() => { });
        (gameService.listenToParticipants as any).mockReturnValue(() => { });
        (voteService.listenToVotes as any).mockReturnValue(() => { });
        (issueService.listenToIssues as any).mockReturnValue(() => { });
        (emojiService.listenToEmojis as any).mockReturnValue(() => { });
    });

    it('redirects to join page if participant ID is not in local storage', () => {
        localStorage.removeItem('currentParticipantId');

        render(<GameRoom />);

        expect(mockNavigate).toHaveBeenCalledWith(`/create?gameId=${gameId}`);
    });

    it('redirects to join page if participant ID exists in local storage but not in session (Ghost Player)', async () => {
        // Setup: User has ID in local storage
        localStorage.setItem('currentParticipantId', participantId);

        // Setup: Game session exists
        (gameService.listenToGameSession as any).mockImplementation((id, callback) => {
            callback({ id, name: 'Test Game', currentIssue: null, votesRevealed: false, hostId: 'other-user' });
            return () => { };
        });

        // Setup: Participants list DOES NOT include the current user
        (gameService.listenToParticipants as any).mockImplementation((id, callback) => {
            callback([
                { id: 'other-user', name: 'Other User', isHost: true }
            ]);
            return () => { };
        });

        render(<GameRoom />);

        // Wait for the redirect logic to trigger
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(`/create?gameId=${gameId}`);
        });

        // Verify local storage was cleared
        expect(localStorage.getItem('currentParticipantId')).toBeNull();
    });

    it('renders game room if participant is valid (Happy Flow)', async () => {
        // Setup: User has ID in local storage
        localStorage.setItem('currentParticipantId', participantId);

        // Setup: Game session exists
        (gameService.listenToGameSession as any).mockImplementation((id, callback) => {
            callback({ id, name: 'Test Game', currentIssue: null, votesRevealed: false, hostId: participantId });
            return () => { };
        });

        // Setup: Participants list INCLUDES the current user
        (gameService.listenToParticipants as any).mockImplementation((id, callback) => {
            callback([
                { id: participantId, name: 'Test User', isHost: true }
            ]);
            return () => { };
        });

        render(<GameRoom />);

        // Verify components render
        await waitFor(() => {
            expect(screen.getByText('Test Game')).toBeInTheDocument();
            expect(screen.getByTestId(`participant-${participantId}`)).toBeInTheDocument();
        });

        // Verify NO redirect happened
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
