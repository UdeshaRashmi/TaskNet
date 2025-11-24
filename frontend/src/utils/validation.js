/**
 * Validation utility functions for form inputs
 */

/**
 * Capitalize the first letter of each word in a string
 * @param {string} text - The text to capitalize
 * @returns {string} - Text with first letter of each word capitalized
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  
  return text
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

/**
 * Capitalize only the first letter of the first word
 * @param {string} text - The text to capitalize
 * @returns {string} - Text with first letter capitalized
 */
export const capitalizeFirstLetter = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Validate that first letter of each word is capitalized
 * @param {string} text - The text to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateCapitalization = (text) => {
  if (!text || text.trim() === '') return true;
  
  const words = text.trim().split(' ').filter(word => word.length > 0);
  
  return words.every(word => {
    const firstChar = word.charAt(0);
    return firstChar === firstChar.toUpperCase() && /[A-Z]/.test(firstChar);
  });
};

/**
 * Get validation error message for capitalization
 * @param {string} fieldName - The name of the field being validated
 * @returns {string} - Error message
 */
export const getCapitalizationError = (fieldName) => {
  return `${fieldName} must start with a capital letter for each word`;
};

/**
 * Auto-capitalize text as user types
 * @param {string} text - The text to process
 * @returns {string} - Auto-capitalized text
 */
export const autoCapitalize = (text) => {
  if (!text) return '';
  
  return text
    .split(' ')
    .map((word, index) => {
      if (word.length === 0) return word;
      // Capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Object with isValid and errors array
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password should contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
