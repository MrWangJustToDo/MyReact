// Marker module for Main Thread – importing `background-only` must fail at build time.
throw new Error(
  "This module cannot be imported from a Main Thread module. " + "It should only be used from a Background Thread."
);
