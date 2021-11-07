import { sign } from 'jsonwebtoken';

class AuthenticationProvider {
  private static authProviderInstance: AuthenticationProvider;

  public static getInstance(): AuthenticationProvider {
    if (!AuthenticationProvider.authProviderInstance) {
      AuthenticationProvider.authProviderInstance = new AuthenticationProvider();
    }

    return AuthenticationProvider.authProviderInstance;
  }

  // The envs are always available NOT to be provided in code
  public signToken(payload: any) {
    return sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }
}

export default AuthenticationProvider;
