import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

import { authService } from '../services/authService';
import { courseService } from "../services/courseService";

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
        const fbRes = await fetch("http://localhost:8080/api/feedback");
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
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Student Dashboard</h1>
          <p className="text-sm text-gray-500">
            {user?.email}
          </p>
        </div>

        <Button onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2"/>
          Logout
        </Button>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Courses</p>
              <h2 className="text-2xl font-bold">{courses.length}</h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Feedbacks Given</p>
              <h2 className="text-2xl font-bold">{feedbacks.length}</h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Semester</p>
              <h2 className="text-lg font-semibold">ODD 2026</h2>
            </CardContent>
          </Card>

        </div>

        {/* ================= FEEDBACK ACTIONS ================= */}
        <div className="grid md:grid-cols-3 gap-4">
          {feedbackOptions.map((opt, i)=>(
            <Card
              key={i}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={()=>navigate(opt.path)}
            >
              <CardContent className="p-6 text-center space-y-3">

                <div className={`${opt.color} p-3 rounded-full inline-block`}>
                  <opt.icon className="text-white"/>
                </div>

                <h3 className="font-semibold">{opt.title}</h3>

                <Button variant="outline" className="w-full">
                  Start
                </Button>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* ================= RECENT FEEDBACK ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>

          <CardContent>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : feedbacks.length === 0 ? (
              <p className="text-gray-500">No feedback submitted</p>
            ) : (
              feedbacks.slice(-5).reverse().map(f => (
                <div key={f.id} className="border-b py-2 text-sm">
                  <span className="font-medium">{f.targetName}</span>
                  {" "}⭐ {f.rating}
                </div>
              ))
            )}

          </CardContent>
        </Card>

        {/* ================= COURSES ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Available Courses</CardTitle>
          </CardHeader>

          <CardContent>

            {loading ? (
              <p className="text-gray-500">Loading courses...</p>
            ) : courses.length === 0 ? (
              <p className="text-gray-500">No courses available</p>
            ) : (
              <div className="space-y-2">
                {courses.map(c => (
                  <div
                    key={c.id}
                    className="border p-3 rounded hover:bg-gray-50"
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

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
