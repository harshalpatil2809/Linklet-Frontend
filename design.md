# Linklet — Product-Wide Design System

**Document type:** Product design specification  
**Product:** Linklet — a modern web-based messaging application  
**Applies to:** Every page, route, shared component, responsive layout, and user state across Linklet  
**Design direction:** Minimal, professional, accessible, calm, and dependable  
**Primary theme:** Dark slate with restrained teal accents  
**Implementation context:** Existing Next.js, React, Tailwind CSS, and current project dependencies

---

## 1. Purpose and Scope

This document defines the shared visual language and interaction standards for the entire Linklet product—not just the login screen. Apply it consistently to authentication, registration, chat, conversations, contacts, user profiles, notifications, settings, search, empty states, dialogs, menus, and future features.

The design system should make Linklet feel like one coherent, production-quality product. Individual pages may have different layouts, but they must share the same colors, typography, spacing logic, component behavior, accessibility standards, and responsive rules.

**Implementation priority:** Preserve existing functionality and integrate the design into the current application. Do not replace real API calls, authentication, WebSocket behavior, routing, token handling, or existing business rules with mock behavior merely to match the design.

## 2. Product Design Principles

1. **Minimal by default.** Show only the controls and information relevant to the current task.
2. **Professional, not decorative.** Prefer clear hierarchy, careful spacing, and precise alignment over visual effects.
3. **Communication first.** Conversations, messages, people, and message composition are the central product experience.
4. **Consistent across routes.** Shared UI must use the same tokens and reusable components.
5. **Accessible to everyone.** Text, controls, focus states, and navigation must work with keyboard, touch, screen readers, zoom, and text scaling.
6. **Responsive at every size.** Support small phones, large phones, tablets, laptops, desktops, wide monitors, and short-height viewports.
7. **Fast and predictable.** Avoid unnecessary animation, layout shifts, heavy decoration, and interaction surprises.
8. **State-aware.** Loading, empty, success, offline, permission, validation, and error states are part of the design—not afterthoughts.
9. **Respect existing behavior.** Visual refactors must not break API contracts, authorization, chat membership rules, notifications, or real-time updates.
10. **Maintainable.** Use shared components and design tokens instead of duplicating one-off styles on each page.

## 3. Visual Direction

### 3.1 Overall look

Use a refined dark interface built from charcoal and slate surfaces, soft-white primary text, muted secondary text, subtle borders, and controlled teal accents.

The product should feel calm and focused, with a clear distinction between the main workspace, secondary navigation, message history, and contextual controls. Use flat surfaces and subtle separators rather than stacked cards, strong shadows, gradients, glowing borders, or glassmorphism.

### 3.2 Avoid

- Purple or violet as a primary brand color.
- Decorative gradients, neon glow, glassmorphism, and excessive blur.
- Large illustrations or marketing blocks inside functional product screens.
- Excessive rounded cards nested inside other rounded cards.
- Heavy drop shadows, thick borders, and unnecessary dividers.
- Oversized headings in dense workspace views.
- Emoji used as substitutes for consistent interface icons.
- Tiny low-contrast labels or icon-only controls without accessible names.
- Layouts that depend on hover alone.
- Fake live conversations, fake unread counts, or invented user data.
- Arbitrary one-off colors and inconsistent corner radii.

## 4. Design Tokens

Use these values as the default product palette. Define them centrally through the project's existing Tailwind configuration, CSS variables, or token file. Do not hard-code different versions of the same token throughout the codebase.

### 4.1 Color palette

| Token | Hex | Intended use |
|---|---|---|
| `--color-bg` | `#101719` | Main application background |
| `--color-surface` | `#151F21` | Sidebar, navigation, and primary panels |
| `--color-surface-raised` | `#1B282A` | Menus, popovers, selected surfaces, and elevated panels |
| `--color-input` | `#182123` | Input and textarea backgrounds |
| `--color-message-incoming` | `#2B3B3D` | Incoming message bubbles |
| `--color-brand` | `#237D73` | Primary buttons and essential brand emphasis |
| `--color-brand-hover` | `#2B9185` | Hover and active brand actions |
| `--color-brand-soft` | `#1B3936` | Subtle selected or highlighted brand surfaces |
| `--color-brand-text` | `#82C8BB` | Teal links and non-critical brand accents |
| `--color-text` | `#E8EEEE` | Primary text and headings |
| `--color-text-secondary` | `#B0BDBF` | Supporting text and secondary labels |
| `--color-text-muted` | `#879597` | Timestamps, hints, and low-priority metadata |
| `--color-border` | `#354345` | Inputs, panels, and component borders |
| `--color-divider` | `#2C383A` | Quiet separators |
| `--color-success` | `#55B88A` | Success status and confirmations |
| `--color-warning` | `#E5B567` | Cautions and recoverable warnings |
| `--color-danger` | `#E47777` | Errors, destructive actions, and invalid fields |
| `--color-info` | `#78B9D0` | Informational status where needed |

Use semantic tokens rather than selecting colors by appearance alone. Keep status colors limited to status meaning. Do not use teal for every icon or every line of text.

**Contrast requirement:** Verify final foreground/background combinations against WCAG 2.2 AA where applicable: at least 4.5:1 for normal text and 3:1 for large text and meaningful UI boundaries/icons. If a listed pairing does not meet the target in a specific context, adjust the pairing while retaining the overall palette.


### 4.6 Centralized color variables in `global.css` — mandatory

**Every color used anywhere in Linklet must be defined as a reusable CSS custom property in the global stylesheet `global.css`.** This applies to all routes, components, states, overlays, icons, borders, backgrounds, text, message bubbles, charts (if present), and responsive variants.

- Use the existing global stylesheet location in the project. If the project file is named `globals.css` rather than `global.css`, extend that existing file instead of creating a competing stylesheet.
- Define the complete semantic color palette in one central `:root` block (or the project's established theme scope), using descriptive names such as `--color-bg`, `--color-surface`, `--color-brand`, `--color-text`, `--color-border`, `--color-danger`, and `--color-success`.
- Reference those variables everywhere through CSS `var(...)` or Tailwind utilities mapped to the same variables. For example: `background-color: var(--color-bg);`, `color: var(--color-text);`, and `border-color: var(--color-border);`.
- Do **not** scatter raw HEX, RGB, HSL, or named color values through component styles, inline styles, CSS modules, or page-specific styles. A literal color is allowed only when defining or updating the canonical tokens themselves in the global stylesheet.
- Include variables for hover, active, focus, disabled, selected, unread, success, warning, error, and informational states wherever those colors are required.
- If light mode or another theme is added later, define theme-specific values by overriding the same semantic variables in the appropriate theme scope. Components should not need to be rewritten to switch themes.
- When a new color is required, first decide whether an existing token can be reused. If not, add a clearly named token to `global.css`, then use that token everywhere it is needed.
- Keep the global stylesheet as the single source of truth; do not duplicate the palette in a second theme file or in Tailwind configuration with conflicting values. Tailwind may reference the global CSS variables, but must not create a separate competing palette.
- Audit the entire application for hard-coded colors during implementation and replace them with the matching tokens. Do not change a color's meaning by reusing a status token for unrelated decoration.

Example:

```css
/* global.css — canonical source of truth */
:root {
  --color-bg: #101719;
  --color-surface: #151f21;
  --color-surface-raised: #1b282a;
  --color-input: #182123;
  --color-brand: #237d73;
  --color-brand-hover: #2b9185;
  --color-text: #e8eeee;
  --color-text-secondary: #b0bdbf;
  --color-border: #354345;
  --color-success: #55b88a;
  --color-warning: #e5b567;
  --color-danger: #e47777;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
}
```

Example component usage:

```css
.primary-button {
  background: var(--color-brand);
  color: var(--color-text);
  border: 1px solid var(--color-brand);
}

.primary-button:hover {
  background: var(--color-brand-hover);
}
```

**Acceptance criterion:** A product-wide color adjustment should be possible by changing the relevant variable in `global.css` without hunting through individual page or component files.

### 4.2 Typography

- Use the existing project font if it is already consistently configured; otherwise use a modern system sans-serif stack.
- Prefer readable, neutral typography over stylized display fonts.
- Use a restrained weight scale: regular (400), medium (500), semibold (600), and bold (700) only where needed.
- Avoid excessive letter spacing and all-caps labels.

| Role | Desktop guidance | Mobile guidance |
|---|---:|---:|
| Page title | 24–30px | 22–26px |
| Section title | 18–20px | 17–19px |
| Body text | 14–16px | 14–16px |
| Form label | 14px | 14px |
| Helper text / metadata | 12–13px | 12–13px |
| Button label | 14–15px, medium/semibold | 14–16px, medium/semibold |
| Brand name | 18–20px, semibold | 18–20px, semibold |

Use comfortable line-height: generally 1.4–1.6 for paragraphs and 1.2–1.35 for headings. Allow text to wrap naturally; never clip important content to preserve a visual layout.

### 4.3 Spacing scale

Use a consistent 4px-based spacing scale:

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64px`

- 4–8px: icon-to-label gaps and compact metadata.
- 12–16px: controls, list rows, and form fields.
- 20–24px: sections and mobile page padding.
- 32–48px: major page sections.
- 64px: spacious desktop separation only where useful.

Avoid arbitrary margins that make similar components feel unrelated. Use responsive spacing utilities when the layout changes by breakpoint.

### 4.4 Shape, borders, and elevation

- Small controls: 6–8px radius.
- Standard inputs and buttons: 8–10px radius.
- Panels and dialogs: 10–14px radius.
- Avatars: circular unless an existing product convention requires otherwise.
- Use 1px borders with `--color-border` or `--color-divider`.
- Prefer separation by spacing and surface color over shadows.
- Use shadows sparingly for overlays that must visibly sit above the page, such as dialogs or menus.
- Avoid pill-shaped controls for every component; reserve full pills for status badges or intentionally compact filters.

### 4.5 Icons

- Use the icon library already installed in the project.
- Keep icon style, stroke weight, and sizing consistent.
- Typical sizes: 16px for compact controls, 18–20px for standard actions, and 22–24px for major navigation.
- Icon-only controls must have an accessible name and a visible tooltip where appropriate.
- Do not mix multiple icon packs without a clear existing reason.

## 5. Global Application Structure

Use a shared application shell for authenticated routes. The shell may adapt by viewport, but it should retain a recognizable Linklet identity.

### 5.1 Desktop workspace

For larger screens, use a structured workspace with:

- **Primary navigation:** concise access to main product areas.
- **Context/list panel:** conversations, contacts, search results, or settings navigation as appropriate.
- **Main content area:** the active conversation or selected page.
- **Optional contextual panel:** only when useful and when enough space is available.

The exact number of columns may vary by route. Avoid forcing every page into a chat-specific three-column layout.

### 5.2 Global navigation

- Keep the Linklet logo and product name consistent.
- Use clear active, hover, focus, and disabled states.
- Use labels alongside icons where space allows; on compact layouts, icon-only navigation is acceptable only with accessible names and tooltips.
- Keep navigation hierarchy shallow and predictable.
- Do not add navigation destinations that do not exist.
- Respect the current routing and authorization model.

### 5.3 Page containers

- Use fluid widths and sensible maximum widths for reading-oriented forms and settings pages.
- Workspace pages should fill available space without causing horizontal overflow.
- Use consistent page titles, optional descriptions, and action placement.
- Avoid excessive empty space in dense chat interfaces and avoid cramming content on smaller screens.

## 6. Responsive Design Requirements

Responsive design is mandatory for every route and reusable component. Build mobile-first where practical, then enhance the layout as available space increases. Breakpoints below are guidance, not a reason to ignore the actual content width.

| Range | Design behavior |
|---|---|
| 320–374px | Small phones: single-column layouts, compact spacing, no secondary side panels |
| 375–480px | Phones: full-width content with comfortable page padding |
| 481–767px | Large phones/small tablets: flexible single-column layouts; panels become drawers when needed |
| 768–1023px | Tablets: compact navigation and adaptable two-panel layouts where practical |
| 1024–1279px | Small laptops: standard workspace with carefully constrained panels |
| 1280–1599px | Desktop: full workspace layout where supported |
| 1600px and above | Wide displays: constrain reading content and avoid stretching text or controls across the entire screen |

### 6.1 Rules for every device

- No horizontal page overflow at any supported width.
- No clipped labels, overlapping controls, or content hidden behind fixed elements.
- Avoid fixed widths that exceed the viewport.
- Use `min-width: 0` on flex/grid children that contain long text.
- Allow long usernames, emails, messages, and conversation titles to wrap or truncate intentionally with a way to access the full value.
- Use `100dvh` or an equivalent safe viewport strategy for full-height layouts, with fallbacks as appropriate.
- Respect safe areas on devices with notches or rounded screen edges.
- Account for virtual keyboards on mobile; users must be able to reach the active input and submit controls.
- Do not rely on hover for essential actions; support touch and keyboard interaction.
- Use touch targets around 44×44px where practical, especially for primary mobile actions.
- Ensure browser zoom and text scaling do not break layouts.
- Short-height windows must scroll naturally; never hide essential actions to force a fixed height.
- Test both portrait and landscape orientation.

### 6.2 Responsive chat behavior

- On desktop, show the conversation list and active conversation together when space allows.
- On small screens, show either the conversation list or the active conversation as the primary view, with a clear back action between them.
- Convert secondary panels into drawers, sheets, or dedicated routes on small screens.
- Keep the message composer visible and usable without covering the last message or keyboard focus.
- Messages must wrap correctly; long URLs or unbroken strings must not widen the viewport.
- Message actions may appear on focus, hover, or through a contextual menu, but must remain available on touch devices.
- Do not shrink message text to fit more content on screen.

## 7. Shared Component Standards

Build or reuse shared components rather than creating page-specific variations without need.

### 7.1 Buttons

Variants:
- **Primary:** teal background, high-contrast text, one main action per local context.
- **Secondary:** surface background with a subtle border.
- **Tertiary / ghost:** minimal background for low-emphasis actions.
- **Destructive:** danger styling for irreversible or harmful actions.

Requirements:
- Minimum height approximately 44px for touch-friendly controls; 48px for prominent authentication actions.
- Clear hover, focus-visible, pressed, loading, and disabled states.
- Prevent duplicate submissions while an action is in progress.
- Use concise, action-oriented labels.
- Do not use color alone to indicate disabled, success, or error status.

### 7.2 Inputs and forms

- Every input must have a persistent visible label; placeholders are supplementary, not labels.
- Use consistent input height, padding, radius, and border.
- Focus state must be clearly visible and keyboard accessible.
- Error messages should explain what needs to be corrected.
- Keep validation text near the relevant control and avoid disruptive layout shifts.
- Use appropriate `autocomplete`, input types, and semantic form behavior.
- Preserve current authentication, API, and validation logic.
- Password visibility toggles must have accessible labels and keyboard support.

### 7.3 Cards and panels

- Use panels for meaningful grouping, not as decoration around every element.
- Keep panel padding and borders consistent.
- Avoid nested cards when a heading and spacing would communicate the hierarchy.
- On mobile, panels should become fluid and should not force horizontal scrolling.

### 7.4 Lists and rows

- Use consistent row heights, alignment, avatar sizes, and metadata hierarchy.
- Provide clear selected, hover, focus, unread, and disabled states.
- Make the intended click target clear and avoid nested clickable controls that conflict.
- Use separators only when they improve scanning.

### 7.5 Avatars

- Use a consistent set of avatar sizes.
- Show a reliable fallback when no image exists.
- Do not invent profile images or presence information.
- Online/presence indicators must reflect real data and include accessible text where meaningful.

### 7.6 Dialogs, drawers, popovers, and menus

- Use overlays only for tasks that benefit from focused interaction.
- Include a clear title, understandable actions, and a dismiss path.
- Keep dialogs within the viewport and make content scrollable when necessary.
- Support Escape to close where appropriate, keyboard focus management, and return focus to the triggering control.
- On mobile, use a full-width sheet or dedicated screen when a desktop-sized dialog would be cramped.
- Destructive actions should be clearly labeled and should not be triggered by accidental clicks.

### 7.7 Toasts and inline feedback

- Use concise, actionable messages.
- Do not use toasts as the only place for critical or persistent errors.
- Avoid stacking too many notifications.
- Keep status messages accessible to assistive technology.
- Use the existing toast system if one is already implemented.

## 8. Page-Level Guidance

The following sections define the expected visual behavior for common product areas. They do not authorize inventing routes or features that are not present in the application.

### 8.1 Login and registration

- Use a focused, uncluttered form layout.
- On wide desktop screens, an optional brand panel may be used if it improves the experience; on small screens, use a single column.
- Keep the form at a readable maximum width of roughly 400–440px.
- Use clear field labels, appropriate autocomplete, visible validation, and loading feedback.
- Preserve existing Google OAuth or other authentication options and their redirects.
- Registration and login links must lead to the existing routes.
- If an existing valid session redirects users, preserve that behavior.

### 8.2 Chat and conversation view

- Prioritize conversation identity, message history, and the composer.
- Use a restrained message-bubble distinction: incoming messages use the defined incoming surface; outgoing messages use the brand color only if contrast remains accessible.
- Keep timestamps, delivery/read indicators, and message metadata visually secondary.
- Group consecutive messages where appropriate without obscuring authorship or timing.
- Keep the composer easy to locate, with clear attachment/send actions only if supported.
- Show empty, loading, reconnecting, failed-to-send, and offline states when relevant to actual application behavior.
- Maintain real-time message updates and current WebSocket integration.
- Do not fabricate read receipts, presence, typing indicators, or delivery states.
- Ensure keyboard focus remains predictable when messages arrive.

### 8.3 Conversation list and search

- Use clear conversation titles, avatars, last-message previews, timestamps, and unread indicators only when real data is available.
- Make selected conversation state obvious without using a harsh highlight.
- Keep search easy to find and usable with keyboard and touch.
- Provide clear no-results and empty states.
- Truncate long previews deliberately while keeping important identity information visible.

### 8.4 Contacts, profiles, and follow relationships

- Present identity information with a clear hierarchy and sensible whitespace.
- Distinguish primary actions from secondary actions.
- Show relationship states accurately and use explicit labels for follow, follow-back, pending, or unavailable actions where those states exist in the product.
- Preserve existing rules that determine who can initiate or access a chat.
- Do not reveal private profile information beyond what the current API and permissions allow.

### 8.5 Notifications

- Keep notification items scannable, with a clear event description and time.
- Distinguish unread items subtly and consistently.
- Provide loading, empty, error, and retry states as appropriate.
- Ensure notification badges and counts reflect actual data.
- Preserve the existing real-time notification implementation.

### 8.6 Settings and account pages

- Group settings by task and label sections clearly.
- Use a readable content width and consistent form controls.
- Separate dangerous account actions from routine preferences.
- Provide save/cancel feedback and prevent accidental loss of unsaved changes where applicable.
- Do not create settings controls for behavior that is not implemented.

### 8.7 Search, empty states, and error pages

- Empty states should explain what is missing and provide one relevant next action when possible.
- Error pages should explain the problem in plain language and offer retry or navigation when useful.
- Avoid large illustrations and marketing copy.
- Never expose stack traces, internal secrets, access tokens, or sensitive server details to end users.

## 9. Interaction and Motion

- Use brief, subtle transitions for color, opacity, and small positional changes.
- Typical duration: 120–200ms for micro-interactions; longer transitions only when the interaction genuinely needs them.
- Avoid spring-heavy motion, looping decorative animation, and large page transitions.
- Respect `prefers-reduced-motion`.
- Ensure animation never delays essential actions or makes content hard to follow.
- Every interactive element must have default, hover (where applicable), focus-visible, active/pressed, disabled, and loading states as relevant.
- Keep interaction behavior consistent across pages.

## 10. Accessibility Standards

Target WCAG 2.2 AA.

- Use semantic landmarks and headings in a logical hierarchy.
- Associate form labels with their controls.
- Provide meaningful accessible names for icon-only buttons.
- Maintain visible keyboard focus; never remove outlines without a suitable replacement.
- Support full keyboard navigation for menus, dialogs, tabs, and forms.
- Maintain required contrast for text and controls.
- Do not rely on color alone to communicate status or errors.
- Announce asynchronous updates and relevant validation errors accessibly.
- Use appropriate alt text for informative images and empty alt text for decorative images.
- Respect reduced motion, browser zoom, and user text-size preferences.
- Ensure interactive targets are comfortably sized for touch.
- Verify focus order and ensure overlays do not trap users incorrectly.

## 11. Content and Microcopy

- Use concise, plain, professional language.
- Prefer direct action labels such as `Send`, `Save changes`, `Try again`, and `Create account`.
- Keep terminology consistent across the product.
- Use sentence case for labels and headings.
- Explain errors in a way that helps the user recover.
- Avoid unnecessary exclamation marks, vague status labels, and technical server messages.
- Never display placeholder content as if it were real user data.

## 12. Technical and Implementation Constraints

- Use the existing Next.js, React, Tailwind CSS, and installed libraries unless there is a demonstrated need to change them.
- Define shared colors, spacing, typography, radii, and focus styles centrally.
- Prefer reusable components and variants over duplicated styles.
- Keep layout and styling responsive by design; avoid brittle absolute positioning for core page structure.
- Preserve current routes, API endpoints, Axios configuration, authentication, token storage, permissions, and redirect behavior.
- Preserve existing Django Channels/WebSocket behavior for chat and notifications.
- Do not replace backend data with hard-coded mock data.
- Do not add dependencies without a clear technical justification.
- Avoid unrelated refactors while implementing design changes.
- Do not expose secrets or production environment values in client-side code.
- Keep visual changes separate from business logic where practical.
- Handle loading and failure states without leaving controls stuck or unusable.

## 13. Quality Assurance and Acceptance Criteria

Review the complete application, not only one page.

### Responsive test widths

At minimum, inspect:
- 320px
- 360px
- 375px
- 390px
- 430px
- 480px
- 768px
- 820px
- 1024px
- 1280px
- 1440px
- 1920px

Also test a short-height viewport, landscape orientation, browser zoom, and an open mobile keyboard.

### Acceptance checklist

- [ ] Every route follows the shared Linklet visual system.
- [ ] Color, typography, spacing, radii, and icons are consistent.
- [ ] The interface is minimal, professional, and easy to scan.
- [ ] No horizontal overflow or clipped essential content at tested sizes.
- [ ] Navigation and controls work with mouse, touch, and keyboard.
- [ ] Focus indicators are visible and accessible.
- [ ] Text and controls meet contrast requirements.
- [ ] Loading, empty, success, offline, validation, and error states are handled where applicable.
- [ ] The chat composer and conversation navigation remain usable on mobile.
- [ ] Authentication, API requests, permissions, notifications, and WebSockets still work.
- [ ] No fake data or unsupported features have been introduced.
- [ ] Reduced-motion preferences are respected.
- [ ] No unnecessary gradients, glow, glassmorphism, heavy shadows, or decorative clutter remain.
- [ ] Existing tests and build checks pass, or any unrelated failures are documented.

## 14. Final Design Standard

Linklet should look like a carefully crafted, production-ready messaging product: quiet, cohesive, accessible, responsive, and focused on communication. The design must feel consistent across all pages and devices while keeping the interface simple enough that users can understand where they are and what to do next.

**Treat this document as the source of truth for Linklet's shared visual and interaction design.** When a page-specific requirement conflicts with the global system, preserve accessibility and functional correctness first, then extend the design system deliberately rather than introducing an inconsistent one-off style.
