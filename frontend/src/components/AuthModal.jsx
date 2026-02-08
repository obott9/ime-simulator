import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../contexts/AuthContext';

export default function AuthModal({ onClose }) {
  const { t } = useTranslation();
  const { signIn, signUp, signInWithGitHub } = useAuthContext();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        setSignUpSuccess(true);
      } else {
        await signIn(email, password);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHub = async () => {
    setError('');
    try {
      await signInWithGitHub();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">
            {isSignUp ? t('auth.signUp') : t('auth.signIn')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {signUpSuccess ? (
          <div className="text-center py-4">
            <p className="text-green-400 text-sm">{t('auth.checkEmail')}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer text-sm"
            >
              {t('auth.close')}
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleGitHub}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm hover:bg-gray-700 transition-colors cursor-pointer mb-4"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              {t('auth.continueWithGitHub')}
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-xs text-gray-500">{t('auth.or')}</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.email')}
                required
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.password')}
                required
                minLength={6}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {loading
                  ? '...'
                  : isSignUp
                    ? t('auth.signUp')
                    : t('auth.signIn')}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-500">
              {isSignUp ? t('auth.hasAccount') : t('auth.noAccount')}{' '}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                {isSignUp ? t('auth.signIn') : t('auth.signUp')}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
