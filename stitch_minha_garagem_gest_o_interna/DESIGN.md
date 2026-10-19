---
name: Precision Modern Auto
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#5700c0'
  on-tertiary: '#ffffff'
  tertiary-container: '#712ae2'
  on-tertiary-container: '#dfccff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#eaddff'
  tertiary-fixed-dim: '#d2bbff'
  on-tertiary-fixed: '#25005a'
  on-tertiary-fixed-variant: '#5a00c6'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  currency-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  currency-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a high-precision, trustworthy, and modern operational atmosphere tailored for automotive inventory management and dealership workflows. It projects efficiency, financial clarity, and control, removing visual clutter so users can track assets, margins, and operational stages without friction.

The visual style blends **Corporate Modern** with **Refined Minimalism**:
- Pristine, elevated card surfaces against a tinted cool slate canvas.
- High-clarity tabular and numeric layouts, ensuring currency (BRL R$) and vehicle specs are legible at a glance.
- Distinct semantic status encodings that instantly communicate vehicle states without overwhelming the interface.
- Crisp border structures balanced with delicate ambient shadows for tactile, modular workspaces.

## Colors

The palette is engineered around high semantic legibility, operational state awareness, and executive clarity.

### Functional Palette
- **Canvas / Background**: `#f8fafc` (Slate 50) delivers a cool, glare-free foundation.
- **Surface**: Pure `#ffffff` creates distinct contrast against the canvas.
- **Borders & Dividers**: Subtle borders (`#e2e8f0`) provide separation without visual weight.
- **Primary Action & Brand**: `#1d4ed8` (Blue 700) with hover states at `#1e40af` (Blue 800) and light active tints (`#eff6ff`).
- **Typography Tokens**:
  - Primary text: `#0f172a` (Slate 900)
  - Secondary metadata: `#475569` (Slate 600)
  - Muted / Placeholders: `#94a3b8` (Slate 400)

### Automotive Lifecycle & Status Tokens
- **Available ("À Venda") & Profit**: Emerald `#059669` (text/fill) on subtle tint `#ecfdf5`.
- **In Preparation ("Em Preparação") & Warnings**: Amber `#d97706` on tint `#fffbeb`.
- **Reserved ("Reservado")**: Violet `#7c3aed` on tint `#f5f3ff`.
- **Sold ("Vendido") & Archived**: Slate `#64748b` on tint `#f1f5f9`.
- **Critical Alerts & Danger**: Crimson `#dc2626` on tint `#fef2f2`.

## Typography

The typography uses **Plus Jakarta Sans** across all levels, leveraging its geometric precision, clear aperture openings, and modern corporate cadence.

Rules for financial and metric displays:
- All Brazilian Real (`R$`) values must be rendered using `font-variant-numeric: tabular-nums` to guarantee vertical column alignment across data tables and summary widgets.
- Currency symbols (`R$`) should be rendered with a lighter optical weight or slightly decreased font size compared to the integer digits to emphasize the principal value.
- Headings maintain tight letter spacing (`-0.01em` to `-0.02em`) to retain compactness in dashboard KPI cards.

## Layout & Spacing

The layout is built on a structured **12-column fluid grid** system optimized for desktop back-office dashboards, adapting into flexible single or dual columns on compact screens.

### Viewport Breakpoints & Adaptation
- **Desktop (≥ 1280px)**: 12-column grid, permanent sidebar navigation (260px fixed), canvas margin `margin-desktop` (`2.5rem`), column gutter `gutter` (`1.5rem`).
- **Tablet / Small Desktop (768px – 1279px)**: 8-column layout, collapsible navigation rail (72px) or sheet overlay, canvas margin `margin` (`1.5rem`), column gutter `gutter-sm` (`1rem`).
- **Mobile (< 768px)**: Single column reflow, bottom or top app-bar navigation, canvas margin `margin-mobile` (`1rem`), components stack vertically with `space-md` gaps.

### Spacing Rhythm
- Internal card padding standardizes on `space-lg` (`1.5rem`) for primary inventory details and KPI metric panels.
- Tight components (table cells, tag containers, form control groups) utilize `space-sm` (`0.5rem`) and `space-md` (`1rem`).

## Elevation & Depth

Visual hierarchy uses a hybrid strategy combining **low-contrast outlines** with **ambient diffused shadows**, avoiding visual heaviness in dense inventory views.

### Layering Levels
- **Base Canvas (Level 0)**: `#f8fafc` flat background.
- **Surface Cards & Data Grids (Level 1)**: Pure `#ffffff`, bounded by a single pixel border (`1px solid #e2e8f0`) and an ambient micro-shadow (`box-shadow: 0 1px 2px 0 rgba(15, 23, 42, 0.04)`).
- **Interactive Hover & Dropdowns (Level 2)**: Cards under active hover or context panels apply a subtle lift (`box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`).
- **Modals, Dialogs, & Flyout Drawers (Level 3)**: Overlay surfaces elevated above backdrop dimmers use deep, diffused ambient dispersion (`box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`).

## Shapes

The design system adopts a balanced, refined geometry using scale level `2` (`Rounded`):
- Standard inputs, buttons, and badges use `rounded` (0.5rem / 8px).
- Main content containers, data summary cards, and vehicle detail panels use `rounded-lg` (1rem / 16px) or `rounded-xl` (1.5rem / 24px) to create soft framing around dense information.
- Status chips and avatar thumbnails use pill-shape encapsulation (`rounded-full`) to contrast against rectangular card architecture.

## Components

### Buttons
- **Primary**: Solid `#1d4ed8`, text `#ffffff`, border radius `0.5rem`, height `40px`, padding `0 1rem`. Focus ring: `3px solid rgba(29, 78, 216, 0.2)`. Hover: `#1e40af`.
- **Secondary / Outline**: Background `#ffffff`, border `1px solid #e2e8f0`, text `#0f172a`. Hover: `#f8fafc`.
- **Destructive**: Background `#fef2f2`, border `1px solid #fecaca`, text `#dc2626`. Hover: `#fee2e2`.

### Status Badges & Chips
Pill-shaped badges (`rounded-full`, padding `0.25rem 0.75rem`, typography `label-sm`):
- **À Venda**: Background `#ecfdf5`, text `#059669`, border `1px solid #a7f3d0`. Includes a 6px emerald dot indicator.
- **Em Preparação**: Background `#fffbeb`, text `#d97706`, border `1px solid #fde68a`.
- **Reservado**: Background `#f5f3ff`, text `#7c3aed`, border `1px solid #ddd6fe`.
- **Vendido**: Background `#f1f5f9`, text `#64748b`, border `1px solid #cbd5e1`.

### Data Cards & Vehicle Cards
- Container: Background `#ffffff`, border `1px solid #e2e8f0`, border radius `1rem`, padding `1.25rem`.
- Vehicle Card Structure: Top section holds image with ratio `16:9` (`rounded-lg` corners) and floating absolute status badge; middle holds title (Make/Model) in `headline-sm` with year/km subline; footer displays financial metrics with estimated profit highlighted via emerald text.

### Form Inputs
- Height `40px`, background `#ffffff`, border `1px solid #cbd5e1`, border radius `0.5rem`, text `#0f172a`, font size `14px`.
- Active/Focus: Border `#1d4ed8`, ring `3px solid rgba(29, 78, 216, 0.15)`.
- Money/Currency inputs: Fixed left prefix addon containing `R$` in neutral `#64748b` background tint.

### Data Tables
- Header: Background `#f8fafc`, typography `label-sm` uppercase, text `#64748b`, height `44px`, bottom border `1px solid #e2e8f0`.
- Row: Height `56px`, alternating subtle hover `#f8fafc`, bottom border `1px solid #f1f5f9`.
- Numeric cells: Right-aligned with tabular numbers.