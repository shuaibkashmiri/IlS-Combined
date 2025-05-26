"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { useEffect } from "react";

const Authorized = () => {
const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user-auth`;
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const res = await axios.get(url, {
        withCredentials: true,
      });
      console.log(res.data);
      if (res.data.success === true) {
        return true;
      } else {
        return router.push("/banglore");
      }
    } catch (error) {
      console.log(error);
      toast.error("Authentication failed");
      router.push("/");
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line
  }, []);
};

export default Authorized;
