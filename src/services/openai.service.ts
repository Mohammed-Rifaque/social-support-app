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

const FIELD_TEMPERATURE: Record<NarrativeField, number> = {
  currentFinancialSituation: 0.6,
  employmentCircumstances: 0.65,
  reasonForApplying: 0.7,
}

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
  const fieldFocus: Record<NarrativeField, string> = {
    currentFinancialSituation:
      'Describe the applicant’s present financial situation, key expenses, constraints, and any debts.',
    employmentCircumstances:
      'Describe employment status, recent changes, stability, and how work impacts finances.',
    reasonForApplying:
      'Explain why the applicant is applying for support now and what assistance would change.',
  }
  const fieldAngleExamples: Record<NarrativeField, string> = {
    currentFinancialSituation:
      'Example angle: Focus on monthly income vs. essential costs (rent, food, medical), debts, and why current cash flow is insufficient.',
    employmentCircumstances:
      'Example angle: Note current job/education status, recent loss or underemployment, barriers (transport, childcare), and steps being taken.',
    reasonForApplying:
      'Example angle: State the specific help sought, immediate goals (stability, essentials), and how support changes near-term outcomes.',
  }

  return [
    'You are helping a person write a concise, respectful social support application.',
    `Write a polished first-person paragraph for the "${fieldLabels[fieldType]}" section.`,
    `Focus only on this section: ${fieldFocus[fieldType]}`,
    fieldAngleExamples[fieldType],
    `Respond only in ${responseLanguage}.`,
    'Keep the tone honest, clear, and professional.',
    'Avoid inventing facts that are not supported by the provided form data.',
    'Limit the answer to 120 words.',
    'Do not repeat prior suggestions; tailor this response uniquely to this field.',
    'Avoid repeating the same opener across sections; vary the first sentence.',
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
        temperature: FIELD_TEMPERATURE[params.fieldType] ?? 0.65,
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
