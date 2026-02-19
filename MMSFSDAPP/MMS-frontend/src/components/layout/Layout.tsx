import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isPublicPage = publicPaths.includes(router.pathname);
  
  if (isPublicPage || !isAuthenticated) {
    return (
      <div className="min-h-screen dark:bg-gray-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={router.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen mesh-bg dark:bg-gray-950">
      <Sidebar />
      <div className="lg:pl-[272px]">
        <Navbar />
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={router.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;