import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

import { authService } from '../services/authService';

import { ArrowLeft, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function InstructorFeedback() {

  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [ratingUI, setRatingUI] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ STATE
  const [instructors, setInstructors] = useState([]);

  // ✅ LOAD INSTRUCTORS FROM BACKEND
  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const token = authService.getToken();

        const res = await fetch("http://localhost:8080/api/instructor", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        setInstructors(data || []);
      } catch (err) {
        console.error("Instructor load error:", err);
        setInstructors([]);
      }
    };

    loadInstructors();
  }, []);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      instructorId: '',
      rating: 0,
      comments: ''
    }
  });

  const selectedInstructorId = watch('instructorId');

  const onSubmit = async (data) => {

    if (!user) {
      toast.error("You must be logged in.");
      return;
    }

    const instructor = instructors.find(
      (i) => i.id.toString() === data.instructorId
    );

    if (!instructor) {
      toast.error("Invalid instructor selected.");
      return;
    }

    try {
      setIsSubmitting(true);

      const newFeedback = {
        studentId: user.id,
        studentName: user.email,
        type: 'INSTRUCTOR', // ✅ FIXED
        targetId: data.instructorId,
        targetName: instructor.name,
        rating: data.rating,
        comments: data.comments.trim(),
        category: `${instructor.name} (Instructor)`,
        status: 'SUBMITTED'
      };

      await fetch("http://localhost:8080/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newFeedback)
      });

      toast.success("Instructor feedback submitted successfully! 🎉");

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
            <CardTitle>Instructor Feedback</CardTitle>
            <CardDescription>
              Evaluate your instructor's teaching effectiveness
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Instructor Selection */}
              <div className="space-y-2">
                <Label>Select Instructor</Label>

                <Controller
                  name="instructorId"
                  control={control}
                  rules={{ required: "Please select an instructor" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an instructor" />
                      </SelectTrigger>

                      <SelectContent>
                        {instructors.map((instructor) => (
                          <SelectItem key={instructor.id} value={instructor.id.toString()}>
                            {instructor.name} - {instructor.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.instructorId && (
                  <p className="text-sm text-red-600">
                    {errors.instructorId.message}
                  </p>
                )}
              </div>

              {/* Instructor Details */}
              {selectedInstructorId && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  {(() => {
                    const instructor = instructors.find(
                      (i) => i.id.toString() === selectedInstructorId
                    );

                    return instructor ? (
                      <div className="space-y-2 text-sm">

                        <div className="flex justify-between">
                          <span className="text-gray-600">Department:</span>
                          <span className="font-medium">{instructor.department}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{instructor.email}</span>
                        </div>

                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Rating */}
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

              {/* Comments */}
              <div className="space-y-2">
                <Label>Your Feedback</Label>

                <Controller
                  name="comments"
                  control={control}
                  rules={{
                    required: "Feedback is required",
                    validate: (value) =>
                      value.trim().length >= 10 ||
                      "Please provide feedback (at least 10 characters)"
                  }}
                  render={({ field }) => (
                    <Textarea {...field} rows={6} />
                  )}
                />

                {errors.comments && (
                  <p className="text-sm text-red-600">
                    {errors.comments.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
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
