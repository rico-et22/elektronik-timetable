import * as React from 'react';

const ReplacementsInfo = ({ date }: { date: string }) => (
  <div className="px-4 lg:px-10 mt-6 mb-4 flex justify-between text-sm sm:text-base">
    <p>{date}</p>
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
