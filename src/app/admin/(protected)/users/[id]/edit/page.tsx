import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdminUser } from '@/lib/require-admin';
import { updateUser } from '../../actions';
import { EditUserForm } from './EditUserForm';
import { ResetPasswordButton } from './ResetPasswordButton';

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const currentUser = await requireAdminUser('ADMIN'); // RM-U03

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) notFound();

  const action = updateUser.bind(null, params.id);
  const isSelf = user.id === currentUser.id;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-6 font-montserrat text-xl font-bold text-cauris-black">
          Modifier « {user.name} »
        </h1>
        <EditUserForm user={user} isSelf={isSelf} action={action} />
      </div>

      <div className="max-w-md border-t border-gray-200 pt-6">
        <h2 className="mb-3 font-montserrat text-sm font-bold text-cauris-black">
          Réinitialisation du mot de passe
        </h2>
        <ResetPasswordButton userId={user.id} />
      </div>
    </div>
  );
}
