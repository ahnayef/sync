<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Sync scheduling app. The integration covers client-side initialization via `instrumentation-client.ts` (the recommended Next.js 15.3+ approach), a server-side PostHog client in `lib/posthog-server.ts`, a reverse-proxy configuration in `next.config.ts` for reliable event delivery, environment variables for the project token and host, and event tracking across 8 files spanning authentication, course management, the routine viewer, user profile, and admin schedule imports. User identification is performed on credentials login and error tracking via `captureException` is added at every catch boundary.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Admin/moderator successfully logs in with email and password credentials | `components/LoginForm.tsx` |
| `user_signed_in_google` | User initiates Google sign-in from the login or signup page | `components/AuthButtons.tsx` |
| `course_toggled` | Student selects or deselects a course in the course selection page | `app/(users)/courses/page.tsx` |
| `courses_saved` | Student saves their course selection; includes count of selected courses | `app/(users)/courses/page.tsx` |
| `focus_mode_toggled` | User enables or disables focus mode on the routine page | `app/(users)/routine/page.tsx` |
| `routine_day_changed` | User navigates to a different day in the routine view | `app/(users)/routine/page.tsx` |
| `profile_updated` | User successfully updates their profile information (name, email, student ID) | `app/(users)/profile/page.tsx` |
| `password_changed` | User successfully changes their account password | `app/(users)/profile/page.tsx` |
| `account_deleted` | User confirms and initiates account deletion | `app/(users)/profile/page.tsx` |
| `password_reset_requested` | User submits email to start the forgot-password OTP flow | `app/(regular)/forgot-password/ForgotPasswordClient.tsx` |
| `schedule_imported` | Admin applies an imported schedule to the database; includes rows/summary counts | `app/api/schedules/import/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1623435)
- [Sign-in trends](/insights/Rx1qTbO2) — daily credentials vs Google sign-ins
- [Course selection to save funnel](/insights/3CmddJTn) — conversion from toggling courses to saving selections
- [Focus mode usage](/insights/TLE8L2cC) — how often students use focus mode on the routine page
- [Profile action trends](/insights/xj4qRyJ5) — profile updates, password changes, and account deletions (churn signal)
- [Schedule imports by admins](/insights/gnrA6qfm) — weekly admin schedule import activity

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
