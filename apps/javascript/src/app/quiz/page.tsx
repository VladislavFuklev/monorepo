import { javascriptQuestions } from "@fintech/interview-data";
import { QuizMode } from "@fintech/ui";

export default function JavaScriptQuizPage() {
  return (
    <QuizMode
      questions={javascriptQuestions}
      topic="javascript"
      accent="#f59e0b"
      hubUrl={process.env.NEXT_PUBLIC_HUB_URL ?? "http://localhost:3003"}
      listUrl="/"
    />
  );
}
