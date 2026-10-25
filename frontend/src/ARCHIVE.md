ARCHIVE / Cleanup Plan

Summary
-------
This file lists candidate module directories to archive (move to `src/archived-modules/`) and files that currently reference those modules. We are NOT deleting code; this is a safe, reversible plan. After moving the directories you can either keep them for later reference or delete them.

Recommended archive targets (move these directories):
- src/modules/admin-dashboard/
- src/modules/agent-dashboard/
- src/modules/landing/
- src/modules/client-management/
- src/modules/commission/
- src/modules/contracting/
- src/modules/configuration/
- src/modules/onboarding/
- src/modules/instructions/
- src/modules/compliance/
- src/modules/executive-dashboard-one/
- src/modules/training/
- (Any other `src/modules/*` that are not `sign-in` or `profile`)

Files that still reference archived modules (needs follow-up)
----------------------------------------------------------
These files currently import from modules that we plan to archive. After moving modules, update or remove these imports as needed.

- src/router/Unauthorized.jsx
  - imports: `../modules/sign-in/slice/signinSlice` (signin is kept; OK)
- src/router/PrivateRoute.jsx
  - imports: `../modules/sign-in/slice/signinSlice` (signin is kept; OK)
- src/router/index.jsx
  - imports: `../modules/sign-in/container` (signin kept; OK)
- src/router/AppLogout.jsx
  - imports: `../modules/sign-in/slice/signinSlice` (ok)

Inter-module references that remain in feature code (these will move along with modules):
- src/modules/onboarding/component/ApprovalRequest.jsx
  - imports admin slice from `../../../modules/admin-dashboard/slice/adminSlice`
- src/modules/onboarding/slice/onBoardingSlice.jsx
  - imports `logout` from signin slice
- src/modules/profile/component/DirectDepositInfo.jsx
  - imports onboarding actions from `../../../modules/onboarding/slice/onBoardingSlice`
- src/modules/profile/component/ProfileInfo.jsx
  - imports from signin and admin slices
- src/components/header/TopHeaderBar.jsx
  - imports `logout` from `../../modules/sign-in/slice/signinSlice` (signin kept; ok)
- src/components/header/DashboardHeader.jsx
  - imports `logout` from `../../modules/sign-in/slice/signinSlice` (signin kept; ok)
- src/components/check-api-response/index.jsx
  - imports `logout` from `../../modules/sign-in/slice/signinSlice` (signin kept; ok)
- src/modules/client-management/slice/clientManagmentSlice.jsx
  - imports `logout` from `../../../modules/sign-in/slice/signinSlice`
- src/modules/agent-dashboard/component/TopEarners.jsx
  - imports commission slice from `../../../modules/commission/slice/commissionSlice`
- src/modules/agent-dashboard/component/RecentFamilies.jsx
  - imports client-management slice from `../../../modules/client-management/slice/clientManagmentSlice`
- src/modules/sign-in/component/CreateAgent.jsx
  - imports onboarding slice
- src/modules/admin-dashboard/slice/adminAction.jsx
  - various admin-related logic and templates
- src/modules/admin-dashboard/slice/adminSlice.jsx
  - imports `logout` from signinSlice
- src/modules/admin-dashboard/container/index.jsx
  - imports onboarding slice

Recommended next steps (safe order)
----------------------------------
1. Move directories listed above to `src/archived-modules/` (git mv preserves history):
   - `git mv src/modules/admin-dashboard src/archived-modules/admin-dashboard`
   - Repeat for each module.
2. Run a repo-wide search for paths referencing moved modules and update imports to new locations (or remove references if unused).
3. Run the app locally and fix any remaining import/runtime errors.
4. Clean up `src/redux/reducers/index.jsx` and `src/router/index.jsx` (already partially done) to remove archived module references.
5. Optionally delete archived directories once confident.

Notes
-----
- We intentionally kept `src/modules/sign-in` and `src/modules/profile` since `signin` provides authentication and `profile` is commonly reused.
- This plan is conservative: we do not delete code. We only update router and reducers so the app boots with a minimal starter surface.
- If you want, I can perform the `git mv` moves automatically; confirm and I will proceed.

If you want me to proceed with moving the directories into `src/archived-modules/`, reply with `proceed-move`.
