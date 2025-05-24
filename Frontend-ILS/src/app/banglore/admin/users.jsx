"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function AdminUsers() {
  const router = useRouter();

  useEffect(() => {
    router.push("/banglore/admin/students");
  }, [router]);

  return null;
}

export default AdminUsers;
