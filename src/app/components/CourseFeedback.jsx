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

      await fetch("http://localhost:8080/api/feedback", {
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
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/student')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card>

          <CardHeader>
            <CardTitle>Course Feedback</CardTitle>
            <CardDescription>
              Share your experience and help improve course quality
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* COURSE SELECTION */}
              <div className="space-y-2">
                <Label>Select Course</Label>

                <Controller
                  name="courseId"
                  control={control}
                  rules={{ required: "Please select a course" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a course" />
                      </SelectTrigger>

                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={String(course.id)}>
                            {course.code || "NO-CODE"} - {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>

                    </Select>
                  )}
                />

                {errors.courseId && (
                  <p className="text-sm text-red-600">
                    {errors.courseId.message}
                  </p>
                )}
              </div>

              {/* COURSE PREVIEW */}
              {selectedCourseId && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  {(() => {
                    const course = courses.find(c => String(c.id) === String(selectedCourseId));

                    return course ? (
                      <div className="space-y-2 text-sm">

                        <div className="flex justify-between">
                          <span className="text-gray-600">Instructor:</span>
                          <span className="font-medium">{course.instructor || "N/A"}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Department:</span>
                          <span className="font-medium">{course.department || "N/A"}</span>
                        </div>

                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* RATING */}
              <div className="space-y-2">
                <Label>Overall Rating</Label>

                <Controller
                  name="rating"
                  control={control}
                  rules={{
                    required: "Please select a rating",
                    min: { value: 1, message: "Please select a rating" }
                  }}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      {[1,2,3,4,5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            setRatingUI(star);
                            field.onChange(star);
                          }}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                        >
                          <Star
                            className={`h-8 w-8 ${
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
                  <p className="text-sm text-red-600">{errors.rating.message}</p>
                )}
              </div>

              {/* COMMENTS */}
              <div className="space-y-2">
                <Label>Your Feedback</Label>

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
                    <Textarea {...field} rows={6} />
                  )}
                />

                {errors.comments && (
                  <p className="text-sm text-red-600">{errors.comments.message}</p>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => navigate('/student')}>
                  Cancel
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
