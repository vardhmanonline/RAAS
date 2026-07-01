# RAAS — UI Testing & Scroll Issues Checklist

**Created:** 2026-07-01  
**Purpose:** Comprehensive testing guide for all UI components and scroll behavior across the RAAS ecommerce platform.

---

## 🎯 Overview

This checklist covers:
- ✅ Responsive design across all breakpoints (480px, 768px, 1024px, desktop)
- ✅ Scroll behavior and fixed/sticky elements
- ✅ Component interactions and animations
- ✅ Typography and color system consistency
- ✅ Form inputs and validation
- ✅ Navigation and routing
- ✅ Mobile-specific issues

---

## 📱 Responsive Breakpoints to Test

| Breakpoint | Device | Width | Issues |
|------------|--------|-------|--------|
| Mobile Small | iPhone SE, 12 Mini | **480px** | Check CTA buttons, overflow, font scaling |
| Mobile | iPhone 12/13/14 | **768px** | Sidebar nav, grid layout, spacing |
| Tablet | iPad, iPad Mini | **1024px** | Sidebar collapse, two-column layout |
| Desktop | Laptop, Desktop | **1200px+** | Full layout, spacing, hover states |

---

## 🏗️ Component Testing Matrix

### 1. **Header Component** (`frontend/src/app/layout/header.component`)
**Status:** ⏳ To be verified

**Desktop (1200px+)**
- [ ] Logo visibility and sizing
- [ ] Navigation menu items (Home, Products, Cart, Account)
- [ ] Search bar input and results
- [ ] Cart icon badge (item count)
- [ ] User account dropdown (if logged in)
- [ ] Sticky header on scroll (position: fixed)
- [ ] Header shadow appears on scroll > 100px
- [ ] Correct color scheme: deep-maroon bg, cream text

**Tablet (1024px)**
- [ ] Navigation compresses or goes mobile
- [ ] Search bar visibility
- [ ] Cart icon stays visible
- [ ] No horizontal overflow

**Mobile (768px)**
- [ ] Hamburger menu appears
- [ ] Logo centered or left-aligned
- [ ] Search bar moves to collapsible state
- [ ] Cart icon visible with badge

**Mobile Small (480px)**
- [ ] Hamburger menu only (no text)
- [ ] Logo minimal size
- [ ] Sidebar navigation overlay (no horizontal push)
- [ ] Touch targets ≥ 44px

---

### 2. **Sidebar Component** (`frontend/src/app/layout/sidebar.component`)
**Status:** ⏳ To be verified

**Desktop (1200px+)**
- [ ] Width: 260px
- [ ] Background: cream (#FBF5E6)
- [ ] Position: fixed, left: 0
- [ ] Contains: Home, Products, Cart, Referrals, Profile, Admin (if logged in)
- [ ] Active route highlighted in saffron/maroon
- [ ] Scrolls independently from main content
- [ ] No overflow of menu items
- [ ] Bottom spacing for footer items (if any)

**Tablet (1024px)**
- [ ] Width reduces to 220px
- [ ] Text truncation or icon-only mode?
- [ ] Check collapsible menu behavior

**Mobile (768px)**
- [ ] Sidebar **must disappear** (position: fixed not applied)
- [ ] Main content: `margin-left: 0; margin-bottom: 80px`
- [ ] Bottom nav bar appears instead
- [ ] Z-index conflict? (should be behind content when closed)

**Mobile Small (480px)**
- [ ] Bottom nav bar works (hamburger or icons)
- [ ] Touch targets for nav items: ≥ 44px tall × 44px wide
- [ ] No sidebar overlap

---

### 3. **Scroll Progress Bar**
**Status:** ⏳ To be verified

**Desktop, Tablet, Mobile**
- [ ] Bar appears at top of page (height: 3px)
- [ ] Gradient color: saffron → maroon → saffron (#E8922A → #7B1818 → #E8922A)
- [ ] Width increases as user scrolls (calculated in AppComponent)
- [ ] Smooth transition: `transition: width 0.1s ease`
- [ ] Z-index: 1000 (stays on top)
- [ ] Box shadow: subtle glow effect

**Issue to Fix:**
- [ ] Progress bar calculation: verify formula `(scrollTop / scrollHeight) * 100` works correctly on all pages
- [ ] Check if progress bar appears in:
  - [ ] Home page (full-height hero)
  - [ ] Product listing (long list)
  - [ ] Cart page (short, may not scroll)

---

### 4. **Main Content Area** (`app-main`)
**Status:** ⏳ To be verified

**Desktop (1200px+)**
- [ ] `margin-left: 260px` (sidebar width)
- [ ] `overflow-y: auto` (enables scroll)
- [ ] `scroll-behavior: smooth` works
- [ ] Background: cream (#FBF5E6)
- [ ] No horizontal scroll or overflow

**Tablet (1024px)**
- [ ] `margin-left: 220px` (reduced sidebar)
- [ ] Content still fits without overflow

**Mobile (768px)**
- [ ] `margin-left: 0` (no sidebar)
- [ ] `margin-bottom: 80px` (room for bottom nav)
- [ ] No horizontal scroll

**Mobile Small (480px)**
- [ ] Content is full width with padding
- [ ] Bottom margin: 80px (enough for bottom nav)
- [ ] All elements responsive (images, cards, text)

---

### 5. **Floating CTA Button** (Shop Now)
**Status:** ⏳ To be verified

**Desktop (1200px+)**
- [ ] Appears after scrolling > 500px
- [ ] Position: fixed, bottom: 8rem, right: 2rem
- [ ] Gradient background: maroon → dark-maroon
- [ ] Icon + Text: "🛍️ Shop Now"
- [ ] Hover: lift up (-4px), shadow increases, darker gradient
- [ ] Animation: slideInUp (elastic easing)
- [ ] Z-index: 98 (below header progress bar but above content)

**Tablet (1024px)**
- [ ] Same positioning
- [ ] May need adjustment if sidebar affects right edge

**Mobile (768px)**
- [ ] Position: fixed, bottom: 6rem, right: 1rem
- [ ] Button size maintained

**Mobile Small (480px)**
- [ ] Position: fixed, bottom: 5.5rem, right: 0.75rem
- [ ] **Icon only** (text hidden: `display: none`)
- [ ] Circular shape: width: 50px, height: 50px
- [ ] Icon centered
- [ ] **TEST:** Does it overlap with bottom nav? Should be visible above

**Issues to Check:**
- [ ] CTA not appearing when scrolled (check signal logic)
- [ ] CTA overlapping bottom navigation on mobile
- [ ] CTA clickable on mobile? Link redirects to `/products`

---

### 6. **Home Page Hero Section**
**Status:** ⏳ To be verified

**Desktop (1200px+)**
- [ ] Full-height or 50vh hero image
- [ ] Text overlay: "Premium Rajasthani Food"
- [ ] CTA button visible and clickable
- [ ] Hero image responsive (no distortion)
- [ ] Text contrast sufficient (readable)
- [ ] Background color fallback: cream

**Tablet (1024px)**
- [ ] Hero scales down
- [ ] Text still readable
- [ ] Button size appropriate

**Mobile (768px)**
- [ ] Hero height: 40vh or 50vh
- [ ] Text stacks vertically
- [ ] Button full-width or narrow
- [ ] Image loads fast (optimization needed?)

**Mobile Small (480px)**
- [ ] Hero height: 30vh minimum
- [ ] Large text: use clamp() for scaling
- [ ] Button: full width or large touch target

---

### 7. **Product Grid**
**Status:** ⏳ To be verified

**Desktop (1200px+)**
- [ ] 4-column grid (`.grid-4`): `grid-template-columns: repeat(4, 1fr); gap: 1.25rem`
- [ ] Cards have rounded corners (var(--radius): 20px)
- [ ] Card hover: lift up (-4px), shadow increases
- [ ] Product image fills card top
- [ ] Product name, price, badge visible
- [ ] "Add to Cart" button visible and clickable

**Tablet (1024px)**
- [ ] 2-column grid (`.grid-3` and `.grid-4` → `repeat(2, 1fr)`)
- [ ] Spacing: 1.25rem gap
- [ ] Card height proportional

**Mobile (768px)**
- [ ] 1-column grid (full-width cards)
- [ ] Card margins: 0 auto or full-width with padding
- [ ] Adequate spacing between cards

**Mobile Small (480px)**
- [ ] 1-column, full-width
- [ ] Padding left/right: ~1rem
- [ ] Card height responsive

**Issues to Check:**
- [ ] Grid layout responsive queries applied?
- [ ] Image aspect ratio consistent (1:1 square)?
- [ ] Price/badge positioning on small screens?
- [ ] Horizontal scroll on narrow screens?

---

### 8. **Cart Page**
**Status:** ⏳ To be verified

**Desktop (1200px+)**
- [ ] Left: Cart items (2/3 width)
- [ ] Right: Order summary (1/3 width), sticky
- [ ] Item rows: image, name, qty, price, remove icon
- [ ] Qty increment/decrement buttons (±)
- [ ] "Proceed to Checkout" button visible
- [ ] Order summary: subtotal, shipping, tax, total
- [ ] Coupon input visible

**Tablet (1024px)**
- [ ] Layout stacks or maintains 2-column
- [ ] Summary may go full-width

**Mobile (768px)**
- [ ] Full-width layout (summary below items)
- [ ] Item cards: image left, details right (horizontal scroll risk)
- [ ] Qty buttons smaller or vertical
- [ ] Summary full-width below items

**Mobile Small (480px)**
- [ ] Horizontal scroll on item row?
- [ ] Consider collapsible item details
- [ ] Qty buttons: icon buttons (±)
- [ ] Remove button: icon only (trash 🗑️)

**Issues to Check:**
- [ ] Empty cart message display?
- [ ] "Continue Shopping" button positioning?
- [ ] Sticky order summary on mobile (conflicts with bottom nav)?

---

### 9. **Checkout Page**
**Status:** ⏳ To be verified

**Desktop (1200px+)**
- [ ] Multi-step form (Step 1: Address, Step 2: Payment)
- [ ] Form fields: Name, Email, Address, City, Pincode, Phone
- [ ] Payment options: UPI, COD, Card (radio buttons)
- [ ] Submit button aligned right
- [ ] Order preview on right (sticky, 1/3 width)

**Tablet (1024px)**
- [ ] Form-only or 2-column collapsible
- [ ] Responsive form width

**Mobile (768px)**
- [ ] Full-width form
- [ ] Order summary below form
- [ ] Single-column layout

**Mobile Small (480px)**
- [ ] Form fields: full-width
- [ ] Input padding, font size readable
- [ ] Submit button: full-width
- [ ] Radio buttons: large touch targets

**Issues to Check:**
- [ ] Form validation messages (below or inline)?
- [ ] Button size on small screens?
- [ ] Keyboard overlay: scroll form up?
- [ ] Success page styling after submit?

---

### 10. **Product Detail Page**
**Status:** ⏳ To be verified

**Desktop (1200px+)**
- [ ] Left: Product image (zoom on hover?)
- [ ] Right: Product info (name, price, ratings, story, health benefits)
- [ ] Specifications table
- [ ] "Add to Cart" button (sticky on scroll?)
- [ ] Related products carousel at bottom

**Tablet (1024px)**
- [ ] Image smaller, details beside or below
- [ ] Table responsive (cards or condensed)

**Mobile (768px)**
- [ ] Image: full-width, top
- [ ] Details: full-width below
- [ ] Table: stacked (left: label, right: value)
- [ ] "Add to Cart": sticky or full-width

**Mobile Small (480px)**
- [ ] Same as tablet
- [ ] Font sizes: readable (16px min for inputs)
- [ ] Button size: 44px min height

**Issues to Check:**
- [ ] Image zoom interaction?
- [ ] Related products: horizontal scroll or carousel?
- [ ] Specs table overflow on small screens?

---

### 11. **Admin Dashboard**
**Status:** ⏳ To be verified

**Desktop (1200px+)**
- [ ] Left: Admin sidebar (products, orders, coupons, customers, analytics, settings)
- [ ] Main: Dashboard cards (sales, new customers, top products)
- [ ] Charts/graphs display correctly

**Tablet (1024px)**
- [ ] Sidebar collapses or goes to hamburger
- [ ] Dashboard single column

**Mobile (768px)**
- [ ] Full-width, no sidebar
- [ ] Dashboard cards single column
- [ ] Charts responsive or scrollable horizontally

**Mobile Small (480px)**
- [ ] All elements responsive
- [ ] Hamburger menu for admin nav

**Issues to Check:**
- [ ] Admin sidebar styling consistent with main sidebar?
- [ ] Charts responsive (ApexCharts or similar)?
- [ ] Table overflow?

---

### 12. **Form Inputs & Validation**
**Status:** ⏳ To be verified

**All Screens**
- [ ] Input class: `.input` applies correct styling
- [ ] Border color: cream-dark (#F0E6CC)
- [ ] Focus state: saffron border (#E8922A), box-shadow glow
- [ ] Placeholder text visible and styled
- [ ] Autofill styling (Chrome yellow background override needed?)

**Desktop (1200px+)**
- [ ] Input width: 100% of container or max-width defined?
- [ ] Label positioning: above input or inline?

**Mobile (768px)**
- [ ] Input width: full-width or constrained?
- [ ] Padding: adequate for touch
- [ ] Font size: 16px+ (prevents zoom on iOS)

**Mobile Small (480px)**
- [ ] Input width: full-width
- [ ] Padding: 0.875rem 1rem
- [ ] Font size: 16px (critical for iOS)
- [ ] Checkbox/radio: larger hit areas

---

### 13. **Buttons**
**Status:** ⏳ To be verified

**All Screens - Standard Classes**
- [ ] `.btn-primary`: maroon gradient, white text, shadow
- [ ] `.btn-secondary`: white bg, maroon border, maroon text
- [ ] `.btn-saffron`: saffron gradient, white text
- [ ] `.btn-ghost`: transparent, saffron border, maroon text

**Hover States**
- [ ] All buttons: `transform: translateY(-2px)` (lift)
- [ ] Shadow increases
- [ ] Color deepens or changes as appropriate

**Desktop (1200px+)**
- [ ] Button sizes: padding 0.875rem 1.75rem
- [ ] Border radius: 50px (pill shape)
- [ ] Font size: 0.95rem

**Mobile (768px)**
- [ ] Button padding: adjusted?
- [ ] Font size: readable

**Mobile Small (480px)**
- [ ] Button padding: 0.875rem 1.25rem
- [ ] Font size: 0.85rem
- [ ] Height: ≥ 44px for touch

---

### 14. **Cards**
**Status:** ⏳ To be verified

**All Screens**
- [ ] Class: `.card` applies white bg, rounded corners (20px), shadow
- [ ] Hover: lift (-4px), shadow increases
- [ ] Transition smooth (0.3s ease)

**Product Cards**
- [ ] Image top, details below
- [ ] Badge (bestseller, spicy, mild) positioned top-right
- [ ] Price and name legible
- [ ] "Add to Cart" button visible

**Order Cards**
- [ ] Order ID, date, total visible
- [ ] Status badge colored (pending, shipped, delivered)
- [ ] "View Details" link or button

---

### 15. **Badges**
**Status:** ⏳ To be verified

**All Classes**
- [ ] `.badge-maroon`: deep-maroon bg, white text
- [ ] `.badge-gold`: gold bg, maroon text
- [ ] `.badge-saffron`: saffron bg, white text
- [ ] Padding: 0.25rem 0.75rem
- [ ] Border radius: 50px
- [ ] Font size: 0.75rem, uppercase

**Usage**
- [ ] Product cards: "Bestseller", "Spicy", "Mild"
- [ ] Order status: "Pending", "Shipped", "Delivered"
- [ ] Admin alerts: "Low Stock", "New Order"

---

### 16. **Typography**
**Status:** ⏳ To be verified

**Font Stack**
- [ ] Headers (h1–h4): Playfair Display (serif), Georgia fallback
- [ ] Body text: Noto Sans Devanagari, Inter, system-ui sans-serif
- [ ] Weights: 400 (headers), 600 (buttons, strong)

**Desktop (1200px+)**
- [ ] h1: large, deep-maroon color
- [ ] h2: medium, deep-maroon
- [ ] p: body font, dark text (#2C1A0E)
- [ ] Line height: 1.6
- [ ] Letter spacing: 0.05em (headers), 0.02em (body)

**Mobile (768px)**
- [ ] h1: `clamp(1.75rem, 4vw, 2.5rem)` (responsive)
- [ ] Font sizes smaller proportionally

**Mobile Small (480px)**
- [ ] h1: minimum 1.75rem
- [ ] Body text: 1rem minimum
- [ ] Contrast: WCAG AA (4.5:1)

---

### 17. **Color System**
**Status:** ⏳ To be verified

**All Screens**
- [ ] Deep Maroon (#7B1818): primary, headers, accents
- [ ] Saffron (#E8922A): accent, hover states, CTAs
- [ ] Gold (#C9A860): secondary accent
- [ ] Cream (#FBF5E6): background
- [ ] Dark text (#2C1A0E): body text contrast

**Contrast Checks**
- [ ] Maroon on cream: ✓ Pass (dark on light)
- [ ] White on maroon: ✓ Pass (light on dark)
- [ ] Saffron on white: ✓ Check (orange on light background)
- [ ] All text meets WCAG AA (4.5:1 for normal, 3:1 for large)

---

### 18. **Animations**
**Status:** ⏳ To be verified

**Scroll Progress Bar**
- [ ] Smooth width transition (0.1s)
- [ ] Gradient smooth

**Floating CTA**
- [ ] Entrance: `slideInUp` animation (0.6s cubic-bezier)
- [ ] Hover: `translateY(-4px)` smooth
- [ ] Exit animation? (when scroll < 500px)

**Cards**
- [ ] Hover: lift + shadow (0.3s ease)
- [ ] Smooth transitions

**Buttons**
- [ ] Hover: lift + shadow changes (0.25s–0.3s)
- [ ] Active states?

**Toast Notifications**
- [ ] Entrance: `slideIn` from right (0.3s ease)
- [ ] Auto-dismiss? (timing)

**Issues to Check:**
- [ ] Performance: animation frame rate consistent?
- [ ] Mobile performance: animations smooth or janky?
- [ ] Prefer-reduced-motion: animations disabled if user preference set?

---

## 🐛 Common Scroll Issues to Test

### Issue #1: Sidebar Margin on Mobile
**Current Code:**
```css
@media (max-width: 768px) {
  .app-main {
    margin-left: 0;  /* Correct */
    margin-bottom: 80px;  /* For bottom nav */
  }
}
```
- [ ] **Test:** On mobile (768px), sidebar is NOT visible
- [ ] [ ] Main content is full-width
- [ ] [ ] No horizontal scroll from sidebar

### Issue #2: Floating CTA Overlap
**Current Code:**
```css
@media (max-width: 480px) {
  .floating-cta {
    bottom: 5.5rem;  /* 88px from bottom */
    right: 0.75rem;
  }
}
```
- [ ] **Test:** Bottom nav is 80px tall, CTA bottom is 88px → **OVERLAP!**
- [ ] [ ] FIX: Change to `bottom: 6.5rem` or higher
- [ ] [ ] CTA is fully visible above bottom nav
- [ ] [ ] No click interception between CTA and nav

### Issue #3: Sticky Order Summary on Mobile
**Potential Issue:** Right sidebar sticky position on mobile checkout
- [ ] **Test:** On mobile, scroll checkout form → summary should scroll with content (not sticky)
- [ ] [ ] Summary is not fixed (no `position: fixed` on mobile)
- [ ] [ ] Summary appears below form on mobile

### Issue #4: Main Content Scroll Container
**Current Code:**
```css
.app-main {
  overflow-y: auto;  /* Enables scroll */
  scroll-behavior: smooth;
}
```
- [ ] **Test:** Scrolling within `.app-main` works smoothly
- [ ] [ ] Body scroll also works (not conflicting)
- [ ] [ ] On iOS, scroll feels responsive (check -webkit-overflow-scrolling)

### Issue #5: Header Fixed Position Conflicts
**Current Code:**
```css
.scroll-progress-bar {
  position: fixed;  /* Sticky bar */
  z-index: 1000;  /* Top layer */
}

.app-main {
  margin-top: 0;  /* No space for header? */
}
```
- [ ] **Test:** Header height is accounted for
- [ ] [ ] Content doesn't get hidden under header
- [ ] [ ] Progress bar visible without obstruction

---

## 📊 Testing Steps

### 1. **Desktop Testing**
```bash
# In Chrome DevTools:
1. Set viewport to 1920×1080
2. Scroll entire page
3. Check progress bar updates (0% → 100%)
4. Verify floating CTA appears > 500px scroll
5. Check all hoverable elements respond
6. Inspect fixed/sticky elements (header, progress bar, order summary)
```

### 2. **Tablet Testing (iPad)**
```bash
1. DevTools: iPad viewport (1024×768)
2. Scroll main content area
3. Verify sidebar is present (220px)
4. Check grid layout (should be 2-column)
5. Floating CTA positioning
6. Bottom nav hidden (not visible on tablet)
```

### 3. **Mobile Testing (768px)**
```bash
1. DevTools: iPhone XR or similar (768×896)
2. Scroll content
3. Sidebar hidden (margin-left: 0)
4. Bottom nav visible (hamburger or icons)
5. Floating CTA visible above bottom nav
6. Grid: 1-column layout
```

### 4. **Mobile Small Testing (480px)**
```bash
1. DevTools: iPhone SE or similar (480×667)
2. All UI elements fully visible
3. No horizontal scroll
4. Floating CTA: icon only, circular
5. Bottom nav: full-width or partial
6. Forms: inputs full-width, readable
7. Images: scaled down but visible
8. Text: readable without pinch-zoom
```

### 5. **Real Device Testing**
```bash
Priority: iPhone 12/13 (768px), iPhone SE (480px), iPad (1024px)
1. Chrome/Safari responsive mode
2. Physical rotation (portrait/landscape)
3. Scroll performance (60fps check)
4. Touch interactions (buttons, form inputs)
5. Overflow behavior
6. Viewport behavior on iOS (address bar)
```

---

## ✅ Sign-Off Checklist

**Before marking as done:**

- [ ] All 18 component sections tested
- [ ] All 4 breakpoints verified
- [ ] No horizontal scroll (except intended carousels)
- [ ] Scroll progress bar works 0–100%
- [ ] Floating CTA appears/hides correctly
- [ ] Mobile bottom nav doesn't overlap content
- [ ] Fixed elements (header, progress) don't block content
- [ ] Animations smooth (60fps on mobile)
- [ ] Forms readable and interactive
- [ ] Images responsive (no distortion)
- [ ] Colors consistent with design system
- [ ] Typography scales correctly
- [ ] Buttons 44px+ touch targets on mobile
- [ ] No console errors
- [ ] Performance: Lighthouse score ≥ 80

---

## 🔗 Related Files

- **Frontend styles:** `frontend/src/styles.scss`
- **App component:** `frontend/src/app/app.component.ts`
- **App config:** `frontend/src/app/app.config.ts`
- **Routes:** `frontend/src/app/app.routes.ts`
- **Header:** `frontend/src/app/layout/header.component.ts`
- **Sidebar:** `frontend/src/app/layout/sidebar.component.ts`

---

## 📋 Issue Logging

**When you find an issue, create a GitHub issue with:**
- Title: `[UI] <Component> - <Issue Description>`
- Labels: `UI`, `bug`, `responsive`, `scroll`, `mobile` (as applicable)
- Breakpoint affected: 480px / 768px / 1024px / desktop
- Browser: Chrome / Safari / Firefox / iOS Safari
- Screenshot/video if possible

---

**Last Updated:** 2026-07-01  
**Next Review:** After implementation of fixes
