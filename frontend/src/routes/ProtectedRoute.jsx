// TEMP: always allows access. Checkpoint 9 wires this to real auth state
// (redirects to /login when there's no valid token).
function ProtectedRoute({ children }) {
  return children;
}

export default ProtectedRoute;