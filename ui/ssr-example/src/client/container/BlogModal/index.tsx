import React, { memo, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

import { useOverlaysClose, useOverlaysOpen } from "@client/hooks";
import { getIsStaticGenerate } from "@shared";

import { DetailModalBody, DetailModalHeader } from "./DetailModal";

const _BlogModal = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search || ""), [search]);
  const open = useOverlaysOpen();
  const close = useOverlaysClose();
  const blogId = query.get("detailId");
  const isModalOpen = query.get("overlay") === "open";

  useEffect(() => {
    if (isModalOpen && blogId !== undefined) {
      open({
        head: <DetailModalHeader id={blogId as string} />,
        body: <DetailModalBody id={blogId as string} />,
        closeComplete: () => {
          query.delete("detailId");
          query.delete("overlay");
          const string = query.toString();
          navigate(`${getIsStaticGenerate() ? "/MyReact/" : "/"}${string ? "?" + string : ""}`);
        },
      });
    } else {
      close();
    }
  }, [blogId, close, isModalOpen, navigate, open, query]);

  return <React.Fragment />;
};

export const BlogModal = memo(_BlogModal);
