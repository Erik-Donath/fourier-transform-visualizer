import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import './SignalCharts.css';

function SignalCharts({ 
  timeData, 
  frequencyData, 
  timeRange, 
  frequencyRange, 
  highlightArea,
  onTimeRangeChange
}) {
  const maxAmplitude = Math.max(...frequencyData.map(f => f.amplitude), 1);

  const handleStartChange = (value) => {
    const newStart = parseFloat(value);
    if (newStart < timeRange.end) {
      onTimeRangeChange({ ...timeRange, start: newStart });
    }
  };

  const handleEndChange = (value) => {
    const newEnd = parseFloat(value);
    if (newEnd > timeRange.start) {
      onTimeRangeChange({ ...timeRange, end: newEnd });
    }
  };

  const presets = [
    { label: '0 to 1s', start: 0, end: 1 },
    { label: '0 to 2s', start: 0, end: 2 },
    { label: '0 to 4s', start: 0, end: 4 },
    { label: '-π to π', start: -Math.PI, end: Math.PI },
    { label: '0 to 2π', start: 0, end: 2 * Math.PI },
  ];

  const handlePresetClick = (preset) => {
    onTimeRangeChange({ start: preset.start, end: preset.end });
  };

  return (
    <div className="signal-charts">
      {/* Time Range Controls */}
      <div className="time-range-section">
        <div className="time-range-header">
          <h3>Zeitbereich</h3>
          <span className="duration-indicator">
            Dauer: {(timeRange.end - timeRange.start).toFixed(3)}s
          </span>
        </div>
        <div className="time-range-controls">
          <div className="time-inputs">
            <div className="input-group">
              <label htmlFor="time-start">Startzeit</label>
              <div className="input-wrapper">
                <input
                  id="time-start"
                  type="number"
                  value={timeRange.start}
                  onChange={(e) => handleStartChange(e.target.value)}
                  step="0.1"
                  className="time-input"
                />
                <span className="input-unit">s</span>
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="time-end">Endzeit</label>
              <div className="input-wrapper">
                <input
                  id="time-end"
                  type="number"
                  value={timeRange.end}
                  onChange={(e) => handleEndChange(e.target.value)}
                  step="0.1"
                  className="time-input"
                />
                <span className="input-unit">s</span>
              </div>
            </div>
          </div>

          <div className="time-presets">
            <span className="presets-label">Schnellauswahl:</span>
            <div className="preset-buttons">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  className="preset-button"
                  onClick={() => handlePresetClick(preset)}
                  title={`Set time range to ${preset.start} - ${preset.end}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-header">
        <h3>Signal-Visualisierung</h3>
      </div>
      <div className="charts-container">
        {/* Time Domain Chart */}
        <div className="chart-section">
          <h4 className="chart-title">Zeitbereich-Signal</h4>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeData}>
                <XAxis 
                  dataKey="time" 
                  domain={[timeRange.start, timeRange.end]}
                  type="number"
                  label={{ value: 'Zeit (s)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  domain={[-3, 3]}
                  label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary-color)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <CartesianGrid stroke="#eaeaea" strokeDasharray="3 3" />
                <Tooltip 
                  formatter={(value) => [value.toFixed(4), 'Amplitude']}
                  labelFormatter={(label) => `Zeit: ${label.toFixed(4)}s`}
                />
                {highlightArea && (
                  <ReferenceArea
                    x1={highlightArea.start}
                    x2={highlightArea.end}
                    strokeOpacity={0.3}
                    fill="var(--primary-color)"
                    fillOpacity={0.1}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Frequency Domain Chart */}
        <div className="chart-section">
          <h4 className="chart-title">Frequenzbereich-Spektrum</h4>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={frequencyData}>
                <XAxis
                  dataKey="frequency"
                  domain={[frequencyRange.min, frequencyRange.max]}
                  type="number"
                  label={{ value: 'Frequenz (Hz)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  domain={[0, maxAmplitude * 1.1]}
                  label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }}
                />
                <Bar 
                  dataKey="amplitude" 
                  fill="var(--secondary-color)"
                  isAnimationActive={false}
                />
                <CartesianGrid stroke="#eaeaea" strokeDasharray="3 3" />
                <Tooltip 
                  formatter={(value) => [value.toFixed(4), 'Amplitude']}
                  labelFormatter={(label) => `Frequenz: ${label.toFixed(2)} Hz`}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

SignalCharts.propTypes = {
  timeData: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  frequencyData: PropTypes.arrayOf(
    PropTypes.shape({
      frequency: PropTypes.number.isRequired,
      amplitude: PropTypes.number.isRequired,
    })
  ).isRequired,
  timeRange: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
  }).isRequired,
  frequencyRange: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }).isRequired,
  highlightArea: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
  }),
  onTimeRangeChange: PropTypes.func.isRequired,
};

export default SignalCharts;
