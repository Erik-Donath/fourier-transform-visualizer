import { evaluate } from "mathjs";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import "./ft"
import dft from "./ft";

function App() {
  const [data, setData] = useState([]);
  const [ftData, setFTData] = useState([]);

  let func = "0";
  for(let i = 1; i <= 10; i++) {
    func += "+" + i + "sin(" + i + "x)"
  }


  function handle() {
    const arr = [];
    const yArr = [];

    for(let x = 0; x <= 100; x += 0.01) {
      let y;
      try {
        y = evaluate(func, { x });
        if (typeof y !== "number" || isNaN(y))
          y = null;
      }
      catch {
        y = null;
      }
      arr.push({x, y})
      yArr.push(y);
    }
    setData(arr);
    console.log("Function:", arr);

    const ftPlotData = dft(yArr, 1, 1).map((freq, idx) => ({
      x: idx,
      y: freq.amplitude
    }));

    setFTData(ftPlotData);
 }

  return <>
    <h1>{func}</h1>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#d0dadf" />
        <XAxis dataKey="x" type="number" />
        <YAxis dataKey="y" type="number" />
        <Tooltip />
        <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
    <button onClick={handle}>Render!!!!!</button>
    <br /><br /><br />

    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={ftData}>
        <CartesianGrid stroke="#d0dadf" />
        <XAxis dataKey="x" type="number" />
        <YAxis dataKey="y" type="number" />
        <Tooltip />
        <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  </>
}

export default App
