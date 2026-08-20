import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PartnerForm } from '../../PartnerForm';
import { updatePartner } from '../../actions';

export default async function EditPartnerPage({ params }: { params: { id: string } }) {
  const partner = await prisma.partner.findUnique({ where: { id: params.id } });
  if (!partner) notFound();

  const action = updatePartner.bind(null, params.id);

  return (
    <div>
      <h1 className="mb-6 font-montserrat text-xl font-bold text-cauris-black">
        Modifier « {partner.name} »
      </h1>
      <PartnerForm partner={partner} action={action} submitLabel="Enregistrer" />
    </div>
  );
}
