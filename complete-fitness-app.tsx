// Complete Fitness Gym Management System
// This is a comprehensive single-file implementation

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Dumbbell, LogOut, Users, Calendar, BarChart3, Settings } from 'lucide-react';

// ==================== SCHEMAS & TYPES ====================

// User Schema
const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Insert User Schema for Registration
const insertUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

// Login Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional().default(false),
});

type User = z.infer<typeof userSchema>;
type InsertUser = z.infer<typeof insertUserSchema>;
type LoginData = z.infer<typeof loginSchema>;

// ==================== COMPONENTS ====================

// Button Component
const Button = ({ 
  children, 
  onClick, 
  type = "button", 
  disabled = false, 
  variant = "default",
  className = "",
  ...props 
}: any) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
const Input = ({ className = "", ...props }: any) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

// Label Component
const Label = ({ children, htmlFor, className = "" }: any) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
      {children}
    </label>
  );
};

// Card Components
const Card = ({ children, className = "" }: any) => {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "" }: any) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = "" }: any) => {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>
  );
};

const CardContent = ({ children, className = "" }: any) => {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
};

// Checkbox Component
const Checkbox = ({ className = "", ...props }: any) => {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 rounded border border-primary text-primary focus:ring-2 focus:ring-primary ${className}`}
      {...props}
    />
  );
};

// ==================== STORAGE & API ====================

// Simple in-memory storage for demo
class MemoryStorage {
  private users: Map<number, User> = new Map();
  private currentId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentId++;
    const now = new Date();
    const user: User = {
      id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async validateLogin(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    // In a real app, you'd hash and compare passwords
    // For demo purposes, we'll just check if user exists
    return user || null;
  }
}

const storage = new MemoryStorage();

// ==================== MAIN APPLICATION ====================

const FitnessGymApp = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'home'>('login');
  const [isLoading, setIsLoading] = useState(false);

  // Mock Toast functionality
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  // ==================== LOGIN COMPONENT ====================
  const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    
    const form = useForm<LoginData>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: "",
        password: "",
        rememberMe: false,
      },
    });

    const handleLogin = async (data: LoginData) => {
      setIsLoading(true);
      try {
        const user = await storage.validateLogin(data.email, data.password);
        if (user) {
          setCurrentUser(user);
          setCurrentPage('home');
          showToast("Login successful! Welcome back to FITNESS Gym Management!");
        } else {
          showToast("Invalid email or password", 'error');
        }
      } catch (error) {
        showToast("Login failed. Please try again.", 'error');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-400 to-blue-500">
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-7xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-0">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row min-h-[600px]">
                {/* Login Form Section */}
                <div className="flex-1 lg:flex-[0.6] p-8 lg:p-16 flex flex-col justify-center">
                  {/* Logo and Branding */}
                  <div className="mb-8">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <Dumbbell className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-800">FITNESS</h1>
                        <p className="text-sm text-gray-600">Gym management</p>
                      </div>
                    </div>
                  </div>

                  {/* Login Form */}
                  <div className="w-full max-w-md">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-8">Log in</h2>
                    
                    <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
                      {/* Email Field */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-600">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          {...form.register("email")}
                        />
                        {form.formState.errors.email && (
                          <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-600">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pr-12"
                            {...form.register("password")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {form.formState.errors.password && (
                          <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                        )}
                      </div>

                      {/* Remember Me and Forgot Password */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="rememberMe"
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                            {...form.register("rememberMe")}
                          />
                          <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                            Keep me logged in
                          </Label>
                        </div>
                        <button
                          type="button"
                          className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>

                      {/* Login Button */}
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      >
                        {isLoading ? "Logging in..." : "Log in"}
                      </Button>

                      {/* Register Link */}
                      <p className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setCurrentPage('register')}
                          className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                        >
                          Register
                        </button>
                      </p>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row gap-4 text-xs text-gray-500">
                        <button className="hover:text-gray-700 transition-colors">Terms of Use</button>
                        <span className="hidden sm:inline">|</span>
                        <button className="hover:text-gray-700 transition-colors">Privacy Policy</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Image Section */}
                <div className="flex-1 lg:flex-[0.4] relative bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 hidden lg:flex items-center justify-center">
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Dumbbell className="w-32 h-32 text-purple-400 mb-4 mx-auto" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to FITNESS</h3>
                      <p className="text-gray-600">Your complete gym management solution</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ==================== REGISTER COMPONENT ====================
  const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    
    const form = useForm<InsertUser>({
      resolver: zodResolver(insertUserSchema),
      defaultValues: {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      },
    });

    const handleRegister = async (data: InsertUser) => {
      setIsLoading(true);
      try {
        const existingUser = await storage.getUserByEmail(data.email);
        if (existingUser) {
          showToast("User already exists with this email", 'error');
          return;
        }

        const user = await storage.createUser(data);
        showToast("Account created successfully! Please login.");
        setCurrentPage('login');
      } catch (error) {
        showToast("Registration failed. Please try again.", 'error');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-400 to-blue-500">
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-7xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-0">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row min-h-[600px]">
                {/* Register Form Section */}
                <div className="flex-1 lg:flex-[0.6] p-8 lg:p-16 flex flex-col justify-center">
                  {/* Logo and Branding */}
                  <div className="mb-8">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <Dumbbell className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-800">FITNESS</h1>
                        <p className="text-sm text-gray-600">Gym management</p>
                      </div>
                    </div>
                  </div>

                  {/* Register Form */}
                  <div className="w-full max-w-md">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-8">Create Account</h2>
                    
                    <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-6">
                      {/* First Name Field */}
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-600">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Enter your first name"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          {...form.register("firstName")}
                        />
                        {form.formState.errors.firstName && (
                          <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                        )}
                      </div>

                      {/* Last Name Field */}
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-600">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Enter your last name"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          {...form.register("lastName")}
                        />
                        {form.formState.errors.lastName && (
                          <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-600">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          {...form.register("email")}
                        />
                        {form.formState.errors.email && (
                          <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-600">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pr-12"
                            {...form.register("password")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {form.formState.errors.password && (
                          <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                        )}
                      </div>

                      {/* Register Button */}
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>

                      {/* Login Link */}
                      <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setCurrentPage('login')}
                          className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                        >
                          Login
                        </button>
                      </p>
                    </form>
                  </div>
                </div>

                {/* Hero Image Section */}
                <div className="flex-1 lg:flex-[0.4] relative bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 hidden lg:flex items-center justify-center">
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-32 h-32 text-purple-400 mb-4 mx-auto" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Join FITNESS</h3>
                      <p className="text-gray-600">Start your fitness journey today</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ==================== HOME/DASHBOARD COMPONENT ====================
  const HomePage = () => {
    const handleLogout = () => {
      setCurrentUser(null);
      setCurrentPage('login');
      showToast("Logged out successfully");
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-400 to-blue-500">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-4">
                <Dumbbell className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">FITNESS</h1>
                <p className="text-white/80">Gym Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/90">
                Welcome, {currentUser?.firstName} {currentUser?.lastName}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Members
                </CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">1,234</div>
                <p className="text-xs text-gray-600">+20% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Active Sessions
                </CardTitle>
                <Calendar className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">89</div>
                <p className="text-xs text-gray-600">Currently in progress</p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Revenue
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">$45,231</div>
                <p className="text-xs text-gray-600">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Equipment Status
                </CardTitle>
                <Settings className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">96%</div>
                <p className="text-xs text-gray-600">Operational</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">New member registration</p>
                      <p className="text-xs text-gray-600">John Doe joined the gym</p>
                    </div>
                    <span className="text-xs text-gray-600">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Equipment maintenance</p>
                      <p className="text-xs text-gray-600">Treadmill #3 serviced</p>
                    </div>
                    <span className="text-xs text-gray-600">4 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Class scheduled</p>
                      <p className="text-xs text-gray-600">Yoga class added for tomorrow</p>
                    </div>
                    <span className="text-xs text-gray-600">6 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Add Member
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Schedule Class
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Equipment Check
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // ==================== MAIN RENDER ====================
  return (
    <div className="fitness-app">
      {/* Add some basic CSS */}
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        
        .fitness-app {
          min-height: 100vh;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
      
      {/* Route based on current page */}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'register' && <RegisterPage />}
      {currentPage === 'home' && currentUser && <HomePage />}
    </div>
  );
};

export default FitnessGymApp;

// ==================== USAGE INSTRUCTIONS ====================
/*
To use this complete fitness gym management system:

1. Save this file as a .tsx file in your React project
2. Install the required dependencies:
   npm install react-hook-form @hookform/resolvers zod lucide-react

3. Import and use the component:
   import FitnessGymApp from './complete-fitness-app';
   
   function App() {
     return <FitnessGymApp />;
   }

4. Features included:
   - Complete login page with gradient background
   - Registration page with form validation
   - Dashboard with gym management features
   - In-memory storage for demo purposes
   - Responsive design
   - Form validation with Zod
   - Modern UI components
   - Session management

5. To extend this application:
   - Replace MemoryStorage with a real database
   - Add password hashing for security
   - Implement real authentication tokens
   - Add more gym management features
   - Connect to a backend API
   - Add routing with React Router
   - Implement real toast notifications

This is a complete, working fitness gym management system in a single file!
*/
