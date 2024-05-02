import {
  AuthenticatedUser,
  SignInRequest,
} from "@services/authentication/authentication";

export async function signIn(
  request: SignInRequest
): Promise<AuthenticatedUser> {
  return {
    id: "d72bd2b6-044f-444e-962d-5669050fc918",
    userName: request.userNameOrEmail,
    email: "string@mail.com",
    avatarUrl: "string",
    jwt: "token",
  };
}
