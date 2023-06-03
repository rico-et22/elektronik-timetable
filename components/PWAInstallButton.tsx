import * as React from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { SettingsContext } from 'pages/_app';

const PWAInstallButton = () => {
  const { supportsPWA, promptInstall } = React.useContext(SettingsContext);

  const onClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    (promptInstall as any).prompt();
  };

  if (!supportsPWA) {
    return null;
  }

  return (
    <div className="mb-8">
      <button
        className="bg-stone-500 text-white w-full px-4 py-3 flex justify-between items-center transition-all duration-75 rounded-lg"
        type="button"
        onClick={onClick}
      >
        <div className="flex items-center">
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-medium">Zainstaluj apkę</h2>
        </div>
      </button>
    </div>
  );
};

export default PWAInstallButton;
