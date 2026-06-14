'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [intent, setIntent] = useState('');

  const handleStart = () => {
    if (!intent.trim()) return;

    localStorage.setItem('undercurrent_intent', intent);
    router.push('/upload');
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* MICROSOFT STYLE GLOW */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/10 blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center">

        {/* BADGE */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-slate-300 mb-6">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          Powered by Undercurrent Intelligence
        </div>

        {/* TITLE */}
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-2">UNDERCURRENT</h1>

        {/* SUBTITLE (IMPORTANT POSITIONING LINE) */}
        <p className="text-xl md:text-2xl text-slate-300 mb-2">
          Enterprise Reality Intelligence Layer
        </p>

        <p className="text-slate-500 mb-10 max-w-2xl mx-auto">
          Undercurrent reveals the gap between what organizations claim to prioritize and what actually receives attention. By analyzing declared intent and workplace signals, the Decision Intelligence Layer surfaces hidden incentives, executive blind spots, and emerging organizational risk before they become business failures.
        </p>

        {/* INPUT CARD */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl text-left">

          <p className="text-sm text-slate-400 mb-3">
            Define Organizational Intent (Leadership Claim Layer)
          </p>

          <textarea
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="e.g. Security, Reliability, Customer Trust..."
            className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-400"
          />

          {/* IQ EXPLANATION MINI BLOCK */}
          <div className="grid md:grid-cols-3 gap-3 mt-6 text-xs text-slate-400">
            <div className="border border-white/10 rounded-lg p-3">
              <p className="text-cyan-300 font-semibold">Work IQ</p>
              <p>Reads execution signals from workplace data</p>
            </div>

            <div className="border border-white/10 rounded-lg p-3">
              <p className="text-purple-300 font-semibold">Fabric IQ</p>
              <p>Structures relationships between organizational signals</p>
            </div>

            <div className="border border-white/10 rounded-lg p-3">
              <p className="text-blue-300 font-semibold">Foundry IQ</p>
              <p>Grounds reasoning in verifiable enterprise sources</p>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleStart}
            className="mt-8 w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:scale-[1.02] transition"
          >
            Initialize Organizational Analysis
          </button>
        </div>

      </div>
    </main>
  );
}