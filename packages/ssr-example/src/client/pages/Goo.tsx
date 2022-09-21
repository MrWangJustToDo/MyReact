import { delay } from "@client/utils";

import type { GetInitialStateType } from "@client/types/common";

const Index = ({ go }: { go: string }) => {
  return <div>123 {go}</div>;
};

export const getInitialState: GetInitialStateType = async () => {
  await delay(3000);
  return { props: { go: "go" } };
};

export default Index;
