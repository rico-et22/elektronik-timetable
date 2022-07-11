import * as React from 'react';

const Credits = () => (
  <div>
    <p className="text-center text-xs text-gray-500 mb-4">
      Źródło danych:{' '}
      <a
        href={process.env.NEXT_PUBLIC_TIMETABLE_BASE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-elektronik-blue"
      >
        {process.env.NEXT_PUBLIC_TIMETABLE_BASE_URL}
      </a>
    </p>
    <p className="text-center text-xs text-gray-500">
      Frontend coded with ❤️ by{' '}
      <a
        href="https://kamilpawlak.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-elektronik-blue"
      >
        Kamil Pawlak
      </a>{' '}
      <br />
      <a
        href="https://github.com/rico-et22/elektronik-timetable"
        target="_blank"
        rel="noopener noreferrer"
        className="text-elektronik-blue"
      >
        GitHub (AGPLv3)
      </a>
    </p>
  </div>
);

export default Credits;
