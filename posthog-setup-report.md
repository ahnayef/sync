# PostHog post-wizard report

PostHog is configured for this Next.js App Router application through `instrumentation-client.ts`, using the project’s `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables. The existing ingestion proxy remains in place. The server-side client now flushes short-lived route-handler events and supports exception autocapture.

This setup also corrected the credentials sign-in event so it no longer sends an email address as an event property. Authenticated users continue to be identified with their email as a person property. New server-side tracking covers successful contact submissions and completed bulk entity imports, with no submitted names, email addresses, subjects, messages, or other user-entered content captured as event properties.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Tracks a successful credentials sign-in without including email in event properties. | `components/LoginForm.tsx` |
| `schedule_imported` | Tracks a completed schedule import with aggregate row counts and program context. | `app/api/schedules/import/route.ts` |
| `contact_form_submitted` | Tracks a successful contact request without recording message contents or contact details. | `app/api/contact/route.ts` |
| `entity_import_completed` | Tracks an administrator or moderator bulk import with imported entity type and record count. | `app/api/imports/apply/route.ts` |

## Next steps

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/175494/dashboard/1866327)
- [Sign-ins over time (wizard) insight](https://us.posthog.com/project/175494/insights/XNqB4C9K)

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or a bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify` and preserves authenticated user attribution.

### Agent skill

The integration skill remains in `.claude/skills/integration-nextjs-app-router` for future agent-assisted PostHog work.
