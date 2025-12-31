"use client";

import React, { useState } from "react";

const toneOptions = [
  { id: "professional", label: "Professional", description: "Formal and business-appropriate", emoji: "👔" },
  { id: "friendly", label: "Friendly", description: "Warm and approachable", emoji: "😊" },
  { id: "casual", label: "Casual", description: "Relaxed and conversational", emoji: "👋" },
  { id: "assertive", label: "Assertive", description: "Direct and confident", emoji: "💪" },
  { id: "diplomatic", label: "Diplomatic", description: "Tactful and considerate", emoji: "🤝" },
  { id: "concise", label: "Concise", description: "Brief and to the point", emoji: "✂️" },
];

export default function EmailToneAdjuster() {
  const [originalEmail, setOriginalEmail] = useState("");
  const [adjustedEmail, setAdjustedEmail] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [emailLog, setEmailLog] = useState([]);
  const [showLog, setShowLog] = useState(false);
  const [selectedLogEntry, setSelectedLogEntry] = useState(null);

  const adjustTone = async () => {
    if (!originalEmail.trim()) {
      setError("Please enter an email to adjust");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAdjustedEmail("");

    const tone = toneOptions.find((t) => t.id === selectedTone);

    try {
      const response = await fetch("/api/adjust-tone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: originalEmail,
          tone: tone.label,
          toneDescription: tone.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "API request failed");
      }

      setAdjustedEmail(data.adjustedEmail);

      // Add to log
      const logEntry = {
        id: Date.now(),
        timestamp: new Date(),
        original: originalEmail,
        adjusted: data.adjustedEmail,
        tone: tone,
      };
      setEmailLog((prev) => [logEntry, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to adjust email tone. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text || adjustedEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  const clearAll = () => {
    setOriginalEmail("");
    setAdjustedEmail("");
    setError(null);
  };

  const loadFromLog = (entry) => {
    setOriginalEmail(entry.original);
    setAdjustedEmail(entry.adjusted);
    setSelectedTone(entry.tone.id);
    setSelectedLogEntry(null);
    setShowLog(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">✉️ Email Tone Adjuster</h1>
          <p className="text-slate-400">Paste your email, pick a tone, and let AI rewrite it for you</p>
        </div>

        {/* Log Toggle Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowLog(!showLog)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              showLog ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            <span>📋</span>
            <span>Session Log</span>
            {emailLog.length > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {emailLog.length}
              </span>
            )}
          </button>
        </div>

        {/* Log Panel */}
        {showLog && (
          <div className="mb-6 bg-slate-800/70 border border-slate-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Session Log</h2>
              {emailLog.length > 0 && (
                <button
                  onClick={() => setEmailLog([])}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Clear Log
                </button>
              )}
            </div>

            {emailLog.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <p>No emails adjusted yet this session</p>
                <p className="text-sm mt-1">Your adjustments will appear here</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {emailLog.map((entry) => (
                  <div key={entry.id} className="border-b border-slate-700 last:border-b-0">
                    {/* Log Entry Header */}
                    <button
                      onClick={() =>
                        setSelectedLogEntry(selectedLogEntry === entry.id ? null : entry.id)
                      }
                      className="w-full p-4 text-left hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{entry.tone.emoji}</span>
                          <div>
                            <p className="text-slate-200 text-sm font-medium">
                              {truncateText(entry.original)}
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              → {entry.tone.label} • {formatTime(entry.timestamp)}
                            </p>
                          </div>
                        </div>
                        <span className="text-slate-500">
                          {selectedLogEntry === entry.id ? "▼" : "▶"}
                        </span>
                      </div>
                    </button>

                    {/* Expanded Log Entry */}
                    {selectedLogEntry === entry.id && (
                      <div className="px-4 pb-4 bg-slate-800/50">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-2">Original</p>
                            <div className="p-3 bg-slate-900/50 rounded text-slate-300 text-sm max-h-32 overflow-y-auto whitespace-pre-wrap">
                              {entry.original}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-2">
                              Adjusted ({entry.tone.label})
                            </p>
                            <div className="p-3 bg-slate-900/50 rounded text-slate-300 text-sm max-h-32 overflow-y-auto whitespace-pre-wrap">
                              {entry.adjusted}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => loadFromLog(entry)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                          >
                            Load into Editor
                          </button>
                          <button
                            onClick={() => copyToClipboard(entry.adjusted)}
                            className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded transition-colors"
                          >
                            {copied ? "✓ Copied!" : "Copy Adjusted"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tone Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">Select Tone</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {toneOptions.map((tone) => (
              <button
                key={tone.id}
                onClick={() => setSelectedTone(tone.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedTone === tone.id
                    ? "border-blue-500 bg-blue-500/20 text-white"
                    : "border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{tone.emoji}</span>
                  <span className="font-medium">{tone.label}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{tone.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-slate-300">Original Email</label>
              {originalEmail && (
                <button onClick={clearAll} className="text-xs text-slate-400 hover:text-slate-200">
                  Clear all
                </button>
              )}
            </div>
            <textarea
              value={originalEmail}
              onChange={(e) => setOriginalEmail(e.target.value)}
              placeholder="Paste your email here..."
              className="w-full h-64 p-4 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <button
              onClick={adjustTone}
              disabled={isLoading || !originalEmail.trim()}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Adjusting tone...</span>
                </>
              ) : (
                <>
                  <span>🎨</span>
                  <span>Adjust Tone</span>
                </>
              )}
            </button>
          </div>

          {/* Output */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-slate-300">
                Adjusted Email
                {adjustedEmail && (
                  <span className="ml-2 text-xs text-blue-400">
                    ({toneOptions.find((t) => t.id === selectedTone)?.label})
                  </span>
                )}
              </label>
              {adjustedEmail && (
                <button
                  onClick={() => copyToClipboard()}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
              )}
            </div>
            <div className="w-full h-64 p-4 bg-slate-800/50 border border-slate-600 rounded-lg overflow-auto">
              {adjustedEmail ? (
                <p className="text-slate-200 whitespace-pre-wrap">{adjustedEmail}</p>
              ) : (
                <p className="text-slate-500 italic">
                  {isLoading ? "Rewriting your email..." : "Your adjusted email will appear here"}
                </p>
              )}
            </div>
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Powered by Claude AI • Your emails are stored in session memory only</p>
        </div>
      </div>
    </div>
  );
}
