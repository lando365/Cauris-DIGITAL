import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PartnerForm } from '../../PartnerForm';
import { updatePartner } from '../../actions';

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const partner = await prisma.partner.findUnique({ where: { id } });
  if (!partner) notFound();

  const action = updatePartner.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-montserrat text-xl font-bold text-cauris-black">
        Modifier « {partner.name} »
      </h1>
      <PartnerForm partner={partner} action={action} submitLabel="Enregistrer" />
    </div>
  );
}
