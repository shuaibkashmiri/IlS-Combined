const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        {/* Outer circle */}
        <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
        {/* Spinning circle */}
        <div className="w-12 h-12 rounded-full border-4 border-[#00965f] border-t-transparent absolute top-0 left-0 animate-spin"></div>
      </div>
      <span className="ml-3 text-lg text-gray-600">Loading...</span>
    </div>
  );
};

export default Loading;
