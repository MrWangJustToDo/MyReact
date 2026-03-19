## ADDED Requirements

### Requirement: Server Action Execution

The system SHALL execute server actions on the server when invoked from the client.

#### Scenario: Direct action invocation

- **WHEN** a client calls a server action with arguments
- **THEN** the server executes the action function with decoded arguments

#### Scenario: Action with return value

- **WHEN** a server action returns a value
- **THEN** the value is serialized via Flight and returned to the client

### Requirement: Form Action Integration

The system SHALL support server actions as form action handlers.

#### Scenario: Form submission

- **WHEN** a form's action prop is a server action
- **THEN** form submission sends FormData to the server action endpoint

#### Scenario: Progressive enhancement

- **WHEN** JavaScript is disabled
- **THEN** the form still submits via standard HTTP POST to the action endpoint

### Requirement: Action Request Handling

The system SHALL handle server action requests via HTTP POST with proper headers.

#### Scenario: Action request routing

- **WHEN** a POST request includes `React-Server-Action` header
- **THEN** the request is routed to the server action handler

#### Scenario: FormData decoding

- **WHEN** the request content-type is `multipart/form-data`
- **THEN** the system decodes FormData and extracts action arguments

#### Scenario: JSON body decoding

- **WHEN** the request body is Flight-encoded text
- **THEN** the system uses `decodeReply` to extract action arguments

### Requirement: Action Response Encoding

The system SHALL encode server action responses in Flight format.

#### Scenario: Successful action response

- **WHEN** a server action completes successfully
- **THEN** the response is a Flight stream with content-type `text/x-component`

#### Scenario: Action error response

- **WHEN** a server action throws an error
- **THEN** the error is encoded in the Flight stream for client error handling

### Requirement: Server Action Registry

The system SHALL maintain a registry of server actions by ID.

#### Scenario: Action registration

- **WHEN** a server action is defined with "use server"
- **THEN** it is registered with a unique ID (e.g., `module#functionName`)

#### Scenario: Action lookup

- **WHEN** an action request arrives with an action ID
- **THEN** the registry returns the corresponding function

#### Scenario: Unknown action

- **WHEN** an action ID is not found in the registry
- **THEN** the system returns a 404 error with descriptive message

### Requirement: useActionState Hook Support

The system SHALL support the `useActionState` hook for form state management.

#### Scenario: Form state initialization

- **WHEN** `useActionState(action, initialState)` is called
- **THEN** the hook returns `[state, formAction, isPending]`

#### Scenario: State update after action

- **WHEN** a form action completes
- **THEN** the state is updated with the action's return value

### Requirement: Action Security

The system SHALL validate server action requests to prevent unauthorized invocations.

#### Scenario: Action ID validation

- **WHEN** an action request arrives
- **THEN** the system verifies the action ID exists in the registry

#### Scenario: CSRF protection

- **WHEN** a server action is invoked
- **THEN** the request origin is validated against allowed origins
