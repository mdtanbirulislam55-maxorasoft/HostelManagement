/**
 * Simple authentication hook for local development.
 *
 * The original project uses Replit's authentication system to fetch
 * the current user from the `/api/auth/user` endpoint.  In a local
 * setup there is no external authentication provider, so this hook
 * simply returns an authenticated state by default.  You can extend
 * this hook to integrate your own authentication checks and fetch
 * user details from your backend as needed.
 */
export function useAuth() {
  return {
    user: null,
    isLoading: false,
    isAuthenticated: true,
  };
}
