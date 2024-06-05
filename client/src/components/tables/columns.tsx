'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { baseURL } from '@/constants';
import { GetCourseProps } from '@/interfaces/courses';
import { GetUserProps } from '@/interfaces/user';
import CoursesService from '@/services/courses_service';
import { ColumnDef } from '@tanstack/react-table';

const coursesService = CoursesService.getInstance();

/**
 * Creates an array of course columns based on the user's role and a function to fetch courses.
 *
 * @param role - The user's role (e.g., "professor", "student").
 * @param fetchCourses - This function is called when a course is created or updated.
 *                        We pass this directly from the component that creates the Columns
 *                        because we need to update the data in the table when a course is created or updated.
 * @returns An array of course columns.
 */
export function createCourseColumns(role: string, fetchCourses: () => void) {
  let courseColumns: ColumnDef<GetCourseProps>[] = [
    // Column for "Ciclo"
    {
      header: 'Ciclo',
      accessorKey: 'cycle',
    },
    // Column for "Semestre"
    {
      header: 'Semestre',
      accessorKey: 'semester',
    },
    // Column for "Nombre"
    {
      header: 'Nombre',
      accessorKey: 'name',
    },
    // Column for "Profesor"
    {
      header: 'Profesor',
      accessorKey: 'professorName',
    },
    // Column for "Descargar Sílabo"
    {
      header: 'Descargar Sílabo',
      accessorKey: 'silabo_pdf',
      cell: ({ row }) => {
        if (row.original.silabo_pdf !== null) {
          return (
            <a
              href={`${baseURL}file/silabo/${row.original.silabo_pdf}`}
              download
              className="text-cyan-600"
            >
              {String(row.original.silabo_pdf)}
            </a>
          );
        } else {
          return <Label> No se ha subido todavía </Label>;
        }
      },
    },
    // Column for "Programa Académico" (commented out)
    //{
    //  header: 'Programa Académico',
    //  accessorKey: 'career',
    //},
  ];

  // Add column for "Subir/Cambiar Sílabo" if the user is a professor
  if (role === 'professor') {
    courseColumns.push({
      header: 'Subir/Cambiar Sílabo',
      accessorKey: 'id',
      cell: ({ row }) => {
        return (
          <Input
            id={`silabo-${row.original.id}`}
            type="file"
            /**
             * This method of onChange is used to upload the file to the server.
             * @param e - The event object.
             * @param fetchCourses - The function to fetch courses. We use this here to
             *                       update the table after the file is uploaded.
             */
            onChange={(e) => {
              if (e.target.files) {
                coursesService.uploadSilabo(
                  row.original.id,
                  e.target.files[0],
                  fetchCourses,
                );
              }
            }}
          />
        );
      },
    });
  }

  return courseColumns;
}

export function addCourseColumns() {}

export const profColumns: ColumnDef<GetUserProps>[] = [
  {
    header: 'Código',
    accessorKey: 'code',
  },
  {
    header: 'DNI',
    accessorKey: 'dni',
  },
  {
    header: 'Nombre',
    accessorKey: 'name',
  },
  {
    header: 'Apellido',
    accessorKey: 'lastname',
  },
  {
    header: 'Correo',
    accessorKey: 'email',
  },
  {
    header: 'Teléfono',
    accessorKey: 'phone',
  },
];
