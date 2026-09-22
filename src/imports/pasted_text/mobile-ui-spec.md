IMPORTANT MOBILE UI REFERENCE:

This project is a MOBILE APPLICATION.

Follow the existing mobile UI style shown in the current prototype. DO NOT convert it into a desktop dashboard or website.

Use the existing design language:

• Light gray/off-white app background
• White rounded cards
• Teal primary accent
• Dark navy/black headings
• Muted gray secondary text
• Rounded search bars
• Rounded icon/category buttons
• Small status badges
• Clean service-provider cards
• Large touch-friendly buttons
• Minimal shadows/borders
• Generous mobile spacing
• Fixed bottom navigation
• Vertical scrolling
• Horizontal scrolling only for categories/chips when needed

Maintain approximately the same mobile proportions as the existing prototype.

Use a phone-sized frame around:
• 390 × 844
• 393 × 852
• Similar modern smartphone dimensions

DO NOT add:
• Desktop sidebar
• Desktop navbar
• Large desktop tables
• Desktop admin layouts
• 3–4 column grids
• Website-style headers

Everything must look and behave like a native modern mobile service-booking application.

==================================================
CURRENT HOME SCREEN STYLE
=========================

Preserve the general structure of the existing Home screen:

Top section:

"Magandang araw! 👋"

User Name

Location pill:
📍 San Pablo City

Then:

Search Bar

Placeholder example:
"Search for plumber, electrician..."

Then:

Service Categories

[See All]

Horizontal category icons such as:

Cleaning
Plumbing
Electrical
Gardening
Home Repair
Other Services

Use horizontally scrollable category buttons if they exceed the screen width.

Then:

AI Recommended for You

Secondary text:
"Based on location & rating"

Display recommended providers using vertically stacked rounded cards.

Example provider card:

[Provider Photo]

Kuya Reynaldo
★ 4.9 (142)

Master Plumber

📍 1.2 km away

₱350/hr

Cards should remain visually similar to the current application.

==================================================
BOTTOM NAVIGATION
=================

Keep the existing bottom navigation structure:

Home
Bookings
Messages
Profile

Do NOT automatically add Favorites as a fifth tab unless there is enough space and it fits the current design.

Instead, Favorite Providers should be accessible from:

• Home screen
• Provider profiles
• Profile menu
• Chatbot
• Favorite Providers shortcut/card

Use the existing bottom navigation design and visual style.

==================================================
FAVORITE PROVIDERS ON HOME
==========================

Add a new Home section below recommended providers or in an appropriate location:

"Your Favorite Providers"

[See All]

Show favorite providers using compact cards consistent with the existing provider cards.

Example:

♥ Your Favorite Providers

[Photo]

Kuya Reynaldo
★ 4.9

Master Plumber

● Available Today

[Book Again]

Allow horizontal scrolling if there are multiple favorite providers.

Show approximately 2 cards before the user needs to scroll.

==================================================
FAVORITE PROVIDERS PAGE
=======================

Create a separate mobile page:

← Favorite Providers

Use the same background and card style as the current app.

Top area:

← Favorite Providers

Subtitle:
"Providers you've saved for easier booking."

Search field:

"Search favorite providers..."

Filter chips:

[All]
[Cleaning]
[Plumbing]
[Electrical]
[Gardening]

Then vertically display provider cards.

Example:

[Photo]

♥ Kuya Reynaldo

Master Plumber

★ 4.9 (142)

📍 1.2 km away

₱350/hr

● Available Today

[View Profile]   [Book Again]

Use a filled heart icon in the upper-right area of each card.

==================================================
ADDING PROVIDERS TO FAVORITES
=============================

Every provider card and provider profile should have a heart icon.

Not favorite:

♡

Tap:
Add provider to Favorites.

Show small toast:

"Kuya Reynaldo added to your favorites."

Heart changes to:

♥

If tapped again:

Open a small mobile bottom sheet or confirmation modal:

"Remove Kuya Reynaldo from favorites?"

[Cancel]

[Remove]

==================================================
PROVIDER PROFILE MOBILE SCREEN
==============================

When a provider is selected, open a full mobile profile.

Structure:

← Provider Profile

Large profile image

♥ Favorite button

Kuya Reynaldo

Master Plumber

★ 4.9 (142 reviews)

📍 1.2 km away

245 completed services

About

Short provider description

Services Offered

• Pipe Repair
• Leak Repair
• Installation
• General Plumbing

Availability

[Today]
[Tomorrow]
[Wednesday]

Customer Reviews

Then use a sticky bottom action:

[Book Kuya Reynaldo]

==================================================
BOOK AGAIN
==========

When the user taps:

[Book Again]

Open the normal mobile booking flow with that provider PRESELECTED.

Example:

← Book Service

Provider

[Photo]
Kuya Reynaldo
Master Plumber
✓ Selected

Service

[Choose Service ▼]

Date

[Choose Date]

Available Time

[9:00 AM]
[10:30 AM]
[1:00 PM]
[3:00 PM]

Booking Summary

Then sticky bottom CTA:

[Continue]

The user should NOT need to search for the provider again.

==================================================
CHATBOT MOBILE DESIGN
=====================

Add a floating chatbot icon positioned slightly above the bottom navigation so it does not overlap navigation controls.

When tapped:

Open either:

• Full-screen chat page

OR

• Large mobile bottom sheet occupying around 80–90% of the screen.

Chat header:

← TapServe Assistant

● Online

Chatbot:

"Hi! How can I help you today?"

Use horizontally wrapping Quick Action chips:

[Book a Service]

[Check Booking]

[Cancellation Policy]

[Available Personnel]

[Service Information]

[Favorite Providers]

IMPORTANT:

Quick Actions represent PREDEFINED QUESTIONS.

When tapped, they should automatically create a USER chat bubble.

Example:

User taps:

[Favorite Providers]

Automatically show:

USER:
"Where can I see my favorite service providers?"

Then BOT:

"You can view all the providers you've saved in the Favorite Providers section. From there, you can check availability, view their profile, or book them again."

Then show:

[View Favorites]

[Book Favorite]

[Find Provider]

If the user taps:

[View Favorites]

Navigate to the Favorite Providers page.

==================================================
CHATBOT QUICK ACTION EXAMPLE
============================

Initial screen:

BOT:

"Hi! How can I help you today?"

Quick Actions:

[Book a Service]
[Check Booking]
[Cancellation Policy]
[Available Personnel]
[Service Information]
[Favorite Providers]

If:

[Cancellation Policy]

is tapped:

Automatically display:

USER:

"What happens if I cancel my booking?"

Then:

BOT:

"If the service provider has already accepted your booking, cancelling it may be recorded as a cancellation offense based on the platform's cancellation policy."

Then:

BOT:

"Repeated cancellations of accepted bookings may lead to warnings or account restrictions."

Follow-up Quick Actions:

[Cancel Booking]
[View Cancellation Rules]
[Account Violations]
[Main Menu]

Previous messages must remain visible.

==================================================
BOOKING CONFLICT MOBILE UI
==========================

If two users try to book the same provider and schedule, prevent double booking.

Example:

User selects:

Kuya Reynaldo

2:00 PM

But another accepted booking already occupies 2:00 PM.

Display a mobile modal/bottom sheet:

"Time Slot Unavailable"

"Kuya Reynaldo already has an accepted booking at 2:00 PM."

Actions:

[Choose Another Time]

[Choose Another Provider]

Automatically disable unavailable time slots.

Example:

9:00 AM

10:30 AM

2:00 PM — Unavailable

3:30 PM

==================================================
CANCELLATION WARNING MOBILE UI
==============================

If an ACCEPTED booking is being cancelled:

Use a mobile confirmation bottom sheet.

Title:

"Cancel Accepted Booking?"

Message:

"Your provider has already accepted this booking. Cancelling it may be recorded as a cancellation offense."

Show:

Provider:
Kuya Reynaldo

Service:
Plumbing Repair

Date:
September 20

Time:
2:00 PM

Cancellation Reason:

[Select reason ▼]

Buttons:

[Keep Booking]

[Cancel Booking]

Use red/destructive styling only for the final cancellation button.

==================================================
RATINGS AND REVIEWS
===================

After service completion:

Show a mobile review screen.

"How was your service?"

Provider image

Kuya Reynaldo

★★★★★

"Write your review..."

Toggle:

Anonymous Review
[ON / OFF]

Helper text:

"When anonymous, your name will not be visible publicly or to the provider. Administrators may still identify your account for moderation."

[Submit Review]

==================================================
ADMIN MOBILE APP
================

The Admin Side must ALSO be designed as a MOBILE application.

Do NOT use desktop admin dashboards or large desktop tables.

Admin bottom navigation could contain:

Dashboard
Users
Violations
Appeals
Settings

Use the same general visual identity but distinguish the Admin experience through labels and content.

==================================================
ADMIN MOBILE DASHBOARD
======================

Use vertically stacked metric cards.

Example:

Community Overview

[Active Users]
1,284

[Warnings]
24

[Suspended]
8

[Violations Today]
17

Then:

"Recent Violations"

Display violations as cards instead of desktop table rows.

Example:

John Santos

Cancellation Abuse

Medium Severity

Today, 2:35 PM

Status:
Pending Review

[Review]

==================================================
ADMIN USER MANAGEMENT
=====================

Use:

Search Users

"Search name or account ID..."

Filter chips:

[All]
[Good Standing]
[Warning]
[Restricted]
[Suspended]
[Banned]

Display users as stacked cards.

Example:

John Santos

Account #10245

Rating:
★ 4.2

Violations:
2

Status:
WARNING

[View Account]

==================================================
USER MODERATION PROFILE
=======================

Mobile screen:

← User Moderation

John Santos

Account Status:
Restricted

Community Rating:
★ 4.2

Completed Bookings:
23

Cancelled Bookings:
4

Violations:
2

Then cards:

Violation History

Cancellation Abuse

September 15

Medium Severity

+1 Point

[View Evidence]

Then sticky or bottom action:

[Moderation Actions]

Tapping it opens a bottom sheet:

Issue Warning
Restrict Account
Suspend Account
Restore Account
Ban Account

==================================================
MODERATION RULES MOBILE SCREEN
==============================

Instead of a desktop settings table, display rules as cards.

Example:

Accepted Booking Cancellation

Severity:
Medium

Threshold:
3

Points:
+1

Automated Action:
Warning

Status:
Enabled

[Edit Rule]

Another card:

Hate Speech

Severity:
High

Threshold:
1 Confirmed Incident

Points:
+3

Action:
Temporary Suspension + Review

[Edit Rule]

==================================================
PROGRESSIVE VIOLATION SYSTEM
============================

Use this logic:

0 Violations
Good Standing

1st Confirmed Violation
Warning

2nd Confirmed Violation
Restricted Account / Final Warning

3rd Confirmed Violation
Temporary Suspension

Further or Severe Violations
Admin Review / Possible Permanent Ban

Severity can override normal progression.

Example:

Critical hate speech or serious threats can immediately enter Admin Review.

Ratings below 4.0 should NOT automatically suspend users.

Low ratings should only be a monitoring/risk indicator unless there are confirmed violations.

==================================================
ADMIN SUSPENSION MOBILE FLOW
============================

Admin selects:

[Suspend Account]

Open bottom sheet:

Suspend User

Reason:

[Select Reason ▼]

Duration:

[24 Hours]
[3 Days]
[7 Days]
[Custom]

Admin Notes:

[Optional notes...]

[Cancel]

[Suspend User]

Then show:

"Account suspended successfully."

==================================================
APPEALS MOBILE UI
=================

For suspended users:

Account Status

TEMPORARILY SUSPENDED

Reason:
Repeated Booking Cancellations

Ends:
September 22, 2026

[View Details]

[Submit Appeal]

Appeal screen:

Reason for Appeal

[Text area]

Supporting Information

[Text area]

[Upload Attachment]

[Submit Appeal]

Admin receives this under:

Appeals

using mobile cards.

==================================================
IMPORTANT DESIGN CONSISTENCY
============================

The new features MUST visually look like part of the CURRENT APP.

Do NOT drastically change the existing home screen.

Reuse the current:

• Teal accent color
• Rounded white cards
• Bottom navigation
• Provider card layout
• Search-bar style
• Service category icons
• Typography hierarchy
• Light background
• Rating presentation
• Location presentation
• Button styles
• Spacing
• Border treatment

When creating new pages, use the existing Home screen as the visual reference.

The goal is to EXTEND the existing mobile UI, not replace it.

==================================================
PROTOTYPE THESE FLOWS
=====================

Create actual Figma prototype interactions for:

Favorite Provider:

Provider Card
→ Heart
→ Added to Favorites
→ Toast
→ Favorite Providers
→ Book Again
→ Provider preselected

Chatbot:

Chatbot Button
→ Quick Action
→ Preset User Message
→ Bot Response
→ Follow-up Actions

Booking Conflict:

Select Provider
→ Select Time
→ Slot Already Taken
→ Unavailable Modal
→ Select New Time

Cancellation:

Accepted Booking
→ Cancel
→ Warning Bottom Sheet
→ Confirm
→ Violation Evaluation

Admin Moderation:

Violation
→ Review User
→ View Evidence
→ Confirm Violation
→ Warning / Restriction / Suspension

Appeal:

Suspension
→ Submit Appeal
→ Admin Reviews
→ Approve / Reject

Everything must be MOBILE-FIRST and visually consistent with the existing app shown in the current prototype.