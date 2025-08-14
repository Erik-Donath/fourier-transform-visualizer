import { useState, useMemo, useCallback } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Utilities
import {
  SIGNAL_CONFIG,
  generateSignalFromComponents,
  generateSignalFromExpression,
  computeDFT,
  extractSignificantFrequencies,
  reconstructExpression,
  generateTimeData,
  generateFrequencyData,
  calculateOptimalFrequencyRange,
  sanitizeFrequencyComponent,
} from './utils/fourier';

// Components
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import FrequencyComponentsEditor from './components/FrequencyComponentsEditor';
import ExpressionEditor from './components/ExpressionEditor';
import SignalCharts from './components/SignalCharts';
import SpectrumAnalysis from './components/SpectrumAnalysis';
import Footer from './components/Footer';

// Styles
import './App.css';

const {
  DEFAULT_SAMPLE_COUNT,
  DEFAULT_X_START,
  DEFAULT_X_END,
} = SIGNAL_CONFIG;

function App() {
  // Core state
  const [mode, setMode] = useState('components');
  const [timeRange, setTimeRange] = useState({
    start: DEFAULT_X_START,
    end: DEFAULT_X_END,
  });

  // Component mode state
  const [frequencyComponents, setFrequencyComponents] = useState([
    { freq: 2, amp: 1, phase: 0 },
    { freq: 5, amp: 0.5, phase: 0 },
  ]);

  // Expression mode state
  const [expression, setExpression] = useState('sin(2*pi*2*t) + 0.33*cos(2*pi*7*t + 2)');
  const [expressionError, setExpressionError] = useState(null);

  // Generate signal based on current mode
  const signal = useMemo(() => {
    try {
      if (mode === 'expression') {
        const result = generateSignalFromExpression(
          DEFAULT_SAMPLE_COUNT,
          expression,
          timeRange.start,
          timeRange.end
        );
        setExpressionError(null);
        return result;
      } else {
        setExpressionError(null);
        return generateSignalFromComponents(
          DEFAULT_SAMPLE_COUNT,
          frequencyComponents,
          timeRange.start,
          timeRange.end
        );
      }
    } catch (error) {
      setExpressionError(error.message);
      return new Array(DEFAULT_SAMPLE_COUNT).fill(0);
    }
  }, [mode, expression, frequencyComponents, timeRange]);

  // Compute frequency spectrum
  const spectrum = useMemo(() => computeDFT(signal), [signal]);

  // Calculate sample rate and generate chart data
  const sampleRate = useMemo(() => 
    DEFAULT_SAMPLE_COUNT / (timeRange.end - timeRange.start), 
    [timeRange]
  );

  const timeData = useMemo(() => 
    generateTimeData(signal, timeRange.start, timeRange.end), 
    [signal, timeRange]
  );

  const frequencyData = useMemo(() => 
    generateFrequencyData(spectrum, sampleRate), 
    [spectrum, sampleRate]
  );

  // Calculate optimal frequency range for display
  const frequencyRange = useMemo(() => 
    calculateOptimalFrequencyRange(frequencyData, sampleRate / 2), 
    [frequencyData, sampleRate]
  );

  // Extract significant frequencies for analysis
  const significantFrequencies = useMemo(() => 
    extractSignificantFrequencies(spectrum, sampleRate, 0.05), 
    [spectrum, sampleRate]
  );

  // Reconstruct expression from spectrum
  const reconstructedExpression = useMemo(() => 
    reconstructExpression(significantFrequencies, 0.05), 
    [significantFrequencies]
  );

  // Event handlers
  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
    setExpressionError(null);
  }, []);

  const handleTimeRangeChange = useCallback((newRange) => {
    if (newRange.start < newRange.end) {
      setTimeRange(newRange);
    }
  }, []);

  const handleFrequencyComponentUpdate = useCallback((index, field, value) => {
    setFrequencyComponents(prev => 
      prev.map((component, i) => 
        i === index 
          ? sanitizeFrequencyComponent({ ...component, [field]: value })
          : component
      )
    );
  }, []);

  const handleAddFrequencyComponent = useCallback(() => {
    setFrequencyComponents(prev => [
      ...prev,
      { freq: 1, amp: 1, phase: 0 }
    ]);
  }, []);

  const handleRemoveFrequencyComponent = useCallback((index) => {
    setFrequencyComponents(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleExpressionChange = useCallback((newExpression) => {
    setExpression(newExpression);
    setExpressionError(null);
  }, []);

  // Calculate highlight area for time chart
  const highlightArea = useMemo(() => {
    const duration = timeRange.end - timeRange.start;
    return {
      start: timeRange.start + duration * 0.2,
      end: timeRange.start + duration * 0.6,
    };
  }, [timeRange]);

  return (
    <div className="app">
      <Header />
      
      <main className="app-main">
        {/* Introduction Section */}
        <section className="intro-section">
          <div className="math-explanation">
            <h3>Die Fourier-Transformation verstehen</h3>
            <p>
              Die Fourier-Transformation zerlegt jedes periodische Signal in seine 
              Frequenzkomponenten. Jede komplexe Wellenform kann als Summe einfacher 
              Sinus- und Kosinuswellen mit unterschiedlichen Frequenzen, Amplituden und Phasen dargestellt werden.
            </p>
            
            <div className="mode-explanation">
              <h4>Zwei Analysemodi:</h4>
              <ul>
                <li>
                  <strong>Komponenten-Modus:</strong> Erstelle Signale durch Kombination einzelner 
                  Frequenzkomponenten mit einstellbaren Parametern
                </li>
                <li>
                  <strong>Formel-Modus:</strong> Gib mathematische Formeln ein und 
                  analysiere deren Frequenzinhalt
                </li>
              </ul>
            </div>

            <div className="formula-section">
              <p><strong>Die Diskrete Fourier-Transformation (DFT):</strong></p>
              <BlockMath math="X_k = \frac{1}{N} \sum_{n=0}^{N-1} x_n \cdot e^{-2\pi i kn / N}" />
              <p className="formula-description">
                Wobei <em>X<sub>k</sub></em> die Frequenzkomponente bei Frequenz <em>k</em> darstellt 
                und <em>x<sub>n</sub></em> die Zeitbereichsabtastwerte sind.
              </p>
            </div>
          </div>
        </section>

        {/* Controls Section */}
        <section className="controls-section">
          <ModeSelector 
            mode={mode} 
            onModeChange={handleModeChange}
          >
            {mode === 'components' && (
              <FrequencyComponentsEditor
                components={frequencyComponents}
                onUpdateComponent={handleFrequencyComponentUpdate}
                onAddComponent={handleAddFrequencyComponent}
                onRemoveComponent={handleRemoveFrequencyComponent}
              />
            )}

            {mode === 'expression' && (
              <ExpressionEditor
                expression={expression}
                onExpressionChange={handleExpressionChange}
                error={expressionError}
              />
            )}
          </ModeSelector>
        </section>

        {/* Visualization Section */}
        <section className="visualization-section">
          <SignalCharts
            timeData={timeData}
            frequencyData={frequencyData}
            timeRange={timeRange}
            frequencyRange={frequencyRange}
            highlightArea={highlightArea}
            onTimeRangeChange={handleTimeRangeChange}
          />

          <SpectrumAnalysis
            significantFrequencies={significantFrequencies}
            reconstructedExpression={reconstructedExpression}
            sampleRate={sampleRate}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
