import React from 'react';
import { VOTE_VALUES, type VoteValue } from '../../types';

interface VotingCardsProps {
    selectedValue: string | null;
    onSelectValue: (value: VoteValue) => void;
    disabled: boolean;
}

export const VotingCards: React.FC<VotingCardsProps> = ({
    selectedValue,
    onSelectValue,
    disabled,
}) => {
    return (
        <div className="py-8">
            <h3 className="text-xl font-semibold mb-4 text-center">Select Your Estimate</h3>
            <div className="flex flex-wrap justify-center gap-4 mx-auto">
                {VOTE_VALUES.map((value) => (
                    <button
                        key={value}
                        onClick={() => !disabled && onSelectValue(value)}
                        disabled={disabled}
                        className={`voting-card ${selectedValue === value ? 'selected' : ''} ${disabled ? 'disabled' : ''
                            }`}
                    >
                        {value}
                    </button>
                ))}
            </div>
            {selectedValue && !disabled && (
                <p className="text-center mt-4 text-green-400 animate-fade-in">
                    ✓ You selected: <span className="font-bold text-2xl">{selectedValue}</span>
                </p>
            )}
        </div>
    );
};
