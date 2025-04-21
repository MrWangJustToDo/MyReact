import { useEffect, useState } from 'react';

export function FunctionNamed() {
  const [data, setData] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setData((i) => i + 1);
    }, 100);
  }, []);

  return <h1 data-num={data}>Named Export Function {data}</h1>;
}