import { baseURL } from '@/constants';
import { LoginProps, RegisterProps } from '@/interfaces/user';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const axiosAuth = axios.create({
  baseURL: baseURL + 'auth/',
  headers: {
    'Content-Type': 'application/json',
  },
});

class AuthService {
  // SINGLETON
  // Instance is used to keep the token in memory and to manage the token change listeners
  // Basically this is a class with only one instance
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // TOKEN MANAGEMENT
  // SETTING AND GETTING TOKEN
  public setItem(key: string, value: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
    if (key === 'token') {
      this.emitTokenChange(value);
    }
  }

  public setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      this.emitTokenChange(token); // Emit token change event
    }
  }

  public getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  public getCareerAndRole() {
    const token = this.getToken();
    if (token && token.split('.').length === 3) {
      const decoded: any = jwtDecode(token);
      return { career: decoded.career, role: decoded.role };
    }
    return null;
  }

  // AUTHENTICATION HEADERS
  public tokenAuthHeader() {
    const token = this.getToken();
    return token
      ? {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      : {};
  }

  // TOKEN CHANGE LISTENERS
  // These are used to update the token in the AuthService when it changes
  private tokenChangeListeners: Array<(token: string | null) => void> = [];

  public onTokenChange(listener: (token: string | null) => void) {
    this.tokenChangeListeners.push(listener);
  }

  public offTokenChange(listener: (token: string | null) => void) {
    this.tokenChangeListeners = this.tokenChangeListeners.filter(
      (l) => l !== listener,
    );
  }

  private emitTokenChange(token: string | null) {
    for (const listener of this.tokenChangeListeners) {
      listener(token);
    }
  }

  // AUTHENTICATION METHODS
  public async register(registerProps: RegisterProps): Promise<void> {
    try {
      const response = await axiosAuth.post('signup/', registerProps);
      if (response.status !== 201) {
        throw new Error('Error registrando usuario');
      }
    } catch (error: any) {
      throw error;
    }
  }

  public async login(loginProps: LoginProps): Promise<void> {
    try {
      const response = await axiosAuth.post('signin/', loginProps);
      if (response.status !== 201) {
        throw new Error('Credenciales incorrectas');
      }
      this.setToken(response.data.accessToken);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        throw new Error('Credenciales incorrectas');
      }
      throw error;
    }
  }

  public async logout() {
    localStorage.removeItem('token');
  }

  // EMAIL VERIFICATION
  public async verifyEmail(key: string): Promise<string> {
    try {
      const response = await axiosAuth.post('register/verify-email/', { key });
      return 'Email verified!';
    } catch (error) {
      return 'Error verifying email';
    }
  }
}

export default AuthService;
