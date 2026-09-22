Use the existing TapServe mobile UI screens as the main design reference.

Do NOT redesign the entire app from scratch.

Maintain the current TapServe branding, layout style, spacing, typography, rounded corners, card style, and clean mobile-first interface.

Keep the existing teal/green TapServe visual identity.

IMPORTANT:
This prompt is mainly for fixing the current UI and prototype behavior.

--------------------------------------------------
1. SPLASH / LOADING SCREEN FIX
--------------------------------------------------

Update the Splash / Loading Screen.

Currently, the splash screen shows a person icon in the center.

This is incorrect.

Replace the person icon with the provided TapServe HOUSE / HOME logo.

Requirements:

- Use the provided TapServe house logo
- Do NOT use a person icon
- Do NOT redesign the provided logo
- Keep the logo centered
- Keep the existing dark teal background
- Keep the “TapServe” title
- Keep the subtitle:
  “AI-Driven Household Services Matching with Live Location Tracking”
- Keep the location pill at the bottom

The loading screen should clearly represent TapServe as a household service application.

--------------------------------------------------
2. LOGIN PAGE — APPLY AS SERVICE PROVIDER FLOW
--------------------------------------------------

On the Login / Landing Page, keep the existing card:

“Want to earn as a specialist?”
“Register as Service Provider”

IMPORTANT:

This card must be CLICKABLE.

When the user taps:

“Register as Service Provider”

it must DIRECTLY navigate to the:

“Apply as a Service Provider”

page.

Do NOT leave the card as decoration only.

Do NOT make it open an unrelated modal.

Create the actual prototype connection.

Required flow:

Login / Landing Page
→ Register as Service Provider
→ Apply as a Service Provider Intro
→ Start Application
→ Personal Information
→ Service Information
→ Documents & Verification
→ Service Provider Terms and Conditions
→ Review Application
→ Submit Application
→ Application Submitted / Application Status

The Back to Login button must return to the Login Page.

--------------------------------------------------
3. AI ASSISTANT BUTTON FIX
--------------------------------------------------

Do NOT create a separate AI Assistant section.

Do NOT create a large AI Assistant card on the Home screen.

Remove the current large:

“Hi! I’m Tappy, your TapServe Assistant”

section from the Home page.

The cartoon mascot should ONLY be used inside the existing floating:

“AI Assistant”

button.

Button layout:

[small cartoon mascot] AI Assistant

Requirements:

- Keep the existing floating pill-style button
- Put the small cartoon mascot on the LEFT side
- Keep the text “AI Assistant”
- Mascot should be small and readable
- Use the teal/white TapServe cartoon mascot
- Do not add another AI card
- Do not add another AI section
- Do not duplicate the mascot around the Home screen

The floating button should remain accessible while browsing the app.

--------------------------------------------------
4. SERVICE CATEGORIES — DYNAMIC / NOT STATIC
--------------------------------------------------

Update the existing Service Categories section.

IMPORTANT:

The Service Categories must NOT be designed as a static or hardcoded list.

Design this section as a DYNAMIC / DATA-DRIVEN category component.

The application should be able to display categories based on the categories currently available in the TapServe system.

For example, if an Admin later adds:

“Roof Repair”

the User Side should automatically be able to display:

Roof Repair

without redesigning the Home screen.

If a category is removed or disabled, it should no longer appear to users.

Therefore:

SERVICE CATEGORIES MUST BE DYNAMIC, NOT STATIC.

--------------------------------------------------
5. HOME PAGE SERVICE CATEGORY PREVIEW
--------------------------------------------------

On the Home screen, keep the horizontal Service Categories section.

It may initially show a limited number of categories such as:

- Cleaning
- Plumbing
- Electrical
- Gardening

However, these are only example data.

Do NOT treat these four categories as the only permanent categories.

The Home screen should dynamically show available categories.

If there are more categories than can fit on the screen:

- Allow horizontal scrolling

OR

- Show only a preview and provide the existing “See All” button

Keep:

Service Categories                     See All

--------------------------------------------------
6. “SEE ALL” SERVICE CATEGORIES FIX
--------------------------------------------------

The current behavior of “See All” is incorrect.

Currently:

See All
→ Service Providers

This must be changed.

Correct flow:

Home
→ See All
→ All Service Categories
→ Select Category
→ Service Providers for that category

“See All” must display ALL AVAILABLE SERVICE CATEGORIES.

It must NOT immediately display Service Providers.

--------------------------------------------------
7. ALL SERVICE CATEGORIES SCREEN
--------------------------------------------------

Create:

“All Service Categories”

Include:

- Back arrow
- Page title
- Search field:
  “Search service categories...”
- Dynamic category grid

Use a clean grid such as:

2 categories per row

or

3 categories per row depending on screen size.

Each category card should contain:

- Service icon
- Category name
- Optional View Providers action

Example category data:

- Cleaning
- Plumbing
- Electrical
- Gardening
- Appliance Repair
- Carpentry
- Home Maintenance
- Aircon Cleaning
- Painting
- Pest Control
- Moving Assistance
- Other Services

IMPORTANT:

These examples are NOT a fixed list.

The screen must be designed to handle:

- New categories
- Removed categories
- Disabled categories
- More categories than currently shown
- Fewer categories than currently shown

The grid should automatically adapt based on the number of categories available.

--------------------------------------------------
8. CATEGORY COLORS — USE ONE CONSISTENT STYLE
--------------------------------------------------

The current All Service Categories design uses many different colors.

For example:

- Orange
- Green
- Purple
- Blue
- Pink

Do NOT use a different color for every category.

Use one consistent TapServe visual system.

Use:

- TapServe teal
- Dark teal
- White
- Light gray
- Subtle teal backgrounds

All:

“View Providers”

buttons or labels should use the SAME TapServe teal style.

Do NOT make each View Providers label a different color.

Category icons may be different icons, but their containers and styling should remain consistent.

The entire category page should look unified.

--------------------------------------------------
9. CATEGORY INTERACTION
--------------------------------------------------

Every category must be clickable.

Example:

Cleaning
→ Cleaning Service Providers

Plumbing
→ Plumbing Service Providers

Electrical
→ Electrical Service Providers

Gardening
→ Gardening Service Providers

Appliance Repair
→ Appliance Repair Service Providers

The same behavior should work automatically for future categories.

When a category is selected:

Show only Service Providers that belong to that category.

Do NOT show unrelated Service Providers.

--------------------------------------------------
10. DYNAMIC CATEGORY STATES
--------------------------------------------------

Design the Service Categories feature with the following states:

LOADING

Show skeleton/loading category cards while categories are being loaded.

EMPTY

If there are currently no service categories:

“No Service Categories Available”

“Please check again later.”

SEARCH EMPTY STATE

If the user searches for a category that does not exist:

“No categories found.”

CATEGORY WITHOUT PROVIDERS

If the selected category exists but no providers are currently available:

“No Providers Available”

“There are currently no available Service Providers for this category.”

Button:

“Browse Other Categories”

--------------------------------------------------
11. SERVICE CATEGORY PROTOTYPE FLOW
--------------------------------------------------

Create actual clickable prototype connections:

Home
→ See All
→ All Service Categories

Home
→ Cleaning
→ Cleaning Service Providers

Home
→ Plumbing
→ Plumbing Service Providers

Home
→ Electrical
→ Electrical Service Providers

Home
→ Gardening
→ Gardening Service Providers

All Service Categories
→ Select any category
→ Matching Service Providers

The design should demonstrate how the same interaction works for dynamically added categories.

--------------------------------------------------
12. LANDING PAGE TERMS AND CONDITIONS
--------------------------------------------------

Keep the Terms and Conditions section on the Login / Landing Page.

Display:

“By continuing, you agree to TapServe’s Terms and Conditions and Privacy Policy.”

Make these clickable:

- Terms and Conditions
- Privacy Policy

When tapped:

Terms and Conditions
→ Terms and Conditions page

Privacy Policy
→ Privacy Policy page

Also keep:

“View Service Provider Terms”

near the:

“Want to earn as a specialist?”

card.

When tapped:

View Service Provider Terms
→ Service Provider Terms and Conditions

--------------------------------------------------
13. PROFILE SECTION — REMOVE ADMIN DASHBOARD
--------------------------------------------------

Update the existing User Profile menu.

Remove:

“Admin Dashboard”

The normal User Profile should NOT contain Admin Dashboard.

Keep user-related options such as:

- My Bookings
- Favorite Providers
- Saved Addresses
- Payment Methods
- Notifications
- Privacy & Security
- Help & Support
- Log Out

IMPORTANT:

Do NOT add an Appeal section in this new prompt.

Do NOT add Account Status / Appeal screens as part of this revision.

--------------------------------------------------
14. LOGO USAGE
--------------------------------------------------

We will provide the official TapServe logo asset.

Use the provided logo.

Do NOT:

- redesign it
- recreate it
- generate another logo
- change its symbol

Landing / Login Page:

Place the provided TapServe logo on the TOP-LEFT side.

Splash Screen:

Use the provided HOUSE / HOME logo instead of the current person icon.

Keep the logo proportional and do not stretch it.

--------------------------------------------------
15. KEEP THE EXISTING UI STYLE
--------------------------------------------------

Do NOT redesign the application.

Keep:

- Existing teal branding
- Existing typography
- Existing card design
- Existing rounded corners
- Existing spacing
- Existing navigation
- Existing mobile screen dimensions
- Existing buttons and form styles

Only fix the problems described in this prompt.

--------------------------------------------------
16. FINAL IMPORTANT CORRECTIONS
--------------------------------------------------

Make sure all of these are fixed:

1. Splash screen:
Use the HOUSE logo, not the person icon.

2. Service Provider Application:
The Register as Service Provider card on the Login page must actually navigate to the application flow.

3. AI Assistant:
Put the cartoon mascot inside the floating AI Assistant button.

4. AI Assistant:
Do NOT create a separate AI Assistant Home section.

5. Service Categories:
They must be DYNAMIC / DATA-DRIVEN and NOT STATIC.

6. See All:
See All must show the complete list of categories first.

7. Category selection:
Only after selecting a category should Service Providers appear.

8. Category styling:
Use one consistent TapServe teal style.
Do NOT use different colorful View Providers labels.

9. Profile:
Remove Admin Dashboard.
