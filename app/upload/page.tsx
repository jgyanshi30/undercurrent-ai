'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadSignalsPage() {
  const router = useRouter();
  const [signals, setSignals] = useState('');
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [intent, setIntent] = useState('');

  const sampleSignals = `Meeting Note: "Security review still pending, but launch timeline critical"
Chat: "We need authentication fixes, but shipping takes priority"
Jira: "Security audit incomplete, 3 critical vulnerabilities backlogged"
Email: "Risk assessment delayed, team focused on feature delivery"
Update: "Compliance requirements documented but not yet resourced"`;

  const signalLength = signals.trim().length;
  const signalQuality =
    signalLength === 0 ? 'empty' : signalLength < 200 ? 'weak' : signalLength < 500 ? 'moderate' : 'strong';

  const signalsDetected = (signals.match(/\b(meeting|chat|jira|update|email|note|signal)\b/gi) || []).length;
  const estimatedConfidence = Math.min(95, Math.max(30, 30 + signalLength / 10));

  const handleSubmit = () => {
    if (!signals.trim()) return;

    // 🔥 CORE FIX: store BOTH intent + signals
    if (typeof window !== 'undefined') {
      localStorage.setItem('undercurrent_intent', intent.trim());
      localStorage.setItem('undercurrent_signals', signals.trim());
    }

    // small UX delay for “system feel”
    setTimeout(() => {
      router.push('/analysis');
    }, 300);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleSampleData = () => {
    setSignals(sampleSignals);
    if (!intent.trim()) {
      setIntent('Security and Compliance');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white px-6 py-12">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-500 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* PREMIUM HEADER */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
            <p className="text-xs tracking-[0.35em] font-semibold text-cyan-300 uppercase">
              Enterprise Intelligence
            </p>
            <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-br from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent mb-4">
            Signal Ingestion Center
          </h1>

          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Import organizational signals from meetings, chats, project systems, and operational updates to detect hidden contradictions in your organization.
          </p>
        </div>

        {/* SIGNAL SOURCE CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-cyan-400/30 transition-all">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-bold text-white mb-2">Meeting Notes</h3>
            <p className="text-sm text-slate-400">Capture decisions, priorities, and concerns from team meetings and standups</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-purple-400/30 transition-all">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-bold text-white mb-2">Team Chats</h3>
            <p className="text-sm text-slate-400">Include Slack threads, Teams messages, and async communication patterns</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-emerald-400/30 transition-all">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-bold text-white mb-2">Project Updates</h3>
            <p className="text-sm text-slate-400">Paste Jira tickets, status updates, and project tracking information</p>
          </div>
        </div>

        {/* HOW UNDERCURRENT WORKS */}
        <div className="mb-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-2xl shadow-black/40">
          <h2 className="text-2xl font-bold text-white mb-8">How Undercurrent Works</h2>

          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {[
              { num: 1, label: 'Read Stated Priority' },
              { num: 2, label: 'Analyze Organizational Signals' },
              { num: 3, label: 'Detect Hidden Contradictions' },
              { num: 4, label: 'Forecast Future Drift' },
              { num: 5, label: 'Generate Intelligence' },
            ].map((step) => (
              <div key={step.num} className="relative">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold mb-3">
                    {step.num}
                  </div>
                  <p className="text-xs font-semibold text-slate-300 text-center leading-tight">{step.label}</p>
                </div>
                {step.num < 5 && (
                  <div className="absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5 bg-gradient-to-r from-cyan-400/50 to-transparent hidden md:block"></div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSampleData}
            className="w-full px-6 py-3 rounded-full border border-cyan-400/50 bg-cyan-400/10 text-cyan-300 font-semibold hover:bg-cyan-400/20 transition-all"
          >
            ✨ Load Sample Data
          </button>
        </div>

        {/* MAIN INPUT CARD */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden p-10 mb-10">

          {/* INTENT INPUT */}
          <div className="mb-10">
            <label className="text-sm font-semibold text-slate-300 mb-3 block">
              Stated Organizational Priority
            </label>

            <textarea
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              rows={2}
              placeholder="e.g., Security, Compliance, Customer Trust, Reliability..."
              className="w-full rounded-2xl bg-slate-950/80 border border-white/10 p-4 text-sm text-white focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
            />
          </div>

          {/* SIGNALS INPUT */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-300">
                Organizational Signals (Reality data)
              </label>
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[0.2em] ${
                signalQuality === 'empty'
                  ? 'bg-slate-700 text-slate-400'
                  : signalQuality === 'weak'
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : signalQuality === 'moderate'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-green-500/20 text-green-300'
              }`}>
                {signalQuality === 'empty'
                  ? 'No Data'
                  : signalQuality === 'weak'
                  ? 'Weak Signal'
                  : signalQuality === 'moderate'
                  ? 'Moderate Signal'
                  : 'Strong Signal'}
              </div>
            </div>

            <textarea
              value={signals}
              onChange={(e) => setSignals(e.target.value)}
              rows={12}
              placeholder="Slack messages, meeting notes, Jira updates, emails..."
              className="w-full rounded-2xl bg-slate-950/80 border border-white/10 p-4 text-sm text-white focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
            />
          </div>

          {/* FILE UPLOAD - PREMIUM */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`rounded-3xl border-2 transition-all duration-300 p-12 text-center mb-10 ${
              dragging
                ? 'border-cyan-400/70 bg-cyan-400/15 shadow-lg shadow-cyan-400/20'
                : 'border-white/10 bg-slate-950/80 hover:border-white/20'
            }`}
          >
            <div className="mb-6 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl shadow-lg">
                📤
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Drag & drop a file here</h3>
            <p className="text-sm text-slate-400 mb-6">
              Optional: Upload .txt, .md, or .docx files (UI preview only)
            </p>

            <label className="inline-flex cursor-pointer items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white hover:border-cyan-400/50 hover:bg-cyan-400/15 transition-all">
              Choose File
              <input type="file" onChange={handleFileSelect} className="sr-only" />
            </label>

            <p className="text-xs text-slate-500 mt-4">
              {fileName ?? 'No file selected'}
            </p>
          </div>

          {/* PROCESSING PREVIEW CARD */}
          {signals.trim().length > 0 && (
            <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-8 mb-10">
              <p className="text-xs tracking-[0.3em] text-cyan-300 font-semibold uppercase mb-6">Ready for Analysis</p>

              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Signals Detected</p>
                  <p className="text-4xl font-black bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    {signalsDetected}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-2">Data Volume</p>
                  <p className="text-4xl font-black bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    {Math.round(signalLength / 100)}
                  </p>
                  <p className="text-xs text-slate-500">characters (×100)</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-2">Estimated Confidence</p>
                  <p className="text-4xl font-black bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                    {Math.round(estimatedConfidence)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA BUTTONS */}
          <div className="flex flex-col md:flex-row gap-4 justify-end">
            <button
              onClick={() => {
                setSignals('');
                setIntent('');
              }}
              className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-all"
            >
              Clear
            </button>
            <button
              onClick={handleSubmit}
              disabled={!signals.trim()}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 hover:scale-105 transition-all disabled:opacity-40 disabled:scale-100"
            >
              Generate Intelligence Report
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}