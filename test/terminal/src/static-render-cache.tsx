/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "@my-react/react";
import { Box, Text, StaticRender, render, renderToRegion, useApp, useInput } from "@my-react/react-terminal";

import type { Region } from "@my-react/react-terminal";

type ItemProperties = {
  readonly index: number;
};

function Item({ index }: ItemProperties) {
  return (
    <Box borderStyle="round" borderColor="green" padding={1} flexDirection="column">
      <Text>Item #{index}</Text>
      <Text dimColor>
        This is a sample item generated in an offline cache.
        {index % 2 === 0 ? " It has extra lines to simulate variable height content.\nLine 2\nLine 3" : ""}
      </Text>
    </Box>
  );
}

const newRegions: Region[] = [];
let currentHeight = 0;
let index = 0;

// We synchronously measure static items using the offline cache renderer
// outside the React lifecycle entirely. This runs before the root is mounted.
while (currentHeight < 100) {
  const region = renderToRegion(<Item index={index} />, { width: 40 });
  if (region.height === 0) {
    throw new Error("Region height is 0, which would cause an infinite loop.");
  }

  newRegions.push(region);
  currentHeight += region.height;
  index++;
}

function App({ regions }: { readonly regions: Region[] }) {
  const { exit } = useApp();

  useInput((input, key) => {
    if (input === "q" || key.escape) {
      exit();
    }
  });

  return (
    <Box flexDirection="column" width={80}>
      <Box paddingY={1}>
        <Text color="yellow">
          Generated {regions.length} items with total height of {regions.reduce((accumulator, r) => accumulator + r.height, 0)} lines.
        </Text>
      </Box>
      <Box flexDirection="column" overflowY="scroll" height={20} borderStyle="round">
        {regions.map((region, index) => (
          <StaticRender key={index} width={40} cachedRender={region} />
        ))}
      </Box>
      <Box paddingY={1}>
        <Text dimColor>Scroll up/down to see all items. Press 'q' to quit.</Text>
      </Box>
    </Box>
  );
}

export const test = () => render(<App regions={newRegions} />, { terminalBuffer: true });
