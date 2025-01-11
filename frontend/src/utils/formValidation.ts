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

  // if (field === 'phone') {
  //   // if (!value) {
  //   //   isValid = false;
  //   //   errors.email = "Email is required";
  //   // } else
  //    if (!/^(?:06)(\d){8}$/.test(value as string)) {
  //     isValid = false;
  //     errors.email = "Email is invalid";
  //   }
  // }

  if (field === 'password') {
    if (!value) {
      isValid = false;
      errors.password = "Password is required";
    } else if (!/.{8,}$/.test(value as string)) { // (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$&()\-`.+,/"])
      isValid = false;
      errors.password = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
  }

  if (field === 'password_confirmation' && formData.password !== "") {
    if (!value && ((value as string) !== formData?.password)) {
      isValid = false;
      errors.password_confirmation = "Passwords do not match. Please try again.";
    }
  }

  return { isValid, errors };
};