import axiosInstance from "./axios";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  avatar?: File | null;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);
  if (data.avatar) formData.append("avatar", data.avatar);

  const res = await axiosInstance.post("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const loginUser = async (data: LoginPayload) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const getMe = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};
