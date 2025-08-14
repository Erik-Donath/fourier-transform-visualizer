import PropTypes from 'prop-types';
import './ModeSelector.css';

function ModeSelector({ mode, onModeChange, children }) {
  const modes = [
    {
      id: 'components',
      label: 'Komponenten-Modus',
      description: 'Erstelle Signale aus Frequenzkomponenten',
      icon: '🔧',
    },
    {
      id: 'expression',
      label: 'Formel-Modus', 
      description: 'Analysiere mathematische Ausdrücke',
      icon: '📐',
    },
  ];

  return (
    <div className="mode-selector-container">
      <div className="mode-selector">
        {modes.map((modeOption) => (
          <button
            key={modeOption.id}
            className={`mode-button ${mode === modeOption.id ? 'active' : ''}`}
            onClick={() => onModeChange(modeOption.id)}
            aria-pressed={mode === modeOption.id}
          >
            <span className="mode-icon">{modeOption.icon}</span>
            <div className="mode-text">
              <span className="mode-label">{modeOption.label}</span>
              <span className="mode-description">{modeOption.description}</span>
            </div>
          </button>
        ))}
      </div>
      
      {children && (
        <div className="mode-content">
          {children}
        </div>
      )}
    </div>
  );
}

ModeSelector.propTypes = {
  mode: PropTypes.string.isRequired,
  onModeChange: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default ModeSelector;
