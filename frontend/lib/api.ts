import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  withCredentials: false,
});

// Attach token if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ga_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('ga_token');
      localStorage.removeItem('ga_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// ── Registration ─────────────────────────────────────────────────────────────
export const registrationApi = {
  submit: (data: RegistrationPayload) => api.post('/registrations', data),
  setupAccount: (data: AccountSetupPayload) => api.post('/auth/setup-account', data),
  checkUsername: (username: string) => api.get(`/auth/check-username/${username}`),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  getStudents: (params?: { page?: number; search?: string; status?: string }) =>
    api.get('/admin/students', { params }),
  getStudent: (id: number) => api.get(`/admin/students/${id}`),
  updateStatus: (id: number, status: string) =>
    api.patch(`/admin/students/${id}/status`, { status }),
  deleteStudent: (id: number) => api.delete(`/admin/students/${id}`),

  getPosts: (params?: { page?: number }) => api.get('/admin/posts', { params }),
  createPost: (data: PostPayload) => api.post('/admin/posts', data),
  updatePost: (id: number, data: Partial<PostPayload>) => api.put(`/admin/posts/${id}`, data),
  deletePost: (id: number) => api.delete(`/admin/posts/${id}`),
  togglePublish: (id: number) => api.patch(`/admin/posts/${id}/toggle-publish`),
};

// ── Public ─────────────────────────────────────────────────────────────────
export const publicApi = {
  getPosts: () => api.get('/posts'),
};

// ── Types ────────────────────────────────────────────────────────────────────
export interface RegistrationPayload {
  name_en: string;
  name_am: string;
  phone: string;
  grade: string;
  purpose: string;
  referral: string;
  lang: string;
}

export interface AccountSetupPayload {
  registration_id: number;
  username: string;
  password: string;
  password_confirmation: string;
}

export interface PostPayload {
  title_en: string;
  title_am: string;
  body_en: string;
  body_am: string;
  type: 'announcement' | 'news' | 'tip';
  is_published: boolean;
}
