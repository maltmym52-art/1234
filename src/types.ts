export interface ToolInput {
  name: string;
  label: string;
  type: 'number' | 'select' | 'text' | 'checkbox';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { label: string; value: string | number }[];
  placeholder?: string;
}

export interface ToolOutput {
  name: string;
  label: string;
  value: string | number;
  unit?: string;
  badge?: string; // e.g. "Optimal", "High Risk", "Acidic"
  badgeColor?: string; // Tailwind color class
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  formula: string;
  howToUse: string;
  inputs: ToolInput[];
  faqs: FAQ[];
  calculate: (inputs: Record<string, any>) => ToolOutput[];
  relatedToolIds?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string; // Used to look up Lucide icons dynamically
  color: string; // e.g., 'emerald' or 'amber'
  toolsCount: number;
}
