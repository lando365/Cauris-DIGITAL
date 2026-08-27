/**
 * Petit utilitaire pour lister les audiences Resend du compte.
 *
 * Usage (depuis la racine du projet) :
 *   node scripts/list-audiences.mjs
 *
 * Le script lit la clé API depuis .env.local et affiche
 * l'ID de chaque audience à copier dans .env.local → RESEND_AUDIENCE_ID
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Resend } from 'resend';

// 1. Lecture manuelle de .env.local
let apiKey;
try {
  const envContent = readFileSync(join(process.cwd(), '.env.local'), 'utf8');
  const match = envContent.match(/^RESEND_API_KEY=(.+)$/m);
  apiKey = match?.[1]?.trim();
} catch {
  console.error('❌ Impossible de lire .env.local. Es-tu bien à la racine du projet ?');
  process.exit(1);
}

if (!apiKey || !apiKey.startsWith('re_')) {
  console.error('❌ RESEND_API_KEY introuvable ou invalide dans .env.local');
  process.exit(1);
}

// 2. Appel à l'API Resend
const resend = new Resend(apiKey);
const { data, error } = await resend.audiences.list();

if (error) {
  console.error('❌ Erreur Resend:', error);
  process.exit(1);
}

const audiences = data?.data ?? [];

if (audiences.length === 0) {
  console.log('Aucune audience trouvée.');
  console.log('Va sur https://resend.com/audiences pour en créer une.');
  process.exit(0);
}

// 3. Affichage
console.log(`\n📬 ${audiences.length} audience(s) trouvée(s) sur ton compte Resend :\n`);
audiences.forEach((a, i) => {
  console.log(`  ${i + 1}. ${a.name}`);
  console.log(`     ID : ${a.id}`);
  console.log(`     Créée le : ${new Date(a.created_at).toLocaleDateString('fr-FR')}\n`);
});

console.log("👉 Copie l'ID ci-dessus dans .env.local :");
console.log(`   RESEND_AUDIENCE_ID=${audiences[0].id}\n`);
