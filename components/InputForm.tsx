import React from 'react';
import { Language, SummarizationStyle, AIResult } from '../types';
import { LANGUAGES, STYLES, SUMMARY_LENGTHS } from '../constants';

interface InputFormProps {
  url: string;
  setUrl: (url: string) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  style: SummarizationStyle;
  setStyle: (style: SummarizationStyle) => void;
  selectedLengths: (keyof AIResult['summaries'])[];
  setSelectedLengths: (value: React.SetStateAction<(keyof AIResult['summaries'])[]>) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const InputForm: React.FC<InputFormProps> = ({
  url,
  setUrl,
  language,
  setLanguage,
  style,
  setStyle,
  selectedLengths,
  setSelectedLengths,
  isLoading,
  handleSubmit,
}) => {
  const handleLengthChange = (key: keyof AIResult['summaries']) => {
    setSelectedLengths(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const isSubmitDisabled = isLoading || selectedLengths.length === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-2">
          Article URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/your-article"
          required
          className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-slate-300 mb-2">
            Output Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            disabled={isLoading}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="style" className="block text-sm font-medium text-slate-300 mb-2">
            Summarization Style
          </label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value as SummarizationStyle)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            disabled={isLoading}
          >
            {STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
            Summary Lengths
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SUMMARY_LENGTHS.map(({ key, label }) => (
                <label key={key} className={`flex items-center space-x-3 p-3 rounded-md border transition-colors ${selectedLengths.includes(key) ? 'bg-sky-900/50 border-sky-700' : 'bg-slate-800 border-slate-600'} ${isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-slate-700'}`}>
                    <input
                        type="checkbox"
                        checked={selectedLengths.includes(key)}
                        onChange={() => handleLengthChange(key)}
                        className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-brand-primary focus:ring-brand-primary focus:ring-offset-slate-800"
                        disabled={isLoading}
                    />
                    <span className="text-sm text-slate-300">{label}</span>
                </label>
            ))}
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="w-full flex justify-center items-center py-3 px-4 bg-brand-primary hover:bg-sky-600 text-white font-bold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-brand-primary disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating...' : (selectedLengths.length === 0 ? 'Select at least one length' : 'Generate Content')}
      </button>
    </form>
  );
};

export default InputForm;