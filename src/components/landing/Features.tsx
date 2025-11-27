import React from 'react';
import { Sparkles, Users, BarChart3, FolderKanban, Zap, Smartphone } from 'lucide-react';

const features = [
    {
        icon: Users,
        title: 'Vote and Estimate in Real-Time',
        description: 'Our crisp and clean interface enables outstanding team engagement for development project estimates.',
        gradient: 'from-blue-500 to-cyan-500',
    },
    {
        icon: BarChart3,
        title: 'Visual Results at a Glance',
        description: 'Results are quick and super-easy to understand while providing in-depth and high-quality insights.',
        gradient: 'from-purple-500 to-pink-500',
    },
    {
        icon: FolderKanban,
        title: 'In-Game Issue Management',
        description: 'Streamline the issues your agile development team is working on with our sidebar manager.',
        gradient: 'from-green-500 to-emerald-500',
    },
    {
        icon: Zap,
        title: 'Integrations & CSV Import',
        description: 'Easily integrate with other tools using CSV files for seamless workflow.',
        gradient: 'from-orange-500 to-red-500',
    },
    {
        icon: Sparkles,
        title: 'Interactive & Fun',
        description: 'Throw emojis to your teammates during estimation for enhanced team engagement.',
        gradient: 'from-yellow-500 to-orange-500',
    },
    {
        icon: Smartphone,
        title: 'Works on All Devices',
        description: 'Vote on any issue, anytime, anywhere with our responsive web app.',
        gradient: 'from-indigo-500 to-purple-500',
    },
];

export const Features: React.FC = () => {
    return (
        <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Everything You Need for
                        <span className="gradient-text"> Agile Estimation</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        A complete solution for Scrum teams to estimate work efficiently
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="card group hover:scale-105 transition-transform cursor-pointer"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
