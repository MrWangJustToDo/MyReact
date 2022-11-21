// simple server component
/*
Component 1:
export default async function Index({children}) {
  const data1 = await fetch('/foo/bar').then((f) => f.json());

  return <div>
  {children}
  <>
    {data1.map(i => <div key={i}>{i}</div>)}
  </>
  </div>
}

Component 2:
export default async function Index({children}) {
  const data2 = await fetch('/foo/baz').then((f) => f.json());

  return <div>{data2}</div>
}
*/
