import { FormFieldComponent } from '@/components/forms/form_field';
import { Button } from '@/components/ui/button';
import { Form, FormItem } from '@/components/ui/form';
import { currentCycle } from '@/constants';
import { GetCourseProps } from '@/interfaces/courses';
import { GetUserProps } from '@/interfaces/user';
import CoursesService from '@/services/courses_service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { SelectFormField } from '../dropdown_field';

const CourseSchema = z.object({
  cycle: z.string().min(1, 'El ciclo es requerido'),
  name: z.string().min(1, 'El nombre es requerido'),
  semester: z.string().min(1, 'El semestre es requerido'),
  professor: z.string().min(1, 'El profesor es requerido'),
});

export function CreateCourseForm({
  onCourseCreated,
  professors,
  isMobile = false,
  courseToModify,
}: {
  // Callback function to be called when a course is created.
  onCourseCreated: (newCourse: any) => void; // TODO: Replace any with the type of newCourse
  professors: GetUserProps[];
  isMobile?: boolean;
  courseToModify?: GetCourseProps; // TODO: Replace any with the type of courseToModify
}) {
  const coursesService = CoursesService.getInstance();
  let mod = false;

  if (courseToModify) {
    mod = true;
  }

  /**
   * Using an array of objects to represent the cycles again
   * because the cycles are not fetched from the server.
   */
  const cycles = Array.from({ length: 14 }, (_, i) => ({
    id: (i + 1).toString(),
    value: (i + 1).toString(),
  }));

  const form = useForm<z.infer<typeof CourseSchema>>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      cycle: courseToModify?.cycle || '',
      name: courseToModify?.name || '',
      semester: currentCycle,
      professor: '',
    },
  });

  async function createModifyCourse(data: z.infer<typeof CourseSchema>) {
    let newCourse; // Declare the newCourse variable

    try {
      if (mod) {
        newCourse = await coursesService.createModifyCourse(
          { ...data, id: courseToModify?.id },
          mod,
        );
      } else {
        newCourse = await coursesService.createModifyCourse(data, mod);
      }
      onCourseCreated(newCourse);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(createModifyCourse)}
        className={
          isMobile
            ? 'flex flex-col justify-start space-y-4 mb-4'
            : 'flex justify-start space-x-11'
        }
      >
        <SelectFormField
          control={form.control}
          name="cycle"
          placeholder="1"
          label={isMobile ? 'Ciclo' : undefined}
          options={cycles}
          className={
            isMobile ? 'w-full pl-2' : 'max-w-full md:max-w-12 md:mr-2 pl-2'
          }
        />
        <FormFieldComponent
          control={form.control}
          name="semester"
          placeholder={courseToModify?.semester || currentCycle}
          type="text"
          label={isMobile ? 'Semestre' : undefined}
          className={
            isMobile ? 'w-full pl-2' : 'max-w-full md:max-w-24 md:mr-3 pl-2'
          }
        />
        <FormFieldComponent
          control={form.control}
          name="name"
          placeholder={courseToModify?.name || ''}
          type="text"
          label={isMobile ? 'Nombre' : undefined}
          className={
            isMobile
              ? 'w-full pl-2'
              : 'max-w-full md:max-w-80 md:mr-[6.5rem] pl-2'
          }
        />
        <SelectFormField
          control={form.control}
          name="professor"
          placeholder={
            courseToModify && courseToModify.professor
              ? `${courseToModify.professor.name} ${courseToModify.professor.lastname}`
              : 'Profesor'
          }
          options={professors}
          label={isMobile ? 'Profesor' : undefined}
          className={
            isMobile ? 'w-full pl-2' : 'max-w-full md:max-w-44 md:mr-32 pl-2'
          }
        />
        <FormItem className="flex justify-center">
          <Button type="submit" className="bg-cyan-600 hover:bg-cyan-800">
            {mod ? 'Modificar' : 'Crear'}
          </Button>
        </FormItem>
      </form>
    </Form>
  );
}
