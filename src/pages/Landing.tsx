import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { HowItWorks } from '../components/landing/HowItWorks';

export const Landing: React.FC = () => {
    return (
        <div className="min-h-screen">
            <Header />

            <main className="pt-16">
                <Hero />

                <div id="features">
                    <Features />
                </div>

                <div id="how-it-works">
                    <HowItWorks />
                </div>
            </main>

            <Footer />
        </div>
    );
};
