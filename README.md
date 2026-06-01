# Social Support App

## Project Overview

This project is a multi-step social support application built with React, TypeScript, Vite, React Hook Form, Zod, and React Router. It guides applicants through personal details, family and housing data, and AI-assisted narrative responses before review and submission.

## Features

- Multi-step form wizard with route-based navigation
- Centralized global state with React context
- Validation powered by Zod and React Hook Form
- AI-assisted writing support for narrative fields
- Local autosave with visible saved status
- English and Arabic language switching with RTL support
- Accessible labels, validation states, and keyboard-friendly controls
- Review page and mock submission flow

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Start the app:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Environment Variables

```bash
VITE_OPENAI_API_KEY=your_openai_api_key
```

Note: this demo calls the OpenAI API from the client because the exercise explicitly requested a Vite environment variable. For production use, move AI calls to a backend service so the API key is not exposed in the browser.

## Architecture

- `src/context`: application-wide form state and persistence status
- `src/routes`: route definitions for each step and completion pages
- `src/pages`: step-specific UI and review/success pages
- `src/components`: reusable UI like the progress bar, shell, AI modal, and textareas
- `src/services`: OpenAI suggestion service and mock submission service
- `src/schemas`: Zod validation schemas for each form stage
- `src/hooks`: local storage persistence
- `src/locales`: i18n configuration and translations

## Future Improvements

- Move AI requests behind a secure backend endpoint
- Add field masking for national ID and phone inputs
- Add automated tests for schema validation and routing
- Persist submission history for staff review workflows
- Add screenshot or GIF walkthroughs for the README
