import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

import { authService } from '../services/authService';
import { apiUrl } from '../config/api';

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

      const res = await fetch(apiUrl("/api/service"), {
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

      await fetch(apiUrl("/api/feedback"), {
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
        Help improve campus services by sharing your experience.
      </div>
    </div>

    {/* MAIN CONTENT */}
    <div className="flex-1 p-6">

      <div className="max-w-5xl mx-auto space-y-6">

        {/* TITLE */}
        <div>
          <h1 className="text-2xl font-bold">Service Feedback</h1>
          <p className="text-gray-500">
            Evaluate institutional services and facilities
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* SECTION 1: SELECT SERVICE */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">

            <h2 className="font-semibold text-lg">Select Service</h2>

            <Controller
              name="serviceId"
              control={control}
              rules={{ required: "Please select a service" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose service..." />
                  </SelectTrigger>

                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem
                        key={service.id}
                        value={service.id.toString()}
                      >
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.serviceId && (
              <p className="text-sm text-red-500">
                {errors.serviceId.message}
              </p>
            )}
          </div>

          {/* SECTION 2: SERVICE DETAILS */}
          {selectedServiceId && (
            <div className="bg-white p-6 rounded-xl shadow-sm border">

              {(() => {
                const service = services.find(
                  (s) => s.id.toString() === selectedServiceId
                );

                return service ? (
                  <div className="space-y-4">

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Service Name</p>
                      <p className="font-medium">{service.name}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="font-medium text-gray-700">
                        {service.description}
                      </p>
                    </div>

                  </div>
                ) : null;
              })()}

            </div>
          )}

          {/* SECTION 3: RATING */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4 text-center">

            <h2 className="font-semibold text-lg">Rate Service</h2>

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
                validate: (value) =>
                  value.trim().length >= 10 ||
                  "Please provide feedback (at least 10 characters)"
              }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  rows={5}
                  className="rounded-lg"
                  placeholder="Write your thoughts about the service..."
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
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>

          </div>

        </form>
      </div>
    </div>
  </div>
);
}
