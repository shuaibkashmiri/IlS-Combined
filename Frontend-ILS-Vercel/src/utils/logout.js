import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const handleLogout = () => {
  // Clear all localStorage items
  localStorage.clear();

  // Clear all sessionStorage items
  sessionStorage.clear();

  // Clear all cookies
  document.cookie.split(";").forEach((cookie) => {
    const [name] = cookie.trim().split("=");
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });

  // Clear any auth tokens or specific items
  localStorage.removeItem("inHouseStudent");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("auth");
  localStorage.removeItem("persist:root");

  // Clear any other specific items you might have
  localStorage.removeItem("selectedCourse");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("wishlistItems");

  // Show success message
  toast.success("Logged out successfully");

  // Redirect to login page
  window.location.href = "/";
};
