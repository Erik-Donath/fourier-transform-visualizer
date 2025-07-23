import { evaluate } from "mathjs";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function App() {
  const [data, setData] = useState([]);

  const func = "1sin(1x)+2sin(2x)+4sin(4x)";
  const arr = [];

  function handle() {
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
    }
    setData(arr);
 }

  return <>
    <h1>HEY HO</h1>
    {data.length > 1 &&
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#d0dadf" />
          <XAxis dataKey="x" type="number" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    }
    <button onClick={handle}>Render!!!!!</button>
  </>
}

export default App
