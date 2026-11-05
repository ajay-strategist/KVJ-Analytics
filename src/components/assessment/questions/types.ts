export interface QuestionProps {
  question: any;
  answer: any;
  checkedAnswer?: {
    checked?: boolean;
    correctIndex?: number;
    correctIndexes?: number[];
    isCorrect?: boolean;
    explanation?: string;
  };
  isInline?: boolean;
  colors: {
    line: string;
    card: string;
    hover: string;
    text?: string;
    slate?: string;
  };
  onAnswerChange: (newAnswer: any) => void;
  onClearChecked: () => void;
}

