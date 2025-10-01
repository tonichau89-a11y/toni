import React, { useState } from 'react';
import { Language, SummarizationStyle, AIResult } from './types';
import { generateContentFromUrl } from './services/geminiService';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';
import { SUMMARY_LENGTHS } from './constants';

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [style, setStyle] = useState<SummarizationStyle>(SummarizationStyle.PROFESSIONAL);
  const [selectedLengths, setSelectedLengths] = useState<(keyof AIResult['summaries'])[]>(SUMMARY_LENGTHS.map(s => s.key));
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLengths.length === 0) {
        setError("Please select at least one summary length.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedResult = await generateContentFromUrl(url, language, style, selectedLengths);
      setResult(generatedResult);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-4xl mx-auto">
        <header className="text-center my-8 md:my-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
            AI Content Optimizer
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Paste an article link to instantly generate summaries, catchy titles, and social media tags in your chosen style and language.
          </p>
        </header>
        
        <div className="bg-slate-800/50 p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-sm">
          <InputForm
            url={url}
            setUrl={setUrl}
            language={language}
            setLanguage={setLanguage}
            style={style}
            setStyle={setStyle}
            selectedLengths={selectedLengths}
            setSelectedLengths={setSelectedLengths}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
          />
        </div>

        {error && (
          <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md text-center">
            <strong>Error:</strong> {error}
          </div>
        )}

        {isLoading && <Loader />}
        
        {result && <ResultsDisplay result={result} />}

      </main>
      <footer className="text-center py-8 mt-12 text-slate-500 text-sm">
        <p>Powered by Google Gemini API</p>
      </footer>
    </div>
  );
};

export default App;