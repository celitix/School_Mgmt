export interface IUserTokenInfo {
  id: string;
  role: role[];
  iat: number;
  exp: number;
}

type role = {
  id: number;
  name: string;
};

export enum UserRoles {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPER_ADMIN',
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ACCOUNTANT = 'ACCOUNTANT',
  CLERK = 'CLERK',
  PARENT = 'PARENT',
}
