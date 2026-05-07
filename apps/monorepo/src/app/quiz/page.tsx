import { monorepoQuestions } from "@fintech/interview-data";
import { QuizMode } from "@fintech/ui";

export default function MonorepoQuizPage() {
  return (
    <QuizMode
      questions={monorepoQuestions}
      topic="monorepo"
      accent="#10b981"
      hubUrl="http://localhost:3003"
      listUrl="/"
    />
  );
}
