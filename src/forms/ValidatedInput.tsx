import { useState, type FormEvent } from 'react';
import { Input, type InputProps } from '../components/Input';

export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export interface ValidatedInputProps extends Omit<InputProps, 'error' | 'onChange' | 'onBlur'> {
  value: string;
  rules: readonly ValidationRule[];
  validateOn?: 'blur' | 'change';
  onChange: (value: string) => void;
  onValidityChange?: (valid: boolean) => void;
}

export function validateValue(value: string, rules: readonly ValidationRule[]) {
  return rules.find((rule) => !rule.validate(value))?.message;
}

export function ValidatedInput({ value, rules, validateOn = 'blur', onChange, onValidityChange, ...props }: ValidatedInputProps) {
  const [touched, setTouched] = useState(false);
  const error = touched ? validateValue(value, rules) : undefined;
  const update = (next: string) => {
    onChange(next);
    if (validateOn === 'change') setTouched(true);
    onValidityChange?.(!validateValue(next, rules));
  };
  return <Input {...props} value={value} error={error} onChange={(event) => update(event.target.value)} onBlur={() => setTouched(true)} />;
}

export function validateForm(event: FormEvent<HTMLFormElement>) {
  if (!event.currentTarget.checkValidity()) {
    event.preventDefault();
    event.currentTarget.reportValidity();
    return false;
  }
  return true;
}
