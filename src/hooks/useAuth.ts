// src/hooks/useAuth.ts

'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [role, setRole] = useState<string | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setRole(userRole);
    setIsAuthLoaded(true);
  }, []);

  return { role, isAuthLoaded };
}