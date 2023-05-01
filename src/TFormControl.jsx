import { FormControl } from "native-base";

export default function TFormControl({ children, formKey, formErrors, ...props }) {
  return (
    <FormControl {...props} isInvalid={formKey in formErrors}>
      {children}
      {formKey in formErrors ? <FormControl.ErrorMessage>{formErrors[formKey]}</FormControl.ErrorMessage> : null}
    </FormControl>
  );
}
