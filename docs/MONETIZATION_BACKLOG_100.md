# Hallaqi — 100+ Development Suggestions Backlog

Generated during monetization expansion. Items marked `[done]` were applied in the same delivery wave.

## A. Navigation & IA (1–12)
1. [done] Rename bottom Discover label (i18n ar/fr/en)
2. [done] Keep Marketplace out of bottom tabs
3. [done] Central AI long-press radial
4. [done] Gallery mode from AI radial
5. Deep-link `/?screen=marketplace`
6. Persist last Discover filters in localStorage
7. Tab haptic feedback on mobile
8. Swipe between Discover sections
9. Badge count for pending business approvals (admin)
10. Keyboard shortcuts for desktop preview
11. Remember last AI radial action
12. Offline banner when marketplace fetch fails

## B. Marketplace Discovery (13–28)
13. [done] Category chips expandable
14. [done] Featured / premium / today filters
15. [done] Wilaya filter UI
16. [done] Brand filter UI
17. [done] Price min/max UI
18. Delivery area filter chips
19. Store/company owner filter
20. Save search presets
21. Infinite scroll / pagination
22. Skeleton loaders for product grid
23. [done] EmptyState component usage
24. Map view of stores by wilaya
25. Recently viewed products
26. Share marketplace product link
27. Compare up to 3 products
28. “Sponsored” badge clarity copy

## C. Product of the Day & Placements (29–38)
29. [done] Admin POTD setter
30. Auction calendar for future dates
31. Auto-select highest bid for tomorrow
32. Banner placement carousel
33. Placement performance report to seller
34. Preview POTD discount-style card
35. Prevent duplicate POTD same product same week
36. Company-level featured brand slots
37. Soft sellout when bids exceed inventory slots
38. Email/push when POTD wins

## D. Store & Company Pages (39–52)
39. [done] Visit Store WebView + fallback
40. [done] Store profile editor
41. [done] Company detail page
42. [done] Store reviews schema + UI
43. Company product shelves
44. Require website URL before approval
45. Social links editor (IG/FB/TikTok)
46. Cover image upload to Storage
47. Logo upload to Storage
48. Store hours section
49. Delivery areas multi-select (wilayas)
50. Verified / Premium / Company badges polish
51. Store SEO slug uniqueness check
52. Embed YouTube brand video (company)

## E. Roles & Onboarding (53–64)
53. [done] Separate store/company/doctor signup
54. [done] Pending entity rows on signup
55. [done] Doctor specialty field (expandable)
56. Guided onboarding checklist for stores
57. Company branding pack upload
58. Doctor license number capture
59. Switch role request flow (client→store)
60. Block barber forced product selling (copy + UX)
61. Moderator role marketplace tools
62. Admin MFA already present — extend to placements
63. Email templates for approval/rejection
64. Arabic-first onboarding tips carousel

## F. Subscriptions & Monetization (65–78)
65. [done] Independent plan catalogs
66. [done] Cap premium at 99
67. [done] Soft warnings at 80%/95% item usage
68. Upgrade CTA when cap reached
69. Featured slot add-on SKU
70. Banner add-on SKU
71. POTD bid checkout (manual admin for now)
72. Invoice PDF for subscription requests
73. CCP receipt for store subscriptions
74. Stripe recurring later (explicitly deferred)
75. “Start free / pay as you grow” everywhere
76. Plan comparison table UI
77. Trial Professional 7 days (optional)
78. Downgrade safeguards (archive excess items)

## G. Analytics (79–88)
79. [done] Basic owner analytics dashboard
80. Wilaya breakdown chart
81. Category performance chart
82. POTD ROI panel
83. Featured slot CTR
84. Export CSV
85. Date range picker
86. Funnel: impression → click → Visit Store
87. Alerts when CTR drops
88. Admin ecosystem health dashboard

## H. AI Seller Tools (89–98)
89. [done] Listing assist API + UI
90. Bulk generate descriptions
91. Suggest category from title
92. Image caption from gallery upload
93. Offer text for POTD bids
94. Keyword density helper
95. Arabic dialect toggle (DZ / MSA)
96. Auto-fill SEO slug
97. Abuse filter on AI outputs
98. Quota meter for seller AI

## I. Quality, A11y, Perf (99–115)
99. [done] Marketplace unit tests (filters/helpers)
100. E2E smoke: Discover → Marketplace → Store → Visit
101. Axe a11y pass on marketplace screens
102. Focus traps in WebView header
103. Reduce motion support for radial
104. Prefetch marketplace categories
105. Image lazy-loading + blurhash
106. Route-based code splitting audit
107. CSP allowlist for merchant WebViews
108. ErrorBoundary per marketplace page
109. Sentry/client-error tags for marketplace
110. Lighthouse mobile score ≥ 80 target
111. Prefers-color-scheme sync with theme
112. RTL audit for new screens
113. FR/EN parity for marketplace strings
114. [done] ARCHITECTURE.md refresh
115. [done] DATABASE.md monetization tables

## J. Trust, Safety, Ops (116–125)
116. Flag product abuse from clients
117. Auto-suspend spam stores (>N reports)
118. Admin marketplace sections reorder
119. Content keyword blacklist
120. Doctor recommendation disclosure (“إعلان/توصية”)
121. Rate-limit Visit Store clicks analytics
122. Backup/export seller catalog
123. Soft delete products with restore window
124. Audit log for placement changes
125. Runbook for approving first 50 stores

## K. Product Polish Quick Wins (126–140)
126. Pull-to-refresh on marketplace
127. [done] Toast on successful product create
128. [done] Confirm dialog before product delete
129. Sticky Visit Store CTA on store page
130. [done] Show category Arabic names on shelves
131. [done] Default sort “featured then popular”
132. Highlight Premium badge on cards
133. [done] Empty seller catalog illustration
134. Doctor trusted badge animation
135. Onboarding tip for AI long-press
136. [done] Marketplace search debounce 250ms
137. Hide zero-result filters gracefully
138. Store rating stars component reuse
139. Company trust tag localization
140. [done] Changelog entry for monetization launch
