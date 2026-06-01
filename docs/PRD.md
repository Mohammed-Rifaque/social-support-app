# Product Requirements Document

## Product Summary

The Social Support App is a three-step application wizard followed by review and success states. It collects applicant identity, household context, and narrative explanations, then allows the applicant to review and submit the form.

## Functional Requirements

1. The root route must redirect to `/step-1`.
2. The application must provide `StepOne`, `StepTwo`, `StepThree`, `Review`, and `Success` pages.
3. Form state must live in a global context and remain the single source of truth.
4. Step one must validate required personal fields, email format, and phone format.
5. Step two must use select inputs for family and housing data.
6. Step three must provide reusable AI-assisted textarea inputs.
7. The app must autosave data to local storage and restore it on refresh.
8. The app must support English and Arabic with RTL switching for Arabic.
9. The review page must display all collected data before submission.
10. Submission must be mocked with a loading state and success page.

## Non-Functional Requirements

- Responsive layout for desktop and mobile
- Keyboard navigable controls
- Accessible labels and ARIA state handling
- Type-safe schemas and form models
- Production build must pass successfully

## Risks

- Frontend API key exposure for AI suggestions
- Potential user confusion if AI-generated text sounds too generic
- Client-only persistence can be cleared by the browser
