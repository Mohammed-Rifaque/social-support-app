# Architecture Overview

## Frontend Stack

- React 19
- TypeScript
- Vite
- React Router
- React Hook Form
- Zod
- i18next
- axios
- react-hot-toast

## State Model

`ApplicationContext` owns the full `ApplicationForm` object and exposes:

- `formData`
- `updateFormData`
- `resetFormData`

The provider integrates with `useLocalStorage` so application data persists automatically between refreshes.

## Form Flow

1. `StepOne` captures personal information.
2. `StepTwo` captures family, employment, income, and housing details.
3. `StepThree` captures narrative explanations with AI assistance.
4. `Review` summarizes the application and triggers mock submission.
5. `Success` confirms the application was submitted.

## AI Suggestion Flow

`AITextarea` calls `generateSuggestion()` from `openai.service.ts`.

- The service sends a request to the OpenAI Responses API.
- The UI shows `Loading...` while awaiting the response.
- Errors are surfaced with `react-hot-toast`.
- The modal lets the user accept, edit, or discard the suggestion.

## Internationalization

- Translation resources live in `src/locales/en/common.json` and `src/locales/ar/common.json`
- `ApplicationShell` applies `dir="rtl"` when Arabic is selected

## Future Architecture Enhancements

- Move AI integration to a backend or edge function
- Add route guards for incomplete steps
- Introduce test coverage for forms and service layers
- Add analytics for step completion and abandonment
