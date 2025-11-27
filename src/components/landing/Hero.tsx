import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { Sparkles, TrendingUp } from 'lucide-react';

export const Hero: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 animated-gradient opacity-20"></div>

            {/* Floating shapes */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 animate-slide-down">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium">Scrum Poker for Agile Teams</span>
                </div>

                {/* Main heading */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                    <span className="gradient-text">Planning Poker</span>
                    <br />
                    <span className="text-white">Made Simple</span>
                </h1>

                {/* Subheading */}
                <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                    Easy-to-use and fun estimations for your development team.
                    Vote in real-time, visualize results instantly, and keep your team engaged.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        size="lg"
                        className="glow"
                        onClick={() => navigate('/create')}
                    >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Start New Game
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => {
                            const element = document.getElementById('features');
                            element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        <TrendingUp className="w-5 h-5 mr-2" />
                        See Features
                    </Button>
                </div>

                {/* Trust indicators */}
                <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-60">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span className="text-sm">Teams Worldwide</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        <span className="text-sm">Real-time Sync</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm">Fun & Engaging</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Add missing imports
import { Users, Zap } from 'lucide-react';
