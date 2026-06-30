export interface CommitmentAnswer {
  question: string;
  answer: string;
}

export interface CommitmentAnswersJson {
  answers: CommitmentAnswer[];
}

export interface ParticipantCommitmentView {
  elementId: string;
  answers: CommitmentAnswer[];
  commitmentSummary: string | null;
  updatedAt: string;
}

const CREATE_QUESTION_HINT = "committing to create";

export function parseCommitmentAnswersJson(raw: unknown): CommitmentAnswer[] {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return [];
  }

  const answers = (raw as CommitmentAnswersJson).answers;
  if (!Array.isArray(answers)) {
    return [];
  }

  return answers
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const row = item as unknown as Record<string, unknown>;
      const question = String(row.question ?? "").trim();
      const answer = String(row.answer ?? "").trim();
      if (!question && !answer) {
        return null;
      }
      return { question, answer };
    })
    .filter((item): item is CommitmentAnswer => item != null);
}

export function buildCommitmentAnswersJson(
  questions: string[],
  answerValues: string[]
): CommitmentAnswersJson {
  return {
    answers: questions.map((question, index) => ({
      question,
      answer: answerValues[index]?.trim() ?? "",
    })),
  };
}

export function buildCommitmentSummary(
  questions: string[],
  answerValues: string[]
): string | null {
  const pairs = questions.map((question, index) => ({
    question,
    answer: answerValues[index]?.trim() ?? "",
  }));

  const createAnswer = pairs.find(
    (pair) =>
      pair.answer &&
      pair.question.toLowerCase().includes(CREATE_QUESTION_HINT)
  )?.answer;

  if (createAnswer) {
    return createAnswer;
  }

  const firstNonEmpty = pairs.find((pair) => pair.answer)?.answer;
  return firstNonEmpty ?? null;
}

export function answersByQuestion(
  saved: CommitmentAnswer[]
): Map<string, string> {
  return new Map(saved.map((item) => [item.question, item.answer]));
}

export function getStageCommitmentSummary(
  commitments: ParticipantCommitmentView[]
): string | null {
  for (const commitment of commitments) {
    if (commitment.commitmentSummary?.trim()) {
      return commitment.commitmentSummary.trim();
    }
  }
  return null;
}

export function mapSavedAnswersToQuestions(
  questions: string[],
  saved: CommitmentAnswer[]
): string[] {
  const byQuestion = answersByQuestion(saved);
  return questions.map((question) => byQuestion.get(question) ?? "");
}
