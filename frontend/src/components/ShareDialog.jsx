import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ShareDialog({ shareCode, onClose }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}${window.location.pathname}?share=${shareCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{t('share.title')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-3">{t('share.description')}</p>

        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm truncate"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition-colors cursor-pointer shrink-0"
          >
            {copied ? t('share.copied') : t('share.copy')}
          </button>
        </div>
      </div>
    </div>
  );
}
