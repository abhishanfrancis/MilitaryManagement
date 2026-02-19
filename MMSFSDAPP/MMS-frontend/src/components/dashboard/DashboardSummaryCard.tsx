import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardSummaryCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  iconBg: string;
  change?: number;
}

const DashboardSummaryCard = ({ title, value, icon, iconBg, change }: DashboardSummaryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-card hover:shadow-card-hover rounded-2xl border border-white/50 transition-all duration-300 group dark:bg-gray-800/80 dark:border-gray-700/50"
    >
      <div className="p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-2xl p-3 ${iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
              <dd>
                <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value.toLocaleString()}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {change !== undefined && (
        <div className="bg-gray-50/50 px-6 py-3 border-t border-gray-100 dark:bg-gray-800/50 dark:border-gray-700">
          <div className="text-sm flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 font-semibold ${
              change >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {change >= 0 ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                </svg>
              )}
              {change >= 0 ? '+' : ''}{change}%
            </span>
            <span className="text-gray-400 dark:text-gray-500">vs last period</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardSummaryCard;