import PropTypes from 'prop-types';
import './ExpressionEditor.css';

function ExpressionEditor({ expression, onExpressionChange, error }) {
  const examples = [
    'sin(2*pi*2*t) + 0.33*cos(2*pi*7*t + 2)',
    'sin(2*pi*5*t) * cos(2*pi*0.5*t)',
    '2*sin(2*pi*3*t) + sin(2*pi*6*t) + 0.5*sin(2*pi*12*t)',
    'exp(-t) * sin(2*pi*10*t)',
    'sin(2*pi*t) + sin(2*pi*1.5*t) + sin(2*pi*2*t)',
  ];

  const handleExampleClick = (example) => {
    onExpressionChange(example);
  };

  return (
    <div className="expression-editor">
      <div className="editor-header">
        <h3 className="editor-title">Mathematischer Ausdruck</h3>
        {error && (
          <span className="status-indicator error">
            Ungültiger Ausdruck
          </span>
        )}
      </div>
      
      <div className="expression-input-group">
        <label htmlFor="expression-input">
          Gib eine mathematische Funktion der Zeit (t) ein:
        </label>
        <textarea
          id="expression-input"
          className={`expression-input ${error ? 'error' : ''}`}
          value={expression}
          onChange={(e) => onExpressionChange(e.target.value)}
          placeholder="z.B. sin(2*pi*2*t) + 0.33*cos(2*pi*7*t + 2)"
          rows="3"
        />
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      <div className="expression-help">
        <h4>Verfügbare Funktionen & Konstanten:</h4>
        <div className="function-list">
          <span className="function-item"><code>sin(x)</code></span>
          <span className="function-item"><code>cos(x)</code></span>
          <span className="function-item"><code>pi</code></span>
          <span className="function-item"><code>exp(x)</code></span>
          <span className="function-item"><code>log(x)</code></span>
          <span className="function-item"><code>sqrt(x)</code></span>
          <span className="function-item"><code>abs(x)</code></span>
          <span className="function-item"><code>pow(x,y)</code></span>
        </div>
      </div>

      <div className="expression-examples">
        <h4>Beispiel-Ausdrücke:</h4>
        <div className="example-buttons">
          {examples.map((example, index) => (
            <button
              key={index}
              className="example-button"
              onClick={() => handleExampleClick(example)}
              title={`Beispiel laden: ${example}`}
            >
              <code>{example}</code>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

ExpressionEditor.propTypes = {
  expression: PropTypes.string.isRequired,
  onExpressionChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default ExpressionEditor;
