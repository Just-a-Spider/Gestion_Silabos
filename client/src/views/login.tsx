'use client';

import { LoginForm } from '@/components/forms/auth/login';
import { useState } from 'react';

export default function LoginView({}) {

  return (
    <div className="flex flex-col items-center h-screen w-full sm:space-y-0 space-y-4 mt-4">
      <div className="sm:max-w-[50%] text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-6">
        <h1>Banco de Silabos</h1>
      </div>
      <div className="flex flex-col bg-white p-6 sm:p-8 rounded-2xl">
        <div className="border-cyan-600 p-6 sm:p-6 border-2 rounded-2xl text-2xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
