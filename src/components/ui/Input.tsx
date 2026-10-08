import React from 'react';

interface InputBaseProps {
  label?: string;
  error?: string;
  pixelLabel?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, InputBaseProps {}
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, InputBaseProps {}
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, InputBaseProps {}

const getBaseClasses = (error?: string) => `
  w-full bg-base rounded px-3 py-2 text-text-primary font-body
  border-2 transition-colors duration-200
  ${error 
    ? 'border-accent-danger' 
    : 'border-base-border focus:border-accent-secondary focus:shadow-neon-purple'
  }
  outline-none
`;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, pixelLabel, className = '', ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = props.id ?? generatedId;
    return (
      <div className={`flex flex-col gap-1 w-full ${className}`}>
        {label && (
          <label htmlFor={inputId} className={`text-text-secondary text-sm ${pixelLabel ? 'font-pixel text-[10px] uppercase' : ''}`}>
            {label}
          </label>
        )}
        <input ref={ref} id={inputId} className={getBaseClasses(error)} {...props} />
        {error && <span className="text-accent-danger text-xs mt-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, pixelLabel, className = '', ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = props.id ?? generatedId;
    return (
      <div className={`flex flex-col gap-1 w-full ${className}`}>
        {label && (
          <label htmlFor={inputId} className={`text-text-secondary text-sm ${pixelLabel ? 'font-pixel text-[10px] uppercase' : ''}`}>
            {label}
          </label>
        )}
        <textarea ref={ref} id={inputId} className={`${getBaseClasses(error)} min-h-[100px] resize-y`} {...props} />
        {error && <span className="text-accent-danger text-xs mt-1">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, pixelLabel, className = '', children, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = props.id ?? generatedId;
    return (
      <div className={`flex flex-col gap-1 w-full ${className}`}>
        {label && (
          <label htmlFor={inputId} className={`text-text-secondary text-sm ${pixelLabel ? 'font-pixel text-[10px] uppercase' : ''}`}>
            {label}
          </label>
        )}
        <select ref={ref} id={inputId} className={getBaseClasses(error)} {...props}>
          {children}
        </select>
        {error && <span className="text-accent-danger text-xs mt-1">{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';
