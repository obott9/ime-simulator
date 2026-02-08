import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="flex items-center justify-center gap-4 px-6 py-3 bg-gray-900 border-t border-gray-800 text-sm text-gray-500">
      <span>&copy; {new Date().getFullYear()} obott9</span>
      <span className="text-gray-700">|</span>
      <a
        href="https://obott9.github.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gray-300 transition-colors"
      >
        {t('footer.portfolio')}
      </a>
      <span className="text-gray-700">|</span>
      <a
        href="https://github.com/obott9"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gray-300 transition-colors"
      >
        GitHub
      </a>
    </footer>
  );
}
