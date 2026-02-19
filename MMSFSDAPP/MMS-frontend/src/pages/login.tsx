import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const FloatingParticle = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-white/10"
    style={{ left: x, top: y, width: size, height: size }}
    animate={{
      y: [0, -30, 0],
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 4 + Math.random() * 2,
      repeat: Infinity,
      delay: delay,
      ease: 'easeInOut',
    }}
  />
);

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login, user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        
        const loggedInUser = await login(values.username, values.password);
        
        const token = localStorage.getItem('token');
        if (token) {
          toast.success('Welcome back!', {
            icon: '🎖️',
            style: {
              borderRadius: '12px',
              background: '#1e293b',
              color: '#fff',
              padding: '16px',
            },
          });
          
          router.replace('/dashboard');
        } else {
          toast.error('Authentication failed. Please try again.');
        }
      } catch (error: any) {
        console.error('Login error:', error);
        
        if (error.response) {
          const errorMessage = error.response.data?.error || 
                              error.response.data?.message || 
                              'Invalid username or password';
          toast.error(errorMessage);
        } else if (error.request) {
          toast.error('No response from server. Please try again later.');
        } else {
          toast.error(error.message || 'Login failed');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Login | Military Resource Management System</title>
      </Head>
      <div className="min-h-screen flex relative overflow-hidden">
        {/* Left Side - Decorative Panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-purple-900" />
          
          {/* Mesh pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Floating particles */}
          {mounted && (
            <>
              <FloatingParticle delay={0} x="10%" y="20%" size={6} />
              <FloatingParticle delay={0.5} x="80%" y="30%" size={8} />
              <FloatingParticle delay={1} x="30%" y="60%" size={5} />
              <FloatingParticle delay={1.5} x="70%" y="70%" size={7} />
              <FloatingParticle delay={2} x="50%" y="40%" size={6} />
              <FloatingParticle delay={0.8} x="20%" y="80%" size={9} />
              <FloatingParticle delay={1.2} x="60%" y="15%" size={5} />
              <FloatingParticle delay={2.5} x="90%" y="85%" size={4} />
            </>
          )}

          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary-500/10 blur-2xl" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Shield Icon */}
              <div className="mb-8">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
              </div>

              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                Military Resource
                <br />
                <span className="text-primary-300">Management System</span>
              </h1>
              
              <p className="text-lg text-primary-200/80 max-w-md leading-relaxed mb-12">
                Secure, centralized platform for managing military assets, transfers, and operations across all bases.
              </p>

              {/* Feature list */}
              <div className="space-y-4">
                {[
                  { icon: '🔒', text: 'End-to-end encrypted communications' },
                  { icon: '📊', text: 'Real-time asset tracking & analytics' },
                  { icon: '🌐', text: 'Multi-base coordination system' },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-lg">{feature.icon}</span>
                    <span className="text-primary-200/70 text-sm">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 relative bg-white dark:bg-gray-900">
          {/* Background decoration for mobile */}
          <div className="absolute inset-0 lg:hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary-100/40 dark:bg-primary-900/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100/30 dark:bg-purple-900/20 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md relative z-10"
          >
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-10">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 items-center justify-center mb-4 shadow-lg shadow-primary-500/30">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold gradient-text">MRMS</h2>
            </div>

            {/* Welcome text */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h2>
              <p className="text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>
            </div>

            {/* Login Form */}
            <form className="space-y-5" onSubmit={formik.handleSubmit}>
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your username"
                    className={`block w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 
                      transition-all duration-300 focus:bg-white dark:focus:bg-gray-800 focus:shadow-lg focus:shadow-primary-500/10
                      ${formik.touched.username && formik.errors.username 
                        ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                      }
                      sm:text-sm`}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <AnimatePresence>
                  {formik.touched.username && formik.errors.username && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-2 text-sm text-red-500 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formik.errors.username}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`block w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 
                      transition-all duration-300 focus:bg-white dark:focus:bg-gray-800 focus:shadow-lg focus:shadow-primary-500/10
                      ${formik.touched.password && formik.errors.password 
                        ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                      }
                      sm:text-sm`}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                <AnimatePresence>
                  {formik.touched.password && formik.errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-2 text-sm text-red-500 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formik.errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-primary-600 focus:ring-primary-500/30 transition"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Remember me</span>
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full relative overflow-hidden flex justify-center py-3.5 px-6 rounded-2xl text-sm font-semibold text-white 
                  bg-gradient-to-r from-primary-600 via-primary-600 to-purple-600 
                  hover:from-primary-700 hover:via-primary-700 hover:to-purple-700 
                  shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                  transition-all duration-300
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
              <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                Military Resource Management System v2.0
                <br />
                <span className="text-gray-300 dark:text-gray-600">Authorized personnel only. All access is monitored and logged.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;