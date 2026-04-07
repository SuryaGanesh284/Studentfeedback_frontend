import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { authService } from '../services/authService';
import { GraduationCap } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
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

    //🔥 TEMP: disable captcha requirement (backend not using it)
     if (!captchaToken) {
       setError("Please verify CAPTCHA");
       return;
     }

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
        setCaptchaToken('');
      }

    } catch (err) {
      console.error(err);
      setError("Login failed. Try again.");
      setCaptchaToken('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">

      <Card className="w-full max-w-md shadow-xl">

        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-600 rounded-full shadow-md">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>

          <CardTitle className="text-xl font-bold">
            Student Feedback System
          </CardTitle>

          <CardDescription>
            Sign in to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">

            {/* EMAIL */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="email@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                required
              />
            </div>

            {/* CAPTCHA (optional for now) */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LeHYKQsAAAAAP_qwkMTBqJhfJzGUT4BbyVHwvbM"
                onChange={(token) => setCaptchaToken(token)}
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            {/* BUTTON */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            {/* REGISTER */}
            <p className="text-center text-sm mt-4">
              Don’t have an account?{" "}
              <span
                className="text-indigo-600 font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </p>
            <p
  className="text-sm text-blue-600 cursor-pointer mt-2"
  onClick={() => navigate("/forgot-password")}
>
  Forgot Password?
</p>


          </form>
        </CardContent>

      </Card>
    </div>
  );
}
