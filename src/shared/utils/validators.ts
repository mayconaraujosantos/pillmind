// Utility functions for validation
export const isValidEmail = (email: string): boolean => {
  // Trim whitespace and check for double dots
  const trimmedEmail = email.trim();
  if (trimmedEmail !== email || trimmedEmail.includes('..')) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmedEmail);
};

export const isValidPhone = (phone: string): boolean => {
  if (!phone || phone.trim() === '') {
    return false;
  }
  // Remove all non-digit characters and check length
  // Using replace with global flag is correct for regex patterns
  // replaceAll doesn't support regex, so we use replace with global flag
  const digitsOnly = phone.replace(/\D/g, '');

  // Reject if has letters (like 'abcd567890')
  if (/[a-zA-Z]/.test(phone)) {
    return false;
  }

  // Reject if has too many hífens (like '123-456-7890-1' with 3+ hífens)
  // But allow parentheses and spaces for formatting like '(11) 9 9999-9999'
  const hífens = phone.match(/-/g);
  if (hífens && hífens.length > 2) {
    return false;
  }

  // Must have 10 or 11 digits for local numbers
  if (digitsOnly.length >= 10 && digitsOnly.length <= 11) {
    return true;
  }

  // Allow 12-13 digits only if starts with + (country code)
  if (digitsOnly.length >= 12 && digitsOnly.length <= 13) {
    return phone.trim().startsWith('+');
  }

  return false;
};
