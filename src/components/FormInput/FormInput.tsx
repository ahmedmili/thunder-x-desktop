import {
  FormHelperText,
  Typography,
  FormControl,
  Input ,
  InputProps,
} from '@mui/material';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import './FormInput.css'


type IFormInputProps = {
  name: string;
  label: string;
  inputProps?: InputProps; // Add inputProps here
} & InputProps;

const FormInput: FC<IFormInputProps> = ({
  name,
  label,
  inputProps,
  ...otherProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue=''
      name={name}
      render={({ field }) => (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Typography
            variant='body2'
            sx={{ color: '#2363eb', mb: 1, fontWeight: 500 }}>
            {label}
          </Typography>
          <Input
          className='inpute'
            {...field}
            fullWidth
            disableUnderline
            sx={{ borderRadius: '1rem' }}
            error={!!errors[name]}
            {...inputProps} // Add inputProps here
            {...otherProps}
          />
        </FormControl>
      )}
    />
  );
};

export default FormInput;
