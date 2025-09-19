// Auth shim to maintain compatibility with the existing route imports.
//
// The server routes import `setupAuth` and `isAuthenticated` from
// `./auth`.  In this local version of the project those helpers are
// implemented in `replitAuth.ts`.  This file simply re-exports
// the functions so that the import paths remain consistent.

export { setupAuth, isAuthenticated } from './replitAuth';