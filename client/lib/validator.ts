// lib/validators.ts

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates crypto wallet addresses based on currency type.
 */
export function validateCryptoAddress(address: string, type: 'BTC' | 'ETH' | 'USDT' | 'TRX'): ValidationResult {
  if (!address || !address.trim()) {
    return { isValid: false, error: 'Wallet address is required.' };
  }

  const cleanAddress = address.trim();

  switch (type) {
    case 'ETH':
      // Ethereum addresses start with 0x followed by 40 hex characters
      if (!/^0x[a-fA-F0-9]{40}$/.test(cleanAddress)) {
        return { isValid: false, error: 'Invalid Ethereum address. Must start with 0x followed by 40 hex characters.' };
      }
      return { isValid: true };

    case 'BTC':
      // Legacy (1...), SegWit (3...), and Native SegWit (bc1...)
      if (!/^(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-hj-np-z0-9]{25,39}|bc1p[a-zA-hj-np-z0-9]{25,59})$/.test(cleanAddress)) {
        return { isValid: false, error: 'Invalid Bitcoin address format.' };
      }
      return { isValid: true };

    case 'TRX':
      // TRON base58 addresses start with 'T' and are 34 characters long
      if (!/^T[a-km-zA-HJ-NP-Z1-9]{33}$/.test(cleanAddress)) {
        return { isValid: false, error: 'Invalid TRON address. Must start with "T" and be 34 characters long.' };
      }
      return { isValid: true };

    case 'USDT':
      // USDT can be ERC-20 (0x...) or TRC-20 (T...)
      const isEvm = /^0x[a-fA-F0-9]{40}$/.test(cleanAddress);
      const isTron = /^T[a-km-zA-HJ-NP-Z1-9]{33}$/.test(cleanAddress);
      if (!isEvm && !isTron) {
        return { isValid: false, error: 'Invalid USDT address. Must be a valid ERC-20 (0x...) or TRC-20 (T...) address.' };
      }
      return { isValid: true };

    default:
      return { isValid: false, error: 'Unsupported crypto payment type.' };
  }
}

/**
 * Validates Bank Account / IBAN numbers.
 */
export function validateBankAccount(accountNumber: string): ValidationResult {
  if (!accountNumber || !accountNumber.trim()) {
    return { isValid: false, error: 'Account number is required.' };
  }

  const cleanAcc = accountNumber.replace(/\s+/g, '').toUpperCase();

  // 1. Check if it's an IBAN format (2 letters + 2 digits + up to 30 alphanumeric)
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/;
  if (ibanRegex.test(cleanAcc)) {
    return validateIBANChecksum(cleanAcc);
  }

  // 2. Standard local account numbers (usually 8 to 20 digits)
  const standardAccRegex = /^[0-9]{8,20}$/;
  if (!standardAccRegex.test(cleanAcc)) {
    return { isValid: false, error: 'Account number must be 8-20 numeric digits or a valid IBAN.' };
  }

  return { isValid: true };
}

/**
 * Modulo 97 IBAN checksum validation (ISO 13616 standard)
 */
function validateIBANChecksum(iban: string): ValidationResult {
  // Move the first 4 characters to the end
  const rearranged = iban.slice(4) + iban.slice(0, 4);

  // Convert letters to numbers (A = 10, B = 11, ..., Z = 35)
  const numericStr = rearranged
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      return code >= 65 && code <= 90 ? (code - 55).toString() : char;
    })
    .join('');

  // Perform BigInt mod-97 check
  let remainder = 0;
  for (let i = 0; i < numericStr.length; i += 7) {
    const block = remainder.toString() + numericStr.substring(i, i + 7);
    remainder = parseInt(block, 10) % 97;
  }

  if (remainder !== 1) {
    return { isValid: false, error: 'Invalid IBAN checksum.' };
  }

  return { isValid: true };
}