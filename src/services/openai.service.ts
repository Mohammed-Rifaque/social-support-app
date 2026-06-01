import axios from 'axios'

import type { ApplicationForm, NarrativeField } from '../types/application'

interface GenerateSuggestionParams {
  application: ApplicationForm
  currentValue: string
  fieldType: NarrativeField
}

const OPENAI_API_URL = 'https://api.openai.com/v1/responses'
const OPENAI_MODEL = 'gpt-5-mini'

function buildPrompt({
  application,
  currentValue,
  fieldType,
}: GenerateSuggestionParams) {
  const fieldLabels: Record<NarrativeField, string> = {
    currentFinancialSituation: 'current financial situation',
    employmentCircumstances: 'employment circumstances',
    reasonForApplying: 'reason for applying',
  }

  return [
    'You are helping a person write a concise, respectful social support application.',
    `Write a polished first-person paragraph for the "${fieldLabels[fieldType]}" section.`,
    'Keep the tone honest, clear, and professional.',
    'Avoid inventing facts that are not supported by the provided form data.',
    'Limit the answer to 120 words.',
    '',
    `Applicant name: ${application.name || 'Not provided'}`,
    `Location: ${[application.city, application.state, application.country].filter(Boolean).join(', ') || 'Not provided'}`,
    `Employment status: ${application.employmentStatus || 'Not provided'}`,
    `Monthly income: ${application.monthlyIncome || 0}`,
    `Housing status: ${application.housingStatus || 'Not provided'}`,
    `Dependents: ${application.dependents}`,
    `Existing notes: ${currentValue || 'None yet'}`,
  ].join('\n')
}

export async function generateSuggestion(params: GenerateSuggestionParams) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('Missing OpenAI API key. Add VITE_OPENAI_API_KEY to your environment.')
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: OPENAI_MODEL,
        input: buildPrompt(params),
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      },
    )

    const suggestion =
      response.data?.output_text ??
      response.data?.output?.[0]?.content?.[0]?.text?.trim?.() ??
      ''

    if (typeof suggestion !== 'string' || suggestion.trim().length === 0) {
      throw new Error('Invalid response from AI service.')
    }

    return suggestion.trim()
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('The AI request timed out. Please try again.', {
          cause: error,
        })
      }

      if (!error.response) {
        throw new Error('Network error while contacting the AI service.', {
          cause: error,
        })
      }

      throw new Error('The AI service returned an unexpected response.', {
        cause: error,
      })
    }

    throw error
  }
}
