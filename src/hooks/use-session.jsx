import useUserStore from "@/lib/AuthZustand";
import { responseHandler } from "@/lib/utils";
import { ServiceSession } from "@/Services/Auth/Auth.services";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const useSession = () => {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUserStore();
  const fetchSession = async () => {
    setLoading(true);

    try {
      const response = await ServiceSession(localStorage.getItem("token"));
      setUser(response.data);
    } catch (error) {
      responseHandler(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);
  return { loading, fetchSession, user };
};

export default useSession;
