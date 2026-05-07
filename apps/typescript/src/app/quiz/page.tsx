import { typescriptQuestions } from "@fintech/interview-data";
import { QuizMode } from "@fintech/ui";

export default function TypeScriptQuizPage() {
  return (
    <QuizMode
      questions={typescriptQuestions}
      topic="typescript"
      accent="#8b5cf6"
      hubUrl="http://localhost:3003"
      listUrl="/"
    />
  );
}
