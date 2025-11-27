import React from 'react';
import { Check, Crown } from 'lucide-react';
import { type Participant } from '../../types';
import { getInitials } from '../../types';
import { QuickEmojiBar } from './QuickEmojiBar';

interface ParticipantCardProps {
    participant: Participant;
    hasVoted: boolean;
    voteValue: string | null;
    votesRevealed: boolean;
    onClick?: () => void;
    onEmojiClick?: (emoji: string) => void;
    onShowFullPicker?: () => void;
    showQuickBar?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
    participant,
    hasVoted,
    voteValue,
    votesRevealed,
    onClick,
    onEmojiClick,
    onShowFullPicker,
    showQuickBar = false,
    onMouseEnter,
    onMouseLeave,
}) => {
    const handleQuickEmojiClick = (emoji: string) => {
        if (onEmojiClick) {
            onEmojiClick(emoji);
        }
    };

    const handleMoreClick = () => {
        if (onShowFullPicker) {
            onShowFullPicker();
        }
    };

    return (
        <div
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`participant-card ${hasVoted ? 'voted' : ''} ${onClick ? 'cursor-pointer' : ''
                }`}
        >
            {/* Quick Emoji Bar */}
            {showQuickBar && onEmojiClick && (
                <QuickEmojiBar
                    onEmojiClick={handleQuickEmojiClick}
                    onMoreClick={handleMoreClick}
                />
            )}

            {/* Avatar */}
            <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg"
                style={{ backgroundColor: participant.color }}
            >
                {getInitials(participant.name)}

                {/* Host crown */}
                {participant.isHost && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
                        <Crown className="w-4 h-4 text-white" />
                    </div>
                )}

                {/* Voted check */}
                {hasVoted && !votesRevealed && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                        <Check className="w-3 h-3 text-white" />
                    </div>
                )}
            </div>

            {/* Name */}
            <div className="text-center">
                <p className="text-sm font-semibold text-white truncate max-w-[100px]">
                    {participant.name}
                </p>
                {participant.isHost && (
                    <p className="text-xs text-yellow-400">Host</p>
                )}
            </div>

            {/* Vote value (revealed) */}
            {votesRevealed && voteValue && (
                <div className="absolute top-1 right-1 w-8 h-8 rounded-lg bg-primary-500/90 backdrop-blur-sm flex items-center justify-center font-bold text-sm text-white shadow-lg animate-slide-down">
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
