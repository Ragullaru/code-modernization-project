"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";

type FieldName = "username" | "email" | "password" | "password2";

interface FormValues {
  username: string;
  email: string;
  password: string;
  password2: string;
}

type FormErrors = Partial<Record<FieldName, string>>;

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function getFieldLabel(field: FieldName): string {
  // Mirrors getFieldName from the original script
  return field.charAt(0).toUpperCase() + field.slice(1);
}

export default function FormValidatorPage() {
  const [values, setValues] = useState<FormValues>({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: FieldName
  ) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (vals: FormValues): FormErrors => {

    const newErrors: FormErrors = {};

    // Required checks - mirrors checkRequired in original code
    (["username", "email", "password", "password2"] as FieldName[]).forEach(
      (field) => {
        if (vals[field].trim() === "") {
          newErrors[field] = `${getFieldLabel(field)} is required`;
        }
      }
    );

    // Only run length and email checks if required checks passed for those fields
    // Username length - mirrors checkLength(username, 3, 15)
    if (!newErrors.username) {
      if (vals.username.length < 3) {
        newErrors.username = `${getFieldLabel(
          "username"
        )} must be at least 3 characters`;
      } else if (vals.username.length > 15) {
        newErrors.username = `${getFieldLabel(
          "username"
        )} must be less than 15 characters`;
      }
    }

    // Password length - mirrors checkLength(password, 6, 25)
    if (!newErrors.password) {
      if (vals.password.length < 6) {
        newErrors.password = `${getFieldLabel(
          "password"
        )} must be at least 6 characters`;
      } else if (vals.password.length > 25) {
        newErrors.password = `${getFieldLabel(
          "password"
        )} must be less than 25 characters`;
      }
    }

    // Email format - mirrors checkEmail
    if (!newErrors.email && !emailRegex.test(vals.email.trim())) {
      newErrors.email = "Email is not valid";
    }

    // Password match - mirrors checkPasswordsMatch
    if (!newErrors.password2 && vals.password !== vals.password2) {
      newErrors.password2 = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setSubmitted(true);

    // Original code only validated and did not actually submit anywhere,
    // so we preserve that behavior here.
  };

  const getFormControlClass = (field: FieldName): string => {
    const base = "form-control";
    const hasError = !!errors[field];

    if (!submitted && !hasError) {
      return base;
    }

    if (hasError) {
      return `${base} error`;
    }

    return `${base} success`;
  };

  return (
    <>
      <div className="container">
        <form id="form" className="form" onSubmit={handleSubmit} noValidate>
          <h2>Register With Us</h2>

          <div className={getFormControlClass("username")}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={values.username}
              onChange={(e) => handleChange(e, "username")}
            />
            <small>{errors.username || "Error message"}</small>
          </div>

          <div className={getFormControlClass("email")}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              placeholder="Enter email"
              value={values.email}
              onChange={(e) => handleChange(e, "email")}
            />
            <small>{errors.email || "Error message"}</small>
          </div>

          <div className={getFormControlClass("password")}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={values.password}
              onChange={(e) => handleChange(e, "password")}
            />
            <small>{errors.password || "Error message"}</small>
          </div>

          <div className={getFormControlClass("password2")}>
            <label htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              id="password2"
              placeholder="Enter password again"
              value={values.password2}
              onChange={(e) => handleChange(e, "password2")}
            />
            <small>{errors.password2 || "Error message"}</small>
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Global styles ported directly from the original style.css */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css?family=Open+Sans&display=swap");

        :root {
          --success-color: #2ecc71;
          --error-color: #e74c3c;
        }

        * {
          box-sizing: border-box;
        }

        body {
          background-color: #f9fafb;
          font-family: "Open Sans", sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
        }

        .container {
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          width: 400px;
        }

        h2 {
          text-align: center;
          margin: 0 0 20px;
        }

        .form {
          padding: 30px 40px;
        }

        .form-control {
          margin-bottom: 10px;
          padding-bottom: 20px;
          position: relative;
        }

        .form-control label {
          color: #777;
          display: block;
          margin-bottom: 5px;
        }

        .form-control input {
          border: 2px solid #f0f0f0;
          border-radius: 4px;
          display: block;
          width: 100%;
          padding: 10px;
          font-size: 14px;
        }

        .form-control input:focus {
          outline: 0;
          border-color: #777;
        }

        .form-control.success input {
          border-color: var(--success-color);
        }

        .form-control.error input {
          border-color: var(--error-color);
        }

        .form-control small {
          color: var(--error-color);
          position: absolute;
          bottom: 0;
          left: 0;
          visibility: hidden;
        }

        .form-control.error small {
          visibility: visible;
        }

        .form button {
          cursor: pointer;
          background-color: #3498db;
          border: 2px solid #3498db;
          border-radius: 4px;
          color: #fff;
          display: block;
          font-size: 16px;
          padding: 10px;
          margin-top: 20px;
          width: 100%;
        }
      `}</style>
    </>
  );
}
