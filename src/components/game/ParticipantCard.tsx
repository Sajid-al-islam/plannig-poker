import React from 'react';
import { Check, Crown } from 'lucide-react';
import { type Participant } from '../../types';
import { getInitials } from '../../types';

interface ParticipantCardProps {
    participant: Participant;
    hasVoted: boolean;
    voteValue: string | null;
    votesRevealed: boolean;
    onClick?: () => void;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
    participant,
    hasVoted,
    voteValue,
    votesRevealed,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className={`participant-card ${hasVoted ? 'voted' : ''} ${onClick ? 'cursor-pointer' : ''
                }`}
        >
            {/* Avatar */}
            <div
                className="relative w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                style={{ backgroundColor: participant.color }}
            >
                {getInitials(participant.name)}

                {/* Host crown */}
                {participant.isHost && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
                        <Crown className="w-5 h-5 text-white" />
                    </div>
                )}

                {/* Voted check */}
                {hasVoted && !votesRevealed && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-white" />
                    </div>
                )}
            </div>

            {/* Name */}
            <div className="text-center">
                <p className="font-semibold text-white truncate max-w-[120px]">
                    {participant.name}
                </p>
                {participant.isHost && (
                    <p className="text-xs text-yellow-400">Host</p>
                )}
            </div>

            {/* Vote value (revealed) */}
            {votesRevealed && voteValue && (
                <div className="absolute top-2 right-2 w-10 h-10 rounded-lg bg-primary-500/90 backdrop-blur-sm flex items-center justify-center font-bold text-lg text-white shadow-lg animate-slide-down">
                    {voteValue}
                </div>
            )}

            {/* Voting status */}
            {!votesRevealed && (
                <div className="text-xs text-center">
                    {hasVoted ? (
                        <span className="text-green-400">✓ Voted</span>
                    ) : (
                        <span className="text-gray-500">Waiting...</span>
                    )}
                </div>
            )}
        </div>
    );
};
