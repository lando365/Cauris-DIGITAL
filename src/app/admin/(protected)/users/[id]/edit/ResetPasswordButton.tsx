'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { resetUserPassword } from '../../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-cauris-black hover:bg-gray-50 disabled:opacity-60"
    >
      {pending ? '…' : 'Réinitialiser le mot de passe'}
    </button>
  );
}

export function ResetPasswordButton({ userId }: { userId: string }) {
  const action = resetUserPassword.bind(null, userId);
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction} className="space-y-2">
      <SubmitButton />
      {state?.newPassword && (
        <div className="rounded-md border border-cauris-orange bg-cauris-cream p-3 text-sm">
          <p className="font-medium text-cauris-black">Nouveau mot de passe (affiché une seule fois) :</p>
          <code className="mt-1 block break-all">{state.newPassword}</code>
        </div>
      )}
    </form>
  );
}
