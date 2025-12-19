export interface ValidationResult<T> {
  isValid: boolean;
  FormError: Partial<Record<keyof T, string>>;
}

export const formValidation = <T extends object>(
  field: keyof T,
  value: unknown,
  formData: T
): ValidationResult<T> => {
  const passwordReg = /.{8,}$/
  // /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$&()\-`.+,/"]).{8,}$/;
  const emailReg = /\S+@\S+\.\S+/;
  const errors: Record<keyof T, string> = {
    email: '',
    password: '',
    password_confirmation: ''
  } as Record<keyof T, string>;
  let FormError: Partial<Record<keyof T, string>> = {};
  let isValid = true;
  
  if (field === 'email' && 'email' in errors) {
    
    if (value === "") {
      isValid = false;
      errors.email = "Email is required";
      console.log('email: ', errors);
    } else if (typeof value === 'string' && !emailReg.test(value)) {
      isValid = false;
      errors.email = "Email is invalid";
    }
    FormError = { ...FormError, email: errors.email };
  }

  if (field === 'password' && 'password' in errors) {
    if (value === "") {
      isValid = false;
      errors.password = "Password is required";
    } else if (typeof value === 'string' && !passwordReg.test(value)) {
      isValid = false;
      errors.password =
        "Password must be at least 8 characters long.";
    }
    FormError = { ...FormError, password: errors.password };
  }

  if (
    field === 'password_confirmation' && 'password_confirmation' in errors && "password" in formData &&
    formData.password !== ""
  ) {
    if(passwordReg.test(formData.password as string) && value === "") {
      isValid = false;
      errors.password_confirmation = "Password Confirmation is required";

    } else if (formData.password !== value) {
      isValid = false;
      errors.password_confirmation = "Passwords do not match";
      
    }
    FormError = { ...FormError, password_confirmation: errors.password_confirmation };
  }
  

  return { isValid, FormError };
};
