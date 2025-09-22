// lib/utils/password.ts

export interface PasswordStrengthResult {
  score: number; // 0-5 scale
  percentage: number; // 0-100 percentage
  strength: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong";
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

export function checkPasswordStrength(
  password: string
): PasswordStrengthResult {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;
  const percentage = (score / 5) * 100;

  let strength: PasswordStrengthResult["strength"];
  if (score === 0) strength = "Very Weak";
  else if (score <= 2) strength = "Weak";
  else if (score === 3) strength = "Fair";
  else if (score === 4) strength = "Good";
  else strength = "Strong";

  return {
    score,
    percentage,
    strength,
    requirements,
  };
}

export function isPasswordStrong(password: string): boolean {
  const result = checkPasswordStrength(password);
  return result.score === 5;
}

export function getPasswordValidationErrors(password: string): string[] {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return errors;
}

// Helper function to get user-friendly password requirement messages for toasts
export function getPasswordRequirementMessages(): { [key: string]: string } {
  return {
    minLength: "Password needs at least 8 characters",
    uppercase: "Password needs an uppercase letter (A-Z)",
    lowercase: "Password needs a lowercase letter (a-z)",
    number: "Password needs a number (0-9)",
    specialChar: "Password needs a special character (!@#$%^&*)",
  };
}
