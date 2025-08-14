import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-info">
          <p className="footer-text">
            © {currentYear} Interaktiver Fourier-Transformation Visualisierer
          </p>
          <p className="footer-tech">
            Erstellt mit React, mathjs, recharts & KaTeX
          </p>
        </div>
        
        <div className="footer-links">
          <a 
            href="https://github.com/Erik-Donath/fourier-transformation-visualisation" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            Quellcode
          </a>
          <span className="footer-separator">•</span>
          <a 
            href="https://de.wikipedia.org/wiki/Fourier-Transformation" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            Mehr erfahren
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
