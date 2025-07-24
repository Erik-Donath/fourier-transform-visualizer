import { evaluate } from "mathjs";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import dft from "./ft";

function App() {
  const [data, setData] = useState([]);
  const [ftData, setFTData] = useState([]);

  let func = "0";
  for (let i = 1; i <= 10; i++) {
    func += "+" + i + "sin(" + i + "x)";
  }

  function handle() {
    const arr = [];
    const yArr = [];
    const xmin = 0;
    const xmax = 2 * Math.PI;
    const N = 1000;
    const dx = (xmax - xmin) / N;

    for (let i = 0; i < N; i++) {
      const x = xmin + i * dx;
      let y;
      try {
        y = evaluate(func, { x });
        if (typeof y !== "number" || isNaN(y)) y = 0;
      } catch {
        y = 0;
      }
      arr.push({ x, y });
      yArr.push(y);
    }
    setData(arr);

    const dftResult = dft(yArr);
    const nMax = Math.floor(N / 2);

    // Plotte nur die ersten 15 Frequenzanteile (bei N=1000 liegen Peaks exakt bei 1...10)
    const ftPlotData = dftResult.slice(1, 16).map((freq, k) => ({
      x: k + 1,
      y: freq.amplitude
    }));

    setFTData(ftPlotData);
  }

  return (
    <>
      <h1>{func}</h1>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#d0dadf" />
          <XAxis
            dataKey="x"
            type="number"
            label={{ value: "x", position: "insideBottomRight", offset: 0 }}
          />
          <YAxis
            dataKey="y"
            type="number"
            label={{ value: "f(x)", position: "insideTopLeft", offset: 0 }}
          />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
      <button onClick={handle}>Render!!!!!</button>
      <br /><br /><br />
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={ftData}>
          <CartesianGrid stroke="#d0dadf" />
          <XAxis
            dataKey="x"
            type="number"
            label={{ value: "Frequenz", position: "insideBottomRight", offset: 0 }}
            domain={['auto', 'auto']}
          />
          <YAxis
            dataKey="y"
            type="number"
            label={{ value: "Amplitude", position: "insideTopLeft", offset: 0 }}
            domain={['auto', 'auto']}
          />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default App;
