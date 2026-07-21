# E10 — Trace Viewer

> **Concept:** When a test fails in CI you can't watch it. Playwright's trace captures every action, screenshot, and network call so you can replay the failure locally.

## What you need
- App running: `npm start`
- Starter spec: copy `trace.starter.spec.ts` → `tests/ui/trace.spec.ts`

## Part 1 — Capture a trace on a passing run

Force traces on every test (not just retries):
```bash
npx playwright test --trace on
```

After the run, open the report:
```bash
npx playwright show-report
```
Click any test → **Traces** tab → click the trace thumbnail. Explore:
- The timeline of actions
- Screenshots at each step
- Network requests panel
- Console output

## Part 2 — Capture a trace on a failing test

1. Start the app with the demo break:
   ```bash
   DEMO_BREAK=1 npm start
   ```

2. Run the suite with traces:
   ```
   bash
   npx playwright test --trace on
   ```

3. Find the trace ZIP for a failing test:
   ```bash
   npx playwright show-trace test-results/<folder>/trace.zip
   ```

4. Step through the trace. Find the exact moment the assertion failed. What did the button say?

## Part 3 — Understand the config

Open `playwright.config.ts`. Notice `trace: 'on-first-retry'`.

This means: capture a trace only when a test fails on first attempt and retries. This is the CI default — traces are captured when you need them, not on every green run (which would be slow).

## Done when
- [ ] You've opened at least one trace in the trace viewer
- [ ] You can identify the failing assertion and the DOM state at the time of failure
- [ ] You can explain when `'on-first-retry'` is more appropriate than `'on'`
