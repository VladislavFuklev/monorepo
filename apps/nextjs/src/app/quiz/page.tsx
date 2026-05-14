import { nextjsQuestions } from "@fintech/interview-data";
import { QuizMode } from "@fintech/ui";

export default function NextJsQuizPage() {
  return (
    <QuizMode
      questions={nextjsQuestions}
      topic="nextjs"
      accent="#6366f1"
      hubUrl={process.env.NEXT_PUBLIC_HUB_URL ?? "http://localhost:3003"}
      listUrl="/"
    />
  );
}
