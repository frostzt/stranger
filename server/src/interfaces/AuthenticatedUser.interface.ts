interface AuthenticatedUser {
  name: string;
  email: string;
  role?: string;
  username: string;
  createdAt?: Date;
  servers?: string[];
}

export default AuthenticatedUser;
