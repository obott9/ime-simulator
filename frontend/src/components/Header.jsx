export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-white">
          IME Indicator Clock
          <span className="ml-2 text-xs font-normal text-gray-400">Simulator</span>
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <a
          href="https://obott9.github.io/imeindicatorclock.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Product Page
        </a>
      </div>
    </header>
  );
}
