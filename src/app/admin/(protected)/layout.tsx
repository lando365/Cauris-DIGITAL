import Link from 'next/link';
import { requireAdminUser } from '@/lib/require-admin';
import { logoutAction } from './actions';

const NAV_ITEMS = [
  { label: 'Tableau de bord', href: '/admin' },
  { label: 'Startups', href: '/admin/startups' },
  { label: 'Articles', href: '/admin/articles' },
  { label: 'Événements', href: '/admin/events' },
  { label: 'Partenaires', href: '/admin/partners' },
  { label: 'Messages', href: '/admin/messages' },
  { label: 'Newsletter', href: '/admin/subscribers' },
  { label: 'Utilisateurs', href: '/admin/users' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminUser();

  return (
    <div className="flex min-h-screen bg-cauris-gray-bg">
      <aside className="w-56 shrink-0 bg-cauris-black text-white">
        <div className="border-b border-white/10 px-4 py-5">
          <p className="font-montserrat text-sm font-bold">CAURIS DIGITAL</p>
          <p className="text-xs text-white/60">Admin</p>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
          <div className="text-sm text-cauris-gray-text">
            {user.name} <span className="text-cauris-gray-secondary">({user.role})</span>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="text-sm text-cauris-orange hover:underline">
              Déconnexion
            </button>
          </form>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
