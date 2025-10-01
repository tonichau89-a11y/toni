import React, { useState, useCallback } from 'react';
import { AIResult } from '../types';
import { SUMMARY_LENGTHS } from '../constants';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';

interface ResultsDisplayProps {
  result: AIResult;
}

const ResultCard: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="bg-slate-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700">
        <div className="px-6 py-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-sky-300">{title}</h3>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [textToCopy]);

    return (
        <button
            onClick={handleCopy}
            className={`flex items-center gap-2 text-sm px-3 py-1 rounded-md transition ${
                copied 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-600 hover:bg-slate-500 text-slate-200'
            }`}
        >
            {copied ? <CheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
        </button>
    );
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const generatedSummaries = SUMMARY_LENGTHS.filter(({ key }) => result.summaries[key]);

  return (
    <div className="space-y-8 mt-12">
      {generatedSummaries.length > 0 && (
        <ResultCard title="Generated Summaries">
          <div className="space-y-6">
            {generatedSummaries.map(({ key, label }) => (
              <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-slate-300">{label}</h4>
                      <CopyButton textToCopy={result.summaries[key]!} />
                  </div>
                  <p className="text-slate-400 bg-slate-900/50 p-4 rounded-md border border-slate-700 whitespace-pre-wrap">
                      {result.summaries[key]}
                  </p>
              </div>
            ))}
          </div>
        </ResultCard>
      )}

      <ResultCard title="Suggested Titles">
        <ul className="space-y-3">
          {result.titles.map((title, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-sky-400 mt-1">&#10148;</span>
              <span className="flex-1 text-slate-300">{title}</span>
            </li>
          ))}
        </ul>
      </ResultCard>

      <ResultCard title="Suggested Tags & Keywords">
        <div className="flex flex-wrap gap-3">
          {result.tags.map((tag, index) => (
            <span key={index} className="bg-brand-secondary/20 text-indigo-300 text-sm font-medium px-3 py-1 rounded-full">
              {tag.startsWith('#') ? '' : '#'}
              {tag}
            </span>
          ))}
        </div>
      </ResultCard>
    </div>
  );
};

export default ResultsDisplay;