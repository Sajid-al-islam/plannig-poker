import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">
                        Planning Poker
                    </span>
                </div>

                {/* Start Game Button */}
                <Button variant="primary" onClick={() => navigate('/create')}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start New Game
                </Button>
            </div>
        </header>
    );
};
