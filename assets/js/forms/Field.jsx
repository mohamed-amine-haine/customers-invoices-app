import React from "react";

const Field = ({
  name,
  label,
  placeholder = "",
  error = "",
  type = "text",
  onChange,
  value
}) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      placeholder={placeholder || label}
      name={name}
      id={name}
      onChange={onChange}
      value={value}
      className={"form-control" + (error && " is-invalid")}
    />
    {error && <p className="invalid-feedback">{error}</p>}
  </div>
);

export default Field;
