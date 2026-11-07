export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  // At least 6 chars, one upper, one lower, one number, one special char
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
}

export function validateRequired(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function validateMinLength(value, min) {
  return String(value).trim().length >= min;
}

export function validateMaxLength(value, max) {
  return String(value).trim().length <= max;
}

