declare module "periscopic" {
  export function extract_names(node: unknown): string[];
  export function analyze(ast: unknown): {
    scope: unknown;
    map: Map<unknown, { references: Set<string>; find_owner: (name: string) => unknown }>;
  };
}

declare module "magic-string" {
  export default class MagicString {
    constructor(code: string);
    update(start: number, end: number, content: string): void;
    remove(start: number, end: number): void;
    append(content: string): void;
    appendLeft(index: number, content: string): void;
    prepend(content: string): void;
    move(start: number, end: number, index: number): void;
    toString(): string;
    generateMap(options?: { hires?: boolean | "boundary" }): unknown;
    hasChanged(): boolean;
  }
}
