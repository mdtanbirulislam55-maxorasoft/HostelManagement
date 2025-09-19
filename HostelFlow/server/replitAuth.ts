import type { Express, RequestHandler } from 'express';

/**
 * Simple authentication stubs for local development.
 *
 * The original project was designed to run on Replit and included an
 * OpenID Connect based authentication flow.  When running locally
 * there is typically no external identity provider available, so this
 * module exports no-op implementations of the authentication helpers.
 *
 * `setupAuth` is called during server initialisation and can be used
 * to configure session handling or middleware.  Here it is a no-op
 * because we do not need to establish sessions for a single-user
 * environment.
 *
 * `isAuthenticated` is used as middleware to protect API routes.  The
 * implementation below always calls `next()` which means all
 * incoming requests are permitted.  It also attaches a dummy user
 * object on the request so that downstream code which expects
 * `req.user.claims.sub` will still function.  You can adapt this
 * middleware to integrate with your own authentication system as
 * needed.
 */

export async function setupAuth(_app: Express) {
  // No-op: in local development we do not configure sessions or
  // external authentication.  If you wish to add your own auth
  // mechanism (e.g. Passport.js with a local strategy), you can
  // initialise it here.
}

export const isAuthenticated: RequestHandler = (req, _res, next) => {
  // Attach a dummy user for downstream consumers.  The `claims.sub`
  // property mirrors the shape used by the original OpenID token and
  // is used as the user identifier in the storage layer.
  (req as any).user = {
    id: 'local-user',
    claims: { sub: 'local-user' },
  };
  return next();
};