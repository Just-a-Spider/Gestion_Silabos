'use client';

import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import AuthService from '@/services/auth_service';
import LoginView from '@/views/login';
import MainView from '@/views/main_view';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TbLogout } from 'react-icons/tb';

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
      <header>
        <nav>
          <div className="w-full h-12 sm:h-14 flex justify-between items-center bg-cyan-600 px-4 sm:px-6">
            <div className="text-sm sm:text-md lg:text-xl font-semibold text-white text-transform: capitalize">
              {role ? (
                <>{role} view</>
              ) : (
                <></>
              )
              }
            </div>
            {token ? (
              <NavigationMenu className="text-center text-sm sm:text-md lg:text-lg font-semibold text-white rounded-2xl bg-none ">
                <NavigationMenuList>
                  <Link href="/" legacyBehavior passHref>
                    <div
                      className="hover:bg-cyan-300  rounded-md cursor-pointer"
                      onClick={logout}
                    >
                      <NavigationMenuLink className="bg-none pr-2 flex items-center">
                        <div className="h-10 w-6 text-white text-sm sm:text-md lg:text-lg flex items-center justify-center">
                          <TbLogout className="" />
                        </div>
                      </NavigationMenuLink>
                    </div>
                  </Link>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <></>
            )}
          </div>
        </nav>
      </header>
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
