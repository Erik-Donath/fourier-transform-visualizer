import PropTypes from 'prop-types';
import { BlockMath } from 'react-katex';
import './SpectrumAnalysis.css';

function SpectrumAnalysis({
  significantFrequencies, 
  reconstructedExpression, 
  sampleRate 
}) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Spektrum-Analyse</h3>
        <span className="status-indicator">
          Abtastrate: {sampleRate.toFixed(1)} Hz
        </span>
      </div>
      <div className="card-content">
        <div className="spectrum-analysis">
          {/* Reconstructed Expression */}
          <div className="analysis-section">
            <h4>Rekonstruierter mathematischer Ausdruck</h4>
            <div className="reconstructed-expression">
              {reconstructedExpression && reconstructedExpression !== '0' ? (
                <BlockMath math={`f(t) = ${reconstructedExpression}`} />
              ) : (
                <p className="no-signal">Keine signifikanten Frequenzkomponenten erkannt</p>
              )}
            </div>
          </div>

          {/* Frequency Components Table */}
          <div className="analysis-section">
            <h4>Erkannte Frequenzkomponenten</h4>
            {significantFrequencies.length > 0 ? (
              <div className="frequency-table-container">
                <table className="frequency-table">
                  <thead>
                    <tr>
                      <th>Frequenz (Hz)</th>
                      <th>Amplitude</th>
                      <th>Phase (rad)</th>
                      <th>Phase (°)</th>
                      <th>Leistung (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {significantFrequencies.map((freq, index) => {
                      const totalPower = significantFrequencies.reduce((sum, f) => sum + f.amplitude * f.amplitude, 0);
                      const power = ((freq.amplitude * freq.amplitude) / totalPower) * 100;
                      const phaseDegrees = (freq.phase * 180 / Math.PI) % 360;
                      
                      return (
                        <tr key={index}>
                          <td>{freq.frequency.toFixed(2)}</td>
                          <td>{freq.amplitude.toFixed(4)}</td>
                          <td>{freq.phase.toFixed(3)}</td>
                          <td>{phaseDegrees.toFixed(1)}°</td>
                          <td>
                            <div className="power-cell">
                              <span>{power.toFixed(1)}%</span>
                              <div className="power-bar">
                                <div 
                                  className="power-fill" 
                                  style={{ width: `${power}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-components">Keine signifikanten Frequenzkomponenten gefunden</p>
            )}
          </div>

          {/* Analysis Summary */}
          <div className="analysis-section">
            <h4>Analyse-Zusammenfassung</h4>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Gesamte Komponenten:</span>
                <span className="stat-value">{significantFrequencies.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Grundfrequenz:</span>
                <span className="stat-value">
                  {significantFrequencies.length > 0 
                    ? `${significantFrequencies[0].frequency.toFixed(2)} Hz`
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Frequenzbereich:</span>
                <span className="stat-value">
                  {significantFrequencies.length > 0 
                    ? `0 - ${Math.max(...significantFrequencies.map(f => f.frequency)).toFixed(2)} Hz`
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Nyquist-Frequenz:</span>
                <span className="stat-value">{(sampleRate / 2).toFixed(1)} Hz</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

SpectrumAnalysis.propTypes = {
  significantFrequencies: PropTypes.arrayOf(
    PropTypes.shape({
      frequency: PropTypes.number.isRequired,
      amplitude: PropTypes.number.isRequired,
      phase: PropTypes.number.isRequired,
    })
  ).isRequired,
  reconstructedExpression: PropTypes.string.isRequired,
  sampleRate: PropTypes.number.isRequired,
};

export default SpectrumAnalysis;
