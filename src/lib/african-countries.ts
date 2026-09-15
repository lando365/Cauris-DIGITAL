/**
 * Liste des pays d'Afrique (les 54 États membres de l'Union Africaine),
 * triée par ordre alphabétique, avec leur code ISO 3166-1 alpha-2.
 *
 * Utilisée dans le formulaire admin Startup : le champ "Pays" est une liste
 * déroulante limitée à ces valeurs, et le champ "Code pays (ISO)" se déduit
 * automatiquement du pays choisi (voir StartupForm.tsx).
 */
export interface AfricanCountry {
  name: string;
  code: string;
}

export const AFRICAN_COUNTRIES: AfricanCountry[] = [
  { name: 'Afrique du Sud', code: 'ZA' },
  { name: 'Algérie', code: 'DZ' },
  { name: 'Angola', code: 'AO' },
  { name: 'Bénin', code: 'BJ' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Cabo Verde', code: 'CV' },
  { name: 'Cameroun', code: 'CM' },
  { name: 'Comores', code: 'KM' },
  { name: 'Congo', code: 'CG' },
  { name: 'Congo (RDC)', code: 'CD' },
  { name: "Côte d'Ivoire", code: 'CI' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Égypte', code: 'EG' },
  { name: 'Érythrée', code: 'ER' },
  { name: 'Eswatini', code: 'SZ' },
  { name: 'Éthiopie', code: 'ET' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambie', code: 'GM' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Guinée', code: 'GN' },
  { name: 'Guinée équatoriale', code: 'GQ' },
  { name: 'Guinée-Bissau', code: 'GW' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Liberia', code: 'LR' },
  { name: 'Libye', code: 'LY' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Mali', code: 'ML' },
  { name: 'Maroc', code: 'MA' },
  { name: 'Maurice', code: 'MU' },
  { name: 'Mauritanie', code: 'MR' },
  { name: 'Mozambique', code: 'MZ' },
  { name: 'Namibie', code: 'NA' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Ouganda', code: 'UG' },
  { name: 'Rwanda', code: 'RW' },
  { name: 'Sao Tomé-et-Principe', code: 'ST' },
  { name: 'Sénégal', code: 'SN' },
  { name: 'Seychelles', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Somalie', code: 'SO' },
  { name: 'Soudan', code: 'SD' },
  { name: 'Soudan du Sud', code: 'SS' },
  { name: 'Tanzanie', code: 'TZ' },
  { name: 'Tchad', code: 'TD' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tunisie', code: 'TN' },
  { name: 'Zambie', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' },
];

/** Retrouve le code ISO d'un pays d'Afrique à partir de son nom exact. */
export function africanCountryCode(name: string): string | undefined {
  return AFRICAN_COUNTRIES.find((c) => c.name === name)?.code;
}
