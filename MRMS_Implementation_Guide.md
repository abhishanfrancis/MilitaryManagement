# MRMS Sidebar Implementation Guide

## Overview

This guide provides step-by-step instructions to integrate the new Military Resource Management System (MRMS) sidebar into your existing MMS frontend.

---

## 1. FILES TO COPY/CREATE

### Files You'll Need:
1. **MRMS_Sidebar.tsx** → Copy to `MMS-frontend/src/components/MRMS-Sidebar/Sidebar.tsx`
2. **MRMS_Sidebar.module.css** → Copy to `MMS-frontend/src/components/MRMS-Sidebar/Sidebar.module.css`
3. **MRMS_menuConfig.json** → Copy to `MMS-frontend/public/config/menuConfig.json`

### Directory Structure to Create:
```
MMS-frontend/
├── src/
│   └── components/
│       ├── MRMS-Sidebar/              [NEW FOLDER]
│       │   ├── Sidebar.tsx            [NEW FILE]
│       │   └── Sidebar.module.css     [NEW FILE]
│       ├── assets/
│       ├── dashboard/
│       ├── layout/
│       └── ...
├── public/
│   ├── config/                        [NEW FOLDER]
│   │   └── menuConfig.json           [NEW FILE]
│   └── ...
└── ...
```

---

## 2. STEP-BY-STEP INTEGRATION

### Step 1: Create Directories
```bash
# Windows PowerShell
mkdir "MMS-frontend\src\components\MRMS-Sidebar"
mkdir "MMS-frontend\public\config"
```

### Step 2: Copy Component Files
- Copy `MRMS_Sidebar.tsx` to `MMS-frontend\src\components\MRMS-Sidebar\Sidebar.tsx`
- Copy `MRMS_Sidebar.module.css` to `MMS-frontend\src\components\MRMS-Sidebar\Sidebar.module.css`
- Copy `MRMS_menuConfig.json` to `MMS-frontend\public\config\menuConfig.json`

### Step 3: Add Logo Asset
Create/add MRMS logo at: `MMS-frontend/public/mrms-logo.png`
- Recommended size: 256x256px
- Format: PNG with transparency for best results

### Step 4: Install FontAwesome Icons
```bash
# Install Font Awesome (if not already installed)
cd MMS-frontend
npm install @fortawesome/fontawesome-free
# OR
npm install font-awesome
```

### Step 5: Import FontAwesome in _app.tsx or _document.tsx

**Option A: Add to `MMS-frontend/src/pages/_app.tsx`:**
```tsx
import '@fortawesome/fontawesome-free/css/all.min.css';
// or
import 'font-awesome/css/font-awesome.min.css';
```

**Option B: Add to `MMS-frontend/src/styles/globals.css`:**
```css
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/all.min.css');
```

---

## 3. UPDATE YOUR LAYOUT COMPONENT

### Modify `MMS-frontend/src/components/layout/Layout.tsx`:

```tsx
import React, { useState } from 'react';
import { Sidebar } from '@/components/MRMS-Sidebar/Sidebar';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={styles.layoutContainer}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        userRole="Admin"  // Pass from AuthContext/Zustand store
        userName="Col. Rajendra Singh"  // Pass from user state
      />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
```

### Update `MMS-frontend/src/components/layout/Layout.module.css`:

```css
.layoutContainer {
  display: flex;
  height: 100vh;
  width: 100%;
  background: #f5f5f5;
}

.mainContent {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .layoutContainer {
    flex-direction: column;
  }

  .mainContent {
    flex: 1;
  }
}
```

---

## 4. INTEGRATE WITH AUTHCONTEXT

### Update your `MMS-frontend/src/contexts/AuthContext.tsx`:

```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'BaseCommander' | 'LogisticsOfficer';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // Your login logic
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## 5. PASS USER DATA TO SIDEBAR

### Update your Layout to use AuthContext:

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/MRMS-Sidebar/Sidebar';

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={styles.layoutContainer}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        userRole={user?.role || 'Admin'}
        userName={user?.fullName || 'User'}
      />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
```

---

## 6. UPDATE MENU CONFIGURATION

### Customize `public/config/menuConfig.json`:

You can modify badge counts, permissions, and paths:

```json
{
  "sections": [
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
        }
      ]
    }
  ]
}
```

---

## 7. CREATE PAGES FOR NAVIGATION ITEMS

Create corresponding page files for each navigation item:

```
MMS-frontend/src/pages/
├── personnel/
│   ├── soldiers.tsx
│   ├── ranks.tsx
│   └── assignments.tsx
├── units/
│   ├── index.tsx
│   ├── commanders.tsx
│   └── members.tsx
├── bases/
│   ├── index.tsx
│   ├── capacity.tsx
│   └── locations.tsx
├── equipment/
│   ├── inventory.tsx
│   ├── status.tsx
│   └── maintenance.tsx
├── missions/
│   ├── index.tsx
│   ├── status.tsx
│   └── deployment.tsx
├── system/
│   ├── users.tsx
│   ├── settings.tsx
│   └── logs.tsx
├── profile.tsx
└── preferences.tsx
```

---

## 8. EXAMPLE PAGE IMPLEMENTATION

### `MMS-frontend/src/pages/personnel/soldiers.tsx`:

```tsx
import React from 'react';
import Layout from '@/components/layout/Layout';

export default function Soldiers() {
  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <h1>Soldiers Management</h1>
        <p>Welcome to the Soldiers Management page.</p>
        {/* Add your soldiers list/table here */}
      </div>
    </Layout>
  );
}
```

---

## 9. STYLING ADJUSTMENTS

### Add to `MMS-frontend/src/styles/globals.css`:

```css
/* Ensure proper scrolling behavior */
html {
  scroll-behavior: smooth;
}

/* Global font adjustments */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ensure main content fills viewport */
#__next {
  display: flex;
  min-height: 100vh;
}

/* Custom scrollbar for modern browsers */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

---

## 10. ROLE-BASED ACCESS CONTROL

### Update menu items based on user roles:

The sidebar automatically filters menu items based on the `permission` array in `menuConfig.json` and the `userRole` prop.

Edit `public/config/menuConfig.json` to configure which roles can see each menu item:

```json
{
  "id": "soldiers",
  "label": "Soldiers",
  "permission": ["Admin", "BaseCommander"]  // Only these roles see this item
}
```

**Available Roles:**
- `Admin` - Full system access
- `BaseCommander` - Base-level management
- `LogisticsOfficer` - Equipment and supplies management

---

## 11. DYNAMIC BADGE UPDATES

### Update badge counts dynamically:

If you want badges to show real-time counts, fetch from your API:

```tsx
// In your Sidebar component or a custom hook
useEffect(() => {
  fetchBadgeCounts().then(counts => {
    // Update menu config with new badge counts
    // This requires extending the component
  });
}, []);
```

---

## 12. TESTING

### Test the sidebar:

1. **Navigation**: Click menu items and verify they navigate correctly
2. **Permissions**: Login with different roles and verify menu items show/hide
3. **Collapse**: Test sidebar collapse/expand functionality
4. **Responsive**: Test on mobile (< 768px) to see off-canvas menu
5. **Icons**: Verify all FontAwesome icons display correctly
6. **Scrolling**: Test scrolling in long menu lists

---

## 13. CUSTOMIZATION EXAMPLES

### Change Military Theme Colors:

Edit `MRMS_Sidebar.module.css`:

```css
.sidebar {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);  /* Change these */
  border-right: 3px solid #d4af37;  /* Gold accent */
}

.appName,
.sectionTitle,
.badge {
  color: #d4af37;  /* Primary accent color */
}
```

### Change to Modern Blue Theme:

```css
.sidebar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-right: 3px solid #00d4ff;
}

.appName,
.sectionTitle {
  color: #00d4ff;
}
```

---

## 14. TROUBLESHOOTING

### Issue: Icons not showing
- **Solution**: Ensure FontAwesome is imported in `_app.tsx` or `globals.css`

### Issue: Menu items not appearing
- **Solution**: Check `permission` array matches user role in AuthContext

### Issue: Sidebar not responsive
- **Solution**: Verify media queries in CSS module are working

### Issue: Collapsed state not working
- **Solution**: Ensure `collapsed` prop is properly passed to Sidebar component

### Issue: JSON config not loading
- **Solution**: Verify path is `public/config/menuConfig.json` and public folder is served

---

## 15. DEPLOYMENT CONSIDERATIONS

### Before deploying:

1. ✅ Replace placeholder logo with actual MRMS logo
2. ✅ Test all navigation links in production
3. ✅ Verify role-based access works with real user data
4. ✅ Update menu paths if your routing structure differs
5. ✅ Test sidebar on mobile devices
6. ✅ Enable gzip compression for CSS/JS
7. ✅ Consider adding search/filter for large menus
8. ✅ Implement analytics tracking for menu usage

---

## 16. ADVANCED FEATURES (Optional)

### Add Search Functionality:

```tsx
const [searchTerm, setSearchTerm] = useState('');

const filteredItems = menuItems.filter(item =>
  item.label.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### Add Dark Mode Toggle:

```tsx
const [darkMode, setDarkMode] = useState(false);

return (
  <aside className={`${styles.sidebar} ${darkMode ? styles.darkMode : ''}`}>
    {/* Add toggle button */}
  </aside>
);
```

### Add Menu Item Analytics:

```tsx
const handleMenuClick = (itemId: string) => {
  trackEvent('menu_click', { item: itemId });
};
```

---

## 17. QUICK START CHECKLIST

- [ ] Create `MRMS-Sidebar` folder in components
- [ ] Copy Sidebar.tsx and Sidebar.module.css
- [ ] Create `config` folder in public
- [ ] Copy menuConfig.json
- [ ] Add FontAwesome CSS import
- [ ] Update Layout component
- [ ] Integrate AuthContext
- [ ] Create navigation pages
- [ ] Test sidebar functionality
- [ ] Customize colors/theme if needed
- [ ] Deploy to production

---

## 18. SUPPORT & NEXT STEPS

### Need to modify navigation structure?
Edit `public/config/menuConfig.json` to add/remove/reorder menu items.

### Need different role permissions?
Update the `permission` array for each menu item.

### Need custom styling?
Edit `Sidebar.module.css` to customize colors, spacing, and animations.

### Need to add notifications?
Add badge objects to menu items with count and variant.

---

## Summary

This MRMS Sidebar is fully customizable, role-based, and mobile-responsive. It follows React best practices and integrates seamlessly with Next.js applications. The military theme can be easily changed to match any design system.

For questions about specific implementation details, refer to the main design document: `MRMS_Sidebar_Navigation_Design.md`

