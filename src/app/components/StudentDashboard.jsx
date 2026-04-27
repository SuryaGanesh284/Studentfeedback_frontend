import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

import { authService } from '../services/authService';
import { courseService } from "../services/courseService";
import { apiUrl } from "../config/api";

import { LogOut, BookOpen, UserCheck, Building2 } from 'lucide-react';

export default function StudentDashboard() {

  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = authService.getCurrentUser();

  // ================= LOAD DATA =================
  useEffect(() => {
    const loadData = async () => {
      try {
        // Courses
        const courseRes = await courseService.getAllCourses();
        setCourses(courseRes || []);

        // Feedbacks (NO FILTER → FIXED ISSUE)
        const fbRes = await fetch(apiUrl("/api/feedback"));
        const fbData = await fbRes.json();
       const myFeedbacks = fbData.filter(
  (f) => f.studentName === user?.email
);

setFeedbacks(myFeedbacks);


      } catch (err) {
        console.log("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // ================= FEEDBACK OPTIONS =================
  const feedbackOptions = [
    {
      title: 'Course Feedback',
      icon: BookOpen,
      path: '/student/feedback/course',
      color: 'bg-blue-500'
    },
    {
      title: 'Instructor Feedback',
      icon: UserCheck,
      path: '/student/feedback/instructor',
      color: 'bg-green-500'
    },
    {
      title: 'Service Feedback',
      icon: Building2,
      path: '/student/feedback/services',
      color: 'bg-purple-500'
    }
  ];

 return (
  <div className="min-h-screen bg-gray-100 flex">

    {/* SIDEBAR */}
    <div className="hidden md:flex w-64 bg-white shadow-lg flex-col p-6">

      <h2 className="text-xl font-bold mb-8">Student Panel</h2>

      <div className="space-y-3">
        <Button variant="ghost" className="justify-start">
          Dashboard
        </Button>

        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => navigate('/student/feedback/course')}
        >
          Course Feedback
        </Button>

        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => navigate('/student/feedback/instructor')}
        >
          Instructor Feedback
        </Button>

        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => navigate('/student/feedback/services')}
        >
          Service Feedback
        </Button>
      </div>

      <div className="mt-auto">
        <Button onClick={handleLogout} className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

    </div>

    {/* MAIN */}
    <div className="flex-1 p-6 space-y-6">

      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <p className="text-gray-500 text-sm">Courses</p>
          <h2 className="text-3xl font-bold">{courses.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <p className="text-gray-500 text-sm">Feedbacks</p>
          <h2 className="text-3xl font-bold">{feedbacks.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <p className="text-gray-500 text-sm">Semester</p>
          <h2 className="text-lg font-semibold">ODD 2026</h2>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-3 gap-6">
        {feedbackOptions.map((opt, i) => (
          <div
            key={i}
            onClick={() => navigate(opt.path)}
            className="bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition"
          >
            <div className="flex flex-col items-center space-y-3">

              <div className={`${opt.color} p-3 rounded-full`}>
                <opt.icon className="text-white" />
              </div>

              <h3 className="font-semibold">{opt.title}</h3>

              <Button variant="outline" className="w-full">
                Start
              </Button>

            </div>
          </div>
        ))}
      </div>

      {/* TWO COLUMN SECTION */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* RECENT FEEDBACK */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="font-semibold mb-4">Recent Feedback</h2>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : feedbacks.length === 0 ? (
            <p className="text-gray-500">No feedback submitted</p>
          ) : (
            feedbacks.slice(-5).reverse().map(f => (
              <div key={f.id} className="border-b py-2 text-sm flex justify-between">
                <span>{f.targetName}</span>
                <span>⭐ {f.rating}</span>
              </div>
            ))
          )}
        </div>

        {/* COURSES */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="font-semibold mb-4">Courses</h2>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="text-gray-500">No courses available</p>
          ) : (
            <div className="space-y-3">
              {courses.map(c => (
                <div
                  key={c.id}
                  className="p-3 rounded-lg border hover:bg-gray-50"
                >
                  <div className="font-medium">
                    {c.name} ({c.code || "N/A"})
                  </div>
                  <div className="text-sm text-gray-500">
                    {c.instructor || "N/A"} • {c.department || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  </div>
);
}
