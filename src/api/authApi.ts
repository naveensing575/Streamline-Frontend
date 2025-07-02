import axiosInstance from "./axios";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: LoginPayload) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

