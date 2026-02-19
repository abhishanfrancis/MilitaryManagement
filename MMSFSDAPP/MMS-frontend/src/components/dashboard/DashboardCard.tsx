import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

const DashboardCard = ({ title, children, action }: DashboardCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-card hover:shadow-card-hover rounded-2xl border border-white/50 transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700/50"
    >
      <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </motion.div>
  );
};

export default DashboardCard;