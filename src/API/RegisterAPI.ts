import createAxios from "../Services/Axios";
import { Manager, RegisterFormData } from "../Types/Type";

export const fetchManagers = async (): Promise<Manager[]> => {
  const axiosInstance = createAxios();
  const response = await axiosInstance.get("/manager");
  const managers = response.data.map(
    (manager: { _id: string; username: string }) => ({
      id: manager._id,
      name: manager.username,
    })
  );
  return managers;
};

export const registerUser = async (formData: RegisterFormData) => {
  const axiosInstance = createAxios();
  const response = await axiosInstance.post("/signup", {
    name: formData.username,
    email: formData.email,
    password: formData.password,
    role: formData.role,
    managerId: formData.role === "Employee" ? formData.managerId : undefined,
  });
  return response.data;
};
