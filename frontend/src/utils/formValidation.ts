export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const formValidation = (field: string, value: unknown, formData: Record<string, unknown>): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  if (field === 'email') {
    if (!value) {
      isValid = false;
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(value as string)) {
      isValid = false;
      errors.email = "Email is invalid";
    }
  }

  if (field === 'password') {
    if (!value) {
      isValid = false;
      errors.password = "Password is required";
    } else if ((value as string).length < 6) {
      isValid = false;
      errors.password = "Password must be at least 6 characters";
    }
  }

  if (field === 'password_confirmation' && formData.password !== "") {
    if (!value) {
      isValid = false;
      errors.password_confirmation = "password_confirmation is required";
    } else if ((value as string) !== formData?.password) {
      isValid = false;
      errors.password_confirmation = "Password must be at least 6 characters";
    }
  }

  return { isValid, errors };
};