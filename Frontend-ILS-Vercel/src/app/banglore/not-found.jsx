"use client";

import { useRouter } from "next/navigation";

const PageNotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-9xl font-bold text-[#00965f]">404</h1>

        <div className="mb-8">
          <div className="text-5xl font-medium text-gray-800 mb-4">Oops!</div>
          <div className="text-gray-600 text-xl">
            The page you're looking for doesn't exist.
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/banglore")}
            className="bg-[#00965f] text-white px-8 py-3 rounded-lg hover:bg-[#164758] transition-colors duration-300 inline-flex items-center space-x-2"
          >
            <span>Back to Home</span>
          </button>

          <div className="text-gray-500 mt-4">
            If you think this is a mistake, please{" "}
            <button
              onClick={() => router.push("/banglore/contact")}
              className="text-[#00965f] hover:underline"
            >
              contact us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
