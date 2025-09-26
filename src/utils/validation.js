/**
 * Comprehensive Validation Utility
 * Provides robust validation rules and error handling for forms
 */

export class ValidationError extends Error {
  constructor(field, message, code = null) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
    this.code = code
  }
}

export const ValidationRules = {
  // Personal Information
  required: (value, fieldName) => {
    if (!value || String(value).trim() === '') {
      throw new ValidationError(fieldName, `${fieldName} is required`)
    }
    return true
  },

  minLength: (value, min, fieldName) => {
    if (String(value).length < min) {
      throw new ValidationError(fieldName, `${fieldName} must be at least ${min} characters long`)
    }
    return true
  },

  maxLength: (value, max, fieldName) => {
    if (String(value).length > max) {
      throw new ValidationError(fieldName, `${fieldName} cannot exceed ${max} characters`)
    }
    return true
  },

  email: (value, fieldName = 'Email') => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!emailRegex.test(value)) {
      throw new ValidationError(fieldName, 'Please enter a valid email address')
    }
    return true
  },

  phone: (value, fieldName = 'Phone') => {
    const cleanPhone = String(value).replace(/[\s\-\(\)\+]/g, '')
    if (cleanPhone.length < 10) {
      throw new ValidationError(fieldName, 'Phone number must be at least 10 digits')
    }
    if (cleanPhone.length > 15) {
      throw new ValidationError(fieldName, 'Phone number cannot exceed 15 digits')
    }
    if (!/^[0-9]+$/.test(cleanPhone)) {
      throw new ValidationError(fieldName, 'Phone number must contain only numbers')
    }
    return true
  },

  // Address Validation
  zipCode: (value, country, fieldName = 'ZIP/Postal Code') => {
    const patterns = {
      US: /^\d{5}(-\d{4})?$/,
      CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
      GB: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
      DE: /^\d{5}$/,
      FR: /^\d{5}$/,
      AU: /^\d{4}$/,
      JP: /^\d{3}-\d{4}$/,
      IN: /^\d{6}$/,
      BR: /^\d{5}-\d{3}$/,
      CN: /^\d{6}$/
    }
    
    const pattern = patterns[country]
    if (pattern && !pattern.test(value)) {
      throw new ValidationError(fieldName, `Please enter a valid ${fieldName} for ${country}`)
    } else if (!pattern && value.length < 3) {
      throw new ValidationError(fieldName, `${fieldName} must be at least 3 characters`)
    }
    return true
  },

  // Payment Validation
  cardNumber: (value, fieldName = 'Card Number') => {
    const cardNumberOnly = String(value).replace(/\s/g, '')
    
    if (cardNumberOnly.length < 13 || cardNumberOnly.length > 19) {
      throw new ValidationError(fieldName, 'Card number must be 13-19 digits')
    }
    
    if (!ValidationRules.luhnCheck(cardNumberOnly)) {
      throw new ValidationError(fieldName, 'Please enter a valid card number')
    }
    
    return true
  },

  luhnCheck: (cardNumber) => {
    let sum = 0
    let isEven = false
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10)
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      sum += digit
      isEven = !isEven
    }
    return sum % 10 === 0
  },

  expiryDate: (value, fieldName = 'Expiry Date') => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
    if (!expiryRegex.test(value)) {
      throw new ValidationError(fieldName, 'Please enter date in MM/YY format')
    }
    
    const [month, year] = value.split('/')
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
    const now = new Date()
    
    if (expiry < now) {
      throw new ValidationError(fieldName, 'Card has expired')
    }
    
    return true
  },

  cvc: (value, fieldName = 'CVC') => {
    if (!/^\d{3,4}$/.test(value)) {
      throw new ValidationError(fieldName, 'CVC must be 3-4 digits')
    }
    return true
  },

  // Bank Account Validation
  accountNumber: (value, country, fieldName = 'Account Number') => {
    const cleaned = String(value).replace(/[^0-9]/g, '')
    
    const requirements = {
      US: { min: 4, max: 17 },
      CA: { min: 7, max: 12 },
      GB: { min: 8, max: 8 },
      DE: { min: 10, max: 10 },
      FR: { min: 10, max: 11 },
      AU: { min: 6, max: 10 },
      IN: { min: 9, max: 18 },
      default: { min: 6, max: 20 }
    }
    
    const req = requirements[country] || requirements.default
    if (cleaned.length < req.min || cleaned.length > req.max) {
      throw new ValidationError(fieldName, `Account number must be ${req.min}-${req.max} digits for ${country || 'your country'}`)
    }
    
    return true
  },

  routingNumber: (value, country, fieldName = 'Routing Number') => {
    const cleaned = String(value).replace(/[^0-9]/g, '')
    
    switch (country) {
      case 'US':
        if (cleaned.length !== 9) {
          throw new ValidationError(fieldName, 'US routing number must be 9 digits')
        }
        if (!ValidationRules.abaRoutingCheck(cleaned)) {
          throw new ValidationError(fieldName, 'Invalid US routing number')
        }
        break
      case 'CA':
        if (cleaned.length !== 9) {
          throw new ValidationError(fieldName, 'Canadian routing number must be 9 digits')
        }
        break
      case 'GB':
        if (cleaned.length !== 6) {
          throw new ValidationError(fieldName, 'UK sort code must be 6 digits')
        }
        break
      default:
        if (cleaned.length < 6 || cleaned.length > 11) {
          throw new ValidationError(fieldName, 'Routing number must be 6-11 digits')
        }
    }
    
    return true
  },

  abaRoutingCheck: (routingNumber) => {
    if (routingNumber.length !== 9) return false
    
    const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1]
    let sum = 0
    
    for (let i = 0; i < 9; i++) {
      sum += parseInt(routingNumber[i]) * weights[i]
    }
    
    return sum % 10 === 0
  },

  iban: (value, fieldName = 'IBAN') => {
    const cleaned = String(value).replace(/[^A-Z0-9]/gi, '').toUpperCase()
    
    if (cleaned.length < 15 || cleaned.length > 34) {
      throw new ValidationError(fieldName, 'IBAN must be 15-34 characters')
    }
    
    // Move first 4 characters to end
    const rearranged = cleaned.slice(4) + cleaned.slice(0, 4)
    
    // Replace letters with numbers (A=10, B=11, etc.)
    const numeric = rearranged.replace(/[A-Z]/g, (char) => {
      return (char.charCodeAt(0) - 55).toString()
    })
    
    // Check mod 97
    if (ValidationRules.mod97(numeric) !== 1) {
      throw new ValidationError(fieldName, 'Please enter a valid IBAN')
    }
    
    return true
  },

  mod97: (str) => {
    let remainder = 0
    for (let i = 0; i < str.length; i++) {
      remainder = (remainder * 10 + parseInt(str[i])) % 97
    }
    return remainder
  },

  // Enhanced name validation
  name: (value, fieldName) => {
    if (!/^[a-zA-Z\s'-\.]+$/.test(value)) {
      throw new ValidationError(fieldName, `${fieldName} can only contain letters, spaces, apostrophes, and hyphens`)
    }
    if (value.trim().length < 2) {
      throw new ValidationError(fieldName, `${fieldName} must be at least 2 characters long`)
    }
    if (value.trim().length > 50) {
      throw new ValidationError(fieldName, `${fieldName} cannot exceed 50 characters`)
    }
    return true
  },

  // Enhanced phone validation with international support
  internationalPhone: (value, fieldName = 'Phone') => {
    // Remove all non-digit characters except + at the beginning
    const cleaned = value.replace(/[^\d+]/g, '')

    // Check if it starts with + and has valid format
    if (cleaned.startsWith('+')) {
      if (cleaned.length < 8 || cleaned.length > 16) {
        throw new ValidationError(fieldName, 'International phone number must be 8-16 digits including country code')
      }
    } else {
      // Domestic number
      if (cleaned.length < 10 || cleaned.length > 15) {
        throw new ValidationError(fieldName, 'Phone number must be 10-15 digits')
      }
    }

    if (!/^\+?[0-9]+$/.test(cleaned)) {
      throw new ValidationError(fieldName, 'Phone number must contain only numbers and optional + prefix')
    }

    return true
  },

  // Enhanced address validation
  address: (value, fieldName) => {
    if (value.trim().length < 5) {
      throw new ValidationError(fieldName, `${fieldName} must be at least 5 characters long`)
    }
    if (value.trim().length > 100) {
      throw new ValidationError(fieldName, `${fieldName} cannot exceed 100 characters`)
    }
    // Check for at least one number (house/building number)
    if (!/\d/.test(value)) {
      throw new ValidationError(fieldName, `${fieldName} must include a house or building number`)
    }
    return true
  },

  // Bank name validation
  bankName: (value, fieldName = 'Bank Name') => {
    if (value.trim().length < 3) {
      throw new ValidationError(fieldName, 'Bank name must be at least 3 characters long')
    }
    if (value.trim().length > 100) {
      throw new ValidationError(fieldName, 'Bank name cannot exceed 100 characters')
    }
    // Allow letters, numbers, spaces, and common bank punctuation
    if (!/^[a-zA-Z0-9\s&.-]+$/.test(value)) {
      throw new ValidationError(fieldName, 'Bank name contains invalid characters')
    }
    return true
  },

  // SWIFT/BIC code validation
  swiftCode: (value, fieldName = 'SWIFT Code') => {
    if (!value || value.trim() === '') return true // Optional field

    const cleaned = value.replace(/\s/g, '').toUpperCase()

    // SWIFT codes are 8 or 11 characters
    if (cleaned.length !== 8 && cleaned.length !== 11) {
      throw new ValidationError(fieldName, 'SWIFT code must be 8 or 11 characters')
    }

    // Format: AAAA BB CC DDD (Bank Code + Country + Location + Branch)
    if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleaned)) {
      throw new ValidationError(fieldName, 'Please enter a valid SWIFT/BIC code')
    }

    return true
  },

  // Card holder name validation
  cardHolderName: (value, fieldName = 'Card Holder Name') => {
    if (value.trim().length < 3) {
      throw new ValidationError(fieldName, 'Card holder name must be at least 3 characters long')
    }
    if (value.trim().length > 50) {
      throw new ValidationError(fieldName, 'Card holder name cannot exceed 50 characters')
    }
    // Allow letters, spaces, apostrophes, hyphens, and periods
    if (!/^[a-zA-Z\s'-\.]+$/.test(value)) {
      throw new ValidationError(fieldName, 'Card holder name can only contain letters and common punctuation')
    }
    return true
  },

  // Enhanced country validation
  country: (value, fieldName = 'Country') => {
    const validCountries = ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'JP', 'IN', 'BR', 'CN']
    if (!validCountries.includes(value)) {
      throw new ValidationError(fieldName, 'Please select a valid country')
    }
    return true
  }
}

export class FormValidator {
  constructor() {
    this.errors = new Map()
    this.touched = new Set()
    this.isValid = true
  }

  // Validate a single field
  validateField(fieldName, value, rules = []) {
    this.touched.add(fieldName)
    this.errors.delete(fieldName)

    try {
      for (const rule of rules) {
        if (typeof rule === 'function') {
          rule(value, fieldName)
        } else if (typeof rule === 'object') {
          const { validator, ...params } = rule
          validator(value, ...Object.values(params), fieldName)
        }
      }
      return { isValid: true, error: null }
    } catch (error) {
      if (error instanceof ValidationError) {
        this.errors.set(fieldName, error.message)
        return { isValid: false, error: error.message }
      }
      throw error
    }
  }

  // Validate all fields
  validateAll(formData, validationConfig) {
    this.errors.clear()
    
    for (const [fieldName, rules] of Object.entries(validationConfig)) {
      const value = formData[fieldName]
      this.validateField(fieldName, value, rules)
    }

    this.isValid = this.errors.size === 0
    return this.isValid
  }

  // Get error for a specific field
  getError(fieldName) {
    return this.errors.get(fieldName) || null
  }

  // Get all errors
  getAllErrors() {
    return Object.fromEntries(this.errors)
  }

  // Check if field has been touched
  isTouched(fieldName) {
    return this.touched.has(fieldName)
  }

  // Check if field is valid
  isFieldValid(fieldName) {
    return !this.errors.has(fieldName)
  }

  // Clear errors
  clearErrors() {
    this.errors.clear()
    this.isValid = true
  }

  // Clear specific error
  clearError(fieldName) {
    this.errors.delete(fieldName)
    this.isValid = this.errors.size === 0
  }

  // Reset validator
  reset() {
    this.errors.clear()
    this.touched.clear()
    this.isValid = true
  }
}

// Predefined validation configurations
export const CheckoutValidationConfig = {
  // Personal Information
  firstname: [
    ValidationRules.required,
    ValidationRules.name
  ],
  lastname: [
    ValidationRules.required,
    ValidationRules.name
  ],
  email: [
    ValidationRules.required,
    ValidationRules.email
  ],
  phone: [
    ValidationRules.required,
    ValidationRules.internationalPhone
  ],

  // Address Information
  address1: [
    ValidationRules.required,
    ValidationRules.address
  ],
  city: [
    ValidationRules.required,
    ValidationRules.name
  ],
  state: [
    ValidationRules.required,
    ValidationRules.name
  ],
  country: [
    ValidationRules.required,
    ValidationRules.country
  ],
  
  // Dynamic validations (these need to be created at runtime)
  createZipCodeValidation: (country) => [
    ValidationRules.required,
    (value) => ValidationRules.zipCode(value, country)
  ],
  
  // Card validation
  createCardValidation: () => ({
    chn: [
      ValidationRules.required,
      ValidationRules.cardHolderName
    ],
    cardnumber: [
      ValidationRules.required,
      ValidationRules.cardNumber
    ],
    edate: [
      ValidationRules.required,
      ValidationRules.expiryDate
    ],
    code: [
      ValidationRules.required,
      ValidationRules.cvc
    ]
  }),

  // Bank account validation
  createBankValidation: (country) => ({
    bankName: [
      ValidationRules.required,
      ValidationRules.bankName
    ],
    accountHolderName: [
      ValidationRules.required,
      ValidationRules.name
    ],
    accountNumber: [
      ValidationRules.required,
      (value) => ValidationRules.accountNumber(value, country)
    ],
    routingNumber: [
      ValidationRules.required,
      (value) => ValidationRules.routingNumber(value, country)
    ],
    swiftCode: [
      ValidationRules.swiftCode
    ]
  }),

  // Wire transfer validation
  createWireTransferValidation: () => ({
    bankName: [
      ValidationRules.required,
      ValidationRules.bankName
    ],
    accountHolderName: [
      ValidationRules.required,
      ValidationRules.name
    ],
    iban: [
      ValidationRules.required,
      ValidationRules.iban
    ],
    bankAddress: [
      ValidationRules.required,
      ValidationRules.address
    ],
    swiftCode: [
      ValidationRules.swiftCode
    ]
  })
}

// Utility functions for real-time validation feedback
export const ValidationHelpers = {
  // Get field validation class
  getFieldClass: (fieldName, validator, hasError = false) => {
    if (!validator.isTouched(fieldName)) return ''
    
    if (hasError || !validator.isFieldValid(fieldName)) {
      return 'error'
    } else if (validator.isFieldValid(fieldName)) {
      return 'success'
    }
    
    return ''
  },

  // Get validation icon
  getValidationIcon: (fieldName, validator) => {
    if (!validator.isTouched(fieldName)) return null
    
    if (!validator.isFieldValid(fieldName)) {
      return 'bx-error-circle'
    } else if (validator.isFieldValid(fieldName)) {
      return 'bx-check-circle'
    }
    
    return null
  },

  // Format error message for display
  formatErrorMessage: (error) => {
    if (!error) return ''
    return error.charAt(0).toUpperCase() + error.slice(1)
  },

  // Debounce validation for real-time feedback
  debounceValidation: (validator, fieldName, value, rules, delay = 300) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = validator.validateField(fieldName, value, rules)
        resolve(result)
      }, delay)
    })
  },

  // Enhanced card type detection
  detectCardType: (cardNumber) => {
    const patterns = {
      visa: /^4[0-9]{0,15}$/,
      mastercard: /^(5[1-5][0-9]{0,14}|2[2-7][0-9]{0,14})$/,
      amex: /^3[47][0-9]{0,13}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{0,12}$/,
      diners: /^3[0689][0-9]{0,11}$/,
      jcb: /^(?:2131|1800|35\d{0,4})\d{0,11}$/,
      unionpay: /^(62|88)[0-9]{0,14}$/
    }

    const cleaned = cardNumber.replace(/\s/g, '')
    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(cleaned)) {
        return type
      }
    }
    return 'unknown'
  },

  // Format card number with spaces
  formatCardNumber: (value) => {
    const cleaned = value.replace(/\s/g, '').replace(/[^0-9]/gi, '')
    let formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned

    // Limit to 19 characters (16 digits + 3 spaces)
    if (formatted.length > 19) {
      formatted = formatted.substring(0, 19)
    }

    return formatted
  },

  // Format expiry date
  formatExpiryDate: (value) => {
    let cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
    }
    return cleaned
  },

  // Format CVC
  formatCVC: (value) => {
    return value.replace(/[^0-9]/gi, '').substring(0, 4)
  },

  // Format IBAN
  formatIBAN: (value) => {
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase()
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.substring(0, 42) // Max IBAN length with spaces
  },

  // Format postal/ZIP code based on country
  formatZipCode: (value, country) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()

    switch (country) {
      case 'CA':
        // Canadian postal code: A1A 1A1
        if (cleaned.length <= 6) {
          return cleaned.replace(/(\w{3})(\w{1,3})/, '$1 $2')
        }
        break
      case 'GB':
        // UK postal code: SW1A 1AA
        if (cleaned.length <= 7) {
          return cleaned.replace(/(\w{2,4})(\w{0,3})/, '$1 $2').trim()
        }
        break
      case 'US':
        // US ZIP: 12345 or 12345-6789
        const numbers = value.replace(/[^0-9]/g, '')
        if (numbers.length <= 5) {
          return numbers
        } else if (numbers.length <= 9) {
          return numbers.substring(0, 5) + '-' + numbers.substring(5)
        }
        break
      default:
        return value
    }

    return value
  },

  // Validate credit card using Luhn algorithm
  validateCreditCard: (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '')

    if (!/^[0-9]+$/.test(cleaned)) return false
    if (cleaned.length < 13 || cleaned.length > 19) return false

    return ValidationRules.luhnCheck(cleaned)
  },

  // Get country-specific validation messages
  getCountryValidationMessage: (country, field) => {
    const messages = {
      US: {
        zipCode: 'Please enter a valid ZIP code (12345 or 12345-6789)',
        routingNumber: 'Please enter a valid 9-digit routing number',
        accountNumber: 'Please enter a valid account number (4-17 digits)'
      },
      CA: {
        zipCode: 'Please enter a valid postal code (A1A 1A1)',
        routingNumber: 'Please enter a valid 9-digit transit number',
        accountNumber: 'Please enter a valid account number (7-12 digits)'
      },
      GB: {
        zipCode: 'Please enter a valid postcode (SW1A 1AA)',
        routingNumber: 'Please enter a valid 6-digit sort code',
        accountNumber: 'Please enter a valid 8-digit account number'
      },
      DE: {
        zipCode: 'Please enter a valid postal code (12345)',
        routingNumber: 'Please enter a valid BLZ (8 digits)',
        accountNumber: 'Please enter a valid account number (10 digits)'
      },
      FR: {
        zipCode: 'Please enter a valid postal code (12345)',
        routingNumber: 'Please enter a valid bank code',
        accountNumber: 'Please enter a valid account number (10-11 digits)'
      }
    }

    return messages[country]?.[field] || `Please enter a valid ${field}`
  }
}

export default {
  ValidationError,
  ValidationRules,
  FormValidator,
  CheckoutValidationConfig,
  ValidationHelpers
}
