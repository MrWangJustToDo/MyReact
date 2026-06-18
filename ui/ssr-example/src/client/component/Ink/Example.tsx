import { Box } from "@my-react/react-terminal/web";
import { StreamMarkdown } from "ink-stream-markdown/web";
import { useCallback, useEffect, useRef, useState } from "react";

import { TextInput } from "./Input";
import { useFocus } from "./useFocus";

const data = `## Recent Announcements

| Date | Category | Details |
|------|----------|---------|
| Jun 3 | Announcement | [Introducing the Services Track and Partner Hub of the Claude Partner Network](https://www.anthropic.com/news/partner-hub) — Launch of partner services and collaboration hub |
| Jun 3 | Policy | [What we learned mapping a year's worth of AI-enabled cyber threats](https://www.anthropic.com/news/ai-cyber-threats) — A year of AI threat landscape research |
| Jun 2 | Announcement | [Expanding Project Glasswing](https://www.anthropic.com/news/glasswing) — Expanding to 15 countries and approximately 150 new organizations |
| Jun 1 | Announcement | [Anthropic confidentially submits draft S-1 to the SEC](https://www.anthropic.com/news/s1) — Anthropic files confidential S-1 draft with the SEC (IPO preparation) |

## Math Examples

Inline math: The Pythagorean theorem states $a^2 + b^2 = c^2$ and Euler's identity is $e^{i\\pi} + 1 = 0$.

$$
\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}
$$

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

\`\`\`mermaid
graph TD
  A[Source] -->|solid| B[Target 1]
  A -.->|dotted| C[Target 2]
  A ==>|thick| D[Target 3]
\`\`\`

## Blockquote & Nested List

> **Note:** This is a blockquote with **bold** and *italic* text.
> It can span multiple lines.

1. First item with nested bullets:
   - Alpha
   - Beta
   - Gamma
2. Second item with \`inline code\` and a [link](https://example.com)
3. Third item

## Code Blocks

\`\`\`python
def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence up to n terms."""
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

print(fibonacci(10))
\`\`\`

---

That's all for now!
`;

const CHUNK_MIN = 3;
const CHUNK_MAX = 12;
const INTERVAL_MS = 30;

const useStreamText = (text: string) => {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  // eslint-disable-next-line react-hooks/refs
  const streaming = indexRef.current < text.length;

  const restart = useCallback(() => {
    indexRef.current = 0;
    setDisplayed("");
  }, []);

  useEffect(() => {
    if (indexRef.current >= text.length) return;

    const timer = setInterval(() => {
      const chunkSize = CHUNK_MIN + Math.floor(Math.random() * (CHUNK_MAX - CHUNK_MIN + 1));
      const nextIndex = Math.min(indexRef.current + chunkSize, text.length);
      indexRef.current = nextIndex;
      setDisplayed(text.slice(0, nextIndex));

      if (nextIndex >= text.length) {
        clearInterval(timer);
      }
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [text, displayed === ""]);

  return { displayed, streaming, restart };
};

export const InkExample = () => {
  const { isFocused } = useFocus();
  const { displayed, streaming, restart } = useStreamText(data);

  return (
    <Box flexDirection="column">
      <StreamMarkdown theme={{ mermaidASCII: { colorMode: "ansi256" } }}>{displayed}</StreamMarkdown>
      <TextInput
        focus={isFocused}
        placeholder={streaming ? "Streaming..." : "Type 'restart' to replay"}
        onSubmit={(value) => {
          if (value.trim().toLowerCase() === "restart") {
            restart();
          }
        }}
      />
    </Box>
  );
};
