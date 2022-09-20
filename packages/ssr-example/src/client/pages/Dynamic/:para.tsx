import { useParams } from "react-router";

export default function Index() {
  const p = useParams();

  return <div>dynamic {JSON.stringify(p)}</div>;
}
