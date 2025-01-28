import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { formValidation, ValidationResult } from '../utils/formValidation';

interface UseFormValidation<T> {
  formData: T;
  errors: Partial<Record<keyof T, string>>;
  setData: Dispatch<SetStateAction<T>>;
  setFormData: (id: string, value: unknown) => void;
  setError: (key: keyof T, value: string) => void;
  validateForm: () => ValidationResult<T>;
}

export const useFormValidation = <T extends object>(initialState: T): UseFormValidation<T> => {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleFormData = useCallback((id: string, value: unknown) => {
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  }, []);

  const handleError = useCallback((key: keyof T, value: string) => {
    setErrors((prev) => ({ ...prev, [key]: value }));
  }, []);

  const validateForm = useCallback((): ValidationResult<T> => {
    setErrors({});
    const validationResult: ValidationResult<T> = { isValid: true, FormError: {} as Partial<Record<keyof T, string>> };
    for (const field in formData) {
      const result = formValidation<T>(field as keyof T, formData[field], formData);
      
      if (!result.isValid) {
        validationResult.isValid = false;
        
        setErrors(prev =>  ({...prev, ...result.FormError}));
      }
    }

    console.log('Errors State: ', errors);
    
    return validationResult;
  }, [formData, errors]);

  return {
    formData,
    errors,
    setError: handleError,
    setFormData: handleFormData,
    setData: setFormData,
    validateForm,
  };
};
