## ADDED Requirements

### Requirement: Flight Stream Consumption

The system SHALL consume Flight streams and reconstruct React element trees on the client.

#### Scenario: Hydrate from Flight stream

- **WHEN** the client receives a Flight stream response
- **THEN** `createFromReadableStream` reconstructs the React element tree

#### Scenario: Fetch-based consumption

- **WHEN** using `createFromFetch(fetch('/rsc'))`
- **THEN** the system handles the fetch response and returns the element tree

### Requirement: Client Module Loading

The system SHALL load client component modules when encountering client references in the Flight stream.

#### Scenario: Module loading on reference

- **WHEN** the Flight stream contains a client reference (`$` marker)
- **THEN** the module loader loads the referenced module using the ID and export name

#### Scenario: Module preloading

- **WHEN** client references are encountered
- **THEN** the system MAY preload module chunks for faster hydration

### Requirement: Client Hydration Integration

The system SHALL integrate Flight-reconstructed trees with `@my-react/react-dom` hydration.

#### Scenario: Hydrate reconstructed tree

- **WHEN** the Flight stream is fully consumed
- **THEN** `hydrateRoot(container, element)` hydrates the DOM with the reconstructed tree

#### Scenario: Interactive after hydration

- **WHEN** hydration completes
- **THEN** client components are fully interactive with event handlers attached

### Requirement: Call Server Interface

The system SHALL provide a `callServer` interface for invoking server actions from the client.

#### Scenario: Server action invocation

- **WHEN** a client component calls a server action
- **THEN** the action arguments are encoded and sent to the server endpoint

#### Scenario: Server action response

- **WHEN** the server returns from an action
- **THEN** the response Flight stream is consumed and the result is returned to the caller

### Requirement: Module Registry

The system SHALL maintain a module registry for resolving client references.

#### Scenario: Register client modules

- **WHEN** client component modules are loaded
- **THEN** they are registered in `globalThis.__my_react_modules__`

#### Scenario: Resolve module export

- **WHEN** a client reference specifies module ID and export name
- **THEN** the registry returns the correct exported component
