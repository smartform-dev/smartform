import { FormPromptStep } from "@/components/form-prompt-step";
import { prisma } from "@/lib/db";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function FormPromptPage({ params }: PageProps) {
  const form = await prisma.form.findUnique({
    where: { id: params.id },
    include: { company: true, prompt: true },
  });

  const initialPrompt = {
    ...form?.company,
    ...form?.prompt,
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <FormPromptStep formId={params.id} initialPrompt={initialPrompt} />
    </div>
  );
}
