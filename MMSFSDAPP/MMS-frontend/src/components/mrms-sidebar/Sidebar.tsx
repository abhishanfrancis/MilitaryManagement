// components/mrms-sidebar/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './Sidebar.module.css';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  badge?: {
    count: number;
    variant: string;
  };
  permission?: string[];
}

interface MenuSection {
  id: string;
  title?: string;
  items: MenuItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  userRole?: string;
  userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
  const {
    collapsed = false,
    onCollapse,
    userRole = 'Admin',
    userName = 'Colonel Singh'
  } = props;
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isMounted, setIsMounted] = useState(false);
  const [menuConfig, setMenuConfig] = useState<{ sections: MenuSection[] } | null>(null);

  // Handle onCollapse with proper type
  const handleCollapse = (value: boolean): void => {
    if (onCollapse) {
      onCollapse(value);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    // Load menu config
    fetch('/config/menuConfig.json')
      .then(res => res.json())
      .then((data: { sections: MenuSection[] }) => {
        setMenuConfig(data);
        // Initialize expanded sections
        const initial: Record<string, boolean> = {};
        data.sections.forEach((section: MenuSection) => {
          initial[section.id] = section.defaultOpen !== false;
        });
        setExpandedSections(initial);
      });
  }, []);

  const toggleSection = (sectionId: string): void => {
    setExpandedSections((prev: Record<string, boolean>) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const hasPermission = (menuItem: MenuItem): boolean => {
    if (!menuItem.permission || menuItem.permission.length === 0) {
      return true;
    }
    return menuItem.permission.includes(userRole);
  };

  const isActive = (path?: string): boolean => {
    return path ? router.pathname === path : false;
  };

  if (!isMounted || !menuConfig) return null;

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <img src="/mrms-logo.png" alt="MRMS" className={styles.logo} />
          {!collapsed && <span className={styles.appName}>MRMS</span>}
        </div>
        <button
          className={styles.toggleBtn}
          onClick={() => handleCollapse(!collapsed)}
          aria-label="Toggle sidebar"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'}`} />
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <span>{userName.charAt(0)}</span>
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>{userName}</p>
            <p className={styles.userRole}>{userRole}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={styles.nav} aria-label="Main navigation">
        {menuConfig.sections.map((section: MenuSection) => (
          <div key={section.id} className={styles.section}>
            {section.title && section.collapsible ? (
              <>
                <button
                  className={styles.sectionTitle}
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={expandedSections[section.id]}
                >
                  {!collapsed && <span>{section.title}</span>}
                  <i
                    className={`fas fa-chevron-down ${
                      expandedSections[section.id] ? styles.expanded : ''
                    }`}
                  />
                </button>
                {expandedSections[section.id] && (
                  <div className={styles.sectionContent}>
                    {section.items
                      .filter(hasPermission)
                      .map((item: MenuItem) => (
                        <NavItem
                          key={item.id}
                          item={item}
                          isActive={isActive(item.path)}
                          collapsed={collapsed}
                        />
                      ))}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.sectionContent}>
                {section.items
                  .filter(hasPermission)
                  .map((item: MenuItem) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      isActive={isActive(item.path)}
                      collapsed={collapsed}
                    />
                  ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        {!collapsed && (
          <>
            <div className={styles.divider} />
            <Link href="/profile" className={styles.footerItem}>
              <i className="fas fa-user-circle" />
              <span>My Profile</span>
            </Link>
            <Link href="/logout" className={`${styles.footerItem} ${styles.logout}`}>
              <i className="fas fa-sign-out-alt" />
              <span>Logout</span>
            </Link>
          </>
        )}
      </div>
    </aside>
  );
};

// NavItem Sub-Component
interface NavItemProps {
  item: MenuItem;
  isActive: boolean;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive, collapsed }: NavItemProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  if (!item.path) {
    return (
      <button
        className={`${styles.item} ${expanded ? styles.expanded : ''}`}
        onClick={(): void => setExpanded(!expanded)}
        title={item.label}
      >
        <i className={`${item.icon} ${styles.icon}`} />
        {!collapsed && (
          <>
            <span className={styles.label}>{item.label}</span>
            {item.badge && (
              <span className={`${styles.badge} ${styles[`badge-${item.badge.variant}`]}`}>
                {item.badge.count}
              </span>
            )}
          </>
        )}
      </button>
    );
  }

  return (
    <Link
      href={item.path}
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      title={item.label}
    >
      <i className={`${item.icon} ${styles.icon}`} />
      {!collapsed && (
        <>
          <span className={styles.label}>{item.label}</span>
          {item.badge && (
            <span className={`${styles.badge} ${styles[`badge-${item.badge.variant}`]}`}>
              {item.badge.count}
            </span>
          )}
        </>
      )}
    </Link>
  );
};

export default Sidebar;
