import createAxios from "../Services/Axios";

export const loginUser = async (email: string, password: string) => {
  const axiosInstance = createAxios();

  try {
    const response = await axiosInstance.post("/login", {
      email,
      password,
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};
