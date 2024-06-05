'use client';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Form, FormItem } from '@/components/ui/form';
import { RegisterProps } from '@/interfaces/user';
import AuthService from '@/services/auth_service';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../ui/button';
import { FormFieldComponent } from '../form_field';

const RegisterSchema = z
  .object({
    name: z.string().min(1, { message: 'Escriba su nombre' }),
    lastname: z.string().min(1, { message: 'Escriba su apellido' }),
    code: z
      .string()
      .min(10, { message: 'Escriba su nombre de usuario' })
      .max(12, { message: 'Nombre de usuario muy largo' }),
    dni: z.string().min(8, { message: 'Escriba su DNI' }),
    email: z.string().email({ message: 'Correo inválido' }),
    password: z.string().min(1, { message: 'Escriba su contraseña' }),
    confirm_password: z.string().min(1, { message: 'Escriba su contraseña' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Las contraseñas deben ser iguales',
    path: ['password2'],
  });

export function RegisterForm() {
  const authService = AuthService.getInstance();

  const [showMessage, setShowMessage] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      lastname: '',
      code: '',
      email: '',
      password: '',
      confirm_password: '',
      dni: '',
    },
  });

  async function submitRegister(data: z.infer<typeof RegisterSchema>) {
    try {
      const registerData: RegisterProps = {
        ...data,
      };
      await authService.register(registerData);
      setShowMessage(true);
      setShowAlert(false);
    } catch (error) {
      setShowMessage(false);
      setShowAlert(true);
    }
  }

  return (
    <Form {...form}>
      {showMessage && (
        <>
          <Alert>
            <AlertTitle>Registro Exitoso</AlertTitle>
          </Alert>
          <br />
        </>
      )}
      {showAlert && (
        <>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error al registrar usuario</AlertTitle>
          </Alert>
          <br />
        </>
      )}
      <form onSubmit={form.handleSubmit(submitRegister)} className="space-y-2">
        <div className="flex flex-row space-x-2">
          <FormFieldComponent
            control={form.control}
            name="name"
            label="Nombre"
            placeholder="Nombre"
          />

          <FormFieldComponent
            control={form.control}
            name="lastname"
            label="Apellido"
            placeholder="Apellido"
          />
        </div>

        <FormFieldComponent
          control={form.control}
          name="code"
          label="Código Universitario"
          placeholder="2024123456"
        />

        <FormFieldComponent
          control={form.control}
          name="dni"
          label="DNI"
          placeholder="12345678"
        />

        <FormFieldComponent
          control={form.control}
          name="email"
          label="Email"
          placeholder="correo@electrónico.com"
        />

        <FormFieldComponent
          control={form.control}
          name="password"
          label="Contraseña"
          type="password"
          togglable={true}
          placeholder="contraseña"
        />
        <FormFieldComponent
          control={form.control}
          name="confirm_password"
          label="Confirmar Contraseña"
          type="password"
          togglable={true}
          placeholder="confirmar"
        />

        <FormItem className="flex justify-center">
          <Button
            type="submit"
            className="
              sm:py-2 sm:px-4 sm:w-32 sm:rounded-full 
            bg-cyan-600 hover:bg-cyan-900 w-30 sm:text-lg text-sm py-1 px-2 
              rounded-lg shadow-md focus:outline-none focus:shadow-outline-green"
          >
            Registrar
          </Button>
        </FormItem>
      </form>
    </Form>
  );
}
