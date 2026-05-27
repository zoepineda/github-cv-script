# GitHub Contributions Summary

*Generated: 2026-05-23*

**Total Merged PRs: 310**

## Achievement Overview

| Type | Count |
|------|-------|
| Other | 176 |
| Feature | 95 |
| Fix | 20 |
| Refactor | 18 |
| Improve | 1 |

## Category Breakdown

| Category | PRs |
|----------|-----|
| Fullstack | 162 |
| Frontend | 117 |
| Backend | 25 |
| Other | 6 |

## Frontend (117 PRs)

### GoRocky/goforms

- **[Refactor/update goslim form assets](https://github.com/GoRocky/goforms/pull/265)** (2026-05-08, +46/-30)
  - Before vs After <img width="1229" height="772" alt="image" src="https://github.com/user-attachments/assets/e45cdb5d-6e79-4820-9320-6ff61c9627bc" /> <img width="1229" height="772" alt="image" src="https://github.com/user-attachments/assets/e286847d-4973-4f82-a887-6860a54912c2" />

- **[feat: update first name placeholder to 'Jane' for GoSlim v2 branding](https://github.com/GoRocky/goforms/pull/261)** (2026-04-27, +1/-1)
  - <img width="1469" height="808" alt="image" src="https://github.com/user-attachments/assets/48fab752-7737-4f2c-823a-450e09852a6d" /> <img width="1469" height="808" alt="image" src="https://github.com/user-attachments/assets/a8693bea-edfa-46c8-beb6-1af959522bb9" /> <!-- codesmith:footer -->

- **[feat: add GoSlim v2 branding support with CloudFront CDN integration and dynamic asset loading based on form slug](https://github.com/GoRocky/goforms/pull/260)** (2026-04-27, +52/-9)
  - If the form is goslim-assessment-v2, the custom form components for weight loss change from GoRocky branding to GoSlim branding: <img width="1469" height="808" alt="image" src="https://github.com/user-attachments/assets/1fe39911-f1f9-40cb-a4fd-36177e6846a6" /> <img width="1469" height="808" alt="ima

- **[Feat/wl oral SKU](https://github.com/GoRocky/goforms/pull/258)** (2026-04-17, +516/-61)
  - Introduces two new oral weight loss products — **Orlistat** and **Oral Compounded Semaglutide** — as fully supported SKUs within the GoSlim/GoRocky personalized plan flow. Both products are available via WL bypass links and are surfaced as cross-sell options on injectable product pages. --- - **Orli

- **[Update WL Oral SKU assets and copies](https://github.com/GoRocky/goforms/pull/259)** (2026-04-17, +7/-5)

- **[refactor: apply code formatting and update delivery text to 'Free discreet delivery nationwide'](https://github.com/GoRocky/goforms/pull/257)** (2026-04-17, +31/-24)

- **[feat: add price override for oral semaglutide and hide orlistat variant details](https://github.com/GoRocky/goforms/pull/256)** (2026-04-17, +18/-10)
  - …nt details, exclude oral products from alternatives list

- **[Feature/dev brand color page](https://github.com/GoRocky/goforms/pull/251)** (2026-04-06, +738/-299)
  - - Developed a brand color palette page that showcases branding colors dynamically from the globals.css file - Clicking on the color copies the hex code OR variable name to your clipboard <img width="1194" height="694" alt="image" src="https://github.com/user-attachments/assets/4d99268b-9b8a-4099-a33

- **[Feature/dev brand color page](https://github.com/GoRocky/goforms/pull/250)** (2026-04-06, +247/-2)
  - - Developed a brand color palette page that showcases branding colors dynamically from the globals.css file - Clicking on the color copies the hex code OR variable name to your clipboard <img width="1194" height="694" alt="image" src="https://github.com/user-attachments/assets/4d99268b-9b8a-4099-a33

- **[Refactor/trial pack remove ineligible back button](https://github.com/GoRocky/goforms/pull/249)** (2026-04-06, +4/-34)
  - For non-Metro Manila patients: <img width="1166" height="689" alt="image" src="https://github.com/user-attachments/assets/3ae149a7-a81b-491c-97c2-f737b267fd00" /> For patients who have taken tirzepatide before:

  *... and 52 more PRs*

### GoRocky/core

- **[Fix: Addressed HL Category UI feedback ](https://github.com/GoRocky/core/pull/798)** (2026-05-19, +675/-179)
  - 1. Fixed Doctor Consultation modal being fixed to ED in the HL catalog <img width="1290" height="2796" alt="image" src="https://github.com/user-attachments/assets/157cb359-06d5-4877-a8fc-486b4f852c58" /> <img width="731" height="766" alt="image" src="https://github.com/user-attachments/assets/3dfb47

- **[Feature/home page tweaks](https://github.com/GoRocky/core/pull/767)** (2026-05-15, +481/-830)
  - New `/web` **404 page** ported from `/webflow`. **Sign-in flow** action buttons migrated to the design system's gradient primary + bordered secondary `Button` from `@gorocky/goforms-ds`. Header drawer's **"Create an account"** button uses the secondary DS button. **`NewsletterSection`** and **`HeroS

- **[Refactor/ed order xp v2 assets](https://github.com/GoRocky/core/pull/707)** (2026-05-11, +288/-164)
  - **Order pages get their own minimal nav.** `/order/gorocky` and `/order/gorocky/[slug]` now render a centered, logo-only, non-sticky `OrderHeader` instead of the full site nav — fewer distractions during purchase intent. Every other surface still ships the regular `Header`. <img width="1417" height=

- **[Feature/duplicate treatments pages webapp](https://github.com/GoRocky/core/pull/691)** (2026-05-06, +2695/-391)
  - Copies the GoSlim (`/treatments/goslim`) and GoFuller (`/treatments/gofuller`) marketing pages from `apps/webflow` into `apps/web` so the patient-facing app serves these pages directly — no more redirecting users to `gorocky.ph`. **8 GoSlim components**: hero, UVP bar, packages, care team, process s

- **[Feature/subscriptions audit](https://github.com/GoRocky/core/pull/674)** (2026-05-06, +5084/-2361)
  - A grab-bag of fixes and polish across the subscription, forms, scheduling, and design-system surfaces. 27 commits ahead of `main`. Changes are grouped below by area, each with the URL where the work is visible and a placeholder for a screenshot. > Web app runs on `localhost:3001`. Admin app on `loca

- **[refactor: remove unused Blob component and fix apostrophe in 404 page](https://github.com/GoRocky/core/pull/648)** (2026-04-29, +1/-77)
  - - Remove dead Blob helper component from ProductDetailsClient (web + webflow) and NewGorockyOrderPage - Replace straight apostrophe with HTML entity (&apos;) in webflow 404 page heading <!-- codesmith:footer -->

- **[Feature/design system](https://github.com/GoRocky/core/pull/640)** (2026-04-29, +15801/-1122)
  - The primary goal of merging this is to land the **shared design system infrastructure** so other features can build on it. The new ED catalog/detail designs that come along for the ride are **intentionally inaccessible in production** — they're gated behind `NEXT_PUBLIC_ENABLE_NEW_ED_DESIGN`, and th

- **[Fix/address clarity recordings struggles](https://github.com/GoRocky/core/pull/643)** (2026-04-28, +210/-100)
  - This PR ships a custom **404 page** for the GoRocky marketing site (`apps/webflow`), refactors the homepage treatment cards into a shared component, fixes mobile-nav UX in the webflow header, and cleans up two stray link issues in the patient web app and webflow redirects. The scope expanded beyond 

- **[Feature/meta page alignment](https://github.com/GoRocky/core/pull/638)** (2026-04-28, +94/-168)
  - Brings the three `/meta/treatments/*` landing pages (GoRocky, GoSlim, GoFuller) into structural parity with their canonical `/treatments/*` counterparts by replacing duplicated `meta-*` components with the shared treatment components and the reusable `ProcessSection`.

- **[Fix/webflow UI fixes](https://github.com/GoRocky/core/pull/595)** (2026-04-28, +158/-129)
  - Tightens a few pieces of the `apps/webflow` migration: 1. **Mobile-swipeable carousels** — Doctors (homepage) and GoFuller Reviews now support native touch swipe with reliable dot-pagination sync. Auto-play pauses while the user is swiping and resumes after. 2. **GoSlim landing polish** — hero and t

  *... and 34 more PRs*

### GoRocky/goslim

- **[Fix/UI updates](https://github.com/GoRocky/goslim/pull/120)** (2026-04-29, +31/-17)
  - - Updated pricing and asset used for goslim package (1250 pesos -> 875 per week, removed background for image) Before: <img width="571" height="689" alt="image" src="https://github.com/user-attachments/assets/d8d39de7-2d57-466f-a747-0813ab0336d6" />

- **[feat: update cta href](https://github.com/GoRocky/goslim/pull/115)** (2026-02-24, +125/-31)

- **[refactor: adjust hero section responsive layout breakpoint](https://github.com/GoRocky/goslim/pull/114)** (2026-02-11, +1/-1)
  - - Changed grid column breakpoint from lg to md for earlier two-column layout transition - Keeps existing gap and spacing configurations intact - Improves responsive design for medium-sized screens (768px and up)

- **[Feature/chinese new year landing page](https://github.com/GoRocky/goslim/pull/113)** (2026-02-11, +1322/-101)
  - <img width="2150" height="1264" alt="image" src="https://github.com/user-attachments/assets/eb266cd2-829e-4c91-9c28-23f5dc3b7151" /> <img width="2370" height="781" alt="image" src="https://github.com/user-attachments/assets/bf5d7151-ec3c-49cb-a93a-d3adf166b730" /> <img width="2370" height="447" alt=

- **[Feature/chinese new year landing page](https://github.com/GoRocky/goslim/pull/112)** (2026-02-11, +1190/-17830)
  - <img width="2150" height="1264" alt="image" src="https://github.com/user-attachments/assets/eb266cd2-829e-4c91-9c28-23f5dc3b7151" /> <img width="2370" height="781" alt="image" src="https://github.com/user-attachments/assets/bf5d7151-ec3c-49cb-a93a-d3adf166b730" /> <img width="2370" height="447" alt=

- **[refactor: simplify blog post metadata generation](https://github.com/GoRocky/goslim/pull/111)** (2026-01-21, +2/-2)
  - - Removed fallback to seo.metaTitle in favor of using post.title directly for page and OpenGraph titles - Maintained consistent title format "{post.title} | GoSlim Blog" across all blog posts - Kept existing SEO fallbacks for description and keywords fields

- **[[MAIN] feat: enhance blog post SEO with social media metadata](https://github.com/GoRocky/goslim/pull/110)** (2026-01-21, +40/-10)
  - - Added OpenGraph image metadata using blog post's featured image for better social sharing - Implemented Twitter card metadata with large image format for improved Twitter previews - Fixed featured image URL handling to support both absolute and relative paths

### GoRocky/erp-ui

- **[feat: add external form links and improve form card display](https://github.com/GoRocky/erp-ui/pull/462)** (2025-11-10, +197/-66)
  - - Added external links to GoSlim and GoRocky forms with appropriate URLs - Created FormLink interface and buildFormLinks utility to generate form-specific links - Added slug display to form cards and list items for better identification

- **[feat: add option to include inactive partners in partner list](https://github.com/GoRocky/erp-ui/pull/461)** (2025-11-10, +12/-5)
  - - Added activeOnly parameter to usePartners hook to control filtering of inactive partners - Modified PartnerList to show all partners by passing false to usePartners - Updated query key to include activeOnly parameter for proper cache management

### GoRocky/aperture

- **[Refactor/quality of life improvements](https://github.com/GoRocky/aperture/pull/2)** (2026-04-30, +1580/-416)
  - A handful of UX upgrades that make folder organization and asset management feel native. The headline change is end-to-end nested folder support — backend already had `parent_id` on `folders`, but the UI didn't expose it. This PR finishes the feature and bundles in a few small wins (keyboard shortcu

### GoRocky/gorocky-erp

- **[fix: resolve mismatched doctor assignments for orders](https://github.com/GoRocky/gorocky-erp/pull/247)** (2026-03-07, +327/-0)
  - - Created script to identify and fix orders where assigned doctors' risk levels don't match order risk levels - Added logic to only process orders with status 'raw_order' or 'in_preparation' - Implemented doctor reassignment based on correct risk level and category matching

## Backend (25 PRs)

### GoRocky/core

- **[Feature/wm treatments hero](https://github.com/GoRocky/core/pull/826)** (2026-05-22, +2562/-486)
  - <img width="1181" height="807" alt="image" src="https://github.com/user-attachments/assets/6d070648-0f53-4803-89b0-a66cb3bd9df4" /> <!-- codesmith:footer --> ---

- **[Feature/hl catalog](https://github.com/GoRocky/core/pull/820)** (2026-05-21, +315/-133)
  - - reroute Take Assessment to gofuller-assessment instead of hl-full-intake - fix checkout CTA in sticky footer to go to actual checkout - bring back cart in header

- **[fix: back button for custom components not working in ed form](https://github.com/GoRocky/core/pull/766)** (2026-05-15, +56/-4)
  - On `gorocky-ed-assessment-v2`, the **Back button was dead on the section right after `consent`** (and on any section whose previous visible section was `consent`). Users on `ed_duration` couldn't return to the consent screen. `FormNavigationProvider.goToPreviousSection` ([apps/web/src/components/for

- **[Fix/blog cms feedback](https://github.com/GoRocky/core/pull/759)** (2026-05-14, +556/-98)
  - **Branch:** `fix/blog-cms-feedback` Addresses the latest round of marketing feedback on the Blog CMS, adds an Introduction CTA feature, and ships an autosave for the editor. Spans the

- **[Feature/admin goform filters](https://github.com/GoRocky/core/pull/599)** (2026-05-11, +0/-0)
  - This PR overhauls the admin **Form Submissions** page (filters, table header controls, template ranking) and fixes a silent 400 bug that was hiding hundreds of real submissions from the dropdown filter. It also adds a small CRM quality-of-life improvement (customer name → user detail link).

- **[feat(migrations): update ED product prices per April 2026 price sheet](https://github.com/GoRocky/core/pull/587)** (2026-04-14, +107/-0)
  - - Add migration 283 to refresh SRP on all ED product variants (Sildenafil, Tadalafil, Viagra, Cialis, bundles) - Update prices across 4/8/12/24 pill counts for generic and branded variants - Match variants by ERP SKU format from migration 156

- **[Feature/reordering flow](https://github.com/GoRocky/core/pull/527)** (2026-04-07, +405/-102)

- **[feat(db): seed recommended_products table with ED treatment preference mappings](https://github.com/GoRocky/core/pull/517)** (2026-04-06, +78/-0)
  - - Add migration 268 to populate recommended_products with preference-to-variant mappings (on_demand/no_preference → Sildenafil 50mg, daily → Tadalafil). Includes debug logging for active ED products and rollback script. <img width="2940" height="1912" alt="image" src="https://github.com/user-attachm

- **[Reordering flow for final testing](https://github.com/GoRocky/core/pull/510)** (2026-04-06, +24277/-809)

- **[refactor: replace incremental display_order updates with explicit ass…](https://github.com/GoRocky/core/pull/486)** (2026-03-27, +60/-20)
  - …ignments in migration 253 - Remove multi-step approach (shift sections 4-11 down, then move contact_details) - Set explicit display_order for all 10 sections (landing=1 through contact_details=10)

  *... and 13 more PRs*

### GoRocky/gorocky-erp

- **[refactor: fix payment scheduling](https://github.com/GoRocky/gorocky-erp/pull/258)** (2026-03-10, +963/-760)
  - - Fixed recurring payment anchor date calculation to use first installment date instead of second installment - Moved non-essential dependencies (@honeybadger-io/js, adm-zip, csv-stringify) from dependencies to devDependencies - Removed unused dependencies to reduce package size and improve maintain

- **[fix: hard-filter doctor assignment by risk level](https://github.com/GoRocky/gorocky-erp/pull/248)** (2026-03-07, +1075/-27)
  - **Hard-filter by risk level**: Doctor assignment now excludes doctors whose `risk_levels` don't match the order's risk level. Previously, risk level was only a soft priority boost with a fallback to any category-matched doctor. **Auto re-assignment on risk change**: New `POST /api/orders/reassign-do

## Fullstack (162 PRs)

### GoRocky/core

- **[Feature/wm treatments hero](https://github.com/GoRocky/core/pull/832)** (2026-05-22, +93/-107)
  - - standardized FeaturedOn component across pages that use it (treatments, home, etc.) <!-- codesmith:footer --> ---

- **[Feature/hl catalog](https://github.com/GoRocky/core/pull/818)** (2026-05-21, +139/-68)
  - - Redirect to /products/hl after HL form submission - Separate one-time and subscription option cards <!-- codesmith:footer -->

- **[Reapply "Addressed HL Catalog Feedback"](https://github.com/GoRocky/core/pull/817)** (2026-05-21, +8031/-2148)
  - - Reapply hl catalog changes to staging <!-- codesmith:footer --> ---

- **[Revert "Addressed HL Catalog Feedback"](https://github.com/GoRocky/core/pull/809)** (2026-05-20, +2148/-8031)
  - Reverts GoRocky/core#808 <!-- codesmith:footer --> ---

- **[Address HL Catalog feedback](https://github.com/GoRocky/core/pull/810)** (2026-05-20, +155/-79)
  - <!-- codesmith:footer --> --- <a href="https://app.blacksmith.sh/GoRocky/codesmith/core/pr/810"><picture><source media="(prefers-color-scheme: dark)" srcset="https://pr-comments-assets.blacksmith.sh/codesmith/view-in-codesmith-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://p

- **[Addressed HL Catalog Feedback](https://github.com/GoRocky/core/pull/808)** (2026-05-20, +8031/-2148)
  - <!-- codesmith:footer --> --- <a href="https://app.blacksmith.sh/GoRocky/codesmith/core/pr/808"><picture><source media="(prefers-color-scheme: dark)" srcset="https://pr-comments-assets.blacksmith.sh/codesmith/view-in-codesmith-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://p

- **[feature: update care manager confirmation page copy and broken links](https://github.com/GoRocky/core/pull/807)** (2026-05-20, +6/-10)
  - ![Uploading image.png…]() <!-- codesmith:footer --> ---

- **[Feature/hl catalog](https://github.com/GoRocky/core/pull/789)** (2026-05-18, +3312/-934)
  - - hooked up the new HL catalog to the checkout logic in /web - added a migration file that adds the new HL SKUs to the products list <!-- codesmith:footer -->

- **[feat: remove periods from header sentences in webflow home page + fix broken wl v2 form references](https://github.com/GoRocky/core/pull/788)** (2026-05-18, +13/-11)
  - <!-- codesmith:footer --> --- <a href="https://app.blacksmith.sh/GoRocky/codesmith/core/pr/788"><picture><source media="(prefers-color-scheme: dark)" srcset="https://pr-comments-assets.blacksmith.sh/codesmith/view-in-codesmith-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://p

- **[fix: build error](https://github.com/GoRocky/core/pull/787)** (2026-05-18, +0/-18)
  - <!-- codesmith:footer --> --- <a href="https://app.blacksmith.sh/GoRocky/codesmith/core/pr/787"><picture><source media="(prefers-color-scheme: dark)" srcset="https://pr-comments-assets.blacksmith.sh/codesmith/view-in-codesmith-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://p

  *... and 131 more PRs*

### GoRocky/goforms

- **[Chore/trial pack tweaks](https://github.com/GoRocky/goforms/pull/236)** (2026-03-31, +127/-9)
  - Minor refinements to the WL Trial Pack assessment flow — copy updates, branding fixes, and removing an unnecessary form section.

- **[Trial Pack UI Tweaks](https://github.com/GoRocky/goforms/pull/235)** (2026-03-31, +127/-9)
  - Minor refinements to the WL Trial Pack assessment flow — copy updates, branding fixes, and removing an unnecessary form section.

- **[Feature/ed subscriptions](https://github.com/GoRocky/goforms/pull/223)** (2026-03-26, +685/-151)

- **[[ED Subs] Remove GoRockyEDSummaryPage from ed assessments](https://github.com/GoRocky/goforms/pull/220)** (2026-03-26, +46/-5)

- **[Fix/hl dob spinner picker](https://github.com/GoRocky/goforms/pull/191)** (2026-03-23, +816/-12)
  - - Fixed doctor consult link for HL to lead to HL consult SKU instead of WL - Changed age input in HL form to take in birthday instead - Implemented date input spinner component from core

- **[Feat/hl add on checkout](https://github.com/GoRocky/goforms/pull/176)** (2026-03-11, +5012/-118)
  - **New subscription + add-on hybrid payment flow** — Created a new API endpoint (`/api/payments/subscription/create`) that handles subscriptions with one-time add-on products (e.g., Finoxidil Spray), with separate first vs. recurring payment amounts **Payment infrastructure refactoring** — Consolidat

- **[Feature/ph phone normalization](https://github.com/GoRocky/goforms/pull/172)** (2026-03-09, +1457/-753)
  - Introduces a single normalizer (`normalizePhMobileToE164`) that converts all Philippine mobile number variants (`09XX`, `9XX`, `639XX`, `+639XX`) to canonical E.164 format (`+639XXXXXXXXX`) across the entire stack — client inputs, API routes, checkout flows, and database. - New `normalizePhMobileToE

- **[Fix/goforms hl subscriptions v1 feedback](https://github.com/GoRocky/goforms/pull/169)** (2026-03-06, +10/-4)
  - - Updated finasteride 12-month pricing - Added phone number input validation and formatting for xendit checkout form

- **[Revert "Fix/goforms hl subscriptions v1 feedback"](https://github.com/GoRocky/goforms/pull/167)** (2026-03-06, +293/-4692)
  - Reverts GoRocky/goforms#166

- **[Fix/goforms hl subscriptions v1 feedback](https://github.com/GoRocky/goforms/pull/166)** (2026-03-06, +4692/-293)
  - - Fixed recommendation logic to follow: “Which statement sounds most like you?” A. I want the strongest, most aggressive regrowth plan available.

  *... and 4 more PRs*

### GoRocky/erp-ui

- **[fix: hard-filter doctor assignment and trigger re-assignment on risk change](https://github.com/GoRocky/erp-ui/pull/584)** (2026-03-07, +106/-27)
  - **Hard-filter in `findOptimalDoctor`**: Doctors without `assignment_rules` or whose `risk_levels` don't include the order's risk level are now excluded entirely. Previously, risk level was a -10 priority boost that could still allow mismatched assignments. **Trigger re-assignment on risk level chang

- **[feat: enhance doctor assignment logic and risk level handling](https://github.com/GoRocky/erp-ui/pull/583)** (2026-03-07, +20357/-1240)
  - - Refactored doctor eligibility filtering to enforce strict category and risk level rules - Simplified priority scoring by removing conditional adjustments - Added automatic doctor reassignment when patient risk level changes

### GoRocky/gorockyhr

- **[Feature/employee dashboard](https://github.com/GoRocky/gorockyhr/pull/3)** (2026-01-09, +2336/-1613)
  - - Changed string instances of "feedback" to "hr concerns" across the employee view

- **[Feature/employee management enhances](https://github.com/GoRocky/gorockyhr/pull/2)** (2026-01-09, +14332/-4223)
  - - Changed employee default view from cards view to table view - Separated department name from employee name and made it it's own column

### GoRocky/gorocky-erp

- **[feat: add doctor reassignment on customer risk level change](https://github.com/GoRocky/gorocky-erp/pull/246)** (2026-03-07, +748/-27)
  - - Added new endpoint /reassign-doctors-on-risk-change to handle doctor reassignment when customer risk level changes - Removed fallback logic for doctor assignment - risk level is now a strict filter requirement - Added clearOrderItemDoctor helper function to safely remove doctor assignments

### GoRocky/goslim

- **[feat: add permanent redirect from /lp/cny to homepage](https://github.com/GoRocky/goslim/pull/116)** (2026-02-24, +7/-1)
  - - Added permanent 301 redirect rule in next.config.mjs to route /lp/cny traffic to homepage - Maintains SEO value by using permanent redirect flag - Preserves PostHog API request compatibility with trailing slash support

### zoepineda/skills-getting-started-with-github-copilot

- **[Add registration validation and more activities](https://github.com/zoepineda/skills-getting-started-with-github-copilot/pull/2)** (2025-06-20, +98/-1)

## Other (6 PRs)

### GoRocky/goforms

- **[fix: update 8mg semaglutide variant checkout URL to use product-speci…](https://github.com/GoRocky/goforms/pull/211)** (2026-03-25, +1/-1)
  - Changed checkout URL from generic "semaglutide" to "semaglutide-8" to properly identify the 8mg variant in checkout flow.

- **[feat: update product recommendations for male hair loss treatment](https://github.com/GoRocky/goforms/pull/168)** (2026-03-06, +14/-14)
  - - Changed default male treatment recommendation from Finoxidil Capsule to Finasteride - Modified recommendation logic for "simple" preference from Oral Minoxidil to Finasteride - Updated recommendation for "recommend" preference from Finoxidil Capsule to Finasteride

- **[feat: update package tags for GoSlim products](https://github.com/GoRocky/goforms/pull/134)** (2026-02-11, +2/-2)
  - - Changed packageTag from "Generic Mounjaro®" to "Compounded" for 75mg product - Changed packageTag from "Generic Ozempic®" to "Compounded" for 8mg product - Updated labels to ensure consistent product branding across installment options

- **[refactor: update tirze and sema one-time payment links to shopify one…](https://github.com/GoRocky/goforms/pull/124)** (2026-02-09, +18/-12)
  - …s instead of xendit

- **[refactor: update product pricings](https://github.com/GoRocky/goforms/pull/123)** (2026-02-09, +13/-13)

- **[refactor: reorder weight loss product definitions](https://github.com/GoRocky/goforms/pull/111)** (2026-02-05, +52/-51)
  - - Reordered product definitions in goslim-installment-products.ts to group similar products together - Now follows the order: 1. Mounjaro

---

## CV-Ready Highlights

*Copy these bullet points to your CV:*

- **Frontend Development**: Contributed 117 merged PRs (+404,646 lines) across 6 repositories
- **Backend Development**: Contributed 25 merged PRs (+32,426 lines) across 2 repositories
- **Fullstack Development**: Contributed 162 merged PRs (+181,998 lines) across 7 repositories