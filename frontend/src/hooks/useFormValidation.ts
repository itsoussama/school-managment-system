import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { formValidation, ValidationResult } from '../utils/formValidation';

interface UseFormValidation {
  formData: Record<string, unknown>;
  errors: Record<string, unknown>;
  setData: Dispatch<SetStateAction<Record<string, unknown>>>;
  setFormData: (id : string, value: unknown) => void;
  setError: (key: string, value: string) => void;
  validateForm: () => ValidationResult;
}

export const useFormValidation = (initialState: Record<string, unknown>): UseFormValidation => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialState);

  const handleFromData = useCallback((id: string, value: unknown) => {
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  }, []);

  const handleError = useCallback((key: string, value: string) => {
    setErrors((prev)=> ({...prev, [key] : value}))
  }, []);

  const validateForm = useCallback((): ValidationResult => {
       const validationResult: ValidationResult = { isValid: true, errors: {} };
    for (const field in formData) {
      const result = formValidation(field, formData[field], formData);
      if (!result.isValid) {
        validationResult.isValid = false;
        validationResult.errors = { ...validationResult.errors, ...result.errors };
      }
    }
    setErrors(validationResult.errors);
    return validationResult;
  }, [formData]);

return {
    formData,
    errors,
    setError: handleError,
    setFormData: handleFromData,
    setData: setFormData,
    validateForm,
};
};