export enum Language {
  ENGLISH = 'English',
  VIETNAMESE = 'Vietnamese',
}

export enum SummarizationStyle {
  PROFESSIONAL = 'Professional',
  HUMOROUS = 'Humorous',
  TENSE = 'Tense',
  OBJECTIVE = 'Objective',
}

export interface AIResult {
  summaries: {
    s80?: string;
    s170?: string;
    s300?: string;
    s600?: string;
  };
  titles: string[];
  tags: string[];
}