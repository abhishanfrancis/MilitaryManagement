import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon, Bars3Icon, MagnifyingGlassIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotificationStore } from '@/stores/notificationStore';
import Link from 'next/link';
import NotificationsDropdown from '../notifications/NotificationsDropdown';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface NavbarProps {
  setSidebarOpen?: (open: boolean) => void;
}

const Navbar = ({ setSidebarOpen }: NavbarProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount } = useNotificationStore();

  return (
    <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-gray-200/60 bg-white/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 dark:bg-gray-900/80 dark:border-gray-700/60">
      {/* Mobile menu button */}
      <button
        type="button"
        className="p-2 -ml-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        onClick={() => setSidebarOpen?.(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="flex flex-1 items-center justify-between gap-4">
        {/* Search bar - decorative */}
        <div className="hidden sm:flex flex-1 max-w-md">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search assets, transfers..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/80 border border-gray-200/60 rounded-xl 
                placeholder:text-gray-400 text-gray-700
                focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 focus:outline-none
                transition-all duration-300
                dark:bg-gray-800/80 dark:border-gray-600/60 dark:text-gray-200 dark:placeholder:text-gray-500
                dark:focus:bg-gray-800 dark:focus:border-primary-500"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 rounded border border-gray-200 dark:text-gray-500 dark:bg-gray-700 dark:border-gray-600">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <MoonIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          {/* Notification dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-5 w-5" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
                </span>
              )}
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95 -translate-y-1"
              enterTo="transform opacity-100 scale-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100 translate-y-0"
              leaveTo="transform opacity-0 scale-95 -translate-y-1"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-2xl bg-white py-1 shadow-elevated ring-1 ring-black/5 focus:outline-none border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:ring-white/5">
                <NotificationsDropdown notifications={notifications} />
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-gray-700" />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:hover:bg-gray-800">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-700 leading-none dark:text-gray-200">{user?.fullName || 'User'}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 dark:text-gray-500">{user?.role || 'Unknown'}</p>
              </div>
              <svg className="hidden sm:block w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95 -translate-y-1"
              enterTo="transform opacity-100 scale-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100 translate-y-0"
              leaveTo="transform opacity-0 scale-95 -translate-y-1"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-2xl bg-white py-2 shadow-elevated ring-1 ring-black/5 focus:outline-none border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:ring-white/5">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.fullName || 'User'}</p>
                  <p className="text-xs text-gray-500 mt-0.5 dark:text-gray-400">{user?.email || ''}</p>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={classNames(
                          active ? 'bg-gray-50 dark:bg-gray-700' : '',
                          'flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 transition-colors'
                        )}
                      >
                        <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        Your Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/settings"
                        className={classNames(
                          active ? 'bg-gray-50 dark:bg-gray-700' : '',
                          'flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 transition-colors'
                        )}
                      >
                        <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => logout()}
                        className={classNames(
                          active ? 'bg-red-50 dark:bg-red-900/30' : '',
                          'flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 transition-colors'
                        )}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;