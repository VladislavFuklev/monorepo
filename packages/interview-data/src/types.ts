export type Difficulty = "junior" | "middle" | "senior";

export interface Question {
  id: string;
  question: string;
  answer: string;
  code?: string;
  difficulty: Difficulty;
  tags: string[];
}
