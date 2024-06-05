'use client';

import { createCourseColumns, profColumns } from '@/components/tables/columns';
import { CoursesTable } from '@/components/tables/courses-table';
import { ProfessorsTable } from '@/components/tables/professors-table';
import { GetCourseProps } from '@/interfaces/courses';
import { GetUserProps } from '@/interfaces/user';
import CoursesService from '@/services/courses_service';
import { ColumnDef } from '@tanstack/react-table';
import { memo, useCallback, useEffect, useState } from 'react';

interface ViewProps {
  role: string;
  showProfessors?: boolean;
}

/**
 * Main view component.
 *
 * @param role - The role of the user.
 * @param showProfessors - Whether to show professors or not.
 * @returns The main view component.
 */
export default function MainView({ role, showProfessors = false }: ViewProps) {
  const coursesService = CoursesService.getInstance();

  const [courses, setCourses] = useState<GetCourseProps[] | []>([]);
  const [professors, setProfessors] = useState<GetUserProps[] | []>([]);

  /**
   * Fetches the courses from the server.
   * We use useCallback to memoize the function and avoid re-rendering.
   * We also compare using JSON.stringify to get the new data.
   */
  const fetchCourses = useCallback(() => {
    coursesService.getCourses().then((newCourses) => {
      if (JSON.stringify(newCourses) !== JSON.stringify(courses)) {
        setCourses(newCourses);
      }
    });
  }, [courses]);

  /**
   * Creates the course columns based on the user's role.
   * We pass the fetchCourses function to the columns to update the data on course creation.
   */
  const courseColumns = createCourseColumns(role, fetchCourses);

  /**
   * Fetches the professors from the server.
   * Only fetches if the professors are shown.
   */
  const fetchProfessors = useCallback(() => {
    coursesService.getProfessors().then((newProfessors) => {
      if (JSON.stringify(newProfessors) !== JSON.stringify(professors)) {
        setProfessors(newProfessors);
      }
    });
  }, [professors]);

  /**
   * Memoized tables. We use memo to store the tables in memory. and avoid re-rendering them.
   * Only re-renders when a new fetch and a new set of data is available.
   */
  const MemoizedCoursesTable = memo(CoursesTable);
  const MemoizedProfessorsTable = memo(ProfessorsTable);

  useEffect(() => {
    fetchCourses();
    if (showProfessors) {
      fetchProfessors();
    }
  }, [showProfessors]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl">Cursos</h2>
      <div className="overflow-x-auto flex flex-col justify-center items-center">
        <MemoizedCoursesTable
          columns={courseColumns as ColumnDef<unknown, unknown>[]}
          data={courses}
          role={role}
          professors={professors}
          onCourseCreated={fetchCourses}
        />
      </div>
      {showProfessors && (
        <>
          <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl mt-6">
            Profesores
          </h2>
          <div className="overflow-x-auto">
            <MemoizedProfessorsTable
              columns={profColumns as ColumnDef<unknown, unknown>[]}
              data={professors}
              onProfessorRegistered={fetchProfessors}
              role={role}
            />
          </div>
        </>
      )}
    </div>
  );
}
