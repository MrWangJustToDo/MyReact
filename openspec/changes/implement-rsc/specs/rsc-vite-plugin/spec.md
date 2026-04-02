## ADDED Requirements

### Requirement: Directive Transform Plugin

The system SHALL provide a Vite plugin that transforms files based on directives.

#### Scenario: Client directive transform

- **WHEN** Vite processes a file with "use client"
- **THEN** the plugin transforms it to export client reference proxies for the server build

#### Scenario: Server directive transform

- **WHEN** Vite processes a file with "use server"
- **THEN** the plugin extracts server actions and registers them

#### Scenario: No directive passthrough

- **WHEN** a file has no RSC directives
- **THEN** the plugin passes it through unchanged

### Requirement: Client/Server Build Splitting

The system SHALL configure Vite for separate client and server builds.

#### Scenario: Server build configuration

- **WHEN** building for the server
- **THEN** "use client" modules are transformed to reference proxies

#### Scenario: Client build configuration

- **WHEN** building for the client
- **THEN** client components are bundled with their dependencies

#### Scenario: Shared dependencies

- **WHEN** both server and client use the same dependency
- **THEN** the dependency is properly resolved in both builds

### Requirement: Client Manifest Generation

The system SHALL generate a manifest mapping module IDs to chunk files.

#### Scenario: Manifest output

- **WHEN** the client build completes
- **THEN** a manifest JSON file maps module IDs to output chunk paths

#### Scenario: Manifest consumption

- **WHEN** the server needs to resolve a client reference
- **THEN** it reads the manifest to find the correct chunk URL

### Requirement: RSC Development Server

The system SHALL configure Vite dev server for RSC development.

#### Scenario: RSC endpoint

- **WHEN** the dev server starts
- **THEN** it exposes `/__rsc` endpoint for Flight stream requests

#### Scenario: Action endpoint

- **WHEN** the dev server starts
- **THEN** it exposes `/__rsc_action` endpoint for server action requests

#### Scenario: Hot Module Replacement

- **WHEN** a server component file changes
- **THEN** the dev server triggers a re-render of affected components

### Requirement: Bootstrap Script Injection

The system SHALL inject client bootstrap scripts for hydration.

#### Scenario: Module loader injection

- **WHEN** rendering HTML
- **THEN** the system injects `__my_react_modules__` initialization script

#### Scenario: Hydration script injection

- **WHEN** rendering HTML with RSC
- **THEN** the system injects Flight consumption and hydration bootstrap

### Requirement: Plugin Configuration

The system SHALL accept RSC configuration options in the Vite plugin.

#### Scenario: Enable RSC mode

- **WHEN** `react({ rsc: true })` is configured
- **THEN** RSC transforms and endpoints are enabled

#### Scenario: Custom action endpoint

- **WHEN** `react({ rsc: { actionEndpoint: '/api/action' } })` is configured
- **THEN** server actions use the custom endpoint

#### Scenario: RSC disabled by default

- **WHEN** `react()` is configured without RSC options
- **THEN** RSC features are not enabled (backward compatible)
