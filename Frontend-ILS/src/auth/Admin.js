import { toast } from "sonner";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const IsAdmin = () => {
  const router = useRouter();
  const url = "http://localhost:8080/api/auth/admin-auth";
  // const url = "https://ils-project.onrender.com/api/auth/admin-auth";

  const checkAdmin = async () => {
    try {
      const res = await axios.get(url, {
        withCredentials: true,
      });
      if (res.data.success === true) {
        return true;
      } else {
        toast.error("You are not authorized to access this page");
        router.replace("/banglore");
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("You are not authorized to access this page");
      router.replace("/banglore");
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);
};

export default IsAdmin;
