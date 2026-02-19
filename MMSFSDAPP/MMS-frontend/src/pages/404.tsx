import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found | MRMS</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100/30 dark:bg-primary-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-100/20 dark:bg-purple-900/10 rounded-full blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full text-center relative z-10"
        >
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            className="text-[10rem] font-extrabold leading-none gradient-text"
          >
            404
          </motion.h1>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Page not found</h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/" className="btn btn-primary">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Go home
            </Link>
            <button onClick={() => window.history.back()} className="btn btn-secondary">
              Go back
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}