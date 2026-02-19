# MRMS Sidebar - Visual Design Guide

## Design System Overview

### Color Palette

#### Primary Colors
```
Navy Blue (Primary Dark)
  HEX: #1a1a2e
  RGB: 26, 26, 46
  Usage: Main sidebar background, headers

Steel Blue (Primary Light)
  HEX: #16213e
  RGB: 22, 33, 62
  Usage: Hover states, section backgrounds

Accent Blue
  HEX: #0066cc
  RGB: 0, 102, 204
  Usage: Active items, focus states, CTAs
```

#### Text Colors
```
White (Primary Text)
  HEX: #ffffff
  RGB: 255, 255, 255
  Usage: Main text on dark background

Light Gray (Secondary Text)
  HEX: #e5e7eb
  RGB: 229, 231, 235
  Usage: Disabled items, descriptions

Medium Gray (Tertiary Text)
  HEX: #9ca3af
  RGB: 156, 163, 175
  Usage: Timestamps, hints
```

#### Status Colors
```
Success (Green)
  HEX: #10b981
  RGB: 16, 185, 129
  Usage: Active status, completed items, OK state

Warning (Amber)
  HEX: #f59e0b
  RGB: 245, 158, 11
  Usage: Caution, requires attention, pending

Danger (Red)
  HEX: #ef4444
  RGB: 239, 68, 68
  Usage: Errors, critical issues, offline

Info (Cyan)
  HEX: #06b6d4
  RGB: 6, 182, 212
  Usage: Information, notifications, new items
```

---

## Typography

### Font Stack
```css
font-family: 'Segoe UI', 'Roboto', 'Ubuntu', 'Cantarell', sans-serif;
```

### Font Sizes & Weights

**Sidebar Header**
- Size: 20px
- Weight: 700 (Bold)
- Line Height: 28px
- Color: White
- Letter Spacing: -0.5px

**Section Title**
- Size: 12px
- Weight: 600 (SemiBold)
- Line Height: 16px
- Color: Light Gray (#e5e7eb)
- Letter Spacing: 0.5px
- Text Transform: Uppercase

**Menu Item Label**
- Size: 14px
- Weight: 500 (Medium)
- Line Height: 20px
- Color: White (active), Light Gray (inactive)

**Menu Item Badge**
- Size: 12px
- Weight: 600 (SemiBold)
- Color: White

---

## Spacing System

### Base Unit: 4px

```
2px   = 2 × base
4px   = 1 × base (Single unit)
8px   = 2 × base
12px  = 3 × base
16px  = 4 × base
20px  = 5 × base
24px  = 6 × base
32px  = 8 × base
48px  = 12 × base
```

### Component Spacing

**Sidebar Container**
```
Padding: 16px (horizontal), 12px (vertical)
Max Width: 250px (expanded), 60px (collapsed)
```

**Section Spacing**
```
Margin Bottom: 12px
Padding: 8px 12px
Border Bottom: 1px solid rgba(255,255,255,0.05)
```

**Menu Item Spacing**
```
Padding: 12px 16px
Margin: 4px 8px
Min Height: 44px (touch target)
```

**Icon Spacing**
```
Icon Size: 20px
Icon Margin Right: 12px (when expanded)
Icon Margin Right: 0px (when collapsed)
Icon Margin Left: 2px (center alignment)
```

**Badge Spacing**
```
Badge Padding: 4px 8px
Badge Margin Left: 8px (auto)
Min Width: 20px
Text Align: Center
```

---

## Component Specifications

### Menu Item States

**Default State**
```
Background: transparent
Text Color: #e5e7eb
Icon Color: #9ca3af
Padding: 12px 16px
Border Radius: 0px
```

**Hover State (Desktop)**
```
Background: rgba(255, 255, 255, 0.1)
Transition: 100ms ease
Shadow: none
```

**Active State**
```
Background: rgba(0, 102, 204, 0.2)
Text Color: #ffffff
Icon Color: #0066cc
Left Border: 4px solid #0066cc
Padding Left: 12px (to maintain alignment)
```

**Disabled State**
```
Background: transparent
Text Color: #6b7280 (muted gray)
Opacity: 0.5
Cursor: not-allowed
Pointer Events: none
```

**Focus State (Keyboard)**
```
Outline: 2px solid #0066cc
Outline Offset: -2px
```

---

### Section Header States

**Collapsed State**
```
Content: "▼" icon (chevron right)
Icon Rotation: 0deg
Height: 40px
```

**Expanded State**
```
Content: "▼" icon (chevron down)
Icon Rotation: 180deg
Transition: transform 200ms ease
```

**Hover State**
```
Background: rgba(255, 255, 255, 0.05)
```

---

### Badge Styles

**Info Badge**
```
Background: #06b6d4 (cyan)
Text Color: #ffffff
Padding: 4px 8px
Border Radius: 4px
Font Size: 11px
Font Weight: 600
```

**Warning Badge**
```
Background: #f59e0b (amber)
Text Color: #1a1a2e (dark text on amber)
Padding: 4px 8px
Border Radius: 4px
```

**Danger Badge**
```
Background: #ef4444 (red)
Text Color: #ffffff
Padding: 4px 8px
Border Radius: 4px
Animation: pulse 2s infinite (critical items)
```

**Success Badge**
```
Background: #10b981 (green)
Text Color: #ffffff
Padding: 4px 8px
Border Radius: 4px
```

---

### Icons

**Icon Library:** FontAwesome 6.x

**Icon Sizes**
```
Menu Item Icons: 20px
Section Header Icons: 16px
Badge Icons: 12px
```

**Icon Color**
```
Default: #9ca3af (medium gray)
Hover: #e5e7eb (light gray)
Active: #0066cc (accent blue)
Disabled: #6b7280 (muted)
```

**Icon Animations**
```
Hover Scale: 1.1 (110%)
Duration: 100ms
Easing: ease-out
```

---

## Responsive Breakpoints

### Desktop (≥1200px)
```css
.sidebar {
  width: 250px;
  display: flex;
}

.sidebar.collapsed {
  width: 250px;  // Always expanded on desktop
}

.menu-label {
  display: inline;
}
```

### Tablet (768px - 1199px)
```css
.sidebar {
  width: 250px;  // Expanded
}

.sidebar.collapsed {
  width: 60px;   // Icon only
}

.menu-label {
  display: none;  // Hidden when collapsed
}

.toggle-btn {
  display: block;
}
```

### Mobile (<768px)
```css
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 80vw;
  max-width: 300px;
  height: 100vh;
  transform: translateX(-100%);
  transition: transform 300ms ease;
}

.sidebar.open {
  transform: translateX(0);
}

.scrim {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transition: opacity 300ms ease;
}

.sidebar.open + .scrim {
  opacity: 1;
  pointer-events: all;
}
```

---

## Animation Specifications

### Duration & Easing
```
Quick Interactions: 100ms cubic-bezier(0.4, 0, 0.6, 1)
Standard: 200ms cubic-bezier(0.4, 0, 0.2, 1)
Entrance: 300ms cubic-bezier(0, 0, 0.2, 1)
Exit: 250ms cubic-bezier(0.4, 0, 1, 1)
```

### Menu Item Animations

**Expand/Collapse Submenu**
```css
Timing: 200ms
Transform: max-height 0 → auto
Opacity: 0 → 1
```

**Hover Highlight**
```css
Timing: 100ms
Background: transparent → rgba(255,255,255,0.1)
```

**Badge Pulse (Critical)**
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
Animation: pulse 2s infinite;
```

---

## Shadow & Depth

### Elevation System

**No Elevation (Default)**
```css
box-shadow: none;
```

**Elevation +1 (Hover Cards)**
```css
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.24);
```

**Elevation +4 (Modals, Sidebars)**
```css
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15),
            0 6px 12px rgba(0, 0, 0, 0.05);
```

---

## Accessibility Specifications

### Focus Indicators
```css
outline: 2px solid #0066cc;
outline-offset: -2px;
border-radius: 2px;
```

### Color Contrast Ratios
```
Text on Background: 17.5:1 (white on #1a1a2e)
Text on Hover: 15.2:1
Icons on Background: 10.8:1
Badge Text: 12.6:1 minimum
```

### Motion & Animation
```
Prefers Reduced Motion: Disable all animations
- @media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}
```

### Minimum Touch Targets
```
Desktop: 36x36px
Mobile: 44x44px
```

---

## Dark Mode CSS Variables

```css
:root {
  --color-bg-primary: #1a1a2e;
  --color-bg-secondary: #16213e;
  --color-text-primary: #ffffff;
  --color-text-secondary: #e5e7eb;
  --color-text-tertiary: #9ca3af;
  --color-accent: #0066cc;
  --color-accent-hover: #005bb3;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #06b6d4;
  
  --spacing-unit: 4px;
  --spacing-xs: calc(var(--spacing-unit) * 2);
  --spacing-sm: calc(var(--spacing-unit) * 3);
  --spacing-md: calc(var(--spacing-unit) * 4);
  --spacing-lg: calc(var(--spacing-unit) * 6);
  --spacing-xl: calc(var(--spacing-unit) * 8);
  
  --border-radius-sm: 2px;
  --border-radius-md: 4px;
  --border-radius-lg: 8px;
  
  --transition-quick: 100ms cubic-bezier(0.4, 0, 0.6, 1);
  --transition-standard: 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Implementation Example

```css
/* Sidebar Container */
.sidebar {
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 100vh;
  background-color: var(--color-bg-primary);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  transition: width var(--transition-standard);
  overflow-y: auto;
}

/* Menu Item */
.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 4px 8px;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-quick);
  min-height: 44px;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.menu-item.active {
  background-color: rgba(0, 102, 204, 0.2);
  color: var(--color-text-primary);
  border-left: 4px solid var(--color-accent);
  padding-left: 12px;
}

.menu-item:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

/* Badge */
.badge {
  margin-left: auto;
  padding: 4px 8px;
  background-color: var(--color-info);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}
```

