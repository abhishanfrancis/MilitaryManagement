# MRMS Sidebar Navigation Structure

## Overview
This document outlines the complete sidebar navigation hierarchy for the Military Resource Management System (MRMS).

---

## Navigation Hierarchy

### 1. **DASHBOARD** (Main Entry Point)
   - **Overview** - System summary and key metrics
   - **System Alerts** - Critical notifications and warnings
   - **Analytics** - Reporting and statistics dashboard

---

### 2. **PERSONNEL MANAGEMENT**
   - **Soldiers** - Complete soldier database and profiles
     - View/Edit Soldier Details
     - Service Records
     - Performance Metrics
   - **Ranks** - Military rank structure and assignments
     - Rank Hierarchy
     - Rank Management
   - **Assignments** - Personnel duty assignments
     - Current Assignments
     - Assignment History
     - Change Assignments

---

### 3. **UNIT MANAGEMENT**
   - **Units** - Military unit organization and structure
     - Unit Directory
     - Unit Composition
     - Unit Strength Reports
   - **Commanders** - Unit leadership information
     - Commander List
     - Command Chain
     - Leadership History
   - **Unit Members** - Personnel within units
     - Roster View
     - Member Details
     - Bulk Operations

---

### 4. **BASE MANAGEMENT**
   - **Bases** - Military bases and installations
     - Base Directory
     - Base Information
     - Facility Management
   - **Capacity Status** - Real-time base capacity monitoring
     - Current Utilization
     - Available Capacity
     - Capacity Reports
   - **Deployment Locations** - Geographic deployment areas
     - Active Deployments
     - Location Map
     - Deployment Timeline

---

### 5. **EQUIPMENT MANAGEMENT**
   - **Equipment Inventory** - Military equipment and assets
     - Equipment Catalog
     - Stock Levels
     - Equipment Details
   - **Equipment Status** - Real-time equipment condition
     - Operational Status
     - Status Dashboard
     - Equipment Condition Reports
   - **Maintenance Tracking** - Equipment maintenance records
     - Maintenance Schedule
     - Service History
     - Maintenance Reports

---

### 6. **MISSION MANAGEMENT**
   - **Missions** - Military missions and operations
     - Mission List
     - Mission Details
     - Create New Mission
   - **Mission Status** - Real-time mission tracking
     - Active Missions
     - Mission Progress
     - Status Reports
   - **Unit Deployment** - Deploy units to missions
     - Deployment Orders
     - Unit Allocation
     - Deployment History

---

### 7. **SYSTEM MANAGEMENT**
   - **Users** - User account management
     - User List
     - User Permissions
     - User Roles
   - **Settings** - System configuration
     - General Settings
     - Security Settings
     - System Configuration

---

## Recommended FontAwesome Icons

| Menu Item | Icon | Icon Code |
|-----------|------|-----------|
| Dashboard | `fas fa-tachometer-alt` | ⚡ |
| Overview | `fas fa-chart-line` | 📈 |
| Alerts | `fas fa-bell` | 🔔 |
| Analytics | `fas fa-chart-bar` | 📊 |
| Personnel | `fas fa-users-cog` | 👥 |
| Soldiers | `fas fa-user-tie` | 👤 |
| Ranks | `fas fa-medal` | 🎖️ |
| Assignments | `fas fa-tasks` | ✓ |
| Units | `fas fa-sitemap` | 🗂️ |
| Commanders | `fas fa-user-secret` | 🎖️ |
| Unit Members | `fas fa-user-shield` | 🛡️ |
| Base Management | `fas fa-building` | 🏢 |
| Bases | `fas fa-landmark` | 🏛️ |
| Capacity | `fas fa-cubes` | 📦 |
| Deployment | `fas fa-map-marked-alt` | 🗺️ |
| Equipment | `fas fa-cogs` | ⚙️ |
| Inventory | `fas fa-box` | 📦 |
| Status | `fas fa-heartbeat` | 💓 |
| Maintenance | `fas fa-wrench` | 🔧 |
| Missions | `fas fa-rocket` | 🚀 |
| Mission Status | `fas fa-tasks-alt` | ✓ |
| Deployment Orders | `fas fa-clipboard-list` | 📋 |
| System Management | `fas fa-cog` | ⚙️ |
| Users | `fas fa-users` | 👥 |
| Settings | `fas fa-sliders-h` | 🎚️ |

---

## Navigation Flow

### User Journey Examples

**1. Military Officer - Daily Operations**
```
Dashboard (Overview) 
  → Check System Alerts
  → Review Personnel Assignments
  → Monitor Mission Status
  → Check Equipment Status
```

**2. Base Commander - Base Operations**
```
Base Management (Bases)
  → View Base Capacity Status
  → Check Active Deployments
  → Review Unit Members at Base
  → Monitor Equipment Inventory
```

**3. Logistics Officer - Equipment Management**
```
Equipment Management (Inventory)
  → Check Equipment Status
  → Review Maintenance Schedule
  → Update Equipment Records
  → Generate Inventory Reports
```

**4. Administrator - System Configuration**
```
System Management (Users)
  → Manage User Accounts
  → Configure System Settings
  → Review Access Permissions
  → View System Logs (Analytics)
```

---

## Menu Behavior & States

### Expandable Sections
The following sections should be **collapsible/expandable**:
- Personnel Management
- Unit Management
- Base Management
- Equipment Management
- Mission Management
- System Management

### Active States
- Highlight currently selected menu item
- Show breadcrumb of current location
- Indicate parent section when in submenu

### Badge Indicators (Optional)
Strategic placement of badges for:
- **Alerts**: Red badge with count on Dashboard
- **Pending Tasks**: Badge on relevant sections
- **Active Missions**: Badge on Mission Management
- **Offline Equipment**: Badge on Equipment Management

---

## Responsive Design Considerations

### Desktop View (1200px+)
- Full sidebar width: 250px
- Expanded menu items visible
- Icons + Labels visible
- Hover effects on menu items

### Tablet View (768px - 1200px)
- Collapsible sidebar: 250px expanded, 60px collapsed
- Toggle button visible
- Icons + abbreviated labels when collapsed

### Mobile View (<768px)
- Sidebar as overlay/drawer
- Full width menu items
- Hamburger menu toggle
- Touch-friendly spacing (44px min height)

---

## UX Improvement Suggestions

### 1. **Breadcrumb Navigation**
Display current location path:
```
Dashboard > Personnel Management > Soldiers > Soldier Details
```

### 2. **Recent Items**
Quick access to recently viewed pages:
- Recent Soldiers
- Recent Missions
- Recent Equipment

### 3. **Quick Actions**
Floating action buttons for common tasks:
- Create New Soldier
- Assign Personnel
- Add Equipment
- Create Mission

### 4. **Search Functionality**
Global search across:
- Soldiers
- Units
- Equipment
- Missions

### 5. **User Profile Section**
In sidebar footer:
- User name and rank
- Role badge
- Quick access to profile settings
- Logout button

### 6. **Customizable Dashboard**
Allow users to customize:
- Which sections appear in sidebar
- Menu item order (drag & drop)
- Favorite items pinned to top

### 7. **Keyboard Shortcuts**
Power users can use:
```
Alt + D → Dashboard
Alt + P → Personnel
Alt + U → Units
Alt + E → Equipment
```

### 8. **Dark/Light Theme**
Military-appropriate color schemes:
- **Dark Theme**: Dark navy (#1a1a2e) with accent colors
- **Light Theme**: Light gray (#f5f5f5) with navy accents
- **High Contrast**: For accessibility

### 9. **Notification Center**
Integration with sidebar:
- Notification bell with unread count
- Quick notification preview
- Mark as read functionality

### 10. **Contextual Help**
Tooltips and help icons:
- Hover tooltips for menu items
- "?" icon for section descriptions
- Context-sensitive help panels

---

## Color Scheme (Military Professional)

### Primary Colors
- **Navy Blue**: `#1a1a2e` (Background)
- **Steel Gray**: `#374151` (Secondary elements)
- **Accent Blue**: `#0066cc` (Active items)
- **White**: `#ffffff` (Text)

### Status Colors
- **Active/Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Alert**: `#ef4444` (Red)
- **Neutral**: `#9ca3af` (Gray)

### Hover States
- Background opacity: 0.1 increase on primary color
- Smooth transition: 200ms

---

## Accessibility Requirements

1. **ARIA Labels**: All menu items have descriptive labels
2. **Keyboard Navigation**: Tab through menu items
3. **Focus States**: Clear visible focus indicators
4. **Semantic HTML**: Proper heading and list structure
5. **Color Contrast**: WCAG AA compliance minimum
6. **Screen Reader Support**: Menu structure is logical and clear

---

## Performance Considerations

1. **Lazy Loading**: Load submenu items on expansion
2. **Caching**: Cache menu configuration and user permissions
3. **Minimal Re-renders**: Optimize React component updates
4. **Bundle Size**: Tree-shake unused icons from FontAwesome

