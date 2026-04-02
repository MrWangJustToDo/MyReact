## ADDED Requirements

### Requirement: Use Client Directive Detection

The system SHALL detect "use client" directives at the top of module files.

#### Scenario: Double-quoted directive

- **WHEN** a file starts with `"use client";` or `"use client"`
- **THEN** the file is identified as a client component module

#### Scenario: Single-quoted directive

- **WHEN** a file starts with `'use client';` or `'use client'`
- **THEN** the file is identified as a client component module

#### Scenario: Directive with whitespace

- **WHEN** the directive has leading whitespace or comments before it
- **THEN** the system still detects the directive as the first statement

### Requirement: Use Server Directive Detection

The system SHALL detect "use server" directives at module or function level.

#### Scenario: Module-level directive

- **WHEN** a file starts with `"use server";`
- **THEN** all exported functions in the file are server actions

#### Scenario: Function-level directive

- **WHEN** a function body starts with `"use server";`
- **THEN** only that function is a server action

#### Scenario: Inline server action

- **WHEN** an async function inside a server component has "use server"
- **THEN** that function becomes a callable server action

### Requirement: Client Reference Proxy Generation

The system SHALL transform "use client" modules to client reference proxies on the server.

#### Scenario: Default export transformation

- **WHEN** a "use client" module has a default export
- **THEN** the server sees a client reference proxy with `$$id` and `$$name: "default"`

#### Scenario: Named export transformation

- **WHEN** a "use client" module has named exports
- **THEN** each export becomes a client reference proxy with corresponding `$$name`

### Requirement: Server Reference Registration

The system SHALL register "use server" functions as server references with unique IDs.

#### Scenario: Server action registration

- **WHEN** a function is marked with "use server"
- **THEN** `registerServerReference(fn, id, name)` is called with a unique action ID

#### Scenario: Bound server actions

- **WHEN** a server action uses `.bind()` to partially apply arguments
- **THEN** the bound arguments are serialized with the action reference

### Requirement: Directive Boundary Enforcement

The system SHALL enforce that client components cannot import server-only code.

#### Scenario: Client imports server module

- **WHEN** a "use client" module attempts to import a server-only module
- **THEN** the build fails with a clear error message

#### Scenario: Server imports client module

- **WHEN** a server component imports a "use client" module
- **THEN** the import is replaced with a client reference proxy
