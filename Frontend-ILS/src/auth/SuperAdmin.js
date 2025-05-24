import { toast } from "sonner";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const IsSuperAdmin = () => {
  const router = useRouter();
const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/superadmin-auth`;
  const checkSuperAdmin = async () => {
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
    checkSuperAdmin();
  }, []);
};

export default IsSuperAdmin;
