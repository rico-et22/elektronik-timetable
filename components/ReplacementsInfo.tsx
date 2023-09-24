import * as React from 'react';

const ReplacementsInfo = ({ date }: { date: Date }) => (
  <div className="px-4 lg:px-10 mt-6 mb-4 flex justify-between gap-3 text-sm sm:text-base">
    <p>
      Dzień: {date.toLocaleDateString('pl-PL')} (
      {date.toLocaleDateString('pl-PL', { weekday: 'long' })})
    </p>
    <p>
      Dane z{' '}
      <a
        href="https://www.elektronik.rzeszow.pl/tv"
        target="_blank"
        rel="noopener noreferrer"
        className="text-elektronik-blue"
      >
        systemu ZSE TV
      </a>
    </p>
  </div>
);

export default ReplacementsInfo;
