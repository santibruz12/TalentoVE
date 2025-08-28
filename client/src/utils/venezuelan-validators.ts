/**
 * Venezuelan ID (Cédula) validation utilities
 * Supports V-12345678 and E-12345678 formats
 */

export type CedulaType = 'V' | 'E';

export interface ParsedCedula {
  type: CedulaType;
  number: string;
  isValid: boolean;
  formatted: string;
}

/**
 * Validates Venezuelan cédula format and structure
 */
export function validateVenezuelanCedula(cedula: string): ParsedCedula {
  const result: ParsedCedula = {
    type: 'V',
    number: '',
    isValid: false,
    formatted: ''
  };

  if (!cedula) {
    return result;
  }

  // Remove spaces and convert to uppercase
  const cleanCedula = cedula.replace(/\s/g, '').toUpperCase();

  // Check format: V-12345678 or E-12345678
  const cedulaRegex = /^([VE])-?(\d{6,8})$/;
  const match = cleanCedula.match(cedulaRegex);

  if (!match) {
    return result;
  }

  const [, type, number] = match;
  
  // Validate number length (6-8 digits)
  if (number.length < 6 || number.length > 8) {
    return result;
  }

  // Check for valid type
  if (type !== 'V' && type !== 'E') {
    return result;
  }

  result.type = type as CedulaType;
  result.number = number;
  result.isValid = true;
  result.formatted = `${type}-${number}`;

  return result;
}

/**
 * Formats a Venezuelan cédula to standard format
 */
export function formatVenezuelanCedula(cedula: string): string {
  const parsed = validateVenezuelanCedula(cedula);
  return parsed.isValid ? parsed.formatted : cedula;
}

/**
 * Gets the nationality description from cédula type
 */
export function getCedulaNationality(type: CedulaType): string {
  return type === 'V' ? 'Venezolano' : 'Extranjero';
}

/**
 * Extracts just the number part from a cédula
 */
export function getCedulaNumber(cedula: string): string {
  const parsed = validateVenezuelanCedula(cedula);
  return parsed.isValid ? parsed.number : '';
}

/**
 * Generates a sample cédula for testing (not for production use)
 */
export function generateSampleCedula(type: CedulaType = 'V'): string {
  const randomNumber = Math.floor(Math.random() * 90000000) + 10000000;
  return `${type}-${randomNumber}`;
}

/**
 * Simple cédula validation function used by form validation
 */
export function validarCedula(cedula: string): boolean {
  const result = validateVenezuelanCedula(cedula);
  return result.isValid;
}