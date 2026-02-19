import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';

export default function Custom500() {
  return (
    <>
      <Head>
        <title>Server Error | MRMS</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-100/20 dark:bg-red-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-orange-100/20 dark:bg-orange-900/10 rounded-full blur-3xl" />
        
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
            className="text-[10rem] font-extrabold leading-none bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500"
          >
            500
          </motion.h1>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Server Error</h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Sorry, something went wrong on our server. Please try again later.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/" className="btn btn-primary">
              Go home
            </Link>
            <button onClick={() => window.location.reload()} className="btn btn-secondary">
              Try again
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}