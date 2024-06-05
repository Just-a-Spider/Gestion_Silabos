'use client';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Form, FormItem } from '@/components/ui/form';
import AuthService from '@/services/auth_service';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../ui/button';
import { FormFieldComponent } from '../form_field';

const LoginSchema = z.object({
  code: z
    .string()
    .min(10, { message: 'Escriba su código de alumno' })
    .max(12, { message: 'Código de alumno muy largo' }),
  password: z.string().min(1, { message: 'Escriba su contraseña' }),
});

export function LoginForm() {
  const authService = AuthService.getInstance();
  const router = useRouter();

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (authService.getToken() !== null) {
      console.log('Already logged in');
    }
  }, []);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      code: '',
      password: '',
    },
  });

  async function submitLogin(data: z.infer<typeof LoginSchema>) {
    try {
      await authService.login(data);
    } catch (error) {
      setShowAlert(true);
    }
  }

  return (
    <Form {...form}>
      {showAlert && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Credenciales Incorrectas</AlertTitle>
        </Alert>
      )}
      <form
        onSubmit={form.handleSubmit(submitLogin)}
        className="sm:space-y-8 space-y-4"
      >
        <FormFieldComponent
          control={form.control}
          name="code"
          label="Código Universitario"
          placeholder="2024123456"
        />
        <FormFieldComponent
          control={form.control}
          name="password"
          label="Contraseña"
          placeholder="contraseña"
          type="password"
          togglable={true}
        />
        <FormItem className="flex justify-center">
          <Button
            type="submit"
            className="
      				sm:py-2 sm:px-4 sm:w-36 sm:rounded-full 
      			bg-cyan-600 hover:bg-cyan-900 w-30 py-1 px-2 sm:text-lg text-sm
      				rounded-lg shadow-md focus:outline-none focus:shadow-outline-green active:bg-cyan-900"
          >
            Ingresar
          </Button>
        </FormItem>
      </form>
    </Form>
  );
}
