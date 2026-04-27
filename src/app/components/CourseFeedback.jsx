import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

import { authService } from '../services/authService';
import { courseService } from '../services/courseService';
import { apiUrl } from '../config/api';

import { ArrowLeft, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function CourseFeedback() {

  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [courses, setCourses] = useState([]);
  const [ratingUI, setRatingUI] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // LOAD COURSES
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await courseService.getAllCourses();
        setCourses(data || []);
      } catch (error) {
        console.log("Course load error:", error);
        setCourses([]);
      }
    };

    loadCourses();
  }, []);

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      courseId: '',
      rating: 0,
      comments: ''
    }
  });

  const selectedCourseId = watch('courseId');

  const onSubmit = async (data) => {

    if (!user) {
      toast.error("You must be logged in.");
      return;
    }

    const course = courses.find(c => String(c.id) === String(data.courseId));

    if (!course) {
      toast.error("Invalid course selected.");
      return;
    }

    try {
      setIsSubmitting(true);

      const newFeedback = {
        studentId: user.id,
         studentName: user.email,
        type: 'COURSE', // ✅ FIXED (uppercase)
        targetId: data.courseId,
        targetName: `${course.code || ""} - ${course.name}`,
        rating: data.rating,
        comments: data.comments.trim(),
        category: `${course.code || ""} - ${course.name}`,
        status: 'SUBMITTED'
      };

      await fetch(apiUrl("/api/feedback"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newFeedback)
      });

      toast.success("Course feedback submitted successfully! 🎉");

      reset();
      setRatingUI(0);

      setTimeout(() => {
        navigate('/student');
      }, 800);

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

 return (
  <div className="min-h-screen bg-gray-100 flex">

    {/* SIDEBAR */}
    <div className="hidden md:flex w-64 bg-white shadow-lg flex-col p-6">
      <h2 className="text-xl font-bold mb-6">Feedback Panel</h2>

      <Button
        variant="ghost"
        className="justify-start"
        onClick={() => navigate('/student')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Dashboard
      </Button>

      <div className="mt-10 text-sm text-gray-500">
        Share your course experience to help improve learning quality.
      </div>
    </div>

    {/* MAIN CONTENT */}
    <div className="flex-1 p-6">

      <div className="max-w-5xl mx-auto space-y-6">

        {/* TITLE */}
        <div>
          <h1 className="text-2xl font-bold">Course Feedback</h1>
          <p className="text-gray-500">
            Evaluate course quality and share your experience
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* SECTION 1: SELECT COURSE */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">

            <h2 className="font-semibold text-lg">Select Course</h2>

            <Controller
              name="courseId"
              control={control}
              rules={{ required: "Please select a course" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose course..." />
                  </SelectTrigger>

                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem
                        key={course.id}
                        value={String(course.id)}
                      >
                        {course.code || "NO-CODE"} - {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.courseId && (
              <p className="text-sm text-red-500">
                {errors.courseId.message}
              </p>
            )}
          </div>

          {/* SECTION 2: COURSE DETAILS */}
          {selectedCourseId && (
            <div className="bg-white p-6 rounded-xl shadow-sm border">

              {(() => {
                const course = courses.find(
                  c => String(c.id) === String(selectedCourseId)
                );

                return course ? (
                  <div className="grid md:grid-cols-2 gap-6">

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Instructor</p>
                      <p className="font-medium">
                        {course.instructor || "N/A"}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">
                        {course.department || "N/A"}
                      </p>
                    </div>

                  </div>
                ) : null;
              })()}

            </div>
          )}

          {/* SECTION 3: RATING */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4 text-center">

            <h2 className="font-semibold text-lg">Rate Course</h2>

            <Controller
              name="rating"
              control={control}
              rules={{
                required: "Please select a rating",
                min: { value: 1, message: "Please select a rating" }
              }}
              render={({ field }) => (
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setRatingUI(star);
                        field.onChange(star);
                      }}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition transform hover:scale-125"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= (hoveredRating || ratingUI)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            />

            {errors.rating && (
              <p className="text-sm text-red-500">
                {errors.rating.message}
              </p>
            )}
          </div>

          {/* SECTION 4: COMMENTS */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-3">

            <h2 className="font-semibold text-lg">Your Feedback</h2>

            <Controller
              name="comments"
              control={control}
              rules={{
                required: "Feedback is required",
                minLength: {
                  value: 10,
                  message: "Minimum 10 characters required"
                }
              }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  rows={5}
                  className="rounded-lg"
                  placeholder="Write your thoughts about the course..."
                />
              )}
            />

            {errors.comments && (
              <p className="text-sm text-red-500">
                {errors.comments.message}
              </p>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3">

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/student')}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>

          </div>

        </form>
      </div>
    </div>
  </div>
);
}
