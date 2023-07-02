import { createContext } from "@my-react/react";

export type FocusContextProps = {
  readonly activeId?: string;
  readonly add: (id: string, options: { autoFocus: boolean }) => void;
  readonly remove: (id: string) => void;
  readonly activate: (id: string) => void;
  readonly deactivate: (id: string) => void;
  readonly enableFocus: () => void;
  readonly disableFocus: () => void;
  readonly focusNext: () => void;
  readonly focusPrevious: () => void;
  readonly focus: (id: string) => void;
};

export const FocusContext = createContext<FocusContextProps>({
  activeId: undefined,
  add: () => void 0,
  remove: () => void 0,
  activate: () => void 0,
  deactivate: () => void 0,
  enableFocus: () => void 0,
  disableFocus: () => void 0,
  focusNext: () => void 0,
  focusPrevious: () => void 0,
  focus: () => void 0,
});

FocusContext.displayName = "InternalFocusContext";
