import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


import {
  Card, CardContent, CardHeader, CardTitle
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "./ui/tabs";
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

import { authService } from "../services/authService";
import { courseService } from "../services/courseService";
import { apiUrl } from "../config/api";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [services, setServices] = useState([]);
  const [instructors, setInstructors] = useState([]);
const[students,setStudents] = useState([]);
  const [courseForm, setCourseForm] = useState({
    code: "", name: "", department: "", instructor: ""
  });

  const [serviceForm, setServiceForm] = useState({
    name: "", description: ""
  });

  const [instructorForm, setInstructorForm] = useState({
    name: "", department: "", email: ""
  });
  

const [search, setSearch] = useState("");
const [typeFilter, setTypeFilter] = useState("");




  useEffect(() => {
    loadAll();
  }, []);
  const safeJson = async (res) => {
  if (!res.ok) {
    console.error("API Error:", res.status);
    return [];
  }

  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

  const loadAll = async () => {
    const safeJson = async (res) => {
  try {
    if (!res.ok) {
      console.error("API Error:", res.status);
      return [];
    }

    const contentType = res.headers.get("content-type");

    // ✅ If no JSON response, return empty
    if (!contentType || !contentType.includes("application/json")) {
      return [];
    }

    return await res.json();

  } catch (err) {
    console.error("Safe JSON Error:", err);
    return [];
  }
};
    const token = authService.getToken();

const [fb, c, s, i, stu] = await Promise.all([
  fetch(apiUrl("/api/feedback")).then(r => r.json()),
  courseService.getAllCourses(),
  fetch(apiUrl("/api/service"), { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
  fetch(apiUrl("/api/instructor"), { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
 
]);

setFeedbacks(fb || []);
setCourses(c || []);
setServices(s || []);
setInstructors(i || []);
setStudents(stu || []);

  };

  // ================= ADD =================

  const addCourse = async () => {
    await courseService.addCourse(courseForm);
    setCourseForm({ code:"", name:"", department:"", instructor:"" });
    loadAll();
  };

  const addService = async () => {
    const token = authService.getToken();
    await fetch(apiUrl("/api/service"), {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify(serviceForm)
    });
    setServiceForm({ name:"", description:"" });
    loadAll();
  };

  const addInstructor = async () => {
    const token = authService.getToken();
    await fetch(apiUrl("/api/instructor"), {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify(instructorForm)
    });
    setInstructorForm({ name:"", department:"", email:"" });
    loadAll();
  };

  // ================= DELETE =================

  const deleteCourse = async (id) => {
    await courseService.deleteCourse(id);
    loadAll();
  };

  const deleteService = async (id) => {
    const token = authService.getToken();
    await fetch(apiUrl(`/api/service/${id}`), {
      method:"DELETE",
      headers:{ Authorization:`Bearer ${token}` }
    });
    loadAll();
  };

  const deleteInstructor = async (id) => {
    const token = authService.getToken();
    await fetch(apiUrl(`/api/instructor/${id}`), {
      method:"DELETE",
      headers:{ Authorization:`Bearer ${token}` }
    });
    loadAll();
  };

  // ================= PDF =================

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Feedback Report", 14, 10);

    autoTable(doc, {
      head: [["Category", "Rating", "Comments"]],
      body: feedbacks.map(f => [f.category, f.rating, f.comments])
    });

    doc.save("feedback.pdf");
  };

  // ================= ANALYTICS =================

  const analytics = useMemo(() => ({
    total: feedbacks.length,
    avg: (feedbacks.reduce((a,b)=>a+b.rating,0)/(feedbacks.length||1)).toFixed(1),
    course: feedbacks.filter(f=>f.type==="COURSE").length,
    service: feedbacks.filter(f=>f.type==="SERVICE").length,
    instructor: feedbacks.filter(f=>f.type==="INSTRUCTOR").length
  }), [feedbacks]);

  const trendData = feedbacks.map((f,i)=>({
    index:i+1,
    rating:f.rating
  }));

  return (
    <motion.div className="min-h-screen p-6 space-y-6 bg-gradient-to-br from-indigo-100 via-white to-blue-100">

      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-indigo-700">Admin Dashboard</h1>
        <Button onClick={()=>{authService.logout();navigate("/");}}>Logout</Button>
      </div>

      <Tabs defaultValue="overview">

        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="instructors">Instructors</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview">

{/* ================= KPI ================= */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">

  {[
    { label: "Total", value: feedbacks.length },
    { label: "Avg Rating", value: (feedbacks.reduce((a,b)=>a+b.rating,0)/(feedbacks.length||1)).toFixed(1) },
    { label: "Positive %", value: Math.round((feedbacks.filter(f=>f.rating>=4).length/(feedbacks.length||1))*100) + "%" },
    { label: "Negative %", value: Math.round((feedbacks.filter(f=>f.rating<=2).length/(feedbacks.length||1))*100) + "%" }
  ].map((item, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.2 }}
    >
      <Card className="bg-white/70 backdrop-blur-lg shadow-lg hover:scale-105 transition">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-gray-500">{item.label}</p>
          <h2 className="text-2xl font-bold text-indigo-600">{item.value}</h2>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>

{/* ================= TREND ================= */}
<Card className="mb-6 shadow-lg">
  <CardHeader><CardTitle>Feedback Trend</CardTitle></CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={feedbacks.map((f,i)=>({i:i+1,r:f.rating}))}>
        <XAxis dataKey="i"/>
        <YAxis/>
        <Tooltip/>
        <Area type="monotone" dataKey="r" stroke="#6366f1" fill="url(#grad)" />
        <defs>
          <linearGradient id="grad">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

{/* ================= CATEGORY ================= */}
<Card className="mb-6 shadow-lg">
  <CardHeader><CardTitle>Category Comparison</CardTitle></CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={[
        {name:"Course",value:feedbacks.filter(f=>f.type==="COURSE").length},
        {name:"Service",value:feedbacks.filter(f=>f.type==="SERVICE").length},
        {name:"Instructor",value:feedbacks.filter(f=>f.type==="INSTRUCTOR").length}
      ]}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
        <Bar dataKey="value" fill="#10b981" radius={[8,8,0,0]}/>
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

{/* ================= TOP PERFORMERS ================= */}
<Card className="mb-6 shadow-lg">
  <CardHeader><CardTitle>Top Performers ⭐</CardTitle></CardHeader>
  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">

    {["COURSE","INSTRUCTOR","SERVICE"].map(type => {
      const items = feedbacks.filter(f=>f.type===type);
      const map = {};
      items.forEach(f=>{
        if(!map[f.targetName]) map[f.targetName]=[];
        map[f.targetName].push(f.rating);
      });

      let best = "N/A", bestAvg = 0;

      Object.keys(map).forEach(k=>{
        const avg = map[k].reduce((a,b)=>a+b,0)/map[k].length;
        if(avg > bestAvg){
          best = k;
          bestAvg = avg;
        }
      });

      return (
        <div key={type} className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">{type}</p>
          <h3 className="font-bold">{best}</h3>
          <p className="text-yellow-500">⭐ {bestAvg.toFixed(1)}</p>
        </div>
      );
    })}

  </CardContent>
</Card>

{/* ================= SENTIMENT ================= */}
<Card className="mb-6 shadow-lg">
  <CardHeader><CardTitle>Sentiment Analysis</CardTitle></CardHeader>
  <CardContent className="space-y-3">

    {[
      {label:"Positive", value:feedbacks.filter(f=>f.rating>=4).length, color:"bg-green-500"},
      {label:"Neutral", value:feedbacks.filter(f=>f.rating===3).length, color:"bg-yellow-500"},
      {label:"Negative", value:feedbacks.filter(f=>f.rating<=2).length, color:"bg-red-500"}
    ].map((item,i)=>(
      <div key={i}>
        <p className="text-sm">{item.label}</p>
        <div className="w-full bg-gray-200 rounded h-3">
          <div
            className={`${item.color} h-3 rounded`}
            style={{ width: `${(item.value/(feedbacks.length||1))*100}%` }}
          />
        </div>
      </div>
    ))}

  </CardContent>
</Card>

{/* ================= ACTIVITY ================= */}
<Card className="shadow-lg">
  <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
  <CardContent className="space-y-2 max-h-60 overflow-y-auto">
    {feedbacks.slice(-5).reverse().map(f=>(
      <div key={f.id} className="text-sm border-b pb-1">
        <span className="font-semibold">{f.targetName}</span> rated ⭐ {f.rating}
      </div>
    ))}
  </CardContent>
</Card>

</TabsContent>

        {/* FEEDBACK */}
        
<TabsContent value="feedbacks">

{/* ================= HEADER ================= */}
<div className="flex flex-col md:flex-row justify-between gap-3 mb-6">

  <h2 className="text-xl font-bold text-indigo-600">
    Feedback Intelligence
  </h2>

  <Button onClick={downloadPDF}>
    Download Report 📄
  </Button>
</div>

{/* ================= FILTERS ================= */}
<div className="flex flex-wrap gap-3 mb-6">

  <Input
    placeholder="🔍 Search feedback..."
    onChange={(e)=>setSearch(e.target.value)}
    className="w-full md:w-64"
  />

  <select
    className="border rounded px-3 py-2"
    onChange={(e)=>setTypeFilter(e.target.value)}
  >
    <option value="">All Types</option>
    <option value="COURSE">Course</option>
    <option value="SERVICE">Service</option>
    <option value="INSTRUCTOR">Instructor</option>
  </select>

</div>

{/* ================= FEEDBACK CARDS ================= */}
<div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">

  {feedbacks
    .filter(f =>
      (!typeFilter || f.type === typeFilter) &&
      (!search || f.comments.toLowerCase().includes(search.toLowerCase()))
    )
    .map((f, i) => (

      <motion.div
        key={f.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
      >

        <Card className="bg-white/70 backdrop-blur-md shadow-md hover:shadow-xl transition">

          <CardContent className="p-5 space-y-3">

            {/* 🔥 HEADER */}
            <div className="flex justify-between items-center">

              <span className={`px-3 py-1 rounded-full text-xs font-semibold
                ${f.type==="COURSE" && "bg-blue-100 text-blue-600"}
                ${f.type==="SERVICE" && "bg-green-100 text-green-600"}
                ${f.type==="INSTRUCTOR" && "bg-purple-100 text-purple-600"}
              `}>
                {f.type}
              </span>

              <span className="text-sm text-gray-500">
                {f.targetName}
              </span>

            </div>

            {/* ⭐ RATING */}
            <div className="flex gap-1">
              {[1,2,3,4,5].map(star => (
                <span key={star}>
                  {star <= f.rating ? "⭐" : "☆"}
                </span>
              ))}
            </div>

            {/* 💬 COMMENT */}
            <p className="text-gray-700 text-sm">
              {f.comments}
            </p>

          </CardContent>

        </Card>

      </motion.div>

  ))}

</div>

</TabsContent>
<TabsContent value="courses">

{/* ================= HEADER ================= */}
<div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-bold text-indigo-600">Course Management</h2>
</div>


{/* ================= ADD FORM ================= */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
>
  <Card className="bg-white/70 backdrop-blur-lg shadow-lg mb-6">
    <CardHeader>
      <CardTitle>Add New Course</CardTitle>
    </CardHeader>

    <CardContent className="grid md:grid-cols-2 gap-4">

      <Input
        placeholder="Course Code (e.g. CS101)"
        value={courseForm.code}
        onChange={e=>setCourseForm({...courseForm,code:e.target.value})}
      />

      <Input
        placeholder="Course Name"
        value={courseForm.name}
        onChange={e=>setCourseForm({...courseForm,name:e.target.value})}
      />

      <Input
        placeholder="Department"
        value={courseForm.department}
        onChange={e=>setCourseForm({...courseForm,department:e.target.value})}
      />

      <Input
        placeholder="Instructor Name"
        value={courseForm.instructor}
        onChange={e=>setCourseForm({...courseForm,instructor:e.target.value})}
      />

      <Button
        className="col-span-2 bg-indigo-600 hover:bg-indigo-700"
        onClick={addCourse}
      >
        ➕ Add Course
      </Button>

    </CardContent>
  </Card>
</motion.div>


{/* ================= COURSE LIST ================= */}
<div className="grid md:grid-cols-2 gap-4">

  {courses.length > 0 ? courses.map((c, i)=>(

    <motion.div
      key={c.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: i * 0.05 }}
    >

      <Card className="shadow-md hover:shadow-xl transition border-l-4 border-indigo-500">

        <CardContent className="p-4 space-y-2">

          {/* TITLE */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-800">
              {c.name}
            </h3>

            <Button
              variant="destructive"
              onClick={()=>deleteCourse(c.id)}
            >
              Delete
            </Button>
          </div>

          {/* DETAILS */}
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Code:</span> {c.code}</p>
            <p><span className="font-medium">Department:</span> {c.department}</p>
            <p><span className="font-medium">Instructor:</span> {c.instructor}</p>
          </div>

        </CardContent>

      </Card>

    </motion.div>

  )) : (

    <div className="col-span-2 text-center text-gray-400 py-10">
      No courses available. Add your first course 🚀
    </div>

  )}

</div>

</TabsContent>


<TabsContent value="instructors">

{/* ================= HEADER ================= */}
<div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-bold text-purple-600">
    Instructor Management
  </h2>
</div>


{/* ================= ADD FORM ================= */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
>
  <Card className="bg-white/70 backdrop-blur-lg shadow-lg mb-6">
    <CardHeader>
      <CardTitle>Add New Instructor</CardTitle>
    </CardHeader>

    <CardContent className="grid md:grid-cols-2 gap-4">

      <Input
        placeholder="Instructor Name"
        value={instructorForm.name}
        onChange={e=>setInstructorForm({...instructorForm,name:e.target.value})}
      />

      <Input
        placeholder="Department"
        value={instructorForm.department}
        onChange={e=>setInstructorForm({...instructorForm,department:e.target.value})}
      />

      <Input
        placeholder="Email Address"
        value={instructorForm.email}
        onChange={e=>setInstructorForm({...instructorForm,email:e.target.value})}
      />

      <Button
        className="col-span-2 bg-purple-600 hover:bg-purple-700"
        onClick={addInstructor}
      >
        ➕ Add Instructor
      </Button>

    </CardContent>
  </Card>
</motion.div>


{/* ================= INSTRUCTOR LIST ================= */}
<div className="grid md:grid-cols-2 gap-4">

  {instructors.length > 0 ? instructors.map((inst, i)=>(

    <motion.div
      key={inst.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: i * 0.05 }}
    >

      <Card className="shadow-md hover:shadow-xl transition border-l-4 border-purple-500">

        <CardContent className="p-4 space-y-3">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-800">
              {inst.name}
            </h3>

            <Button
              variant="destructive"
              onClick={()=>deleteInstructor(inst.id)}
            >
              Delete
            </Button>
          </div>

          {/* DETAILS */}
          <div className="space-y-1 text-sm">

            <p>
              <span className="font-medium text-gray-600">Department:</span>{" "}
              <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs">
                {inst.department}
              </span>
            </p>

            <p className="text-gray-600">
              <span className="font-medium">Email:</span>{" "}
              <span className="text-blue-600">{inst.email}</span>
            </p>

          </div>

        </CardContent>

      </Card>

    </motion.div>

  )) : (

    <div className="col-span-2 text-center text-gray-400 py-10">
      No instructors added yet 👨‍🏫
    </div>

  )}

</div>

</TabsContent>
<TabsContent value="services">

{/* ================= HEADER ================= */}
<div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-bold text-green-600">
    Service Management
  </h2>
</div>


{/* ================= ADD FORM ================= */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
>
  <Card className="bg-white/70 backdrop-blur-lg shadow-lg mb-6">
    <CardHeader>
      <CardTitle>Add New Service</CardTitle>
    </CardHeader>

    <CardContent className="grid md:grid-cols-2 gap-4">

      <Input
        placeholder="Service Name (e.g. Library, Canteen)"
        value={serviceForm.name}
        onChange={e=>setServiceForm({...serviceForm,name:e.target.value})}
      />

      <Input
        placeholder="Short Description"
        value={serviceForm.description}
        onChange={e=>setServiceForm({...serviceForm,description:e.target.value})}
      />

      <Button
        className="col-span-2 bg-green-600 hover:bg-green-700"
        onClick={addService}
      >
        ➕ Add Service
      </Button>

    </CardContent>
  </Card>
</motion.div>


{/* ================= SERVICE LIST ================= */}
<div className="grid md:grid-cols-2 gap-4">

  {services.length > 0 ? services.map((s, i)=>(

    <motion.div
      key={s.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: i * 0.05 }}
    >

      <Card className="shadow-md hover:shadow-xl transition border-l-4 border-green-500">

        <CardContent className="p-4 space-y-3">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-800">
              {s.name}
            </h3>

            <Button
              variant="destructive"
              onClick={()=>deleteService(s.id)}
            >
              Delete
            </Button>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-green-50 p-3 rounded-md text-sm text-gray-700">
            {s.description || "No description provided"}
          </div>

        </CardContent>

      </Card>

    </motion.div>

  )) : (

    <div className="col-span-2 text-center text-gray-400 py-10">
      No services added yet 🏢
    </div>

  )}

</div>

</TabsContent>
<TabsContent value="students">

  {/* HEADER */}
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-indigo-600">
      Student Management
    </h2>
  </div>

  {/* TOTAL CARD */}
  <div className="mb-6">
    <Card className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg">
      <CardContent className="p-6 text-center">
        <p className="text-sm opacity-80">Total Registered Students</p>
        <h2 className="text-4xl font-bold">{students.length}</h2>
      </CardContent>
    </Card>
  </div>

  {/* STUDENT LIST */}
  <div className="grid md:grid-cols-2 gap-4">

    {students.length > 0 ? students.map((s, i) => (

      <motion.div
        key={s.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
      >

        <Card className="shadow hover:shadow-xl transition bg-white/80 backdrop-blur">

          <CardContent className="p-5 space-y-2">

            <h3 className="font-semibold text-lg text-gray-800">
              {s.name || "Student"}
            </h3>

            <p className="text-sm text-gray-500">
              {s.email}
            </p>

            <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
              {s.role}
            </span>

          </CardContent>

        </Card>

      </motion.div>

    )) : (
      <p className="text-gray-400 text-center col-span-2">
        No students found
      </p>
    )}

  </div>

</TabsContent>



      </Tabs>
    </motion.div>
  );
}
