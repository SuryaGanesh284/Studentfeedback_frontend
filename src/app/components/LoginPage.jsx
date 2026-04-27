import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { authService } from '../services/authService';
import { GraduationCap } from 'lucide-react';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔥 Auto redirect if already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();

      if (user?.role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    setLoading(true);

    try {
      const token = await authService.login(
        email.trim(),
        password
      );

      if (token) {

        const user = authService.getCurrentUser();
        console.log("USER:", user);

        // 🔥 FIXED ROLE CHECK
        if (user?.role === "ROLE_ADMIN") {
          navigate('/admin');
        } else {
          navigate('/student');
        }

      } else {
        setError('Invalid email or password');
      }

    } catch (err) {
      console.error(err);
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex">

    {/* LEFT SIDE (Branding) */}
    <div className="hidden md:flex w-1/2 bg-indigo-600 text-white flex-col justify-center items-center p-10">

      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-white/20 rounded-full">
            <GraduationCap className="h-10 w-10" />
          </div>
        </div>

        <h1 className="text-3xl font-bold">
          Student Feedback System
        </h1>

        <p className="text-indigo-100 max-w-sm">
          Share your thoughts, improve courses, and make learning better for everyone.
        </p>
      </div>

    </div>

    {/* RIGHT SIDE (Form) */}
    <div className="flex flex-1 items-center justify-center bg-gray-50 px-4">

      <Card className="w-full max-w-md shadow-xl rounded-2xl border-0">

        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold">
            Welcome Back 👋
          </CardTitle>
          <CardDescription>
            Login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">

            {/* EMAIL */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="email@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-lg"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-lg"
                required
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full h-11 text-base rounded-lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            {/* LINKS */}
            <div className="text-center text-sm space-y-2">

              <p>
                Don’t have an account?{" "}
                <span
                  className="text-indigo-600 font-medium cursor-pointer hover:underline"
                  onClick={() => navigate("/register")}
                >
                  Register
                </span>
              </p>

              <p
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </p>

            </div>

          </form>
        </CardContent>

      </Card>
    </div>
  </div>
);
}
