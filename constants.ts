
import { Language, SummarizationStyle } from './types';

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: Language.ENGLISH, label: 'English' },
  { value: Language.VIETNAMESE, label: 'Tiếng Việt' },
];

export const STYLES: { value: SummarizationStyle; label: string }[] = [
  { value: SummarizationStyle.PROFESSIONAL, label: 'Professional' },
  { value: SummarizationStyle.OBJECTIVE, label: 'Objective' },
  { value: SummarizationStyle.HUMOROUS, label: 'Humorous' },
  { value: SummarizationStyle.TENSE, label: 'Tense' },
];

export const SUMMARY_LENGTHS = [
    { key: 's80', label: '80 Words' },
    { key: 's170', label: '170 Words' },
    { key: 's300', label: '300 Words' },
    { key: 's600', label: '600 Words' },
] as const;
