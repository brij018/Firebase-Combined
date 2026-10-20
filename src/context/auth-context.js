import { createContext } from "react";

const authContext = createContext({
  user: null,
  loading: true,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
  loginAnonymouslyUser: async () => {},
  logout: async () => {},
});

export default authContext;
