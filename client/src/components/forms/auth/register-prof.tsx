'use client';

import { Form, FormItem } from '@/components/ui/form';
import { GetUserProps, RegisterProfessorProps } from '@/interfaces/user';
import CoursesService from '@/services/courses_service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../ui/button';
import { FormFieldComponent } from '../form_field';

const RegisterSchema = z.object({
  prof_name: z.string().min(1, { message: 'Escriba su nombre' }),
  prof_lastname: z.string().min(1, { message: 'Escriba su apellido' }),
  prof_code: z
    .string()
    .min(10, { message: 'Escriba el código del docente' })
    .max(12, { message: 'Código muy largo' }),
  prof_dni: z.string().min(1, { message: 'Escriba el DNI del docente' }),
  prof_email: z.string().email({ message: 'Correo inválido' }),
  prof_phone: z
    .string()
    .min(1, { message: 'Escriba el número de teléfono del docente' }),
});

export function RegisterProfessorForm({
  onProfessorRegistered,
  isMobile = false,
  professorToModify,
}: {
  onProfessorRegistered: () => void;
  isMobile?: boolean;
  professorToModify?: GetUserProps;
}) {
  const courseService = CoursesService.getInstance();
  let mod = false;

  if (professorToModify) {
    mod = true;
  }

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      prof_name: professorToModify?.name || '',
      prof_lastname: professorToModify?.lastname || '',
      prof_code: professorToModify?.code || '',
      prof_dni: professorToModify?.dni || '',
      prof_email: professorToModify?.email || '',
      prof_phone: professorToModify?.phone || '',
    },
  });

  async function submitRegister(data: z.infer<typeof RegisterSchema>) {
    let newProfessor;

    try {
      if (mod) {
        newProfessor = await courseService.registerModifyProfessor(
          {
            ...data,
            id: professorToModify?.id,
          },
          mod,
        );
      } else {
        newProfessor = await courseService.registerModifyProfessor(data, mod);
      }
      onProfessorRegistered();
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitRegister)}>
        <div
          className={
            isMobile
              ? 'flex flex-col justify-start space-y-4 mb-4'
              : 'flex justify-start space-x-11 mb-4'
          }
        >
          <FormFieldComponent
            control={form.control}
            name="prof_code"
            placeholder="202401020304"
            type="text"
            label={isMobile ? 'Código' : undefined}
            className={
              isMobile
                ? 'w-full pl-2'
                : 'max-w-full md:max-w-32 md:mr-[3rem] pl-2'
            }
          />
          <FormFieldComponent
            control={form.control}
            name="prof_dni"
            placeholder="87654321"
            type="text"
            label={isMobile ? 'DNI' : undefined}
            className={
              isMobile
                ? 'w-full pl-2'
                : 'max-w-full md:max-w-32 md:mr-[1rem] pl-2'
            }
          />
          <FormFieldComponent
            control={form.control}
            name="prof_name"
            placeholder="Juanito"
            type="text"
            label={isMobile ? 'Nombre' : undefined}
            className={
              isMobile
                ? 'w-full pl-2'
                : 'max-w-full md:max-w-32 md:mr-[1rem] pl-2'
            }
          />
          <FormFieldComponent
            control={form.control}
            name="prof_lastname"
            placeholder="Pérez"
            type="text"
            label={isMobile ? 'Apellido' : undefined}
            className={
              isMobile
                ? 'w-full pl-2'
                : 'max-w-full md:max-w-32 md:mr-[1rem] pl-2'
            }
          />
          <FormFieldComponent
            control={form.control}
            name="prof_email"
            placeholder="juanitoperez@udh.edu.pe"
            type="text"
            label={isMobile ? 'Correo' : undefined}
            className={
              isMobile
                ? 'w-full pl-2'
                : 'max-w-full md:max-w-64 md:mr-[5.5rem] pl-2'
            }
          />
          <FormFieldComponent
            control={form.control}
            name="prof_phone"
            placeholder="987654321"
            type="text"
            label={isMobile ? 'Teléfono' : undefined}
            className={isMobile ? 'w-full pl-2' : 'max-w-full md:max-w-36 pl-2'}
          />
        </div>
        <FormItem className="flex justify-center">
          <Button type="submit" className="bg-cyan-600 hover:bg-cyan-800">
            {mod ? 'Modificar' : 'Registrar'}
          </Button>
        </FormItem>
      </form>
    </Form>
  );
}
