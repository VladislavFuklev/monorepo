import { reactQuestions } from "@fintech/interview-data";
import { QuizMode } from "@fintech/ui";

export default function ReactQuizPage() {
  return (
    <QuizMode
      questions={reactQuestions}
      topic="react"
      accent="#0ea5e9"
      hubUrl={process.env.NEXT_PUBLIC_HUB_URL ?? "http://localhost:3003"}
      listUrl="/"
    />
  );
}
