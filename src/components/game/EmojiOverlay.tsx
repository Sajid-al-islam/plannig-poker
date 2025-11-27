import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker, { type EmojiClickData, Theme } from 'emoji-picker-react';
import { type EmojiThrow, type Participant } from '../../types';

interface EmojiOverlayProps {
    selectedParticipant: Participant | null;
    onClose: () => void;
    onEmojiSelect: (emoji: string) => void;
    currentParticipantId: string;
}

export const EmojiOverlay: React.FC<EmojiOverlayProps> = ({
    selectedParticipant,
    onClose,
    onEmojiSelect,
}) => {
    const handleEmojiClick = (emojiData: EmojiClickData) => {
        onEmojiSelect(emojiData.emoji);
        onClose();
    };

    if (!selectedParticipant) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Emoji Picker */}
            <div className="relative z-10 animate-slide-up">
                <div className="mb-4 text-center">
                    <p className="text-white font-semibold">
                        Send an emoji to {selectedParticipant.name}
                    </p>
                </div>
                <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme={Theme.DARK}
                    width={350}
                    height={450}
                />
            </div>
        </div>
    );
};

interface FlyingEmojiProps {
    emoji: EmojiThrow;
    toPosition: { x: number; y: number };
    onComplete: () => void;
    fromParticipantName: string;
}

export const FlyingEmoji: React.FC<FlyingEmojiProps> = ({
    emoji,
    toPosition,
    onComplete,
    fromParticipantName,
}) => {
    // Generate random starting position from off-screen (for anonymity)
    const getRandomStartPosition = () => {
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        const offset = 100; // pixels off-screen

        switch (side) {
            case 0: // top
                return { x: Math.random() * window.innerWidth, y: -offset };
            case 1: // right
                return { x: window.innerWidth + offset, y: Math.random() * window.innerHeight };
            case 2: // bottom
                return { x: Math.random() * window.innerWidth, y: window.innerHeight + offset };
            case 3: // left
            default:
                return { x: -offset, y: Math.random() * window.innerHeight };
        }
    };

    const [startPosition] = React.useState(getRandomStartPosition());

    useEffect(() => {
        // Log who sent the emoji (for debugging/moderation)
        console.log(`Emoji ${emoji.emoji} sent by ${fromParticipantName}`);

        const timer = setTimeout(onComplete, 3000);
        return () => clearTimeout(timer);
    }, [onComplete, emoji.emoji, fromParticipantName]);

    return (
        <motion.div
            className="fixed z-40 text-2xl pointer-events-none"
            initial={{
                x: startPosition.x,
                y: startPosition.y,
                opacity: 0,
            }}
            animate={{
                x: [startPosition.x, toPosition.x, toPosition.x, toPosition.x],
                y: [startPosition.y, toPosition.y, toPosition.y, toPosition.y + 50],
                opacity: [0, 1, 1, 0],
            }}
            transition={{
                duration: 2,
                times: [0, 0.6, 0.8, 1], // Fly (60%), Pause (20%), Drop (20%)
                ease: 'easeInOut',
            }}
        >
            {emoji.emoji}
        </motion.div>
    );
};

interface EmojiContainerProps {
    emojis: EmojiThrow[];
    participants: Participant[];
}

export const EmojiContainer: React.FC<EmojiContainerProps> = ({
    emojis,
    participants,
}) => {
    const [displayedEmojis, setDisplayedEmojis] = useState<EmojiThrow[]>([]);
    const processedEmojiIds = React.useRef<Set<string>>(new Set());

    useEffect(() => {
        // Only show new emojis that haven't been processed yet
        const newEmojis = emojis.filter(
            (e) => !processedEmojiIds.current.has(e.id)
        );

        if (newEmojis.length > 0) {
            // Mark new emojis as processed immediately
            newEmojis.forEach(e => processedEmojiIds.current.add(e.id));

            setDisplayedEmojis((prevDisplayed) => {
                // Double check against currently displayed to be safe
                const uniqueNewEmojis = newEmojis.filter(
                    e => !prevDisplayed.some(de => de.id === e.id)
                );
                return [...prevDisplayed, ...uniqueNewEmojis];
            });
        }
    }, [emojis]);

    const handleEmojiComplete = (emojiId: string) => {
        setDisplayedEmojis((prev) => prev.filter((e) => e.id !== emojiId));
    };

    const getParticipantPosition = (participantId: string) => {
        const element = document.getElementById(`participant-${participantId}`);
        if (element) {
            const rect = element.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            };
        }
        return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    };

    const getParticipantName = (participantId: string): string => {
        const participant = participants.find(p => p.id === participantId);
        return participant?.name || 'Unknown';
    };

    return (
        <div className="emoji-container">
            <AnimatePresence>
                {displayedEmojis.map((emoji) => (
                    <FlyingEmoji
                        key={emoji.id}
                        emoji={emoji}
                        toPosition={getParticipantPosition(emoji.toId)}
                        onComplete={() => handleEmojiComplete(emoji.id)}
                        fromParticipantName={getParticipantName(emoji.fromId)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};
