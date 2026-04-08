import React from 'react';

const QuoteSection = ({ text, author }) => {
  return (
    <section className="py-32 bg-white text-center">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10 opacity-20">
          <svg className="w-12 h-12 mx-auto fill-slate-900" viewBox="0 0 24 24">
            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V9C10.017 6.79086 11.8079 5 14.017 5H19.017C21.2261 5 23.017 6.79086 23.017 9V15C23.017 18.3137 20.3307 21 17.017 21H14.017ZM1.017 21L1.017 18C1.017 16.8954 1.91243 16 3.017 16H6.017C6.56928 16 7.017 15.5523 7.017 15V9C7.017 8.44772 6.56928 8 6.017 8H2.017C1.46472 8 1.017 8.44772 1.017 9V12C1.017 12.5523 0.569282 13 0.017 13H-1.983C-2.53528 13 -3.017 12.5523 -3.017 12V9C-3.017 6.79086 -1.22614 5 1.017 5H6.017C8.22614 5 10.017 6.79086 10.017 9V15C10.017 18.3137 7.33072 21 4.017 21H1.017Z" />
          </svg>
        </div>
        <h3 className="text-2xl md:text-4xl font-serif text-slate-900 mb-8 italic leading-relaxed">
          "{text}"
        </h3>
        <div className="flex items-center justify-center gap-4">
          <div className="w-10 h-[1px] bg-pc-gold"></div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">{author}</span>
          <div className="w-10 h-[1px] bg-pc-gold"></div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;