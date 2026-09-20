import { describe, it, expect } from 'vitest';
import { detectFileType } from './file-signature';

const bytes = (...values: number[]) => new Uint8Array(values);
const text = (value: string) => new TextEncoder().encode(value);

describe('detectFileType (magic bytes)', () => {
  it('reconnaît JPEG, PNG, WebP et PDF', () => {
    expect(detectFileType(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe('image/jpeg');
    expect(detectFileType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toBe('image/png');
    expect(detectFileType(bytes(0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x45, 0x42, 0x50))).toBe(
      'image/webp'
    );
    expect(detectFileType(text('%PDF-1.7 contenu'))).toBe('application/pdf');
  });

  it('reconnaît un SVG sain', () => {
    expect(detectFileType(text('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))).toBe(
      'image/svg+xml'
    );
  });

  it('refuse un SVG avec script, gestionnaire d’événement ou URL javascript:', () => {
    expect(detectFileType(text('<svg><script>alert(1)</script></svg>'))).toBeNull();
    expect(detectFileType(text('<svg onload="alert(1)"></svg>'))).toBeNull();
    expect(detectFileType(text('<svg><a href="javascript:alert(1)"/></svg>'))).toBeNull();
  });

  it('refuse un exécutable, du PHP, un GIF, un RIFF non WebP et un contenu vide', () => {
    expect(detectFileType(text('MZ fake executable content'))).toBeNull();
    expect(detectFileType(text('<?php echo 1; ?>'))).toBeNull();
    expect(detectFileType(text('GIF89a'))).toBeNull();
    expect(
      detectFileType(bytes(0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x41, 0x56, 0x45))
    ).toBeNull();
    expect(detectFileType(new Uint8Array(0))).toBeNull();
  });
});
