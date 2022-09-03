import { useParams } from "react-router";

import type { GetInitialStateType, PreLoadComponentType } from "types/components";

const Id: PreLoadComponentType = () => {
  const f = useParams<{ id: string }>();
  console.log("params", f);
  return <div>params: {f.id}</div>;
};

export const getInitialState: GetInitialStateType = ({ query, params }) => {
  console.log("当前id参数为:", params.id);
  console.log("当前query为", query);
};

export default Id;
