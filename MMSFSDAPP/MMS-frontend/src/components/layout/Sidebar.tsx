import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  RocketLaunchIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  BellAlertIcon,
  ChartPieIcon,
  UserIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  BuildingLibraryIcon,
  MapPinIcon,
  CubeIcon,
  ShieldCheckIcon,
  FlagIcon,
  MapIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface NavSection {
  label: string;
  items: NavItemType[];
}

interface NavItemType {
  name: string;
  href: string;
  icon: any;
  roles: string[];
}

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const navSections: NavSection[] = [
    {
      label: 'Dashboard',
      items: [
        { name: 'Overview', href: '/dashboard', icon: HomeIcon, roles: ['Admin', 'BaseCommander', 'LogisticsOfficer'] },
      ],
    },
    {
      label: 'Personnel',
      items: [
        { name: 'Soldiers', href: '/soldiers', icon: UserIcon, roles: ['Admin', 'BaseCommander'] },
        { name: 'Assignments', href: '/assignments', icon: ClipboardDocumentCheckIcon, roles: ['Admin', 'BaseCommander'] },
      ],
    },
    {
      label: 'Units',
      items: [
        { name: 'Units', href: '/units', icon: UserGroupIcon, roles: ['Admin', 'BaseCommander'] },
      ],
    },
    {
      label: 'Bases',
      items: [
        { name: 'Bases', href: '/bases', icon: BuildingOffice2Icon, roles: ['Admin'] },
      ],
    },
    {
      label: 'Equipment',
      items: [
        { name: 'Inventory', href: '/equipment', icon: CubeIcon, roles: ['Admin', 'BaseCommander', 'LogisticsOfficer'] },
      ],
    },
    {
      label: 'Missions',
      items: [
        { name: 'Missions', href: '/missions', icon: RocketLaunchIcon, roles: ['Admin', 'BaseCommander'] },
      ],
    },
    {
      label: 'System',
      items: [
        { name: 'Users', href: '/users', icon: CommandLineIcon, roles: ['Admin'] },
        { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, roles: ['Admin'] },
        { name: 'Profile', href: '/profile', icon: UserIcon, roles: ['Admin', 'BaseCommander', 'LogisticsOfficer'] },
      ],
    },
  ];

  // Filter sections based on user role
  const filteredSections = navSections.map(section => ({
    ...section,
    items: section.items.filter(item => user?.role && item.roles.includes(user.role))
  })).filter(section => section.items.length > 0);

  // Flatten sections into a single array for easier access
  const filteredNavigation = filteredSections.flatMap(section => section.items);

  const isActive = (href: string) => {
    if (href === '/dashboard') return router.pathname === '/dashboard';
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  const NavItem = ({ item, isMobile = false }: { item: NavItemType; isMobile?: boolean }) => {
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        className={classNames(
          active
            ? 'bg-white/10 text-white shadow-lg shadow-black/5'
            : 'text-slate-400 hover:bg-white/5 hover:text-white',
          'group relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200'
        )}
        onClick={() => isMobile && setSidebarOpen(false)}
      >
        {active && (
          <motion.div
            layoutId={isMobile ? 'sidebar-indicator-mobile' : 'sidebar-indicator'}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-400 rounded-r-full"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}
        <item.icon
          className={classNames(
            active ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300',
            'flex-shrink-0 h-5 w-5 transition-colors duration-200'
          )}
          aria-hidden="true"
        />
        <span>{item.name}</span>
        {active && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in duration-200 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-[280px] flex-1 flex-col">
                {/* Mobile sidebar content */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 px-4 pb-4 pt-5 border-r border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                      </div>
                      <span className="text-white font-bold text-lg">MRMS</span>
                    </div>
                    <button
                      type="button"
                      className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  <nav className="flex flex-1 flex-col gap-1 mt-4">
                    {filteredNavigation.map((item) => (
                      <NavItem key={item.name} item={item} isMobile />
                    ))}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-[272px] lg:flex-col">
        <div className="flex grow flex-col overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-white/5">
          {/* Logo area */}
          <div className="flex h-16 shrink-0 items-center px-5 gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-base tracking-tight">MRMS</h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Command Center</p>
            </div>
          </div>

          {/* Search-like area */}
          <div className="px-4 mb-2">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            <p className="px-3 pt-2 pb-2 text-[10px] font-semibold tracking-widest uppercase text-slate-600">
              Navigation
            </p>
            {filteredNavigation.slice(0, 1).map((item) => (
              <NavItem key={item.name} item={item} />
            ))}

            <p className="px-3 pt-5 pb-2 text-[10px] font-semibold tracking-widest uppercase text-slate-600">
              Management
            </p>
            {filteredNavigation.slice(1, 6).map((item) => (
              <NavItem key={item.name} item={item} />
            ))}

            {filteredNavigation.length > 6 && (
              <>
                <p className="px-3 pt-5 pb-2 text-[10px] font-semibold tracking-widest uppercase text-slate-600">
                  System
                </p>
                {filteredNavigation.slice(6).map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </>
            )}
          </nav>

          {/* User section at bottom */}
          <div className="px-3 pb-4 mt-auto">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-4" />
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary-500/10">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.fullName || 'User'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.role || 'Unknown'}</p>
              </div>
              <button
                onClick={() => logout()}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-white/10 hover:text-red-400 transition-all duration-200"
                title="Sign out"
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;