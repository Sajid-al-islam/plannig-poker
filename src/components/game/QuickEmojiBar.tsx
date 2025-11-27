import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

interface QuickEmojiBarProps {
    onEmojiClick: (emoji: string) => void;
    onMoreClick: () => void;
}

const DEFAULT_EMOJIS = ['🎯', '🚀', '👏', '❤️'];
const RECENT_EMOJIS_KEY = 'planning-poker-recent-emojis';

export const QuickEmojiBar: React.FC<QuickEmojiBarProps> = ({ onEmojiClick, onMoreClick }) => {
    const [emojis, setEmojis] = useState<string[]>(DEFAULT_EMOJIS);

    useEffect(() => {
        // Load recent emojis from localStorage
        const stored = localStorage.getItem(RECENT_EMOJIS_KEY);
        if (stored) {
            try {
                const recent = JSON.parse(stored);
                if (Array.isArray(recent) && recent.length > 0) {
                    // Merge recent with defaults, keeping 4 total
                    const merged = [...new Set([...recent, ...DEFAULT_EMOJIS])].slice(0, 4);
                    setEmojis(merged);
                }
            } catch (err) {
                console.error('Failed to load recent emojis:', err);
            }
        }
    }, []);

    const handleEmojiClick = (emoji: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening full picker
        onEmojiClick(emoji);
    };

    const handleMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        onMoreClick();
    };

    return (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-[#2d3748] px-4 py-2.5 rounded-full flex items-center gap-2 shadow-2xl">
                {emojis.map((emoji, index) => (
                    <button
                        key={index}
                        onClick={(e) => handleEmojiClick(emoji, e)}
                        className="w-9 h-9 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center text-xl"
                        title={`Throw ${emoji}`}
                    >
                        {emoji}
                    </button>
                ))}
                <div className="w-px h-5 bg-gray-600 mx-1" />
                <button
                    onClick={handleMoreClick}
                    className="w-9 h-9 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center text-white"
                    title="More emojis"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export const updateRecentEmojis = (emoji: string) => {
    try {
        const stored = localStorage.getItem(RECENT_EMOJIS_KEY);
        let recent: string[] = stored ? JSON.parse(stored) : [];

        // Remove if already exists
        recent = recent.filter(e => e !== emoji);

        // Add to front
        recent.unshift(emoji);

        // Keep only 4 most recent
        recent = recent.slice(0, 4);

        localStorage.setItem(RECENT_EMOJIS_KEY, JSON.stringify(recent));
    } catch (err) {
        console.error('Failed to update recent emojis:', err);
    }
};
