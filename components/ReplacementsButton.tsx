import * as React from 'react';
import {
  ArrowPathRoundedSquareIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { SettingsContext } from 'pages/_app';

const ReplacementsButton = () => {
  const { setBottomBarExpanded } = React.useContext(SettingsContext);
  const handleLinkClick = () => {
    if (setBottomBarExpanded) setBottomBarExpanded(false);
  };
  return (
    <div className="mb-8">
      <Link href="/replacements" passHref legacyBehavior prefetch={false}>
        <a
          className="bg-gray-600 text-white w-full px-4 py-3 flex justify-between items-center transition-all duration-75 rounded-lg"
          onClick={() => handleLinkClick()}
          onKeyPress={() => handleLinkClick()}
          role="button"
        >
          <div className="flex items-center">
            <ArrowPathRoundedSquareIcon className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-medium">Lista zastępstw</h2>
          </div>
          <ArrowLongRightIcon className="h-5 w-5" />
        </a>
      </Link>
    </div>
  );
};

export default ReplacementsButton;
