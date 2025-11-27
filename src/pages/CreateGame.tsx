import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { createGameSession, joinGameSession } from '../services/gameService';

export const CreateGame: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'create' | 'join' | null>(null);
    const [gameId, setGameId] = useState('');

    const handleCreateGame = async () => {
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { gameId, participantId } = await createGameSession(name);
            // Store in localStorage
            localStorage.setItem('currentGameId', gameId);
            localStorage.setItem('currentParticipantId', participantId);
            navigate(`/game/${gameId}`);
        } catch (err) {
            setError('Failed to create game. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGame = async () => {
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!gameId.trim()) {
            setError('Please enter a game ID');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await joinGameSession(gameId, name);
            if (result.success) {
                // Store in localStorage
                localStorage.setItem('currentGameId', gameId);
                localStorage.setItem('currentParticipantId', result.participantId);
                navigate(`/game/${gameId}`);
            } else {
                setError(result.error || 'Failed to join game');
            }
        } catch (err) {
            setError('Failed to join game. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 gradient-text">
                        Get Started
                    </h1>
                    <p className="text-gray-400">
                        Create a new game or join an existing one
                    </p>
                </div>

                <div className="space-y-4">
                    {!mode ? (
                        <>
                            <Button
                                fullWidth
                                size="lg"
                                onClick={() => setMode('create')}
                            >
                                Create New Game
                            </Button>
                            <Button
                                fullWidth
                                size="lg"
                                variant="outline"
                                onClick={() => setMode('join')}
                            >
                                Join Existing Game
                            </Button>
                        </>
                    ) : mode === 'create' ? (
                        <div className="glass-strong p-6 rounded-xl space-y-4">
                            <h2 className="text-2xl font-bold mb-4">Create New Game</h2>
                            <Input
                                label="Your Name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                                error={error}
                            />
                            <div className="flex gap-3">
                                <Button
                                    fullWidth
                                    onClick={handleCreateGame}
                                    loading={loading}
                                    disabled={loading}
                                >
                                    Create Game
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setMode(null);
                                        setError('');
                                    }}
                                >
                                    Back
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-strong p-6 rounded-xl space-y-4">
                            <h2 className="text-2xl font-bold mb-4">Join Game</h2>
                            <Input
                                label="Your Name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                            />
                            <Input
                                label="Game ID"
                                placeholder="Enter game ID"
                                value={gameId}
                                onChange={(e) => setGameId(e.target.value)}
                                fullWidth
                                error={error}
                            />
                            <div className="flex gap-3">
                                <Button
                                    fullWidth
                                    onClick={handleJoinGame}
                                    loading={loading}
                                    disabled={loading}
                                >
                                    Join Game
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setMode(null);
                                        setError('');
                                    }}
                                >
                                    Back
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
