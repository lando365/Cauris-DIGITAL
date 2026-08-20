import { StartupForm } from '../StartupForm';
import { createStartup } from '../actions';

export default function NewStartupPage() {
  return (
    <div>
      <h1 className="mb-6 font-montserrat text-xl font-bold text-cauris-black">Nouvelle startup</h1>
      <StartupForm action={createStartup} submitLabel="Créer la startup" />
    </div>
  );
}
