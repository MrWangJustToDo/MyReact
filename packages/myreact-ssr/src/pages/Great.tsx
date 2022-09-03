import { useSearchParams } from "react-router-dom";

import { apiName } from "config/api";
import { getDataAction_Server } from "store/reducer/server/share/action";

import type { GetInitialStateType, PreLoadComponentType } from "types/components";

const Great: PreLoadComponentType<{ blog: string[] }> = (props) => {
  console.log(props, "test auto inject");
  const [, setSearch] = useSearchParams();
  return (
    <div>
      Great rt, {props?.blog?.join(", ")} props
      <br />
      <button onClick={() => setSearch({ a: Math.random().toString() })}>click</button>
    </div>
  );
};

export const getInitialState: GetInitialStateType = async ({ store }) => {
  console.log("开始222");
  await store.dispatch(getDataAction_Server({ name: apiName.blog }));
  console.log(store.sagaTask?.isRunning(), store.sagaTask?.isCancelled());
  console.log("dispatch done");
  return { props: { blog: [1, 2, 3, 4, 5, 6, 7, 7, 8, 9, "bbbb   "], foo: { a: 1, b: 2, c: 3 } }, cookies: { foo: "foo", bar: "bar" } };
};

export default Great;
