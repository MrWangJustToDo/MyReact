import { createElement, Scope, CommentStart, CommentEnd } from "@my-react/react";
import { NODE_TYPE } from "@my-react/react-shared";

import type { MyReactElementNode , MyReactFiberNode } from "@my-react/react";


export const WrapperByScope = (children: MyReactElementNode) => createElement(Scope, null, createElement(CommentStart), children, createElement(CommentEnd));

export const isCommentElement = (fiber: MyReactFiberNode) => fiber.type & (NODE_TYPE.__isCommentStartNode__ | NODE_TYPE.__isCommentEndNode__);
