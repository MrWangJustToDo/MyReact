## ADDED Requirements

### Requirement: Async Server Component Execution

The system SHALL execute async server components on the server and await their results before continuing reconciliation.

#### Scenario: Async component with data fetching

- **WHEN** a server component is an async function that fetches data
- **THEN** the system awaits the component's Promise and uses the returned JSX for child reconciliation

#### Scenario: Nested async components

- **WHEN** server components are nested (parent and child are both async)
- **THEN** the system executes them in tree order, awaiting each before processing children

### Requirement: Flight Stream Rendering

The system SHALL serialize server component output to the React Flight protocol format via `@lazarv/rsc`.

#### Scenario: Render to Flight stream

- **WHEN** `renderToFlightStream(element)` is called
- **THEN** the system returns a `ReadableStream<Uint8Array>` containing Flight-encoded data

#### Scenario: Streaming output

- **WHEN** server components use Suspense boundaries
- **THEN** the Flight stream emits chunks incrementally as each boundary resolves

### Requirement: Client Reference Serialization

The system SHALL serialize client component references in the Flight stream using module IDs.

#### Scenario: Client component in server tree

- **WHEN** a server component renders a component marked with "use client"
- **THEN** the Flight stream contains a client reference (`$`) with the module ID and export name

#### Scenario: Props passed to client components

- **WHEN** a server component passes props to a client component
- **THEN** the props are serialized in the Flight stream and available during client hydration

### Requirement: Server Component Fiber Type

The system SHALL use a dedicated fiber type `NODE_TYPE.__serverComponent__` for server components.

#### Scenario: Fiber type identification

- **WHEN** a component is identified as a server component (no "use client" directive)
- **THEN** the fiber type includes the `__serverComponent__` bit

#### Scenario: Dispatch routing

- **WHEN** `dispatchFiber` encounters a server component fiber
- **THEN** it routes to `processServerComponent` handler

### Requirement: Error Handling in Server Components

The system SHALL propagate errors from server components through the Flight stream with error digests.

#### Scenario: Server component throws error

- **WHEN** a server component throws an error during execution
- **THEN** the error is encoded in the Flight stream with a digest for client-side error boundaries

#### Scenario: Async rejection

- **WHEN** a server component's Promise rejects
- **THEN** the rejection is handled the same as a thrown error
