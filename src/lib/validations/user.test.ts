import { describe, it, expect } from 'vitest';
import { passwordSchema, createUserSchema } from './user';

// RM-U01 : minimum 12 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial
describe('passwordSchema (RM-U01)', () => {
  it('accepte un mot de passe conforme', () => {
    const result = passwordSchema.safeParse('SolideP@ssw0rd2026');
    expect(result.success).toBe(true);
  });

  it('refuse un mot de passe de moins de 12 caractères', () => {
    const result = passwordSchema.safeParse('Sh0rt!Pwd');
    expect(result.success).toBe(false);
  });

  it('refuse un mot de passe sans majuscule', () => {
    const result = passwordSchema.safeParse('solidep@ssw0rd2026');
    expect(result.success).toBe(false);
  });

  it('refuse un mot de passe sans chiffre', () => {
    const result = passwordSchema.safeParse('SolideP@ssword');
    expect(result.success).toBe(false);
  });

  it('refuse un mot de passe sans caractère spécial', () => {
    const result = passwordSchema.safeParse('SolidePassw0rd2026');
    expect(result.success).toBe(false);
  });

  it('accepte exactement 12 caractères conformes (cas limite)', () => {
    const result = passwordSchema.safeParse('Solide1P@ss1');
    expect('Solide1P@ss1'.length).toBe(12);
    expect(result.success).toBe(true);
  });
});

describe('createUserSchema', () => {
  const base = {
    email: 'test@caurisdigital.org',
    name: 'Test User',
    role: 'EDITOR',
    password: 'SolideP@ssw0rd2026',
  };

  it('accepte une entrée valide', () => {
    expect(createUserSchema.safeParse(base).success).toBe(true);
  });

  it('refuse un email invalide', () => {
    expect(createUserSchema.safeParse({ ...base, email: 'pas-un-email' }).success).toBe(false);
  });

  it('refuse un rôle hors ADMIN/EDITOR', () => {
    expect(createUserSchema.safeParse({ ...base, role: 'SUPERADMIN' }).success).toBe(false);
  });
});
