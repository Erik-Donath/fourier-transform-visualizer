import { sin, cos, pi, compile, atan2, sqrt } from 'mathjs';

/**
 * Configuration constants for signal processing
 */
export const SIGNAL_CONFIG = {
  DEFAULT_SAMPLE_COUNT: 512,
  DEFAULT_X_START: 0,
  DEFAULT_X_END: 1,
  MAX_FREQUENCY: 50,
  MIN_AMPLITUDE_THRESHOLD: 0.01,
  PHASE_TOLERANCE: 0.1,
};

/**
 * Generate a signal from frequency components
 * @param {number} sampleCount - Number of samples
 * @param {Array} frequencies - Array of {freq, amp, phase} objects
 * @param {number} xStart - Start time
 * @param {number} xEnd - End time
 * @returns {Array} Signal samples
 */
export function generateSignalFromComponents(sampleCount, frequencies, xStart = 0, xEnd = 1) {
  const signal = new Array(sampleCount);
  const timeStep = (xEnd - xStart) / (sampleCount - 1);
  
  for (let n = 0; n < sampleCount; n++) {
    const t = xStart + n * timeStep;
    let value = 0;
    
    for (const { freq, amp, phase = 0 } of frequencies) {
      value += amp * sin(2 * pi * freq * t + phase);
    }
    
    signal[n] = value;
  }
  
  return signal;
}

/**
 * Generate a signal from a mathematical expression
 * @param {number} sampleCount - Number of samples
 * @param {string} expression - Mathematical expression with variable 't'
 * @param {number} xStart - Start time
 * @param {number} xEnd - End time
 * @returns {Array} Signal samples
 * @throws {Error} If expression is invalid
 */
export function generateSignalFromExpression(sampleCount, expression, xStart = 0, xEnd = 1) {
  let compiledExpression;
  
  try {
    compiledExpression = compile(expression);
  } catch (error) {
    throw new Error(`Invalid expression: ${error.message}`);
  }
  
  const signal = new Array(sampleCount);
  const timeStep = (xEnd - xStart) / (sampleCount - 1);
  
  for (let n = 0; n < sampleCount; n++) {
    const t = xStart + n * timeStep;
    
    try {
      const value = compiledExpression.evaluate({ 
        t, 
        pi, 
        sin, 
        cos,
        sqrt,
        abs: Math.abs,
        exp: Math.exp,
        log: Math.log,
        pow: Math.pow
      });
      
      signal[n] = typeof value === 'number' && isFinite(value) ? value : 0;
    } catch {
      signal[n] = 0; // Handle evaluation errors gracefully
    }
  }
  
  return signal;
}

/**
 * Compute the Discrete Fourier Transform (DFT) of a signal
 * @param {Array} signal - Input signal samples
 * @returns {Array} Frequency domain representation
 */
export function computeDFT(signal) {
  const N = signal.length;
  const spectrum = new Array(N);
  
  for (let k = 0; k < N; k++) {
    let real = 0;
    let imag = 0;
    
    for (let n = 0; n < N; n++) {
      const angle = (-2 * pi * k * n) / N;
      real += signal[n] * cos(angle);
      imag += signal[n] * sin(angle);
    }
    
    // Normalize and scale for single-sided spectrum
    const scale = k === 0 || k === N / 2 ? 1 / N : 2 / N;
    real *= scale;
    imag *= scale;
    
    const amplitude = sqrt(real * real + imag * imag);
    const phase = amplitude > 1e-10 ? atan2(imag, real) : 0;
    
    spectrum[k] = {
      frequency: k,
      real,
      imaginary: imag,
      amplitude,
      phase,
      magnitude: amplitude, // Alias for compatibility
    };
  }
  
  return spectrum;
}

/**
 * Extract significant frequency components from spectrum
 * @param {Array} spectrum - DFT spectrum
 * @param {number} sampleRate - Sample rate in Hz
 * @param {number} threshold - Minimum amplitude threshold (relative to max)
 * @returns {Array} Significant frequency components
 */
export function extractSignificantFrequencies(spectrum, sampleRate, threshold = 0.05) {
  const N = spectrum.length;
  const maxAmplitude = Math.max(...spectrum.map(f => f.amplitude), 1);
  const minAmplitude = threshold * maxAmplitude;
  
  return spectrum
    .slice(0, Math.floor(N / 2) + 1) // Single-sided spectrum
    .map((component, k) => ({
      ...component,
      frequency: (k * sampleRate) / N, // Convert to Hz
    }))
    .filter(component => component.amplitude > minAmplitude)
    .sort((a, b) => b.amplitude - a.amplitude); // Sort by amplitude descending
}

/**
 * Reconstruct mathematical expression from frequency components
 * @param {Array} frequencies - Significant frequency components
 * @param {number} threshold - Minimum amplitude threshold
 * @returns {string} LaTeX mathematical expression
 */
export function reconstructExpression(frequencies, threshold = 0.01) {
  if (!frequencies || frequencies.length === 0) {
    return '0';
  }
  
  const terms = [];
  
  for (const { frequency, amplitude, phase } of frequencies) {
    if (amplitude < threshold) continue;
    
    const freq = frequency.toFixed(1);
    const amp = amplitude.toFixed(3);
    
    if (frequency === 0) {
      // DC component
      terms.push(amp);
    } else {
      // AC components with phase analysis
      const normalizedPhase = ((phase % (2 * pi)) + 2 * pi) % (2 * pi);
      
      if (Math.abs(normalizedPhase) < SIGNAL_CONFIG.PHASE_TOLERANCE) {
        // Cosine term (phase ≈ 0)
        terms.push(`${amp} \\cos(2\\pi \\cdot ${freq} \\cdot t)`);
      } else if (Math.abs(normalizedPhase - pi/2) < SIGNAL_CONFIG.PHASE_TOLERANCE) {
        // Negative sine term (phase ≈ π/2)
        terms.push(`-${amp} \\sin(2\\pi \\cdot ${freq} \\cdot t)`);
      } else if (Math.abs(normalizedPhase + pi/2) < SIGNAL_CONFIG.PHASE_TOLERANCE || 
                 Math.abs(normalizedPhase - 3*pi/2) < SIGNAL_CONFIG.PHASE_TOLERANCE) {
        // Positive sine term (phase ≈ -π/2 or 3π/2)
        terms.push(`${amp} \\sin(2\\pi \\cdot ${freq} \\cdot t)`);
      } else {
        // General case with phase
        const phaseStr = normalizedPhase.toFixed(2);
        terms.push(`${amp} \\cos(2\\pi \\cdot ${freq} \\cdot t + ${phaseStr})`);
      }
    }
  }
  
  if (terms.length === 0) return '0';
  
  return terms.join(' + ').replace(/\+ -/g, '- ');
}

/**
 * Calculate signal statistics
 * @param {Array} signal - Signal samples
 * @returns {Object} Signal statistics
 */
export function calculateSignalStats(signal) {
  const validSamples = signal.filter(x => isFinite(x));
  
  if (validSamples.length === 0) {
    return { mean: 0, rms: 0, peak: 0, min: 0, max: 0 };
  }
  
  const mean = validSamples.reduce((sum, x) => sum + x, 0) / validSamples.length;
  const rms = sqrt(validSamples.reduce((sum, x) => sum + x * x, 0) / validSamples.length);
  const min = Math.min(...validSamples);
  const max = Math.max(...validSamples);
  const peak = Math.max(Math.abs(min), Math.abs(max));
  
  return { mean, rms, peak, min, max };
}

/**
 * Generate time axis data for plotting
 * @param {Array} signal - Signal samples
 * @param {number} xStart - Start time
 * @param {number} xEnd - End time
 * @returns {Array} Time-value pairs for plotting
 */
export function generateTimeData(signal, xStart = 0, xEnd = 1) {
  const timeStep = (xEnd - xStart) / (signal.length - 1);
  
  return signal.map((value, index) => ({
    time: parseFloat((xStart + index * timeStep).toFixed(6)),
    value: parseFloat(value.toFixed(6)),
  }));
}

/**
 * Generate frequency axis data for plotting
 * @param {Array} spectrum - DFT spectrum
 * @param {number} sampleRate - Sample rate in Hz
 * @returns {Array} Frequency-amplitude pairs for plotting
 */
export function generateFrequencyData(spectrum, sampleRate) {
  const N = spectrum.length;
  
  return spectrum
    .slice(0, Math.floor(N / 2) + 1) // Single-sided spectrum
    .map((component, k) => ({
      frequency: parseFloat(((k * sampleRate) / N).toFixed(3)),
      amplitude: parseFloat(component.amplitude.toFixed(6)),
      phase: parseFloat(component.phase.toFixed(6)),
      real: parseFloat(component.real.toFixed(6)),
      imaginary: parseFloat(component.imaginary.toFixed(6)),
    }));
}

/**
 * Validate and sanitize frequency component
 * @param {Object} component - Frequency component {freq, amp, phase}
 * @returns {Object} Sanitized component
 */
export function sanitizeFrequencyComponent(component) {
  return {
    freq: Math.max(0, Math.min(SIGNAL_CONFIG.MAX_FREQUENCY, parseFloat(component.freq) || 0)),
    amp: Math.max(0, Math.min(10, parseFloat(component.amp) || 0)),
    phase: parseFloat(component.phase) || 0,
  };
}

/**
 * Calculate optimal frequency range for display
 * @param {Array} frequencyData - Frequency domain data
 * @param {number} maxFrequency - Maximum possible frequency
 * @returns {Object} {min, max} frequency range
 */
export function calculateOptimalFrequencyRange(frequencyData, maxFrequency) {
  const significantFreqs = frequencyData.filter(f => 
    f.amplitude > 0.01 * Math.max(...frequencyData.map(d => d.amplitude), 1)
  );
  
  if (significantFreqs.length === 0) {
    return { min: 0, max: Math.min(20, maxFrequency) };
  }
  
  const maxSignificantFreq = Math.max(...significantFreqs.map(f => f.frequency));
  return {
    min: 0,
    max: Math.min(maxSignificantFreq * 1.2, maxFrequency),
  };
}
