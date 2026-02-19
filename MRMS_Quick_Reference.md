# MRMS Sidebar - Quick Reference & Cheat Sheet

## FILES CREATED FOR YOU

| File | Location | Purpose |
|------|----------|---------|
| **MRMS_Sidebar_Navigation_Design.md** | Project Root | Complete design specification (8000+ lines) |
| **MRMS_Sidebar.tsx** | Copy to `src/components/MRMS-Sidebar/` | React component |
| **MRMS_Sidebar.module.css** | Copy to `src/components/MRMS-Sidebar/` | Component styling |
| **MRMS_menuConfig.json** | Copy to `public/config/` | Menu structure configuration |
| **MRMS_Implementation_Guide.md** | Project Root | Step-by-step integration tutorial |
| **MRMS_Visual_Guide_UX_Enhancements.md** | Project Root | Visual specs & UX improvements |
| **MRMS_Quick_Reference.md** | Project Root | This file - quick lookups |

---

## QUICK START (5 MINUTES)

```bash
# 1. Create directories
mkdir src\components\MRMS-Sidebar
mkdir public\config

# 2. Copy files
# Copy MRMS_Sidebar.tsx → src\components\MRMS-Sidebar\Sidebar.tsx
# Copy MRMS_Sidebar.module.css → src\components\MRMS-Sidebar\Sidebar.module.css
# Copy MRMS_menuConfig.json → public\config\menuConfig.json

# 3. Install FontAwesome (if needed)
npm install @fortawesome/fontawesome-free

# 4. Import in _app.tsx
import '@fortawesome/fontawesome-free/css/all.min.css'

# 5. Update Layout.tsx
import { Sidebar } from '@/components/MRMS-Sidebar/Sidebar'

# 6. Use in your app
<Sidebar collapsed={false} onCollapse={setCollapsed} userRole="Admin" />
```

---

## COMPONENT PROPS

```typescript
<Sidebar
  collapsed={boolean}           // Is sidebar collapsed? Default: false
  onCollapse={(value) => {}}    // Callback when collapse state changes
  userRole="Admin"              // User's role: Admin, BaseCommander, LogisticsOfficer
  userName="Col. Rajendra"      // Display name of logged-in user
/>
```

---

## MENU STRUCTURE IN JSON

```json
{
  "sections": [
    {
      "id": "section-id",
      "title": "Section Title",        // null for no title
      "collapsible": true,              // Can be collapsed?
      "defaultOpen": true,              // Start expanded?
      "items": [
        {
          "id": "item-id",
          "label": "Item Label",
          "icon": "fas fa-icon-name",
          "path": "/page-path",
          "permission": ["Admin"],      // Who can see this
          "badge": {
            "count": 5,
            "variant": "danger"         // danger, warning, success, info
          }
        }
      ]
    }
  ]
}
```

---

## ICON QUICK REFERENCE

### Personnel
- Soldiers: `fas fa-users`
- Ranks: `fas fa-medal`
- Assignments: `fas fa-tasks`

### Units  
- Units: `fas fa-sitemap`
- Commanders: `fas fa-star`
- Members: `fas fa-user-tie`

### Bases
- Bases: `fas fa-fort`
- Capacity: `fas fa-chart-bar`
- Locations: `fas fa-map-marker-alt`

### Equipment
- Inventory: `fas fa-cube`
- Status: `fas fa-check-circle`
- Maintenance: `fas fa-tools`

### Missions
- Missions: `fas fa-bullseye`
- Status: `fas fa-hourglass-half`
- Deployment: `fas fa-parachute-box`

### System
- Users: `fas fa-user-cog`
- Settings: `fas fa-cog`
- Logs: `fas fa-history`

### Account
- Profile: `fas fa-user-circle`
- Preferences: `fas fa-sliders-h`
- Logout: `fas fa-sign-out-alt`
- Dashboard: `fas fa-chart-line`

[Full FontAwesome icons: https://fontawesome.com/icons](https://fontawesome.com/icons)

---

## COLOR PALETTE

### Military Theme (Default)
```css
Primary Dark:     #1a1a2e
Secondary Dark:   #16213e
Accent Gold:      #d4af37
Text Primary:     #ffffff (White)
Text Secondary:   #b0b0b0 (Gray)

Badge Colors:
- Danger/Red:     #ff6b6b
- Warning/Orange: #fbbf24
- Success/Green:  #4ade80
- Info/Blue:      #60a5fa
```

### Change Theme (Edit Sidebar.module.css)
```css
.sidebar {
  /* Change background gradient */
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  /* Change accent color */
  border-right: 3px solid #d4af37;
}
```

---

## INTEGRATION WITH AUTHCONTEXT

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/MRMS-Sidebar/Sidebar';

export default function Layout({ children }) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        userRole={user?.role || 'Admin'}
        userName={user?.fullName || 'User'}
      />
      <main>{children}</main>
    </div>
  );
}
```

---

## ROLE PERMISSIONS

### Available Roles
- **Admin**: Full system access, all menu items visible
- **BaseCommander**: Base-level management, limited system access
- **LogisticsOfficer**: Equipment/supplies focused, limited access

### Set Permissions in menuConfig.json
```json
{
  "id": "soldiers",
  "label": "Soldiers",
  "permission": ["Admin", "BaseCommander"]  // Only these roles see this
}
```

### Hide from All Roles
```json
{
  "permission": []  // Empty array = visible to all
}
```

---

## BADGES & NOTIFICATIONS

### Badge Types

| Type | Color | Use Case | Icon |
|------|-------|----------|------|
| **danger** | 🔴 Red | Active/Urgent | Missions, Critical alerts |
| **warning** | 🟠 Orange | Needs attention | Maintenance pending, Low stock |
| **success** | 🟢 Green | Completed/OK | Deployed, All systems ready |
| **info** | 🔵 Blue | Information | Total count, Status info |

### Example Badge
```json
{
  "id": "missions",
  "label": "Missions",
  "badge": {
    "count": 12,
    "variant": "danger"
  }
}
```

### Update Badge Dynamically
```tsx
// Fetch badge data and update menu
const [badgeCounts, setBadgeCounts] = useState({});

useEffect(() => {
  fetchBadgeCounts().then(counts => setBadgeCounts(counts));
}, []);
```

---

## RESPONSIVE BREAKPOINTS

| Device | Width | Behavior |
|--------|-------|----------|
| Desktop | 1200px+ | Sidebar always visible, 280px |
| Tablet | 768-1199px | Sidebar collapsible, 260px → 80px |
| Mobile | < 768px | Hamburger menu, off-canvas overlay |

### Mobile Sidebar Behavior
- Hidden by default (hamburger menu)
- Slides in from left side
- 280px width when open
- Overlay backdrop visible
- Click outside to close
- Swipe left to close (if implemented)

---

## KEYBOARD SHORTCUTS

```
Tab              → Navigate between items
Shift + Tab      → Go to previous item
Enter / Space    → Activate/click item
Escape           → Close expanded section
Arrow Up/Down    → Navigate within section
Home             → Jump to top
End              → Jump to bottom

(Add custom shortcuts in component)
Ctrl + K         → Open search (if implemented)
Ctrl + P         → Go to Profile
Ctrl + Q         → Logout
```

---

## TROUBLESHOOTING

### Icons Not Showing
```
Solution: Add FontAwesome CSS import in _app.tsx
import '@fortawesome/fontawesome-free/css/all.min.css'
```

### Menu Items Not Visible
```
Solution 1: Check user role matches permission array
Solution 2: Verify permission array in menuConfig.json
Solution 3: Debug component with console.log(userRole)
```

### Sidebar Not Collapsing
```
Solution: Check collapsed prop is properly passed
<Sidebar collapsed={sidebarCollapsed} {...props} />
```

### Styles Not Applied
```
Solution: Verify CSS module path is correct
Import styles from './Sidebar.module.css'
```

### Navigation Not Working
```
Solution 1: Check path prop in menu items
Solution 2: Verify pages exist at those paths
Solution 3: Check Next.js routing configuration
```

### Badge Not Showing
```
Solution: Ensure badge object structure is correct
"badge": { "count": 5, "variant": "danger" }
```

---

## CSS CUSTOMIZATION

### Change Primary Color
```css
/* Replace all #d4af37 with your color */
.sidebar {
  border-right: 3px solid #your-color;
}

.sectionTitle,
.appName,
.badge {
  color: #your-color;
}
```

### Change Background
```css
.sidebar {
  /* Replace gradient */
  background: linear-gradient(135deg, #color1 0%, #color2 100%);
}
```

### Increase/Decrease Width
```css
.sidebar {
  width: 280px;  /* Default: 280px */
  /* Change to your desired width */
}

.sidebar.collapsed {
  width: 80px;  /* When collapsed: 80px */
}
```

### Adjust Item Height/Padding
```css
.item {
  padding: 10px 20px;  /* Increase for larger items */
  /* Change to 12px 20px or 15px 25px */
}
```

---

## TYPESCRIPT TYPES

```typescript
interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  badge?: {
    count: number;
    variant: 'danger' | 'warning' | 'success' | 'info';
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
```

---

## COMMON TASKS

### Add New Menu Item
1. Edit `public/config/menuConfig.json`
2. Add to appropriate section:
```json
{
  "id": "new-item",
  "label": "New Item",
  "icon": "fas fa-icon",
  "path": "/new-item",
  "permission": ["Admin"]
}
```
3. Create page at `/pages/new-item.tsx`
4. Done!

### Add New Section
```json
{
  "id": "new-section",
  "title": "New Section",
  "collapsible": true,
  "defaultOpen": false,
  "items": [
    // Add items here
  ]
}
```

### Change Permissions for Item
```json
{
  "permission": ["Admin", "BaseCommander", "LogisticsOfficer"]
}
```

### Update Badge Count
Edit the `badge.count` value in menuConfig.json or fetch dynamically.

### Change Icon
Replace `icon` field with any FontAwesome class:
```json
{
  "icon": "fas fa-new-icon-name"
}
```

---

## PERFORMANCE TIPS

### 1. Lazy Load Sections
```tsx
const LazySection = lazy(() => import('./MenuSection'));
```

### 2. Memoize Components
```tsx
export const Sidebar = React.memo(SidebarComponent);
```

### 3. Use Production Build
```bash
npm run build
npm run start
```

### 4. Enable Gzip Compression
```javascript
// In next.config.js
compress: true
```

### 5. Optimize FontAwesome
```bash
# Use only needed icons instead of full library
npm uninstall @fortawesome/fontawesome-free
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
```

---

## ACCESSIBILITY CHECKLIST

- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces menu structure
- [ ] Focus indicators visible
- [ ] Color contrast >= 4.5:1
- [ ] Touch targets >= 44px (mobile)
- [ ] ARIA labels present
- [ ] Tooltip descriptions for icons
- [ ] No color-only information
- [ ] Semantic HTML used
- [ ] Animation can be disabled

---

## DEPLOYMENT CHECKLIST

- [ ] Logo placed at `/public/mrms-logo.png`
- [ ] FontAwesome CSS imported
- [ ] Menu config validated
- [ ] All navigation pages created
- [ ] AuthContext integrated
- [ ] Layout component updated
- [ ] Testing completed
- [ ] No console errors
- [ ] Mobile responsive verified
- [ ] Accessibility tested

---

## FILE LOCATIONS SUMMARY

```
Your Project Root/
├── MRMS_Sidebar_Navigation_Design.md       (Keep for reference)
├── MRMS_Implementation_Guide.md            (Keep for reference)
├── MRMS_Visual_Guide_UX_Enhancements.md   (Keep for reference)
├── MRMS_Quick_Reference.md                 (This file)
├── MRMS_menuConfig.json                    (Copy to public/config/)
├── MRMS_Sidebar.tsx                        (Copy to src/components/MRMS-Sidebar/)
├── MRMS_Sidebar.module.css                 (Copy to src/components/MRMS-Sidebar/)
│
├── Project/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MRMS-Sidebar/              [NEW]
│   │   │   │   ├── Sidebar.tsx            [NEW - Copy here]
│   │   │   │   └── Sidebar.module.css     [NEW - Copy here]
│   │   │   ├── layout/
│   │   │   │   └── Layout.tsx             [MODIFY]
│   │   │   └── ...
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx            [INTEGRATE]
│   │   ├── pages/
│   │   │   ├── _app.tsx                   [ADD IMPORT]
│   │   │   ├── personnel/
│   │   │   ├── units/
│   │   │   ├── bases/
│   │   │   ├── equipment/
│   │   │   ├── missions/
│   │   │   ├── system/
│   │   │   └── ... [CREATE PAGES]
│   │   └── styles/
│   │       └── globals.css                [UPDATE]
│   │
│   ├── public/
│   │   ├── config/                        [NEW]
│   │   │   └── menuConfig.json            [NEW - Copy here]
│   │   ├── mrms-logo.png                  [ADD LOGO]
│   │   └── ...
│   │
│   ├── package.json                       [ADD FONTAWESOME]
│   └── ...
```

---

## SUPPORT RESOURCES

### When You Need To...

**Change menu items**
→ Edit `public/config/menuConfig.json`

**Change styling/colors**
→ Edit `src/components/MRMS-Sidebar/Sidebar.module.css`

**Change component behavior**
→ Edit `src/components/MRMS-Sidebar/Sidebar.tsx`

**Understand full design**
→ Read `MRMS_Sidebar_Navigation_Design.md`

**See integration steps**
→ Read `MRMS_Implementation_Guide.md`

**Learn visual specs**
→ Read `MRMS_Visual_Guide_UX_Enhancements.md`

**Need quick answers**
→ You're reading it! `MRMS_Quick_Reference.md`

---

## NEXT STEPS

1. ✅ Review `MRMS_Sidebar_Navigation_Design.md` for full specification
2. ✅ Follow `MRMS_Implementation_Guide.md` step-by-step
3. ✅ Copy component files to your project
4. ✅ Create menu sections/pages
5. ✅ Test on desktop, tablet, and mobile
6. ✅ Deploy to production

---

## VERSION INFORMATION

| Component | Version | Last Updated |
|-----------|---------|--------------|
| Design | 1.0 | Feb 2026 |
| Component | 1.0 | Feb 2026 |
| Documentation | 1.0 | Feb 2026 |

---

## LICENSE & USAGE

Free to use and modify for your MRMS military management system.
Customization recommended for your specific needs.

---

**Questions?** Refer to the complete design documentation or review the implementation guide for detailed instructions.

**Ready to integrate?** Start with the step-by-step implementation guide and follow each step carefully.

