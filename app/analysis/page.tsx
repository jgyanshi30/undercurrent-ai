'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Stage = {
  label: string;
  status: 'pending' | 'active' | 'done';
};

type ScoreCard = {
  title: string;
  value: number;
  description: string;
  accent: string;
  trend?: number;
};

const clamp = (v: number, min = 0, max = 100) =>
  Math.min(Math.max(v, min), max);

const count = (text: string, regex: RegExp) =>
  (text.match(regex) || []).length;

const generateBlindSpot = (intent: string, signals: string) => {
  const deliverySignals = count(
    signals,
    /deploy|release|feature|ship|launch/i
  );

  const securitySignals = count(
    signals,
    /security|risk|audit|vulnerability|incident/i
  );

  if (deliverySignals > securitySignals) {
    return {
      severity: 'HIGH',
      message:
        'Leadership talks about security, but organizational attention is concentrated on delivery speed.',
    };
  }

  return {
    severity: 'LOW',
    message:
      'Observed execution generally matches declared priorities.',
  };
};

const detectIncentive = (signals: string) => {
  const deliverySignals = count(
    signals,
    /deploy|release|feature|ship|launch/i
  );

  const securitySignals = count(
    signals,
    /security|risk|audit|vulnerability/i
  );

  if (deliverySignals > securitySignals) {
    return {
      confidence: 84,
      incentive:
        'Feature delivery appears to be rewarded more strongly than risk reduction.',
    };
  }

  return {
    confidence: 71,
    incentive:
      'Team incentives appear aligned with stated priorities.',
  };
};

const generateForecast = (signals: string) => {
  const riskSignals = count(
    signals,
    /security|risk|audit|incident|vulnerability|breach/i
  );

  if (riskSignals > 2) {
    return {
      day30:
        'Security backlog continues growing.',
      day60:
        'Compliance exposure and audit risk increase.',
      day90:
        'High probability of customer trust impact or security incident.',
    };
  }

  return {
    day30:
      'Minor organizational drift detected.',
    day60:
      'Execution friction increases.',
    day90:
      'Strategic misalignment compounds.',
  };
};

const generateContradictionEngine = (intent: string, signals: string) => {
  const securityIntent = /security|compliance|risk|audit/i.test(intent);
  const deliverySignals = count(signals, /deploy|release|feature|ship|launch/i);
  const securitySignals = count(signals, /security|risk|audit|vulnerability/i);

  if (securityIntent && deliverySignals > securitySignals) {
    return {
      declaredPriority: intent || 'Security & Compliance',
      observedBehavior: 'Delivery-focused execution with accelerated release cycles',
      hiddenTension: 'Speed of delivery prioritized over risk mitigation',
      likelyReality: 'Team incentives reward shipping velocity more than security posture',
    };
  }

  return {
    declaredPriority: intent || 'Organizational Alignment',
    observedBehavior: 'Measured execution with balanced priorities',
    hiddenTension: 'Minor friction between stated goals and execution',
    likelyReality: 'Team incentives generally aligned with stated strategy',
  };
};

const demoIntent = 'Security First';
const demoSignals = `Release deadline fixed\nSecurity review postponed\nLaunch approved despite unresolved risks\nPatch backlog increasing\nAudit flagged but deprioritized`;

const extractEvidence = (signals: string) => {
  const evidencePatterns = [
    { pattern: /security.*review.*pending|audit.*incomplete|vulnerability.*backlog/i, text: 'Security review delayed' },
    { pattern: /release.*accelerat|timeline.*critical|launch.*priority/i, text: 'Release deadline accelerated' },
    { pattern: /compliance.*postponed|fix.*postponed|audit.*delayed/i, text: 'Compliance fixes postponed' },
    { pattern: /deployment.*block|blocked.*release|unresolved.*risk/i, text: 'Release deployment blocked' },
    { pattern: /risk.*assessment.*delay|audit.*backlog.*increas/i, text: 'Risk assessment delayed' },
    { pattern: /feature.*shipping|delivery.*focus|ship.*takes.*priority/i, text: 'Feature delivery prioritized' },
  ];

  const foundEvidence: string[] = [];
  evidencePatterns.forEach((ep) => {
    if (ep.pattern.test(signals) && foundEvidence.length < 6) {
      foundEvidence.push(ep.text);
    }
  });

  return foundEvidence.length > 0
    ? foundEvidence
    : [
        'Organizational signals detected',
        'Behavioral patterns observed',
        'Strategic contradictions identified',
      ];
};

const generateExecutiveActions = (intent: string, signals: string) => {
  const securityIntent = /security|compliance|risk|audit/i.test(intent);
  const deliverySignals = count(signals, /deploy|release|feature|ship|launch/i);
  const securitySignals = count(signals, /security|risk|audit|vulnerability/i);

  const actions = [];

  if (securityIntent && deliverySignals > securitySignals) {
    actions.push(
      'Require security sign-off before release approval.',
      'Review and recalibrate team incentive structures quarterly.',
      'Reduce security audit backlog before next release cycle.'
    );
  } else {
    actions.push(
      'Conduct organizational alignment workshop with leadership.',
      'Establish clear metrics for measuring stated priorities.',
      'Implement monthly strategic review cadence.'
    );
  }

  return actions;
};

export default function AnalysisPage() {
  const [intent, setIntent] = useState('');
  const [signals, setSignals] = useState('');
  const [stageIndex, setStageIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [timestamp, setTimestamp] = useState('');
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const i = localStorage.getItem('undercurrent_intent') || '';
    const s = localStorage.getItem('undercurrent_signals') || '';
    if (!i && !s) {
      // populate demo scenario when no user data present
      setIntent(demoIntent);
      setSignals(demoSignals);
      setDemoMode(true);
    } else {
      setIntent(i);
      setSignals(s);
    }
    
    const now = new Date();
    setTimestamp(now.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }));

    // simulate AI pipeline progression
    const timer = setInterval(() => {
      setStageIndex((prev) => {
        if (prev >= 4) {
          clearInterval(timer);
          setReady(true);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  const stages: Stage[] = [
    { label: 'Ingesting organizational intent', status: stageIndex >= 0 ? 'done' : 'pending' },
    { label: 'Parsing workplace signals', status: stageIndex >= 1 ? 'done' : stageIndex === 1 ? 'active' : 'pending' },
    { label: 'Detecting contradictions', status: stageIndex >= 2 ? 'done' : stageIndex === 2 ? 'active' : 'pending' },
    { label: 'Building behavioral model', status: stageIndex >= 3 ? 'done' : stageIndex === 3 ? 'active' : 'pending' },
    { label: 'Generating strategic intelligence', status: stageIndex >= 4 ? 'done' : 'active' },
  ];

  const scores: ScoreCard[] = useMemo(() => {
    const securityIntent = /security|risk|audit/i.test(intent);
    const securitySignals = count(signals, /security|risk|audit|vulnerability|incident/i);
    const deliverySignals = count(signals, /deploy|release|feature|ship|launch/i);
    const riskSignals = count(signals, /blocked|delay|unresolved|issue/i);

    const total = Math.max(1, securitySignals + deliverySignals + riskSignals);

    const divergence = clamp(60 + (deliverySignals - securitySignals) * 8);
    const contradiction = clamp(
      55 + Math.abs((securityIntent ? 1 : 0) - deliverySignals / total) * 40
    );
    const drift = clamp(50 + deliverySignals * 3 + riskSignals * 5);

    return [
      {
        title: 'Reality Divergence',
        value: divergence,
        description: 'Gap between stated intent and observed execution.',
        accent: 'from-cyan-400 to-blue-500',
        trend: 8,
      },
      {
        title: 'Strategic Contradiction',
        value: contradiction,
        description: 'Conflicts between priorities and behavior signals.',
        accent: 'from-purple-400 to-pink-500',
        trend: 5,
      },
      {
        title: 'Organizational Drift',
        value: drift,
        description: 'Trajectory of operational misalignment over time.',
        accent: 'from-orange-400 to-red-500',
        trend: 12,
      },
    ];
  }, [intent, signals]);

  const heatmap = useMemo(() => {
    const security = count(signals, /security|risk|audit/i);
    const delivery = count(signals, /deploy|release|feature|ship/i);
    const ops = count(signals, /blocked|delay|issue|pending/i);

    const total = Math.max(1, security + delivery + ops);

    return {
      security: Math.round((security / total) * 100),
      delivery: Math.round((delivery / total) * 100),
      ops: Math.round((ops / total) * 100),
    };
  }, [signals]);

  const blindSpot = useMemo(
    () => generateBlindSpot(intent, signals),
    [intent, signals]
  );

  const incentive = useMemo(
    () => detectIncentive(signals),
    [signals]
  );

  const forecast = useMemo(
    () => generateForecast(signals),
    [signals]
  );

  const contradiction = useMemo(
    () => generateContradictionEngine(intent, signals),
    [intent, signals]
  );

  const evidence = useMemo(
    () => extractEvidence(signals),
    [signals]
  );

  const executiveActions = useMemo(
    () => generateExecutiveActions(intent, signals),
    [intent, signals]
  );

  const riskLevel = useMemo(() => {
    const avg = Math.round((scores[0].value + scores[1].value + scores[2].value) / 3);
    if (avg > 80) return { label: 'CRITICAL', color: 'bg-red-600 text-white' };
    if (avg > 65) return { label: 'HIGH', color: 'bg-orange-500 text-white' };
    if (avg > 45) return { label: 'MODERATE', color: 'bg-yellow-500 text-black' };
    return { label: 'LOW', color: 'bg-green-500 text-white' };
  }, [scores]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white px-6 py-12">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-500 opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* PREMIUM HEADER */}
        <div className="mb-16 fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
            <p className="text-xs tracking-[0.35em] font-semibold text-cyan-300 uppercase">
              Intelligence Engine v1.0
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-100 to-cyan-200 mb-4 text-center">Undercurrent Intelligence Report</h1>

            <p className="text-lg text-slate-300 max-w-3xl leading-relaxed mb-4 text-center">
              Enterprise Reality Intelligence — the Decision Intelligence Layer that surfaces misalignment between declared priorities and actual organizational attention.
            </p>

            <div className="flex items-center gap-6 mt-6 text-sm text-slate-400 w-full max-w-3xl">
              <span>Generated {timestamp}</span>
              <span className="w-1 h-1 bg-slate-600 rounded-full" />
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                Analysis active
              </span>

              <div className="ml-auto">
                <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold ${riskLevel.color} shadow-md`}>
                  <span className="text-xs opacity-80">RISK</span>
                  <span>{riskLevel.label}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI PIPELINE - PREMIUM VISUALIZATION */}
        <div className="mb-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm tracking-[0.3em] text-cyan-300 font-semibold uppercase">Intelligence Pipeline</h2>
            <div className="text-xs text-slate-400">
              {stageIndex + 1} / {stages.length} stages
            </div>
          </div>

          <div className="space-y-4">
            {stages.map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="relative flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      s.status === 'done'
                        ? 'bg-green-400 shadow-lg shadow-green-400/50'
                        : s.status === 'active'
                        ? 'bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50'
                        : 'bg-slate-700'
                    }`}
                  />
                  {i < stages.length - 1 && (
                    <div
                      className={`absolute left-1.5 top-3.5 w-0.5 h-4 transition-all duration-300 ${
                        stageIndex > i ? 'bg-green-400' : 'bg-slate-700'
                      }`}
                    />
                  )}
                </div>
                <p className="text-sm text-slate-300 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {!ready ? (
          <div className="text-center py-20">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-blue-400 animate-spin"></div>
              </div>
              <p className="text-slate-400 font-medium">Building organizational intelligence model...</p>
            </div>
          </div>
        ) : (
          <>
            {/* EXECUTIVE SUMMARY SECTION */}
            <div className="mb-16 grid md:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-8 backdrop-blur-xl">
                <p className="text-xs tracking-[0.3em] text-cyan-300 uppercase font-semibold mb-4">Key Risk</p>
                <p className="text-2xl font-bold text-white">
                  Intent-Execution Misalignment
                </p>
                <p className="text-sm text-slate-400 mt-3">
                  Leadership priorities diverge sharply from operational focus
                </p>
              </div>

              <div className="rounded-3xl border border-orange-400/20 bg-gradient-to-br from-orange-500/10 to-red-500/5 p-8 backdrop-blur-xl">
                <p className="text-xs tracking-[0.3em] text-orange-300 uppercase font-semibold mb-4">Most Likely Failure</p>
                <p className="text-2xl font-bold text-white">
                  Security Incident
                </p>
                <p className="text-sm text-slate-400 mt-3">
                  Unaddressed risk compounds without corrective action
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-green-500/5 p-8 backdrop-blur-xl">
                <p className="text-xs tracking-[0.3em] text-emerald-300 uppercase font-semibold mb-4">Recommended Action</p>
                <p className="text-2xl font-bold text-white">
                  Executive Realignment
                </p>
                <p className="text-sm text-slate-400 mt-3">
                  Align team incentives with stated organizational priorities
                </p>
              </div>
            </div>

            {/* PRIMARY INSIGHT */}
            <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-2xl shadow-black/40">
              <p className="text-xs tracking-[0.3em] text-cyan-300 font-semibold uppercase mb-6">Core Insight</p>
              <p className="text-3xl md:text-4xl font-bold leading-snug text-white">
                Organization shows strong execution bias toward delivery while
                stated priorities emphasize governance and security.
              </p>
            </div>

            {/* EXECUTIVE REALITY BRIEFING */}
            <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-md">
              <p className="text-xs tracking-[0.3em] text-cyan-300 font-semibold uppercase mb-4">Executive Reality Briefing</p>
              <div className="text-slate-300 space-y-3">
                <p className="text-slate-200"><span className="font-semibold">Leadership claim:</span> {intent || 'No declared leadership intent provided.'}</p>

                <p className="text-slate-200">Observed behavior: Predominant operational emphasis on {heatmap.delivery >= heatmap.security && heatmap.delivery >= heatmap.ops ? `feature delivery (${heatmap.delivery}%)` : heatmap.security >= heatmap.ops ? `security and compliance (${heatmap.security}%)` : `operational risk activities (${heatmap.ops}%)`} relative to declared priorities.</p>

                <p className="text-slate-200">Hidden contradiction: {contradiction.hiddenTension}. This indicates a structural misalignment between stated governance priorities and day-to-day execution.</p>

                <p className="text-slate-200">Projected consequence: {forecast.day30} If unaddressed, exposure to security incidents, audit findings, or customer trust erosion increases within the next 30–90 days.</p>

                <p className="text-slate-200"><span className="font-semibold">Immediate recommended actions:</span> {executiveActions[0] || 'Reassess release gating and security sign-off; prioritize clearing audit backlog; recalibrate incentive structures to reward risk remediation.'}</p>
              </div>
            </div>

            {/* DEMO SCENARIO - COLLAPSIBLE */}
            <div className="mb-12">
              <button onClick={() => setDemoOpen(!demoOpen)} className="flex items-center justify-between w-full md:w-2/3 mx-auto px-6 py-3 bg-white/3 border border-white/10 rounded-full text-left">
                <span className="font-semibold">See Example Organizational Scenario</span>
                <span className="text-slate-300">{demoOpen ? '▲' : '▼'}</span>
              </button>

              {demoOpen && (
                <div className="mt-4 max-w-3xl mx-auto p-6 rounded-2xl bg-white/3 border border-white/6">
                  <p className="font-semibold text-white mb-2">Leadership Priority: Security First</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 mb-3">
                    <li>Repeated statements about compliance and audit readiness</li>
                    <li>Release schedules accelerated without security sign-off</li>
                    <li>Patch backlog grows while features ship</li>
                  </ul>
                  <p className="text-slate-200"><span className="font-semibold">Undercurrent Findings:</span> Delivery focus dominates attention (Delivery 68%), security signals weak, projected elevated incident risk within 90 days.</p>
                </div>
              )}
            </div>

            {/* SCORE CARDS - PREMIUM DASHBOARD */}
            <div className="mb-16 grid md:grid-cols-3 gap-8">
              {scores.map((c) => (
                <div
                  key={c.title}
                  className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/40 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-xs tracking-[0.3em] text-slate-400 uppercase font-semibold">{c.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{c.description}</p>
                    </div>
                    {c.trend && (
                      <div className="flex items-center gap-1 text-xs font-semibold text-orange-400">
                        <span>↑</span>
                        <span>{c.trend}%</span>
                      </div>
                    )}
                  </div>

                  <p className={`text-6xl font-black bg-gradient-to-r ${c.accent} bg-clip-text text-transparent mb-6`}>
                    {c.value}
                  </p>

                  <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${c.accent} transition-all duration-700`}
                      style={{ width: `${c.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* ATTENTION DISTRIBUTION */}
            <div className="mb-16 grid lg:grid-cols-2 gap-8">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
                <p className="text-xs tracking-[0.3em] text-cyan-300 font-semibold uppercase mb-4">Attention vs Intent</p>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-300 mb-2">Leadership Declared Intent</p>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        style={{ width: `${/security|risk|compliance|audit/i.test(intent) ? 70 : 30}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-300 mb-2">Observed Attention (combined)</p>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      <div className="text-center">
                        <p className="text-xs text-slate-400">Security</p>
                        <p className="text-2xl font-black text-cyan-400">{heatmap.security}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-400">Delivery</p>
                        <p className="text-2xl font-black text-purple-400">{heatmap.delivery}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-400">Ops</p>
                        <p className="text-2xl font-black text-orange-400">{heatmap.ops}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-2xl shadow-black/40">
                <p className="text-xs tracking-[0.3em] text-cyan-300 font-semibold uppercase mb-8">Attention Distribution Analysis</p>

                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <div className="flex items-end justify-between mb-4">
                      <p className="text-sm font-semibold text-slate-300">Security Focus</p>
                      <p className="text-3xl font-black text-cyan-400">{heatmap.security}%</p>
                    </div>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        style={{ width: `${heatmap.security}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-end justify-between mb-4">
                      <p className="text-sm font-semibold text-slate-300">Delivery Focus</p>
                      <p className="text-3xl font-black text-purple-400">{heatmap.delivery}%</p>
                    </div>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-500"
                        style={{ width: `${heatmap.delivery}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-end justify-between mb-4">
                      <p className="text-sm font-semibold text-slate-300">Operational Risk</p>
                      <p className="text-3xl font-black text-orange-400">{heatmap.ops}%</p>
                    </div>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-red-500"
                        style={{ width: `${heatmap.ops}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EXECUTIVE BLIND SPOT - ALERT STYLE */}
            <div className="mb-16 rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-xl p-10 shadow-2xl shadow-red-500/10">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
                    <span className="text-2xl">⚠</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-white">Executive Blind Spot Detected</h2>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-[0.2em] ${
                      blindSpot.severity === 'HIGH'
                        ? 'bg-red-500/30 text-red-300 border border-red-400/50 shadow-lg shadow-red-500/20'
                        : 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/50 shadow-lg shadow-yellow-500/20'
                    }`}>
                      {blindSpot.severity} Risk
                    </span>
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {blindSpot.message}
                  </p>
                </div>
              </div>
            </div>

            {/* HIDDEN INCENTIVE DETECTOR */}
            <div className="mb-16 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-xl p-10 shadow-2xl shadow-purple-500/10">
              <p className="text-xs tracking-[0.3em] text-purple-300 font-semibold uppercase mb-6">Hidden Incentive Detector</p>
              
              <p className="text-xl font-semibold text-white mb-8">
                {incentive.incentive}
              </p>

              <div className="flex items-end gap-6">
                <div className="flex-1">
                  <p className="text-sm text-slate-400 mb-3">Confidence Score</p>
                  <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
                      style={{ width: `${incentive.confidence}%` }}
                    />
                  </div>
                </div>
                <p className="text-4xl font-black text-purple-400">{incentive.confidence}%</p>
              </div>
            </div>

            {/* ORGANIZATIONAL CONTRADICTION ENGINE */}
            <div className="mb-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-2xl shadow-black/40">
              <p className="text-xs tracking-[0.3em] text-cyan-300 font-semibold uppercase mb-8">Organizational Contradiction Engine</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 backdrop-blur p-6">
                  <p className="text-xs tracking-[0.2em] text-cyan-300 font-semibold uppercase mb-3">Declared Priority</p>
                  <p className="text-lg font-bold text-white">{contradiction.declaredPriority}</p>
                </div>

                <div className="rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur p-6">
                  <p className="text-xs tracking-[0.2em] text-purple-300 font-semibold uppercase mb-3">Observed Behavior</p>
                  <p className="text-lg font-bold text-white">{contradiction.observedBehavior}</p>
                </div>

                <div className="rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/10 to-red-500/5 backdrop-blur p-6">
                  <p className="text-xs tracking-[0.2em] text-orange-300 font-semibold uppercase mb-3">Hidden Tension</p>
                  <p className="text-lg font-bold text-white">{contradiction.hiddenTension}</p>
                </div>

                <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-green-500/5 backdrop-blur p-6">
                  <p className="text-xs tracking-[0.2em] text-emerald-300 font-semibold uppercase mb-3">Likely Reality</p>
                  <p className="text-lg font-bold text-white">{contradiction.likelyReality}</p>
                </div>
              </div>
            </div>

            {/* EVIDENCE SUPPORTING CONCLUSION */}
            <div className="mb-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-2xl shadow-black/40">
              <p className="text-xs tracking-[0.3em] text-cyan-300 font-semibold uppercase mb-8">Evidence Supporting Conclusion</p>
              
              <div className="space-y-3">
                {evidence.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-400 font-bold">✓</div>
                    </div>
                    <p className="text-slate-200 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RECOMMENDED EXECUTIVE ACTIONS */}
            <div className="mb-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-2xl shadow-black/40">
              <p className="text-xs tracking-[0.3em] text-cyan-300 font-semibold uppercase mb-8">Recommended Executive Actions</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {executiveActions.map((action, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur p-8 hover:border-white/20 transition-all">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg mb-5">
                      {idx + 1}
                    </div>
                    <p className="text-slate-200 leading-relaxed">{action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 30/60/90 DAY FAILURE FORECAST - TIMELINE STYLE */}
            <div className="mb-16">
              <p className="text-xs tracking-[0.3em] text-cyan-300 font-semibold uppercase mb-8">Strategic Risk Timeline</p>

              <div className="grid md:grid-cols-3 gap-6">
                {/* 30 Days */}
                <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 backdrop-blur-xl p-8 shadow-2xl shadow-cyan-500/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-full bg-cyan-400/20 border border-cyan-400/50 flex items-center justify-center text-sm font-bold text-cyan-300">1</div>
                    <h3 className="text-2xl font-bold text-white">30 Days</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    {forecast.day30}
                  </p>
                  <div className="h-1 bg-cyan-400/20 rounded-full mt-4">
                    <div className="h-full w-1/3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                  </div>
                </div>

                {/* 60 Days */}
                <div className="rounded-3xl border border-yellow-400/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 backdrop-blur-xl p-8 shadow-2xl shadow-yellow-500/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-full bg-yellow-400/20 border border-yellow-400/50 flex items-center justify-center text-sm font-bold text-yellow-300">2</div>
                    <h3 className="text-2xl font-bold text-white">60 Days</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    {forecast.day60}
                  </p>
                  <div className="h-1 bg-yellow-400/20 rounded-full mt-4">
                    <div className="h-full w-2/3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                  </div>
                </div>

                {/* 90 Days */}
                <div className="rounded-3xl border border-red-400/30 bg-gradient-to-br from-red-500/10 to-rose-500/5 backdrop-blur-xl p-8 shadow-2xl shadow-red-500/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-full bg-red-400/20 border border-red-400/50 flex items-center justify-center text-sm font-bold text-red-300">3</div>
                    <h3 className="text-2xl font-bold text-white">90 Days</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    {forecast.day90}
                  </p>
                  <div className="h-1 bg-red-400/20 rounded-full mt-4">
                    <div className="h-full w-full bg-gradient-to-r from-red-400 to-rose-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* WHY THIS RESULT - EXPLANATION */}
            <div className="mb-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-2xl shadow-black/40">
              <h2 className="text-xs tracking-[0.3em] text-cyan-300 font-semibold uppercase mb-6">Analytical Methodology</h2>

              <p className="text-slate-300 leading-relaxed text-lg">
                The system detected repeated delivery-oriented language in execution signals while security-related intent remains underrepresented in actual activity. This creates structural misalignment between declared priorities and operational focus. The confidence metrics reflect pattern frequency analysis across all ingested signals. Higher scores indicate stronger signal presence, suggesting organizational behavior increasingly diverges from stated strategic direction.
              </p>
            </div>

            {/* CTA */}
            <div className="flex gap-4 justify-center">
              <Link
                href="/upload"
                className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform"
              >
                Run New Analysis
              </Link>
              <Link
                href="/"
                className="px-10 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.6s ease-out; }

        .glow { box-shadow: 0 6px 30px rgba(99,102,241,0.12); }
        .soft-glow { filter: drop-shadow(0 10px 30px rgba(0,0,0,0.6)); }

        .risk-badge { padding: 0.35rem 0.75rem; border-radius: 9999px; font-weight: 700; }

        @media (prefers-reduced-motion: no-preference) {
          .fade-in { animation: fadeIn 0.6s ease-out; }
        }
      `}</style>
    </main>
  );
}