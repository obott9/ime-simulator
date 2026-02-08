import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const UI_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'zh-Hant', label: '繁體中文' },
  { code: 'zh-Hans', label: '简体中文' },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const { user, loading, signOut } = useAuthContext();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-white">
            {t('header.title')}
            <span className="ml-2 text-xs font-normal text-gray-400">{t('header.subtitle')}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="bg-gray-800 text-gray-300 text-sm rounded px-2 py-1 border border-gray-700 cursor-pointer"
          >
            {UI_LANGUAGES.map(({ code, label }) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
          <a
            href="https://obott9.github.io/imeindicatorclock.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {t('header.productPage')}
          </a>

          {!loading && (
            user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 max-w-[120px] truncate">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  {t('auth.signOutButton')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors cursor-pointer"
              >
                {t('auth.signIn')}
              </button>
            )
          )}
        </div>
      </header>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
