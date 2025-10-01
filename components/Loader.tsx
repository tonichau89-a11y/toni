
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 my-8">
        <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-brand-primary border-t-transparent"></div>
        <p className="text-slate-300">AI is thinking... this may take a moment.</p>
    </div>
  );
};

export default Loader;
