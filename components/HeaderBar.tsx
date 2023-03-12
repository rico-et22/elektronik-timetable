import * as React from 'react';
import InlineSVG from 'react-inlinesvg';
import ShortHoursSwitcher from 'components/ShortHoursSwitcher';

const HeaderBar = ({ hasReplacements }: { hasReplacements: boolean }) => (
  <div className="w-full bg-elektronik-red p-4 relative flex items-center justify-between z-10 filter drop-shadow-md dark:drop-shadow-none">
    <div className="flex items-center flex-shrink-0">
      <div className="bg-white flex items-center justify-center p-1 mr-3 rounded">
        <InlineSVG src="/logo-zse-wektor.svg" className="w-8 h-8" />
      </div>
      <h1 className="text-white text-xl text-center m-0">
        Plan lekcji <span className="italic font-bold">express</span>
      </h1>
    </div>
    {!hasReplacements && (
      <div className="lg:hidden">
        <ShortHoursSwitcher small />
      </div>
    )}
  </div>
);

export default HeaderBar;
