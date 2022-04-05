import * as React from "react";
import InlineSVG from "react-inlinesvg";

const HeaderBar = () => {
  return (
    <div className="w-full bg-elektronik-red p-4 flex items-center flex-shrink-0 relative z-10 filter drop-shadow-md">
      <div className="bg-white flex items-center justify-center p-1 mr-3 rounded">
        <InlineSVG src="/logo-zse-wektor.svg" className="w-8 h-8" />
      </div>
      <h1 className="text-white text-xl text-center m-0">Plan lekcji <span className="italic font-bold">express</span></h1>
    </div>
  );
};

export default HeaderBar;
