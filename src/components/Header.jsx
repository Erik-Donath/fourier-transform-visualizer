import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-brand">
          <img 
            src="/icon.svg" 
            alt="Fourier Transform Icon" 
            className="header-icon"
            width="48"
            height="48"
          />
          <div className="header-text">
            <h1 className="header-title">Fourier-Transformation Visualisierer</h1>
            <p className="header-subtitle">Interaktive Signalanalyse & Frequenzbereich-Erkundung</p>
          </div>
        </div>
        
        <nav className="header-nav" aria-label="Main navigation">
          <a 
            href="https://github.com/Erik-Donath/fourier-transformation-visualisation" 
            target="_blank" 
            rel="noopener noreferrer"
            className="nav-link"
            aria-label="View source code on GitHub"
          >
            <img 
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
              alt="GitHub" 
              className="nav-icon github-icon"
              width="20"
              height="20"
            />
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
