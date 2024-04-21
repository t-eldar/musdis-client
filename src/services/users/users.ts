import requestHandler from "@services/request-handler";
import axios from "axios";

type SignInRequest = {
  userNameOrEmail: string;
  password: string;
};

type AuthenticatedUser = {
  id: string;
  userName: string;
  email: string;
  avatarUrl: string;
  jwt: string;
  additionalClaims: Record<string, string>;
};

const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_SERVER_URL,
});

// TODO: add validation with zod
export async function signIn(request: SignInRequest) {
  const handler = requestHandler<undefined, AuthenticatedUser>(() =>
    client.post("/users/sign-in", request)
  );
  
  return await handler();
}
