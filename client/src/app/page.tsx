'use client';

import Navbar from '@/components/navbar';
import AuthService from '@/services/auth_service';
import LoginView from '@/views/login';
import MainView from '@/views/main_view';
import { useEffect, useState } from 'react';

export default function LandingPage({}) {
  const authService = AuthService.getInstance();

  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  );
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);

    const handleTokenChange = (newToken: string | null) => {
      setToken(newToken);
    };
    authService.onTokenChange(handleTokenChange);

    if (token) {
      const careerAndRole = authService.getCareerAndRole();
      if (careerAndRole) {
        const { role } = careerAndRole;
        setRole(role);
      }
    }

    return () => {
      authService.offTokenChange(handleTokenChange);
    };
  }, [token]);

  if (!isClient) {
    return null;
  }

  async function logout() {
    await authService.logout();
    setToken(null);
  }

  return (
    <>
    <Navbar token={token} onLogout={logout} />
      <div className="flex flex-col items-center h-screen w-full sm:space-y-0 space-y-4 mt-4 px-4 sm:px-0">
        {token ? (
          <MainView role={role || ''} showProfessors={role === 'coordinator'} />
        ) : (
          <LoginView />
        )}
      </div>
    </>
  );
}
