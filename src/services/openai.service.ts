import axios from 'axios'

import type { ApplicationForm, NarrativeField } from '../types/application'

interface GenerateSuggestionParams {
  application: ApplicationForm
  currentValue: string
  fieldType: NarrativeField
  language: string
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_MODEL = 'gpt-3.5-turbo'

function buildPrompt({
  application,
  currentValue,
  fieldType,
  language,
}: GenerateSuggestionParams) {
  const responseLanguage = language.startsWith('ar') ? 'Arabic' : 'English'
  const fieldLabels: Record<NarrativeField, string> = {
    currentFinancialSituation: 'current financial situation',
    employmentCircumstances: 'employment circumstances',
    reasonForApplying: 'reason for applying',
  }

  return [
    'You are helping a person write a concise, respectful social support application.',
    `Write a polished first-person paragraph for the "${fieldLabels[fieldType]}" section.`,
    `Respond only in ${responseLanguage}.`,
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
    throw new Error('aiError.missingApiKey')
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: [
              'You help applicants write concise, respectful social support application text.',
              'Do not invent facts.',
              'Keep the answer professional, first-person, and under 120 words.',
              'Always write the final suggestion in the language requested by the user prompt.',
            ].join(' '),
          },
          {
            role: 'user',
            content: buildPrompt(params),
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      },
    )

    const suggestion = response.data?.choices?.[0]?.message?.content?.trim?.() ?? ''

    if (typeof suggestion !== 'string' || suggestion.trim().length === 0) {
      throw new Error('aiError.invalidResponse')
    }

    return suggestion.trim()
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiMessage =
        typeof error.response?.data?.error?.message === 'string'
          ? error.response.data.error.message
          : undefined

      if (error.code === 'ECONNABORTED') {
        throw new Error('aiError.timeout', {
          cause: error,
        })
      }

      if (!error.response) {
        throw new Error('aiError.network', {
          cause: error,
        })
      }

      throw new Error(apiMessage || 'aiError.unexpectedResponse', {
        cause: error,
      })
    }

    throw error
  }
}
