import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { StartupForm } from '../../StartupForm';
import { updateStartup } from '../../actions';

export default async function EditStartupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const startup = await prisma.startup.findUnique({ where: { id } });
  if (!startup) notFound();

  const action = updateStartup.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-montserrat text-xl font-bold text-cauris-black">
        Modifier « {startup.name} »
      </h1>
      <StartupForm startup={startup} action={action} submitLabel="Enregistrer" />
    </div>
  );
}
