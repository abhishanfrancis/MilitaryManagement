import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardTableProps {
  headers: string[];
  data: (string | ReactNode)[][];
  icon?: ReactNode;
  emptyMessage?: string;
}

const DashboardTable = ({ headers, data, icon, emptyMessage = 'No data available' }: DashboardTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl">
      {data.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
          <thead className="bg-gray-50/80 dark:bg-gray-800/80">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: rowIndex * 0.03 }}
                className="hover:bg-primary-50/30 dark:hover:bg-primary-900/20 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {cell}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="py-16 text-center">
          {icon && (
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-2xl bg-gray-100/80 dark:bg-gray-700/80 text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}
          <h3 className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">{emptyMessage}</h3>
        </div>
      )}
    </div>
  );
};

export default DashboardTable;