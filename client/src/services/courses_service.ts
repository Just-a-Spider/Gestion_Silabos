import { baseURL } from '@/constants';
import { CreateCourseProps, GetCourseProps } from '@/interfaces/courses';
import { GetUserProps, RegisterProfessorProps } from '@/interfaces/user';
import axios from 'axios';
import AuthService from './auth_service';

const authURL = baseURL + 'auth/';
const authService = AuthService.getInstance();
const token = authService.getToken();

const axiosCourses = axios.create({
  baseURL: baseURL + 'courses/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

class CoursesService {
  private static instance: CoursesService;

  private constructor() {}

  public static getInstance(): CoursesService {
    if (!CoursesService.instance) {
      CoursesService.instance = new CoursesService();
    }
    return CoursesService.instance;
  }

  public async getCourses(): Promise<GetCourseProps[]> {
    try {
      const courses = await axiosCourses.get('');
      const processedCourses = courses.data.map((course: GetCourseProps) => {
        return {
          ...course,
          professorName: `${course.professor.name} ${course.professor.lastname}`,
        };
      });
      return processedCourses;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }

  public async createModifyCourse(
    course: CreateCourseProps | GetCourseProps,
    edit: boolean,
  ): Promise<GetCourseProps> {
    try {
      let response;
      if (edit) {
        response = await axiosCourses.put(
          `/${(course as GetCourseProps).id}/`,
          course,
        );
      } else {
        response = await axiosCourses.post('', course);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }

  public async downloadSilabo(courseId: string) {
    try {
      const response = await axios.get(`${baseURL}/files/${courseId}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }

  /**
   * Uploads a silabo file for a specific course.
   *
   * @param callback - A callback function to be called after the file is uploaded.
   *                   This function does not receive any arguments and does not return anything.
   */
  public async uploadSilabo(
    courseId: string,
    file: File,
    callback: () => void,
  ) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axiosCourses.post(`/${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      callback();
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }

  // PROFFESOR METHODS
  public async registerModifyProfessor(
    professor: RegisterProfessorProps | GetUserProps,
    edit: boolean,
  ) {
    try {
      let response;
      if (edit) {
        response = await axios.put(
          authURL + 'professor/' + (professor as GetUserProps).id,
          professor,
          authService.tokenAuthHeader(),
        );
      } else {
        response = await axios.post(
          authURL + 'register/professor',
          professor,
          authService.tokenAuthHeader(),
        );
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }

  public async getProfessors() {
    try {
      const professors = await axios.get(
        authURL + 'professors',
        authService.tokenAuthHeader(),
      );
      return professors.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }
}

export default CoursesService;
