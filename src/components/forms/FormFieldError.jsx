import React from "react";

export default function FormFieldError({ name, errors, touched }) {
  if (!touched?.[name] || !errors?.[name]) return null;
  return (
    <div
      className="text-danger small validation-error mb-1"
      role="alert"
      id={`${name}-error`}
    >
      {errors[name]}
    </div>
  );
}
