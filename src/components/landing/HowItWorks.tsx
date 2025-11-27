import React from 'react';
import { PlusCircle, Send, Vote, MessageCircle, Eye } from 'lucide-react';

const steps = [
    {
        icon: PlusCircle,
        title: 'Create Game',
        description: 'Start a new planning poker session with a unique game link',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Send,
        title: 'Invite Team',
        description: 'Share the game link with your team members',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: Vote,
        title: 'Vote',
        description: 'Each team member selects their estimate privately',
        color: 'from-green-500 to-emerald-500',
    },
    {
        icon: MessageCircle,
        title: 'Discuss',
        description: 'Talk through different perspectives and estimates',
        color: 'from-orange-500 to-red-500',
    },
    {
        icon: Eye,
        title: 'Reveal & Finalize',
        description: 'Show all votes and agree on the final estimate',
        color: 'from-pink-500 to-purple-500',
    },
];

export const HowItWorks: React.FC = () => {
    return (
        <section className="py-20 px-4 bg-gradient-to-b from-transparent to-dark-900/50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text-accent">How It Works</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Get started with planning poker in 5 simple steps
                    </p>
                </div>

                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20"></div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index} className="relative">
                                    <div className="flex flex-col items-center text-center">
                                        {/* Step number */}
                                        <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-dark-800 border-2 border-primary-500 flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>

                                        {/* Icon */}
                                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-xl hover:scale-110 transition-transform`}>
                                            <Icon className="w-10 h-10 text-white" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-lg font-bold mb-2 text-white">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
