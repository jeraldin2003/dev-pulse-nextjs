import { useState } from 'react';
export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) {
      const { [name]: fieldErr } = validate(next);
      setErrors((prev) => {
        const updated = { ...prev };
        if (fieldErr)
          updated[name] = fieldErr; // add/update error
        else delete updated[name]; // remove it so the field clears
        return updated;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, ...validate(values) }));
  };
  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    const allErrors = validate(values);
    setErrors(allErrors);
    setTouched(Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    if (Object.keys(allErrors).length === 0) onSubmit(values);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  return { values, errors, touched, handleChange, handleBlur, handleSubmit, reset };
}
