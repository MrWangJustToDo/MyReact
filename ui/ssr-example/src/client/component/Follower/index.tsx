import { memo } from "react";

import { Follower } from "./Item";

import type { GetViewerQuery } from "@site/graphql";

const _Followers = ({ data }: { data: GetViewerQuery["viewer"]["followers"]["nodes"] }) => (
  <>
    {data.map(({ login, name, avatarUrl, id, email, bioHTML }, index) => {
      return <Follower key={id} id={id} isFirst={index === 0} name={name || login} email={email} bioHTML={bioHTML} avatarUrl={avatarUrl} />;
    })}
  </>
);

export const Followers = memo(_Followers);
