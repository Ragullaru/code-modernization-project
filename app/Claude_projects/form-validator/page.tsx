'use client';

import { useState, FormEvent } from 'react';

export default function FormValidator() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const [fieldStates, setFieldStates] = useState<{
    [key: string]: { status: 'idle' | 'success' | 'error'; message: string };
  }>({
    username: { status: 'idle', message: '' },
    email: { status: 'idle', message: '' },
    password: { status: 'idle', message: '' },
    password2: { status: 'idle', message: '' },
  });

  // Show input error message
  const showError = (field: string, message: string) => {
    setFieldStates((prev) => ({
      ...prev,
      [field]: { status: 'error', message },
    }));
  };

  // Show success outline
  const showSuccess = (field: string) => {
    setFieldStates((prev) => ({
      ...prev,
      [field]: { status: 'success', message: '' },
    }));
  };

  // Check email is valid
  const checkEmail = (field: string, value: string): boolean => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(value.trim())) {
      showSuccess(field);
      return true;
    } else {
      showError(field, 'Email is not valid');
      return false;
    }
  };

  // Check required fields
  const checkRequired = (fields: { name: string; value: string }[]): boolean => {
    let hasError = false;
    fields.forEach((field) => {
      if (field.value.trim() === '') {
        showError(field.name, `${getFieldName(field.name)} is required`);
        hasError = true;
      } else {
        showSuccess(field.name);
      }
    });
    return hasError;
  };

  // Check input length
  const checkLength = (field: string, value: string, min: number, max: number): boolean => {
    if (value.length < min) {
      showError(field, `${getFieldName(field)} must be at least ${min} characters`);
      return false;
    } else if (value.length > max) {
      showError(field, `${getFieldName(field)} must be less than ${max} characters`);
      return false;
    } else {
      showSuccess(field);
      return true;
    }
  };

  // Check passwords match
  const checkPasswordsMatch = (password1: string, password2: string): boolean => {
    if (password1 !== password2) {
      showError('password2', 'Passwords do not match');
      return false;
    }
    return true;
  };

  // Get fieldname
  const getFieldName = (field: string): string => {
    return field.charAt(0).toUpperCase() + field.slice(1);
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requiredFields = [
      { name: 'username', value: formData.username },
      { name: 'email', value: formData.email },
      { name: 'password', value: formData.password },
      { name: 'password2', value: formData.password2 },
    ];

    if (checkRequired(requiredFields)) {
      checkLength('username', formData.username, 3, 15);
      checkLength('password', formData.password, 6, 25);
      checkEmail('email', formData.email);
      checkPasswordsMatch(formData.password, formData.password2);
    }
  };

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');

        :root {
          --success-color: #2ecc71;
          --error-color: #e74c3c;
        }

        * {
          box-sizing: border-box;
        }

        body {
          background-color: #f9fafb;
          font-family: 'Open Sans', sans-serif;
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

      <div className="container">
        <form id="form" className="form" onSubmit={handleSubmit}>
          <h2>Register With Us</h2>
          <div className={`form-control ${fieldStates.username.status}`}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
            />
            <small>{fieldStates.username.message}</small>
          </div>
          <div className={`form-control ${fieldStates.email.status}`}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            <small>{fieldStates.email.message}</small>
          </div>
          <div className={`form-control ${fieldStates.password.status}`}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            <small>{fieldStates.password.message}</small>
          </div>
          <div className={`form-control ${fieldStates.password2.status}`}>
            <label htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              id="password2"
              placeholder="Enter password again"
              value={formData.password2}
              onChange={(e) => handleChange('password2', e.target.value)}
            />
            <small>{fieldStates.password2.message}</small>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}