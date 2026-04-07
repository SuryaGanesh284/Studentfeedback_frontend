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

export default function ServiceFeedback() {

  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [ratingUI, setRatingUI] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ SERVICES STATE
  const [services, setServices] = useState([]);

  // ✅ LOAD SERVICES FROM BACKEND
useEffect(() => {
  const loadServices = async () => {
    try {
      const token = authService.getToken();

      console.log("TOKEN:", token); // 🔍 debug

      const res = await fetch("http://localhost:8080/api/service", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("STATUS:", res.status); // 🔍 debug

      // 🚨 HANDLE ERROR PROPERLY
      if (!res.ok) {
        console.error("Failed to fetch services:", res.status);
        setServices([]);
        return;
      }

      const data = await res.json();

      console.log("SERVICES DATA:", data); // 🔍 debug

      setServices(data || []);

    } catch (err) {
      console.error("Service load error:", err);
      setServices([]);
    }
  };

  loadServices();
}, []);


  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      serviceId: '',
      rating: 0,
      comments: ''
    }
  });

  const selectedServiceId = watch('serviceId');

  const onSubmit = async (data) => {

    if (!user) {
      toast.error('You must be logged in to submit feedback.');
      return;
    }

    const service = services.find(
      (s) => s.id.toString() === data.serviceId
    );

    if (!service) {
      toast.error('Invalid service selected.');
      return;
    }

    try {
      setIsSubmitting(true);

      const newFeedback = {
        studentId: user.id,
         studentName: user.email,
        type: 'SERVICE', // ✅ FIXED
        targetId: data.serviceId,
        targetName: service.name,
        rating: data.rating,
        comments: data.comments.trim(),
        category: service.name,
        status: 'SUBMITTED'
      };

      await fetch("http://localhost:8080/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newFeedback)
      });

      toast.success('Service feedback submitted successfully! 🎉');

      reset();
      setRatingUI(0);

      setTimeout(() => {
        navigate('/student');
      }, 800);

    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/student')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">

        <Card>
          <CardHeader>
            <CardTitle>Institutional Services Feedback</CardTitle>
            <CardDescription>
              Help us improve campus facilities and services
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* SERVICE SELECTION */}
              <div className="space-y-2">
                <Label>Select Service</Label>

                <Controller
                  name="serviceId"
                  control={control}
                  rules={{ required: "Please select a service" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a service category" />
                      </SelectTrigger>

                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.serviceId && (
                  <p className="text-sm text-red-600">
                    {errors.serviceId.message}
                  </p>
                )}
              </div>

              {/* SERVICE DETAILS */}
              {selectedServiceId && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  {(() => {
                    const service = services.find(
                      (s) => s.id.toString() === selectedServiceId
                    );

                    return service ? (
                      <div className="space-y-2 text-sm">
                        <div className="font-medium text-gray-900">
                          {service.name}
                        </div>
                        <p className="text-gray-600">
                          {service.description}
                        </p>
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
                    <div className="flex items-center gap-3">
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

              {/* BUTTONS */}
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => navigate('/student')}>
                  Cancel
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}