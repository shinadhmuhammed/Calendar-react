import { useState, useEffect } from "react";
import createAxios from "../Services/Axios";

interface Manager {
  _id: string;
  username: string;
}

export const useManagers = () => {
  const [managers, setManagers] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const axiosInstance = createAxios();
        const response = await axiosInstance.get("/manager");
        const managerData = response.data.map((manager: Manager) => ({
          id: manager._id,
          name: manager.username,
        }));
        setManagers(managerData);
      } catch (error) {
        setError("Error fetching managers");
        console.error("Error fetching managers", error);
      }
    };

    fetchManagers();
  }, []);

  return { managers, error };
};
