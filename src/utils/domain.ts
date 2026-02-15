/**
 * Domain utilities for multi-tenant SaaS
 * Handles domain validation and normalization
 */

/**
 * Normalize domain to standard format
 * Removes protocol, www, and paths
 * @param domain - Raw domain input
 * @returns Normalized domain (e.g., "example.com")
 */
export function normalizeDomain(domain: string): string {
  // each split[...] may return undefined under noUncheckedIndexedAccess
  const step1 =
    domain
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '') // Remove protocol and www
      .split('/')[0] || '';
  const step2 = step1.split('?')[0] || '';
  const step3 = step2.split('#')[0] || '';
  return step3.trim();
}

/**
 * Validate domain format
 * @param domain - Domain to validate
 * @returns True if valid domain format
 */
export function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/;
  return domainRegex.test(domain);
}

/**
 * Full domain validation with normalization
 * @param rawDomain - Raw domain input from user
 * @returns Validation result with normalized domain or error
 */
export function validateAndNormalizeDomain(rawDomain: string): {
  isValid: boolean;
  normalizedDomain?: string;
  error?: string;
} {
  if (!rawDomain || rawDomain.trim() === '') {
    return {
      isValid: false,
      error: 'Domain is required',
    };
  }

  const normalized = normalizeDomain(rawDomain);

  if (!isValidDomain(normalized)) {
    return {
      isValid: false,
      error:
        'Invalid domain format. Use format: example.com (no http, www, or paths)',
    };
  }

  // Check for common mistakes
  if (normalized.includes('localhost')) {
    return {
      isValid: false,
      error: 'Localhost is not allowed for production use',
    };
  }

  if (normalized.includes('127.0.0.1')) {
    return {
      isValid: false,
      error: 'IP addresses are not allowed',
    };
  }

  return {
    isValid: true,
    normalizedDomain: normalized,
  };
}

/**
 * Check if origin/referer matches allowed domains
 * @param origin - Request origin or referer
 * @param allowedDomains - Array of allowed domains
 * @returns True if origin is allowed
 */
export function isOriginAllowed(
  origin: string | null,
  allowedDomains: string[],
): boolean {
  if (!origin) return false;

  const normalized = normalizeDomain(origin);
  return allowedDomains.includes(normalized);
}

/**
 * Extract domain from URL
 * @param url - Full URL
 * @returns Normalized domain
 */
export function extractDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return normalizeDomain(urlObj.hostname);
  } catch {
    return normalizeDomain(url);
  }
}

/**
 * Add subdomain to allowed domains list
 * @param baseDomain - Base domain
 * @param subdomain - Subdomain to add
 * @returns Full subdomain
 */
export function createSubdomain(baseDomain: string, subdomain: string): string {
  const normalized = normalizeDomain(baseDomain);
  return `${subdomain}.${normalized}`;
}
