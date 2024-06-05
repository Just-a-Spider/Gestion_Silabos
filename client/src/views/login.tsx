'use client';

import { LoginForm } from '@/components/forms/auth/login';
import { RegisterForm } from '@/components/forms/auth/register';
import { useState } from 'react';

export default function LoginView({}) {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="flex flex-col items-center h-screen w-full sm:space-y-0 space-y-4 mt-4">
      <div className="sm:max-w-[50%] text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-600 text-center">
        <h1>Banco de Silabos</h1>
      </div>
      <div className="flex flex-col bg-white p-6 sm:p-8 rounded-2xl">
        <div className="border-cyan-600 p-6 sm:p-6 border-2 rounded-2xl text-2xl">
          <>{showRegister ? <RegisterForm /> : <LoginForm />}</>
        </div>
        <button
          className="text-black mt-4"
          onClick={() => setShowRegister(!showRegister)}
        >
          {showRegister ? (
            <div>
              <span>¿Ya tienes una cuenta?</span>
              <span className="text-cyan-600 ml-2 hover:text-cyan-700">
                Inicia Sesión
              </span>
            </div>
          ) : (
            <div>
              <span>¿No tienes una cuenta?</span>
              <span className="text-cyan-600 ml-2 hover:text-cyan-700">
                Regístrate
              </span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
