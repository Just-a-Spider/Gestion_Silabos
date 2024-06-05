import { GetUserProps } from './user';

export interface GetCourseProps {
  id: string;
  name: string;
  cycle: string;
  semester: string;
  career: string;
  silabo_pdf: File | null;
  professor: GetUserProps;
}

export interface CreateCourseProps {
  cycle: string;
  name: string;
  semester: string;
  professor: string;
}

export interface UploadSilaboProps {
  courseId: string;
  file: File;
}
