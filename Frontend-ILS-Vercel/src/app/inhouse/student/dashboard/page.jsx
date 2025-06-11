"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const OfflineStudentDashboard = () => {
  const { currentStudent } = useSelector((state) => state.inhouse);
  
  // Hardcoded data for demonstration
  const studentData = {
    name: "John Doe",
    course: "Web Development Bootcamp",
    progress: 65,
    upcomingClasses: [
      {
        subject: "React.js Fundamentals",
        time: "10:00 AM",
        date: "2024-03-20",
        instructor: "Sarah Wilson",
      },
      {
        subject: "Node.js Backend",
        time: "2:00 PM",
        date: "2024-03-21",
        instructor: "Mike Johnson",
      },
    ],
    recentAssignments: [
      {
        title: "React Components Project",
        dueDate: "2024-03-25",
        status: "Pending",
      },
      {
        title: "Node.js API Development",
        dueDate: "2024-03-28",
        status: "Completed",
      },
    ],
    courseDetails: {
      duration: "6 months",
      startDate: "2024-01-15",
      endDate: "2024-07-15",
      totalModules: 12,
      completedModules: 8,
    },
    paymentStatus: {
      totalFee: 50000,
      paidAmount: 35000,
      remainingAmount: 15000,
      nextInstallment: "2024-04-15",
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <div className="flex items-center space-x-4">
              <UserCircleIcon className="h-8 w-8 text-gray-600" />
              <span className="text-gray-700 font-medium">{studentData.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Course Progress Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Course Progress</h2>
            <span className="text-sm text-gray-500">{studentData.course}</span>
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                  Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  {studentData.progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
              <div
                style={{ width: `${studentData.progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Course Details Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <BookOpenIcon className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Course Details</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="text-gray-900">{studentData.courseDetails.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date</span>
                <span className="text-gray-900">{studentData.courseDetails.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Date</span>
                <span className="text-gray-900">{studentData.courseDetails.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Modules Completed</span>
                <span className="text-gray-900">
                  {studentData.courseDetails.completedModules}/{studentData.courseDetails.totalModules}
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Classes Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <CalendarIcon className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Classes</h3>
            </div>
            <div className="space-y-4">
              {studentData.upcomingClasses.map((class_, index) => (
                <div key={index} className="border-l-4 border-indigo-500 pl-4">
                  <h4 className="font-medium text-gray-900">{class_.subject}</h4>
                  <div className="text-sm text-gray-600">
                    <p>{class_.date} at {class_.time}</p>
                    <p>Instructor: {class_.instructor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <CurrencyDollarIcon className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Fee</span>
                <span className="text-gray-900">₹{studentData.paymentStatus.totalFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paid Amount</span>
                <span className="text-green-600">₹{studentData.paymentStatus.paidAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining</span>
                <span className="text-red-600">₹{studentData.paymentStatus.remainingAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Installment</span>
                <span className="text-gray-900">{studentData.paymentStatus.nextInstallment}</span>
              </div>
            </div>
          </div>

          {/* Recent Assignments Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <AcademicCapIcon className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Assignments</h3>
            </div>
            <div className="space-y-4">
              {studentData.recentAssignments.map((assignment, index) => (
                <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                  <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Due: {assignment.dueDate}</span>
                    <span
                      className={`${
                        assignment.status === "Completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Attendance</p>
                <p className="text-2xl font-semibold text-indigo-600">85%</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Assignments</p>
                <p className="text-2xl font-semibold text-green-600">12/15</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Projects</p>
                <p className="text-2xl font-semibold text-yellow-600">3/4</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Certificates</p>
                <p className="text-2xl font-semibold text-purple-600">2</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfflineStudentDashboard;
