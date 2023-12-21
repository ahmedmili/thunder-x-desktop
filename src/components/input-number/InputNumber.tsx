import styles from "./inputNumber.module.scss";
interface InputNumberProps {
  type?: string;
  error?: string;
  touched?: string;
  next: string;
}
const InputNumber = ({
  field,
  form: { touched, errors },
  ...props
}: InputNumberProps & { field: any; form: any }) => {
  const hasError = touched[field.name] && errors[field.name];
  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    nextFieldName: string
  ) => {
    const input = event.target;
    const { name, value } = input;
    input.value = value.slice(0, 1);

    // Remove any non-numeric characters from the input value
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 1);

    // Update the input value to the numeric value
    input.value = numericValue;

    if (numericValue !== "") {
      const nextField = document.getElementsByName(nextFieldName)[0];
      if (nextField) {
        nextField.focus();
      }
    }
  };
  return (
    <input
      className={styles.input}
      style={{textAlign:"center"}}
      type={props.type}
      error={errors[field.name]}
      onInput={(event: any) => handleInput(event, props.next)}
      {...field}
      {...props}
    />
  );
};

export default InputNumber;
