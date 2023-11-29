import { TextField } from '@mui/material';
import classnames from 'classnames';


interface InputProps {
  className?: string;
  containerClassname?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  value: string | number;
  type?: 'text' | 'password' | 'number';
  label?: string;
  error?: boolean;
  required?: boolean;
  placeholder?: string;
  onBlur?: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}


function InputLabel({ label, required }: Pick<InputProps, 'label' | 'required'>) {
  return (
    <span className="input-label">
      {label} {required && <span className="input-label__asterisk">*</span>}
    </span>
  );
}


export function Input({
  className,
  containerClassname,
  fullWidth = true,
  type = 'text',
  value,
  disabled,
  label,
  error,
  required,
  placeholder,
  onBlur,
  onChange,
}: InputProps) {
  return (
    <div className={classnames('input-container', containerClassname)}>
      {label && (
        <InputLabel label={label} required={required} />
      )}

      <TextField
        variant="outlined"
        color="primary"
        value={value}
        fullWidth={fullWidth}
        disabled={disabled}
        placeholder={placeholder}
        type={type}
        name={label}
        error={error}
        InputProps={{
          classes: {
            root: classnames('input', className),
          },
        }}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
}
