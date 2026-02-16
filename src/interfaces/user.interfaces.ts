export interface IUserTokenInfo {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export enum UserRoles {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPER_ADMIN',
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ACCOUNTANT = 'ACCOUNTANT',
  CLERK = 'CLERK',
}
