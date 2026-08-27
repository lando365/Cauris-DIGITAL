import { PartnerForm } from '../PartnerForm';
import { createPartner } from '../actions';

export default function NewPartnerPage() {
  return (
    <div>
      <h1 className="mb-6 font-montserrat text-xl font-bold text-cauris-black">
        Nouveau partenaire
      </h1>
      <PartnerForm action={createPartner} submitLabel="Créer le partenaire" />
    </div>
  );
}
