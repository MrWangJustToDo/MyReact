// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
const fs = require('node:fs');
const path = require('node:path');

const LOADER_RUNTIME = fs.readFileSync(
  path.resolve(__dirname, './loader-internal.cjs'),
  'utf-8',
);

const RefreshHotLoader = function RefreshHotLoader(source, inputSourceMap) {
  this.callback(null, source + '\n\n' + LOADER_RUNTIME, inputSourceMap);
};

module.exports = RefreshHotLoader;
