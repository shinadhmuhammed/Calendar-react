import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../API/LoginAPI";
import axios from "axios";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.email.includes("@")) {
      setError("Invalid email format.");
      return;
    }

    try {
      const response = await loginUser(formData.email, formData.password);
      if (response.status === 200) {
        navigate("/calendar");
        localStorage.setItem("token", response.data.token);
      } else {
        const message =
          response.data.message || "Login failed. Please try again.";
        setError(message);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data.message ||
            "An error occurred. Please try again later."
        );
      } else if (error instanceof Error) {
        setError(error.message || "An error occurred. Please try again later.");
      } else {
        setError("An unknown error occurred. Please try again later.");
      }
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-gray-600">
          Don't have an account?
          <a
            href="/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
