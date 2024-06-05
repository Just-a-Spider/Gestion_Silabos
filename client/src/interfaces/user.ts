export interface LoginProps {
  code: string;
  password: string;
}

export interface RegisterProps {
  code: string;
  email: string;
  password: string;
}

export interface RegisterProfessorProps {
  prof_name: string;
  prof_lastname: string;
  prof_email: string;
  prof_code: string;
  prof_phone: string;
}

export interface GetUserProps {
  id: string;
  cycle: string | null;
  code: string;
  dni: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
}
