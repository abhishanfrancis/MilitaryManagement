# Military Resource Management System (MRMS) - Sidebar Navigation Design

## 1. SIDEBAR NAVIGATION HIERARCHY

```
MRMS Dashboard
├── 📊 Dashboard
│   ├── Overview
│   ├── System Alerts
│   └── Analytics
│
├── 👥 Personnel Management
│   ├── Soldiers
│   ├── Ranks & Hierarchy
│   └── Assignments
│
├── 🏢 Unit Management
│   ├── Units
│   ├── Commanders
│   └── Unit Members
│
├── 🏭 Base Management
│   ├── Bases
│   ├── Capacity Status
│   └── Deployment Locations
│
├── ⚙️ Equipment Management
│   ├── Equipment Inventory
│   ├── Equipment Status
│   └── Maintenance Tracking
│
├── 🎯 Mission Management
│   ├── Missions
│   ├── Mission Status
│   └── Unit Deployment
│
├── ⚡ System Management
│   ├── Users
│   ├── Settings
│   └── System Logs
│
└── 🚪 Account
    ├── Profile
    ├── Preferences
    └── Logout
```

---

## 2. SIDEBAR COMPONENT STRUCTURE (React/TypeScript)

### 2.1 TypeScript Types

```typescript
// types/navigation.ts
export interface MenuItem {
  id: string;
  label: string;
  icon: string; // FontAwesome icon class
  path?: string;
  children?: MenuItem[];
  badge?: {
    count: number;
    variant: 'danger' | 'warning' | 'success' | 'info';
  };
  permission?: string[]; // RBAC - which roles can see this
}

export interface SidebarConfig {
  sections: MenuSection[];
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}
```

### 2.2 Sidebar Menu Configuration

```json
{
  "sections": [
    {
      "id": "main",
      "title": null,
      "collapsible": false,
      "items": [
        {
          "id": "dashboard",
          "label": "Dashboard",
          "icon": "fas fa-chart-line",
          "path": "/dashboard",
          "permission": ["Admin", "BaseCommander", "LogisticsOfficer"]
        }
      ]
    },
    {
      "id": "personnel",
      "title": "Personnel Management",
      "collapsible": true,
      "defaultOpen": true,
      "items": [
        {
          "id": "soldiers",
          "label": "Soldiers",
          "icon": "fas fa-users",
          "path": "/personnel/soldiers",
          "badge": {
            "count": 245,
            "variant": "info"
          },
          "permission": ["Admin", "BaseCommander"]
        },
        {
          "id": "ranks",
          "label": "Ranks & Hierarchy",
          "icon": "fas fa-medal",
          "path": "/personnel/ranks",
          "permission": ["Admin"]
        },
        {
          "id": "assignments",
          "label": "Assignments",
          "icon": "fas fa-tasks",
          "path": "/personnel/assignments",
          "permission": ["Admin", "BaseCommander"]
        }
      ]
    },
    {
      "id": "units",
      "title": "Unit Management",
      "collapsible": true,
      "defaultOpen": true,
      "items": [
        {
          "id": "units-list",
          "label": "Units",
          "icon": "fas fa-sitemap",
          "path": "/units",
          "badge": {
            "count": 12,
            "variant": "info"
          },
          "permission": ["Admin", "BaseCommander"]
        },
        {
          "id": "commanders",
          "label": "Commanders",
          "icon": "fas fa-star",
          "path": "/units/commanders",
          "permission": ["Admin", "BaseCommander"]
        },
        {
          "id": "unit-members",
          "label": "Unit Members",
          "icon": "fas fa-user-tie",
          "path": "/units/members",
          "permission": ["Admin", "BaseCommander"]
        }
      ]
    },
    {
      "id": "bases",
      "title": "Base Management",
      "collapsible": true,
      "defaultOpen": true,
      "items": [
        {
          "id": "bases-list",
          "label": "Bases",
          "icon": "fas fa-fort",
          "path": "/bases",
          "badge": {
            "count": 10,
            "variant": "success"
          },
          "permission": ["Admin"]
        },
        {
          "id": "capacity",
          "label": "Capacity Status",
          "icon": "fas fa-chart-bar",
          "path": "/bases/capacity",
          "permission": ["Admin", "BaseCommander"]
        },
        {
          "id": "locations",
          "label": "Deployment Locations",
          "icon": "fas fa-map-marker-alt",
          "path": "/bases/locations",
          "permission": ["Admin"]
        }
      ]
    },
    {
      "id": "equipment",
      "title": "Equipment Management",
      "collapsible": true,
      "defaultOpen": false,
      "items": [
        {
          "id": "equipment-inventory",
          "label": "Equipment Inventory",
          "icon": "fas fa-cube",
          "path": "/equipment/inventory",
          "badge": {
            "count": 342,
            "variant": "info"
          },
          "permission": ["Admin", "BaseCommander", "LogisticsOfficer"]
        },
        {
          "id": "equipment-status",
          "label": "Equipment Status",
          "icon": "fas fa-check-circle",
          "path": "/equipment/status",
          "permission": ["Admin", "BaseCommander"]
        },
        {
          "id": "maintenance",
          "label": "Maintenance Tracking",
          "icon": "fas fa-tools",
          "path": "/equipment/maintenance",
          "badge": {
            "count": 8,
            "variant": "warning"
          },
          "permission": ["Admin", "LogisticsOfficer"]
        }
      ]
    },
    {
      "id": "missions",
      "title": "Mission Management",
      "collapsible": true,
      "defaultOpen": true,
      "items": [
        {
          "id": "missions-list",
          "label": "Missions",
          "icon": "fas fa-bullseye",
          "path": "/missions",
          "badge": {
            "count": 12,
            "variant": "danger"
          },
          "permission": ["Admin", "BaseCommander"]
        },
        {
          "id": "mission-status",
          "label": "Mission Status",
          "icon": "fas fa-hourglass-half",
          "path": "/missions/status",
          "permission": ["Admin", "BaseCommander"]
        },
        {
          "id": "deployment",
          "label": "Unit Deployment",
          "icon": "fas fa-parachute-box",
          "path": "/missions/deployment",
          "permission": ["Admin", "BaseCommander"]
        }
      ]
    },
    {
      "id": "system",
      "title": "System Management",
      "collapsible": true,
      "defaultOpen": false,
      "items": [
        {
          "id": "users",
          "label": "Users",
          "icon": "fas fa-user-cog",
          "path": "/system/users",
          "permission": ["Admin"]
        },
        {
          "id": "settings",
          "label": "Settings",
          "icon": "fas fa-cog",
          "path": "/system/settings",
          "permission": ["Admin"]
        },
        {
          "id": "logs",
          "label": "System Logs",
          "icon": "fas fa-history",
          "path": "/system/logs",
          "permission": ["Admin"]
        }
      ]
    },
    {
      "id": "account",
      "title": null,
      "collapsible": false,
      "items": [
        {
          "id": "profile",
          "label": "My Profile",
          "icon": "fas fa-user-circle",
          "path": "/profile",
          "permission": []
        },
        {
          "id": "preferences",
          "label": "Preferences",
          "icon": "fas fa-sliders-h",
          "path": "/preferences",
          "permission": []
        },
        {
          "id": "logout",
          "label": "Logout",
          "icon": "fas fa-sign-out-alt",
          "path": "/logout",
          "permission": []
        }
      ]
    }
  ]
}
```

---

## 3. SUGGESTED FONTAWESOME ICONS

### Navigation Icons Reference

| Item | Icon | FontAwesome Class | Alternative |
|------|------|-------------------|-------------|
| Dashboard | 📊 | `fas fa-chart-line` | `fas fa-tachometer-alt` |
| Soldiers | 👥 | `fas fa-users` | `fas fa-people-carry` |
| Ranks | 🎖️ | `fas fa-medal` | `fas fa-star` |
| Assignments | ✅ | `fas fa-tasks` | `fas fa-list-check` |
| Units | 🏢 | `fas fa-sitemap` | `fas fa-layer-group` |
| Commanders | ⭐ | `fas fa-star` | `fas fa-crown` |
| Unit Members | 👔 | `fas fa-user-tie` | `fas fa-users` |
| Bases | 🏭 | `fas fa-fort` | `fas fa-building` |
| Capacity | 📈 | `fas fa-chart-bar` | `fas fa-signal` |
| Locations | 📍 | `fas fa-map-marker-alt` | `fas fa-map` |
| Equipment | 📦 | `fas fa-cube` | `fas fa-box` |
| Status | ✓ | `fas fa-check-circle` | `fas fa-circle-check` |
| Maintenance | 🔧 | `fas fa-tools` | `fas fa-wrench` |
| Missions | 🎯 | `fas fa-bullseye` | `fas fa-target` |
| Mission Status | ⏳ | `fas fa-hourglass-half` | `fas fa-spinner` |
| Deployment | 🪂 | `fas fa-parachute-box` | `fas fa-rocket` |
| Users | 👤 | `fas fa-user-cog` | `fas fa-users-cog` |
| Settings | ⚙️ | `fas fa-cog` | `fas fa-sliders-h` |
| Logs | 📜 | `fas fa-history` | `fas fa-file-alt` |
| Profile | 👤 | `fas fa-user-circle` | `fas fa-id-card` |
| Logout | 🚪 | `fas fa-sign-out-alt` | `fas fa-door-open` |

---

## 4. SIDEBAR UI LAYOUT DESIGN

### 4.1 Sidebar Structure (HTML/CSS Layout)

```html
<aside class="sidebar military-sidebar">
  <!-- Header Section -->
  <div class="sidebar-header">
    <div class="logo-container">
      <img src="/logo.png" alt="MRMS" class="logo" />
      <span class="app-name">MRMS</span>
    </div>
    <button class="sidebar-toggle" aria-label="Toggle sidebar">
      <i class="fas fa-chevron-left"></i>
    </button>
  </div>

  <!-- User Info Section -->
  <div class="sidebar-user-info">
    <div class="user-avatar">
      <img src="/user-avatar.jpg" alt="User" />
    </div>
    <div class="user-details">
      <p class="user-name">Col. Rajendra Singh</p>
      <p class="user-role">Admin</p>
    </div>
  </div>

  <!-- Navigation Menu -->
  <nav class="sidebar-nav">
    <!-- Dashboard Section (No Title) -->
    <div class="nav-section">
      <a href="/dashboard" class="nav-item active">
        <i class="fas fa-chart-line nav-icon"></i>
        <span class="nav-label">Dashboard</span>
      </a>
    </div>

    <!-- Personnel Management Section -->
    <div class="nav-section collapsible">
      <button class="nav-section-title" aria-expanded="true">
        <span>👥 Personnel Management</span>
        <i class="fas fa-chevron-down collapse-icon"></i>
      </button>
      
      <div class="nav-section-content">
        <a href="/personnel/soldiers" class="nav-item">
          <i class="fas fa-users nav-icon"></i>
          <span class="nav-label">Soldiers</span>
          <span class="badge badge-info">245</span>
        </a>
        
        <a href="/personnel/ranks" class="nav-item">
          <i class="fas fa-medal nav-icon"></i>
          <span class="nav-label">Ranks & Hierarchy</span>
        </a>
        
        <a href="/personnel/assignments" class="nav-item">
          <i class="fas fa-tasks nav-icon"></i>
          <span class="nav-label">Assignments</span>
        </a>
      </div>
    </div>

    <!-- Other Sections... (similar structure) -->
  </nav>

  <!-- Footer Section -->
  <div class="sidebar-footer">
    <div class="footer-divider"></div>
    <a href="/profile" class="nav-item">
      <i class="fas fa-user-circle nav-icon"></i>
      <span class="nav-label">My Profile</span>
    </a>
    <a href="/logout" class="nav-item logout">
      <i class="fas fa-sign-out-alt nav-icon"></i>
      <span class="nav-label">Logout</span>
    </a>
  </div>
</aside>
```

### 4.2 Sidebar Styling (CSS/Tailwind)

```css
/* Military Theme Sidebar Styles */

.military-sidebar {
  width: 280px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
  border-right: 3px solid #d4af37; /* Gold military accent */
  transition: width 0.3s ease;
  overflow-y: auto;
}

.military-sidebar.collapsed {
  width: 80px;
}

/* Header */
.sidebar-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid rgba(212, 175, 55, 0.2);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 32px;
  height: 32px;
  filter: brightness(0) invert(1);
}

.app-name {
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 2px;
  color: #d4af37;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: #d4af37;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.3s;
}

.sidebar-toggle:hover {
  transform: scale(1.1);
}

/* User Info */
.sidebar-user-info {
  padding: 15px 20px;
  display: flex;
  gap: 12px;
  align-items: center;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #d4af37;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  margin: 2px 0 0 0;
  font-size: 11px;
  color: #b0b0b0;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 15px 0;
}

.nav-section {
  margin: 5px 0;
}

.nav-section-title {
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  color: #d4af37;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;
  transition: background 0.2s;
}

.nav-section-title:hover {
  background: rgba(212, 175, 55, 0.1);
}

.collapse-icon {
  transition: transform 0.3s;
  font-size: 10px;
}

.nav-section-title[aria-expanded="false"] .collapse-icon {
  transform: rotate(-90deg);
}

.nav-section-content {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  color: #b0b0b0;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.nav-item:hover {
  background: rgba(212, 175, 55, 0.15);
  color: #ffffff;
  padding-left: 24px;
}

.nav-item.active {
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  border-left: 3px solid #d4af37;
  padding-left: 17px;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #d4af37;
}

.nav-icon {
  width: 20px;
  text-align: center;
  font-size: 16px;
}

.nav-label {
  flex: 1;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Badge */
.badge {
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

.badge-danger {
  background: rgba(220, 38, 38, 0.2);
  color: #ff6b6b;
}

.badge-warning {
  background: rgba(180, 83, 9, 0.2);
  color: #fbbf24;
}

.badge-success {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.badge-info {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

/* Footer */
.sidebar-footer {
  border-top: 2px solid rgba(212, 175, 55, 0.1);
  padding: 15px 0;
}

.footer-divider {
  height: 1px;
  background: rgba(212, 175, 55, 0.1);
  margin: 0;
}

.nav-item.logout {
  color: #ff6b6b;
}

.nav-item.logout:hover {
  background: rgba(255, 107, 107, 0.15);
  color: #ff8787;
}

/* Scrollbar Styling */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3);
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.5);
}

/* Collapsed Sidebar State */
.military-sidebar.collapsed .sidebar-header .app-name,
.military-sidebar.collapsed .user-details,
.military-sidebar.collapsed .nav-label,
.military-sidebar.collapsed .sidebar-footer .nav-item span {
  display: none;
}

.military-sidebar.collapsed .logo-container {
  justify-content: center;
  width: 100%;
}

.military-sidebar.collapsed .sidebar-user-info {
  justify-content: center;
  padding: 10px;
}

.military-sidebar.collapsed .user-avatar {
  margin: 0;
}

.military-sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 10px 0;
}
```

---

## 5. NAVIGATION FLOW EXPLANATION

### 5.1 User Journey Maps

#### Admin Role Flow
```
Login
  ↓
Dashboard (Overview, Alerts, Analytics)
  ├→ Personnel Management
  │   ├→ Soldiers (View, Edit, Assign)
  │   ├→ Ranks (Configure)
  │   └→ Assignments (Manage)
  ├→ Unit Management
  │   ├→ Units (Create, Edit, Deploy)
  │   ├→ Commanders (Assign)
  │   └→ Unit Members (View)
  ├→ Base Management
  │   ├→ Bases (Full Admin)
  │   ├→ Capacity (Monitor)
  │   └→ Locations (Manage)
  ├→ Equipment Management
  │   ├→ Inventory (Full Control)
  │   ├→ Status (Track)
  │   └→ Maintenance (Schedule)
  ├→ Mission Management
  │   ├→ Missions (Create, Deploy)
  │   ├→ Mission Status (Monitor)
  │   └→ Unit Deployment (Manage)
  ├→ System Management
  │   ├→ Users (Create, Manage)
  │   ├→ Settings (Configure)
  │   └→ Logs (Audit)
  └→ Account
      ├→ Profile
      ├→ Preferences
      └→ Logout
```

#### Base Commander Role Flow
```
Login
  ↓
Dashboard (Base Overview, Alerts)
  ├→ Personnel Management
  │   ├→ Soldiers (View, Limited Edit)
  │   └→ Assignments (Manage Base Personnel)
  ├→ Unit Management
  │   ├→ Units (View, Limited Edit)
  │   └→ Unit Members (View Base Units)
  ├→ Base Management
  │   ├→ Bases (View Own Base)
  │   └→ Capacity (Monitor)
  ├→ Equipment Management
  │   ├→ Inventory (View Base Equipment)
  │   └→ Status (Track)
  ├→ Mission Management
  │   ├→ Missions (View, Limited Create)
  │   ├→ Mission Status (Monitor)
  │   └→ Unit Deployment (Manage)
  └→ Account
      ├→ Profile
      ├→ Preferences
      └→ Logout
```

#### Logistics Officer Role Flow
```
Login
  ↓
Dashboard (Equipment Overview)
  ├→ Personnel Management (Limited - View Only)
  ├→ Unit Management (Limited - View Only)
  ├→ Equipment Management
  │   ├→ Inventory (View, Track)
  │   ├→ Status (Monitor)
  │   └→ Maintenance (Manage)
  └→ Account
      ├→ Profile
      ├→ Preferences
      └→ Logout
```

---

## 6. REACT COMPONENT IMPLEMENTATION EXAMPLE

### 6.1 Sidebar Component

```tsx
// components/Sidebar/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import menuConfig from '@/config/menuConfig.json';
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
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onCollapse }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Initialize expanded sections based on defaultOpen
    const initial: Record<string, boolean> = {};
    menuConfig.sections.forEach(section => {
      initial[section.id] = section.defaultOpen !== false;
    });
    setExpandedSections(initial);
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const hasPermission = (menuItem: MenuItem): boolean => {
    if (!menuItem.permission || menuItem.permission.length === 0) {
      return true;
    }
    return user && menuItem.permission.includes(user.role);
  };

  const isActive = (path?: string): boolean => {
    return path ? router.pathname === path : false;
  };

  if (!isMounted) return null;

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} military-sidebar`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <img src="/mrms-logo.png" alt="MRMS" className={styles.logo} />
          {!collapsed && <span className={styles.appName}>MRMS</span>}
        </div>
        <button
          className={styles.toggleBtn}
          onClick={() => onCollapse?.(!collapsed)}
          aria-label="Toggle sidebar"
        >
          <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'}`} />
        </button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <img src={`/avatars/${user._id}.jpg`} alt={user.username} />
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>{user.fullName}</p>
            <p className={styles.userRole}>{user.role}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={styles.nav}>
        {menuConfig.sections.map(section => (
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
                      expandedSections[section.id] ? '' : styles.collapsed
                    }`}
                  />
                </button>
                {expandedSections[section.id] && (
                  <div className={styles.sectionContent}>
                    {section.items
                      .filter(hasPermission)
                      .map(item => (
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
                  .map(item => (
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
              {!collapsed && <span>My Profile</span>}
            </Link>
            <Link href="/logout" className={`${styles.footerItem} ${styles.logout}`}>
              <i className="fas fa-sign-out-alt" />
              {!collapsed && <span>Logout</span>}
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

const NavItem: React.FC<NavItemProps> = ({ item, isActive, collapsed }) => {
  const [expanded, setExpanded] = useState(false);

  if (!item.path) {
    return (
      <button
        className={`${styles.item} ${expanded ? styles.expanded : ''}`}
        onClick={() => setExpanded(!expanded)}
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
    <Link href={item.path} className={`${styles.item} ${isActive ? styles.active : ''}`}>
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
```

---

## 7. UX IMPROVEMENT SUGGESTIONS

### 7.1 Navigation Enhancements

| Feature | Benefit | Implementation |
|---------|---------|-----------------|
| **Search/Filter** | Quick navigation to items | Add search box at top of sidebar |
| **Favorites/Pinned** | Fast access to frequent pages | Star icon to pin menu items |
| **Breadcrumbs** | Current location clarity | Show in header |
| **Recent Items** | Recent page history | "Recently Visited" section |
| **Smart Collapse** | Responsive on mobile | Auto-hide sidebar on smaller screens |
| **Keyboard Shortcuts** | Power user speed | `Ctrl+K` for command palette |
| **Notifications** | Real-time alerts | Badge on mission/maintenance items |
| **Activity Status** | Online/Offline awareness | User status indicator |

### 7.2 Accessibility Features

```tsx
// ARIA Attributes for Accessibility
<nav aria-label="Main navigation">
  <div role="menuitem" aria-expanded={isExpanded}>
    Menu Item
  </div>
</nav>

// Keyboard Navigation
- Tab: Move between menu items
- Enter/Space: Activate menu item
- Arrow Down/Up: Navigate sections
- Escape: Close expanded menus
```

### 7.3 Mobile Responsiveness

```css
@media (max-width: 768px) {
  .military-sidebar {
    position: fixed;
    left: -280px;
    height: 100vh;
    z-index: 1000;
    transition: left 0.3s ease;
  }

  .military-sidebar.open {
    left: 0;
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
}
```

### 7.4 Performance Optimizations

```tsx
// Lazy load menu items
const LazyNavItem = lazy(() => import('./NavItem'));

// Memoize sidebar components
export const Sidebar = React.memo(SidebarComponent);

// Virtual scrolling for long lists
import { FixedSizeList } from 'react-window';
```

### 7.5 Animation & Transitions

```css
/* Smooth Transitions */
.nav-item {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-section-content {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 8. RESPONSIVE DESIGN BREAKPOINTS

| Screen Size | Sidebar Behavior | Notes |
|-------------|------------------|-------|
| **Desktop (1200px+)** | Always visible, 280px width | Full menu items visible |
| **Tablet (768px-1199px)** | Collapsible, 80px when collapsed | Icon-only mode available |
| **Mobile (< 768px)** | Hamburger menu, off-canvas | Overlay menu, swipes enabled |

---

## 9. THEME CUSTOMIZATION

### 9.1 Color Scheme Variables

```css
:root {
  /* Military Theme Colors */
  --primary-dark: #1a1a2e;
  --primary-darker: #16213e;
  --military-gold: #d4af37;
  --military-silver: #c0c0c0;
  --accent-red: #dc2626;
  --accent-green: #22c55e;
  --neutral-light: #b0b0b0;
  --neutral-dark: #ffffff;
  
  /* Hover/Active States */
  --bg-hover: rgba(212, 175, 55, 0.1);
  --bg-active: rgba(212, 175, 55, 0.2);
  
  /* Transitions */
  --transition-fast: 0.2s;
  --transition-normal: 0.3s;
  --transition-slow: 0.5s;
}
```

### 9.2 Alternative Themes

```css
/* Modern Theme */
.sidebar.modern {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --accent-color: #00d4ff;
}

/* Classic Admin Theme */
.sidebar.classic {
  background: #2c3e50;
  --accent-color: #3498db;
}

/* Dark Mode */
.sidebar.dark {
  background: #0f0f0f;
  --accent-color: #00ff00;
}
```

---

## 10. USAGE INSTRUCTIONS

### Step 1: Install Dependencies
```bash
npm install font-awesome react-router-dom zustand
```

### Step 2: Add Menu Configuration
- Place `menuConfig.json` in `/public/config/`
- Reference in component via import

### Step 3: Implement Sidebar Component
```tsx
import { Sidebar } from '@/components/Sidebar';

export default function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar 
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
```

### Step 4: Configure Role-Based Access
- Update `permission` array in `menuConfig.json`
- Add role check in component
- Verify in AuthContext

### Step 5: Customize Styling
- Update CSS variables in `:root`
- Modify colors for military theme
- Adjust spacing/padding as needed

---

## SUMMARY

✅ **Professional Military Sidebar Design** with:
- 7 main navigation sections + account
- Role-based menu filtering
- Military color scheme (Dark Blue + Gold)
- Collapsible sections and responsive design
- Badge notifications for alerts
- Icon-based navigation
- Smooth animations and transitions
- Mobile-friendly overlay menu
- Accessibility features (ARIA, keyboard nav)
- Lazy loading for performance

This design provides a clean, organized, and professional military-themed navigation experience suitable for the MRMS system.

