import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Eye, RotateCcw, LogOut, Check } from 'lucide-react';
import { Button } from '../components/common/Button';
import { VotingCards } from '../components/game/VotingCards';
import { ParticipantCard } from '../components/game/ParticipantCard';
import { ResultsChart } from '../components/game/ResultsChart';
import { IssueSidebar } from '../components/game/IssueSidebar';
import { EmojiOverlay, EmojiContainer } from '../components/game/EmojiOverlay';
import type { GameSession, Participant, Vote, Issue, EmojiThrow, VoteValue } from '../types';
import {
    listenToGameSession,
    listenToParticipants,
    leaveGameSession,
    revealVotes,
    resetVotingRound,
    setCurrentIssue,
} from '../services/gameService';
import { submitVote, listenToVotes, hasVoted, getParticipantVote } from '../services/voteService';
import { throwEmoji, listenToEmojis } from '../services/emojiService';
import {
    addIssue,
    listenToIssues,
    deleteIssue,
    markIssueEstimated,
    importIssuesFromCSV,
    exportIssuesToCSV,
} from '../services/issueService';
import { copyToClipboard, getGameUrl, calculateVoteStats } from '../utils/helpers';

export const GameRoom: React.FC = () => {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();

    // State
    const [gameSession, setGameSession] = useState<GameSession | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [votes, setVotes] = useState<Vote[]>([]);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [emojis, setEmojis] = useState<EmojiThrow[]>([]);
    const [currentParticipantId, setCurrentParticipantId] = useState<string | null>(null);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
    const [copied, setCopied] = useState(false);

    const currentParticipant = participants.find((p) => p.id === currentParticipantId);
    const isHost = currentParticipant?.isHost || false;

    // Initialize
    useEffect(() => {
        if (!gameId) return;

        // Get participant ID from localStorage
        const storedParticipantId = localStorage.getItem('currentParticipantId');
        if (!storedParticipantId) {
            navigate('/create');
            return;
        }
        setCurrentParticipantId(storedParticipantId);

        // Setup listeners
        const unsubGame = listenToGameSession(gameId, setGameSession);
        const unsubParticipants = listenToParticipants(gameId, setParticipants);
        const unsubVotes = listenToVotes(gameId, setVotes);
        const unsubIssues = listenToIssues(gameId, setIssues);
        const unsubEmojis = listenToEmojis(gameId, setEmojis);

        return () => {
            unsubGame();
            unsubParticipants();
            unsubVotes();
            unsubIssues();
            unsubEmojis();
        };
    }, [gameId, navigate]);

    // Handle vote selection
    const handleVoteSelect = (value: VoteValue) => {
        if (!gameId || !currentParticipantId) return;
        setSelectedValue(value);
        submitVote(gameId, currentParticipantId, value);
    };

    // Handle reveal votes
    const handleRevealVotes = async () => {
        if (!gameId) return;
        await revealVotes(gameId);
    };

    // Handle reset votes
    const handleResetVotes = async () => {
        if (!gameId) return;
        await resetVotingRound(gameId);
        setSelectedValue(null);
    };

    // Handle finalize estimate
    const handleFinalizeEstimate = async () => {
        if (!gameId || !gameSession?.currentIssue) return;

        const stats = calculateVoteStats(votes);
        if (!stats) return;

        // Use consensus or median as estimate
        const estimate = stats.consensus
            ? stats.mode[0]
            : stats.median.toString();

        await markIssueEstimated(gameId, gameSession.currentIssue, estimate);
        await setCurrentIssue(gameId, null);
        await resetVotingRound(gameId);
        setSelectedValue(null);
    };

    // Handle emoji throw
    const handleEmojiThrow = async (emoji: string) => {
        if (!gameId || !currentParticipantId || !selectedParticipant) return;

        const result = await throwEmoji(gameId, currentParticipantId, selectedParticipant.id, emoji);

        if (!result.success) {
            console.log(result);
            console.warn('Failed to throw emoji:', result.error);
            // Silently fail - rate limiting is normal behavior
        } else {
            console.log('Emoji thrown successfully:', emoji);
        }
    };

    // Handle copy game link
    const handleCopyLink = async () => {
        if (!gameId) return;
        const success = await copyToClipboard(getGameUrl(gameId));
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Handle leave game
    const handleLeaveGame = async () => {
        if (!gameId || !currentParticipantId) return;
        await leaveGameSession(gameId, currentParticipantId);
        localStorage.removeItem('currentGameId');
        localStorage.removeItem('currentParticipantId');
        navigate('/');
    };

    if (!gameSession || !currentParticipantId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner w-12 h-12"></div>
            </div>
        );
    }

    const currentIssue = issues.find((i) => i.id === gameSession.currentIssue);
    const userHasVoted = hasVoted(votes, currentParticipantId);
    const allVoted = participants.every((p) => hasVoted(votes, p.id));

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="glass-strong p-4 mb-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold gradient-text">{gameSession.name}</h1>
                        <p className="text-sm text-gray-400">Game ID: {gameId}</p>
                    </div>
                    <div className="flex gap-3 flex-wrap justify-center">
                        <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? 'Copied!' : 'Copy Link'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleLeaveGame}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Leave
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                {/* Current Issue */}
                {currentIssue && (
                    <div className="glass p-6 rounded-xl mb-6 animate-slide-down">
                        <h2 className="text-xl font-bold mb-2 text-white">Current Issue</h2>
                        <h3 className="text-2xl font-bold gradient-text-accent">{currentIssue.title}</h3>
                        {currentIssue.description && (
                            <p className="text-gray-400 mt-2">{currentIssue.description}</p>
                        )}
                    </div>
                )}

                {/* Participants Grid */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-center">
                        Participants ({participants.length})
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {participants.map((participant) => (
                            <div key={participant.id} id={`participant-${participant.id}`}>
                                <ParticipantCard
                                    participant={participant}
                                    hasVoted={hasVoted(votes, participant.id)}
                                    voteValue={getParticipantVote(votes, participant.id)}
                                    votesRevealed={gameSession.votesRevealed}
                                    onClick={() =>
                                        participant.id !== currentParticipantId && setSelectedParticipant(participant)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Voting Cards */}
                {currentIssue && !gameSession.votesRevealed && (
                    <VotingCards
                        selectedValue={selectedValue}
                        onSelectValue={handleVoteSelect}
                        disabled={userHasVoted}
                    />
                )}

                {/* Host Controls */}
                {isHost && currentIssue && (
                    <div className="flex justify-center gap-4 mb-8">
                        {!gameSession.votesRevealed ? (
                            <Button
                                onClick={handleRevealVotes}
                                disabled={!allVoted}
                                size="lg"
                            >
                                <Eye className="w-5 h-5 mr-2" />
                                Reveal Votes {!allVoted && `(${votes.length}/${participants.length})`}
                            </Button>
                        ) : (
                            <>
                                <Button onClick={handleResetVotes} variant="outline" size="lg">
                                    <RotateCcw className="w-5 h-5 mr-2" />
                                    Reset Votes
                                </Button>
                                <Button onClick={handleFinalizeEstimate} size="lg">
                                    <Check className="w-5 h-5 mr-2" />
                                    Finalize Estimate
                                </Button>
                            </>
                        )}
                    </div>
                )}

                {/* Results */}
                {gameSession.votesRevealed && votes.length > 0 && (
                    <div className="mb-8">
                        <ResultsChart votes={votes} />
                    </div>
                )}
            </div>

            {/* Issue Sidebar */}
            <IssueSidebar
                issues={issues}
                currentIssueId={gameSession.currentIssue}
                onAddIssue={(title, description) => gameId && addIssue(gameId, title, description)}
                onSelectIssue={(issueId) => gameId && setCurrentIssue(gameId, issueId)}
                onMarkEstimated={(issueId, estimate) =>
                    gameId && markIssueEstimated(gameId, issueId, estimate)
                }
                onDeleteIssue={(issueId) => gameId && deleteIssue(gameId, issueId)}
                onImportCSV={(csvText) => gameId && importIssuesFromCSV(gameId, csvText)}
                onExportCSV={() => {
                    const csv = exportIssuesToCSV(issues);
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `planning-poker-issues-${gameId}.csv`;
                    a.click();
                }}
                isHost={isHost}
            />

            {/* Emoji Overlay */}
            <EmojiOverlay
                selectedParticipant={selectedParticipant}
                onClose={() => setSelectedParticipant(null)}
                onEmojiSelect={handleEmojiThrow}
                currentParticipantId={currentParticipantId}
            />

            {/* Emoji Container */}
            <EmojiContainer emojis={emojis} participants={participants} />
        </div>
    );
};
