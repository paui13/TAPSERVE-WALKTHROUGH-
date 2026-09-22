# PROFILE SECTION — CREATE SCREENS FOR ALL MENU BUTTONS

Update the existing **TapServe Profile section**.

Keep the current Profile menu design exactly consistent with the existing UI:

- White rounded rectangular menu cards
- Small icon on the left
- Menu title
- Chevron arrow on the right
- Light gray background
- TapServe teal branding
- Mobile-first spacing

IMPORTANT:

Every menu item must be **clickable/tappable** and must navigate to an actual designed screen.

Do NOT leave any Profile menu button without a destination screen.

Each destination screen should include:

- Back arrow
- Page title
- Consistent TapServe header
- Mobile-friendly cards/forms
- Proper empty states
- Appropriate actions

---

# 1. MY BOOKINGS

When the user taps:

**My Bookings**

Navigate to:

# My Bookings

Create tabs:

- Upcoming
- In Progress
- Completed
- Cancelled

Each booking card should show:

- Service Provider photo
- Provider name
- Service category
- Booking date
- Booking time
- Location
- Booking status
- Booking ID

Example:

**Kuya Reynaldo**  
Plumbing Service

September 25, 2026  
10:00 AM  
San Pablo City

Status: **Upcoming**

Actions depending on status:

### Upcoming

- View Details
- Message Provider
- Reschedule
- Cancel Booking

### In Progress

- Track Provider
- Message Provider
- View Booking

### Completed

- View Details
- Rate & Review
- Book Again

### Cancelled

- View Details
- Book Again

Clicking a booking should open a **Booking Details** screen.

---

# 2. FAVORITE PROVIDERS

When the user taps:

**Favorite Providers**

Navigate to:

# Favorite Providers

Display providers that the user has saved.

Each provider card should contain:

- Provider photo
- Provider name
- Service specialty
- Rating
- Number of reviews
- Distance/location
- Availability
- Price/rate if supported
- Filled heart icon showing that the provider is favorited

Actions:

- View Profile
- Book Now
- Remove from Favorites

Create an empty state:

**No Favorite Providers Yet**

Message:

**“Providers you favorite will appear here.”**

Button:

**Find Providers**

---

# 3. SAVED ADDRESSES

When the user taps:

**Saved Addresses**

Navigate to:

# Saved Addresses

Show saved addresses as cards.

Examples:

### Home

123 Sample Street  
San Pablo City, Laguna

### Work

ABC Building  
San Pablo City, Laguna

Each address card should have:

- Address label
- Complete address
- Default address indicator
- Edit button
- Delete option

Add:

**+ Add New Address**

When tapped, open:

# Add Address

Fields:

- Address Label
- House / Unit Number
- Street
- Barangay
- City / Municipality
- Province
- Postal Code
- Additional Landmark

Optional:

- Pin location on map

Add checkbox:

**Set as default address**

Buttons:

- Cancel
- Save Address

---

# 4. PAYMENT METHODS

When the user taps:

**Payment Methods**

Navigate to:

# Payment Methods

Show the user's saved payment options only if payment functionality is supported by TapServe.

Possible cards:

- Cash
- GCash
- Maya
- Debit / Credit Card

If TapServe currently supports **cash only**, show:

### Cash Payment

**“Payment is made directly to the Service Provider after the service is completed.”**

Do NOT invent online payment functionality if TapServe does not currently support it.

Create appropriate:

- Default payment state
- Add payment state if supported
- Empty state

---

# 5. NOTIFICATIONS

When the user taps:

**Notifications**

Navigate to:

# Notification Settings

Create toggle settings for:

### Booking Notifications

- Booking confirmation
- Provider accepted booking
- Provider on the way
- Service started
- Service completed
- Booking cancellation

### Messages

- New messages
- AI Assistant responses

### Service Provider

- Provider availability updates
- Application status updates

### Account & Security

- Login alerts
- Account warnings
- Suspension notices
- Appeal updates

### Promotions

- Offers and service recommendations

Use ON/OFF toggle switches.

Add:

**Enable All Notifications**

---

# 6. PRIVACY & SECURITY

When the user taps:

**Privacy & Security**

Navigate to:

# Privacy & Security

Create menu items:

### Account Security

- Change Password
- Two-Factor Authentication if supported
- Login Activity

### Privacy

- Profile Visibility
- Location Permissions
- Data & Privacy
- Manage Permissions

### Account

- Download Account Data if supported
- Deactivate Account
- Delete Account

Create confirmation dialogs for sensitive actions.

Example:

**Delete Account?**

“Deleting your account will permanently remove your TapServe account and associated information according to TapServe's data retention policy.”

Buttons:

- Cancel
- Continue

Do not immediately delete the account when the menu option is tapped.

---

# 7. ACCOUNT STATUS & APPEALS

Add a new Profile menu item:

**Account Status**

Recommended placement:

Privacy & Security  
↓  
**Account Status**  
↓  
Help & Support

Use an appropriate shield/status icon.

When tapped, navigate to:

# Account Status

For normal accounts display:

✓ **Account in Good Standing**

Show:

- Current account status
- Number of warnings
- Active restrictions
- Pending appeals

If there is a violation, show a card containing:

- Violation Type
- Date
- Offense Number
- Penalty
- Status

Actions:

**View Violation**

**Submit Appeal**

If the user has already appealed:

**View Appeal Status**

This screen must connect to the existing **Appeal Submission and Evidence Upload flow**.

Prototype:

Profile  
→ Account Status  
→ Violation Details  
→ Submit Appeal  
→ Upload Evidence  
→ Submit  
→ Appeal Status

---

# 8. HELP & SUPPORT

When the user taps:

**Help & Support**

Navigate to:

# Help & Support

Use the existing TapServe AI mascot/avatar in this screen where appropriate.

Include:

### AI Assistant

Small card:

[TapServe Mascot]

**Ask TapServe AI Assistant**

“Get quick help with bookings, providers, appeals, and account questions.”

Button:

**Ask AI Assistant**

This button may open the existing AI chat.

Also include:

### Frequently Asked Questions

Categories:

- Booking
- Service Providers
- Cancellations
- Account
- Appeals
- Payments
- Safety
- Service Provider Application

### Contact Support

Options:

- Send Support Request
- Report a Problem

Create:

# Submit Support Request

Fields:

- Concern Category
- Subject
- Description
- Upload Screenshot / Evidence

Button:

**Submit Request**

---

# 9. ADMIN DASHBOARD

The existing:

**Admin Dashboard**

menu option should only appear if the logged-in account has an **Admin role**.

Do NOT display Admin Dashboard to normal User or Service Provider accounts.

When an Admin taps:

**Admin Dashboard**

navigate to the existing TapServe Admin Dashboard.

If the mobile app provides only a shortcut to the web-based admin system, design a confirmation/intermediate screen:

# Open Admin Dashboard

Message:

**“Continue to the TapServe Admin Dashboard to manage users, providers, bookings, appeals, and system activity.”**

Button:

**Continue to Admin Dashboard**

Secondary:

**Cancel**

Keep administrative access role-based.

---

# 10. LOG OUT

When the user taps:

**Log Out**

Do NOT immediately log them out.

Show a confirmation bottom sheet or modal:

# Log Out?

**“Are you sure you want to log out of your TapServe account?”**

Buttons:

**Cancel**

**Log Out**

When Log Out is confirmed:

→ Navigate back to the **TapServe Login / Landing Page**

---

# PROFILE PROTOTYPE CONNECTIONS

Create actual clickable Figma prototype connections:

**My Bookings**  
→ My Bookings screen

**Favorite Providers**  
→ Favorite Providers screen

**Saved Addresses**  
→ Saved Addresses screen

**Payment Methods**  
→ Payment Methods screen

**Notifications**  
→ Notification Settings

**Privacy & Security**  
→ Privacy & Security screen

**Account Status**  
→ Account Status / Violations / Appeals

**Help & Support**  
→ Help & Support screen

**Admin Dashboard**  
→ Admin Dashboard, only for Admin accounts

**Log Out**  
→ Log Out confirmation  
→ Login / Landing Page after confirmation

Every destination screen must have a functional **Back arrow** that returns to the Profile page.

---

# IMPORTANT UI RULE

Do NOT redesign the existing Profile menu.

Extend it by designing what happens **after the user taps each option**.

All destination screens should visually match the existing TapServe application:

- Same teal colors
- Same fonts
- Same border radius
- Same icon style
- Same card style
- Same spacing
- Same mobile dimensions
- Same navigation behavior

Create proper:

- Loading states
- Empty states
- Success states
- Error states
- Confirmation modals
- Disabled states
- Back navigation

The entire Profile section should work as a complete clickable prototype rather than a static menu.

---

# SERVICE CATEGORIES — FIX “SEE ALL” BEHAVIOR

Update the existing **Service Categories** section on the TapServe User Home screen.

Keep the current Service Categories visual design and existing category cards.

Current visible categories may include:

- Cleaning
- Plumbing
- Electrical
- Gardening

## IMPORTANT — FIX “SEE ALL”

The current **See All** behavior is incorrect.

When the user taps **See All**, it must NOT immediately show Service Providers.

Instead, it must navigate to a dedicated:

# All Service Categories

screen.

The **All Service Categories** screen must display the complete list of TapServe service categories.

Example categories:

- Cleaning
- Plumbing
- Electrical
- Gardening
- Appliance Repair
- Carpentry
- Home Maintenance
- Aircon Cleaning / Repair
- Painting
- Pest Control
- Moving Assistance
- Other Services

Use a mobile-friendly category grid.

Recommended layout:

- 2 or 3 category cards per row
- Category icon
- Category name
- Rounded card/container
- TapServe teal accent
- Clean spacing consistent with the existing app

Add a search field at the top:

**Search service categories...**

## CORRECT USER FLOW

The correct navigation must be:

**Home**
→ tap **See All**
→ **All Service Categories**
→ user selects a category
→ show Service Providers that belong to that selected category

Example:

**See All**
→ All Service Categories
→ Plumbing
→ Plumbing Service Providers

Service Providers should only appear after the user selects a specific category.

Therefore:

**See All = Show all service categories**

NOT:

**See All = Show all service providers**

## INDIVIDUAL CATEGORY INTERACTION

The category cards already visible on the Home screen must also be clickable.

Examples:

**Cleaning**
→ Cleaning Service Providers

**Plumbing**
→ Plumbing Service Providers

**Electrical**
→ Electrical Service Providers

**Gardening**
→ Gardening Service Providers

Each selected category must correctly filter the provider results.

## EMPTY CATEGORY STATE

If a category currently has no available Service Providers, do NOT show unrelated providers.

Show:

**No Providers Available**

Message:

**“There are currently no available Service Providers for this category. Please check again later or explore another service.”**

Button:

**Browse Other Categories**

## REQUIRED FIGMA PROTOTYPE CONNECTIONS

Create actual clickable prototype interactions:

**See All**
→ All Service Categories

**Cleaning**
→ Cleaning Service Providers

**Plumbing**
→ Plumbing Service Providers

**Electrical**
→ Electrical Service Providers

**Gardening**
→ Gardening Service Providers

**Any category inside All Service Categories**
→ Service Provider list filtered by that selected category

Every destination screen must have a functional **Back arrow**.

---

# EXISTING TAPSERVE LOGO — USE THE LOGO ASSET WE PROVIDE

We will provide the official **TapServe logo asset** together with this prompt.

IMPORTANT:

- Use the logo file/image that we provide.
- Do NOT redesign the logo.
- Do NOT generate a new logo.
- Do NOT modify the logo symbol.
- Do NOT replace it with another icon.
- Preserve the supplied logo’s original appearance, proportions, and branding.
- Only resize it proportionally when needed for the UI.

## LANDING / LOGIN PAGE LOGO PLACEMENT

Place the provided TapServe logo on the **top-left side of the Landing / Login page**.

It should appear above or near:

**Welcome to TapServe**

Recommended hierarchy:

**[Provided TapServe Logo] TapServe**

**Welcome to TapServe**

Keep the logo:

- Clearly visible
- Properly aligned to the left
- Consistent with the page margins
- Mobile-friendly
- Large enough to recognize
- Not oversized
- Proportionally scaled without stretching or distortion

Maintain clean spacing between the logo and the **Welcome to TapServe** heading.

## OTHER MAIN SCREENS

Use the same provided logo on the **top-left side of major top-level screens where branding is appropriate**, such as:

- Landing / Login
- Sign Up
- Home
- Service Provider Application Intro

Do NOT place the full logo unnecessarily on every subpage.

For subpages such as:

- My Bookings
- Favorite Providers
- Saved Addresses
- Privacy & Security
- Account Status
- Appeal Details
- Notification Settings

use the existing mobile subpage header:

**[Back Arrow] Page Title**

## LOGO ASSET PRIORITY

If a placeholder or old temporary logo currently exists in the design, replace that placeholder with the **official logo asset we provide**.

The provided logo asset is the source of truth.

Do not recreate it manually.

Do not change its colors unless the supplied asset already contains the intended colors.

The final Landing / Login Page must clearly show the provided TapServe logo on the **top-left side** while keeping the rest of the existing UI unchanged.

---

# LANDING / LOGIN PAGE — TERMS AND CONDITIONS

Update the existing **TapServe Landing / Login Page** and add Terms and Conditions access without redesigning the current screen.

Keep the existing:

- TapServe logo
- Welcome to TapServe heading
- Login / Sign Up tabs
- Email Address field
- Password field
- Remember Me
- Forgot Password
- Login button
- Google login
- Facebook login
- “Want to earn as a specialist? Register as Service Provider” card

## ADD TERMS AND CONDITIONS TEXT

Add a small, clean text section near the lower part of the Login / Sign Up area, preferably **above the “Want to earn as a specialist?” card**.

Display:

**“By continuing, you agree to TapServe’s Terms and Conditions and Privacy Policy.”**

Make the following text clickable:

- **Terms and Conditions**
- **Privacy Policy**

Keep this text subtle and visually consistent with the existing mobile UI.

Use smaller typography than the main form text, but make the clickable links recognizable using the existing TapServe teal accent.

## TERMS AND CONDITIONS INTERACTION

When the user taps:

**Terms and Conditions**

→ Open a dedicated mobile-friendly **TapServe Terms and Conditions** page or scrollable modal.

The page should include:

- Back arrow or Close button
- Page title: **Terms and Conditions**
- Scrollable content
- Clear section headings
- TapServe-consistent typography and spacing

When the user taps:

**Privacy Policy**

→ Open a dedicated mobile-friendly **Privacy Policy** page or scrollable modal.

Both screens must have a functional way to return to the Landing / Login Page.

## SERVICE PROVIDER TERMS ACCESS

Near the existing:

**Want to earn as a specialist?**  
**Register as Service Provider**

card, also add a small clickable text link:

**View Service Provider Terms**

When tapped:

→ Open the **Service Provider Terms and Conditions** page.

This should allow applicants to read the provider-specific terms before starting the application.

## IMPORTANT

Do NOT require the user to check an agreement checkbox on the Login screen.

The Landing / Login page should only display the informational statement:

**“By continuing, you agree to TapServe’s Terms and Conditions and Privacy Policy.”**

The required agreement checkbox should remain inside the **Service Provider Application flow** on the dedicated Service Provider Terms and Conditions step.

## REQUIRED FIGMA PROTOTYPE CONNECTIONS

Create actual prototype interactions:

**Terms and Conditions**
→ TapServe Terms and Conditions page/modal

**Privacy Policy**
→ Privacy Policy page/modal

**View Service Provider Terms**
→ Service Provider Terms and Conditions page

Each Terms/Privacy screen:
→ Back/Close
→ Landing / Login Page

Do NOT leave these as non-clickable text.

The final Landing / Login Page should clearly include the Terms and Conditions statement while preserving the existing TapServe layout and design.

