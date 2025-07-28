import { type ForegroundColorName } from "ansi-styles";
import { createContext } from "react";
import { type LiteralUnion } from "type-fest";

export type BackgroundColor = LiteralUnion<ForegroundColorName, string>;

export const backgroundContext = createContext<BackgroundColor | undefined>(undefined);
