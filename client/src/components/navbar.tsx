// Navbar.tsx
import React from 'react';
import { TbLogout } from 'react-icons/tb';
import Link from 'next/link';
import AuthService from '@/services/auth_service';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from './ui/navigation-menu';

const Navbar = ({ token, onLogout }: { token: any; onLogout: any }) => {
  const authService = AuthService.getInstance();
  async function logout() {
    await authService.logout();
    onLogout();
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <nav>
        <div className="w-full h-12 sm:h-14 bg-cyan-700 flex justify-between items-center px-4 sm:px-6">
          <div className="text-sm sm:text-md lg:text-xl font-semibold text-white text-transform: capitalize">
            @Just_a_Spider
          </div>
          {token ? (
            <NavigationMenu className="text-center text-sm sm:text-md lg:text-lg font-semibold text-white rounded-2xl bg-none ">
              <NavigationMenuList>
                <Link href="/" legacyBehavior passHref>
                  <div
                    className="hover:bg-cyan-500 rounded-md cursor-pointer"
                    onClick={logout}
                  >
                    <NavigationMenuLink className="bg-none pr-2 flex items-center">
                      <span className="pl-2">Cerrar sesión</span>
                    </NavigationMenuLink>
                  </div>
                </Link>
              </NavigationMenuList>
            </NavigationMenu>
          ) : null}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
