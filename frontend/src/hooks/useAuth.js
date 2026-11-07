import { useState } from 'react';

export function useAuth() {
  // This hook is consumed via AuthContext — importing useContext(AuthContext)
  // For convenience, it's re-exported from the context
  throw new Error('useAuth must be used within an AuthProvider. Import from context/AuthContext instead.');
}

