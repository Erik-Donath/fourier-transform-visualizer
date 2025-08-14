# Fourier-Transform-Visualisierer

[![GitHub Pages](https://img.shields.io/badge/demo-online-green)](https://erik-donath.github.io/fourier-transform-visualizer/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF.svg)](https://vitejs.dev/)

Eine interaktive Webanwendung zur Visualisierung und zum besseren Verständnis der Fourier-Transformation.

## 🌟 Funktionen

### Duale Analysemodi

- **Komponenten-Modus**: Erstellen Sie Signale durch die Kombination einzelner Frequenzkomponenten mit individuell anpassbaren Parametern (Frequenz, Amplitude, Phase)
- **Ausdrucks-Modus**: Geben Sie mathematische Formeln direkt ein und analysieren Sie deren Frequenzinhalt in Echtzeit

### Interaktive Visualisierungen

- **Zeitbereich**: Live-Signaldarstellung mit flexibel anpassbaren Zeitbereichen
- **Frequenzbereich**: Anschauliche Visualisierung von Amplituden- und Phasenspektrum

### Erweiterte Analyse

- **Diskrete Fourier-Transformation (DFT)**: Umfassende Analyse im Frequenzbereich
- **Intelligente Frequenzerkennung**: Automatische Identifikation der wichtigsten Frequenzkomponenten
- **Ausdrucksrekonstruktion**: Automatische Generierung mathematischer Ausdrücke basierend auf der Frequenzanalyse
- **Live-Updates**: Alle Visualisierungen werden in Echtzeit aktualisiert, sobald Sie Parameter ändern

## 🚀 Live-Demo

Das Tool kann unter dem folgenden Link genutzt werden: [https://erik-donath.github.io/fourier-transform-visualizer/](https://erik-donath.github.io/fourier-transform-visualizer/)

## 🛠️ Technologie-Stack

- **Frontend-Framework**: React 18.3.1 mit Hooks
- **Build-Tool**: Vite 6.0.5
- **Mathematik**: Math.js für Ausdrucksanalyse und -auswertung
- **Diagramme**: Recharts für interaktive Datenvisualisierung
- **LaTeX-Rendering**: KaTeX und react-katex für mathematische Formeln
- **Styling**: CSS3 mit modernen Flexbox/Grid-Layouts

## 📦 Installation

### Voraussetzungen

- Node.js (Version 16 oder höher)
- npm oder yarn Paketmanager

### Einrichtung

1. Repository klonen:

```bash
git clone https://github.com/Erik-Donath/fourier-transform-visualizer.git
cd fourier-transform-visualizer
```

2. Abhängigkeiten installieren:

```bash
npm install
```

3. Entwicklungsserver starten:

```bash
npm run dev
```

4. Öffnen Sie Ihren Browser und navigieren Sie zu `http://localhost:5173`

## 🧮 Mathematischer Hintergrund

Die Anwendung implementiert die **Diskrete Fourier-Transformation (DFT)**:

```
X_k = (1/N) * Σ(n=0 bis N-1) x_n * e^(-2πikn/N)
```

Wobei:

- `X_k` die Frequenzkomponente bei Frequenz `k` darstellt
- `x_n` die Zeitbereichsproben sind
- `N` die Gesamtanzahl der Proben ist

### Schlüsselkonzepte

- **Signalzerlegung**: Wie sich komplexe Wellenformen aus einfachen Sinusoiden zusammensetzen
- **Frequenzanalyse**: Identifikation dominanter Frequenzen in Signalen
- **Phasenbeziehungen**: Verständnis von Phasenverschiebungen zwischen Komponenten
- **Spektrale Rekonstruktion**: Umwandlung von Frequenzdaten zurück in mathematische Ausdrücke

## 📁 Projektstruktur

```
src/
├── components/           # React-Komponenten
│   ├── Header.jsx       # Anwendungsheader
│   ├── ModeSelector.jsx # Modus-Wechsel-Interface
│   ├── FrequencyComponentsEditor.jsx # Komponenten-Modus-Steuerungen
│   ├── ExpressionEditor.jsx # Ausdrucks-Modus-Steuerungen
│   ├── SignalCharts.jsx # Zeit- und Frequenzbereichsdiagramme
│   ├── SpectrumAnalysis.jsx # Frequenzanalyse-Anzeige
│   └── Footer.jsx       # Anwendungsfußzeile
├── utils/
│   └── fourier.js       # Kern-Mathematikfunktionen und DFT-Implementierung
├── App.jsx              # Hauptanwendungskomponente
├── main.jsx            # Anwendungseinstiegspunkt
└── index.css           # Globale Stile
```

## 🔧 Verfügbare Skripte

- `npm run dev` - Entwicklungsserver starten
- `npm run build` - Für Produktion erstellen
- `npm run preview` - Produktions-Build vorschauen
- `npm run lint` - ESLint-Code-Analyse ausführen

## 🤝 Mitwirken

Beiträge sind herzlich willkommen! Bei größeren Änderungen erstellen Sie bitte zunächst ein Issue, um Ihre Ideen zu diskutieren.

### Entwicklungsrichtlinien

1. Befolgen Sie den bestehenden Code-Stil und die Konventionen
2. Fügen Sie Kommentare für komplexe mathematische Operationen hinzu
3. Testen Sie Ihre Änderungen in verschiedenen Browsern
4. Aktualisieren Sie die Dokumentation nach Bedarf

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](LICENSE)-Datei für Details.

## 👥 Autoren

- **Erik Donath** - Erste Entwicklung und mathematische Implementierung
- **Justus Weik** - Mitentwickler und Projektbeitragender

## 🙏 Danksagungen

- Erstellt mit modernem React und Vite für optimale Leistung
- Mathematische Berechnungen unterstützt von Math.js
- Interaktive Diagramme erstellt mit Recharts
- LaTeX-Rendering bereitgestellt von KaTeX
- Inspiriert von der Schönheit und Nützlichkeit der Fourier-Analyse in der Signalverarbeitung
