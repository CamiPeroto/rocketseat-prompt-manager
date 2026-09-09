import type { PromptSummary } from '@/core/domain/prompts/prompt.entity';
import PromptCard from './prompt-card';

interface Props {
  prompts: PromptSummary[];
}
export default function PromptList({ prompts }: Props) {
  return (
    <ul className="space-y-2">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
        />
      ))}
    </ul>
  );
}
