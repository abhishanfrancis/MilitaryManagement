import { Fragment } from 'react';
import { Menu } from '@headlessui/react';
import { format } from 'date-fns';
import { Notification, useNotificationStore } from '@/stores/notificationStore';
import { BellIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface NotificationsDropdownProps {
  notifications: Notification[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const NotificationsDropdown = ({ notifications }: NotificationsDropdownProps) => {
  const { markAsRead, markAllAsRead } = useNotificationStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-gray-400">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-2xl bg-gray-100/80 dark:bg-gray-700/80 mb-3">
            <BellIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="font-medium">No notifications</p>
          <p className="text-xs mt-1 text-gray-400">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div>
          {notifications.map((notification) => (
            <Menu.Item key={notification.id}>
              {({ active }) => (
                <div
                  className={classNames(
                    active ? 'bg-primary-50/50 dark:bg-primary-900/20' : '',
                    notification.read ? 'opacity-60' : '',
                    'px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 last:border-b-0 cursor-pointer transition-colors'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="mt-1.5 text-xs text-gray-400">
                        {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="ml-3 flex-shrink-0 mt-1">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary-500 ring-2 ring-primary-100 dark:ring-primary-900"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Menu.Item>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;