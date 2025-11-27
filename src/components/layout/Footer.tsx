import React from 'react';
import { Github, Twitter, Heart, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="py-12 px-4 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* About */}
                    <div>
                        <h4 className="font-bold mb-4 text-white">Planning Poker</h4>
                        <p className="text-gray-400 text-sm">
                            The easiest way for agile teams to estimate work and collaborate in real-time.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#features" className="text-gray-400 hover:text-primary-400 transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#how-it-works" className="text-gray-400 hover:text-primary-400 transition-colors">
                                    How It Works
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-bold mb-4 text-white">Connect</h4>
                        <div className="flex gap-4">
                            <a
                                href="https://github.com/sajid-al-islam"
                                target="_blank"
                                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                target="_blank"
                                href="https://www.linkedin.com/in/muhammad-sajidul-islam"
                                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500">
                    <p className="flex items-center justify-center gap-2">
                        Made with <Heart className="w-4 h-4 text-red-500" fill="currentColor" /> for agile teams everywhere
                    </p>
                    <p className="mt-2">© 2025 Planning Poker. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
