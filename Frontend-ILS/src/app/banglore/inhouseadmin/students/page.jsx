"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { addOfflineStudent, fetchOfflineCourses, fetchOfflineStudents } from "../../../../redux/features/inhouseSlice";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaBook, FaArrowLeft, FaUsers, FaPlusSquare, FaTimes } from "react-icons/fa";
import Link from "next/link";

// Create a loading component
const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/banglore/inhouseadmin" className="text-gray-600 hover:text-gray-900">
            <FaArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-[#164758]">Students Enrolled</h1>
        </div>
      </div>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-[#00965f] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading students data...</p>
        </div>
      </div>
    </div>
  </div>
);

// Create the main component
function AddOfflineStudent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, message, offlineCourses = [], offlineStudents = [] } = useSelector((state) => state.inhouse);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    parentName: "",
    email: "",
    password: "",
    phone: "",
    alternativePhone: "",
    address: "",
    myCourses: {
      course: "",
      finalPrice: 0,
      paidFee: "",
      installments: 0,
      discount: 0
    },
    academicDetails: {
      qualification: "",
      institution: "",
      year: "",
      percentage: 0
    },
    profileImage: "",
    dob: "",
    gender: "",
    status: "active"
  });

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch offline courses and students when the component mounts
  useEffect(() => {
    if (mounted) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          await Promise.all([
            dispatch(fetchOfflineCourses()),
            dispatch(fetchOfflineStudents())
          ]);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [dispatch, mounted]);

  // Calculate final price based on selected course fee and manually entered registration fee
  useEffect(() => {
    const selectedCourse = offlineCourses.find(course => course?._id === formData.myCourses.course);
    const courseFee = selectedCourse?.fee || 0; // Get course fee, default to 0
    const paidFeeValue = parseFloat(formData.myCourses.paidFee) || 0; // Get manually entered paid fee, default to 0
    const discountPercentage = parseFloat(formData.myCourses.discount) || 0; // Get discount percentage, default to 0

    // Calculate discount amount: (discount * original price) / 100
    const discountAmount = (discountPercentage * courseFee) / 100;

    // Calculate final price: Course Fee - Paid Fee - Discount Amount
    const calculatedFinalPrice = courseFee - paidFeeValue - discountAmount;

    // Update the finalPrice in the form state
    setFormData(prev => ({
      ...prev,
      myCourses: {
        ...prev.myCourses,
        finalPrice: calculatedFinalPrice
      }
    }));
  }, [formData.myCourses.course, formData.myCourses.paidFee, formData.myCourses.discount, offlineCourses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields (myCourses and academicDetails)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      let processedValue = value;
      // Convert numeric inputs to numbers
      if (parent === 'myCourses' && (child === 'regFee' || child === 'finalPrice' || child === 'paidFee' || child === 'installments')) {
        processedValue = parseFloat(value) || 0;
      } else if (parent === 'academicDetails' && child === 'percentage'){
        processedValue = parseFloat(value) || 0;
      }
      
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: processedValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addOfflineStudent(formData));
      if (!error) {
        // Refresh the students list after adding a new student
        await dispatch(fetchOfflineStudents());
        // Clear the form
        setFormData({
          name: "",
          parentName: "",
          email: "",
          password: "",
          phone: "",
          alternativePhone: "",
          address: "",
          myCourses: {
            course: "",
            finalPrice: 0,
            paidFee: "",
            installments: 0,
            discount: 0
          },
          academicDetails: {
            qualification: "",
            institution: "",
            year: "",
            percentage: 0
          },
          profileImage: "",
          dob: "",
          gender: "",
          status: "active"
        });
        // Close the modal
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  // Show loading state if not mounted or loading
  if (!mounted || isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/banglore/inhouseadmin" className="text-gray-600 hover:text-gray-900">
              <FaArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-[#164758]">Students Enrolled</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#00965f] text-white rounded-lg hover:bg-[#007f4f] transition-colors flex items-center gap-2"
          >
            <FaPlusSquare className="h-5 w-5" />
            Add New Student
          </button>
        </div>

        {message && message.includes("student") && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Students List Section */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <FaUsers className="h-6 w-6 text-[#00965f]" />
              <h3 className="text-xl font-semibold text-gray-800">Enrolled Students</h3>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            {Array.isArray(offlineStudents) && offlineStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="pb-3 font-medium text-gray-600">Name</th>
                      <th className="pb-3 font-medium text-gray-600">Email</th>
                      <th className="pb-3 font-medium text-gray-600">Phone</th>
                      <th className="pb-3 font-medium text-gray-600">Course</th>
                      <th className="pb-3 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offlineStudents.map((student) => (
                      <tr key={student?._id || Math.random()} className="border-b border-gray-100">
                        <td className="py-4">{student?.name || '-'}</td>
                        <td className="py-4">{student?.email || '-'}</td>
                        <td className="py-4">{student?.phone || '-'}</td>
                        <td className="py-4">
                          {offlineCourses?.find(course => course?._id === student?.course)?.title || '-'}
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-600">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FaUsers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No students enrolled yet</p>
                <p className="text-sm text-gray-400">Start by adding your first student</p>
              </div>
            )}
          </div>
        </section>

        {/* Add Student Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Add New Student</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FaUser className="h-5 w-5 text-[#00965f]" />
                      Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Full Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                            required
                          />
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Parent/Guardian Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="parentName"
                            value={formData.parentName}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                          />
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                            required
                          />
                          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Password</label>
                        <div className="relative">
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                            required
                          />
                          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Phone Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                          />
                          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Alternative Phone</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="alternativePhone"
                            value={formData.alternativePhone}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                          />
                          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Date of Birth</label>
                        <div className="relative">
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Gender</label>
                        <div className="relative">
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">Address</label>
                      <div className="relative">
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all min-h-[80px]"
                        />
                        <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Academic Details */}
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FaBook className="h-5 w-5 text-[#00965f]" />
                      Academic Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Qualification</label>
                        <input
                          type="text"
                          name="academicDetails.qualification"
                          value={formData.academicDetails.qualification}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Institution</label>
                        <input
                          type="text"
                          name="academicDetails.institution"
                          value={formData.academicDetails.institution}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Year</label>
                        <input
                          type="text"
                          name="academicDetails.year"
                          value={formData.academicDetails.year}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Percentage</label>
                        <input
                          type="number"
                          name="academicDetails.percentage"
                          value={formData.academicDetails.percentage}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FaBook className="h-5 w-5 text-[#00965f]" />
                      Course Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Select Course</label>
                        <div className="relative">
                          <select
                            name="myCourses.course"
                            value={formData.myCourses.course}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all appearance-none"
                            required
                          >
                            <option value="">Select a course</option>
                            {Array.isArray(offlineCourses) && offlineCourses.length > 0 ? (
                              offlineCourses.map((course) => (
                                <option key={course?._id || Math.random()} value={course?._id}>
                                  {course?.title || 'Untitled Course'}
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>
                                No courses available
                              </option>
                            )}
                          </select>
                          <FaBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Course Fee</label>
                        <input
                          type="text"
                          value={offlineCourses?.find(course => course?._id === formData.myCourses.course)?.fee || '-'}
                          className="border border-gray-300 rounded-lg px-4 py-2.5 w-full bg-gray-100 cursor-not-allowed"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Discount (%)</label>
                        <div className="relative">
                          <input
                            type="number"
                            name="myCourses.discount"
                            value={formData.myCourses.discount}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Paid Fee</label>
                        <input
                          type="number"
                          name="myCourses.paidFee"
                          value={formData.myCourses.paidFee}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Final Price</label>
                        <input
                          type="number"
                          name="myCourses.finalPrice"
                          value={formData.myCourses.finalPrice}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Number of Installments</label>
                        <input
                          type="number"
                          name="myCourses.installments"
                          value={formData.myCourses.installments}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#00965f] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg font-medium bg-[#00965f] text-white hover:bg-[#007f4f] transition-colors flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding Student...
                        </>
                      ) : (
                        "Add Student"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export the component with dynamic import and no SSR
export default dynamic(() => Promise.resolve(AddOfflineStudent), {
  ssr: false,
  loading: () => <LoadingState />
});