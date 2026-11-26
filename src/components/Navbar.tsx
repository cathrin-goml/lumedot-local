import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-20">
      <div className="w-full px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        <a
          href="https://lumedot.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5"
        >
          <img
            src="https://avatars.githubusercontent.com/u/174046562?s=200&v=4"
            width={30}
            height={30}
            alt="lumedot logo"
            className="rounded-lg"
          />
          <span className="text-xl font-semibold tracking-tight text-slate-900">
            lumedot
          </span>
        </a>
      </div>
    </header>
  );
};
