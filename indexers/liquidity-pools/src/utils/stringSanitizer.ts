import validator from 'validator';

export class StringSanitizer {
  static sanitizeString(input: string): string {
    if (!input || typeof input !== 'string') return input;

    return validator
      .escape(input) // Escapes HTML entities
      .trim()
      .substring(0, 255);
  }
}
