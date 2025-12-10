'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';

type FormField = {
  id: string;
  value: string;
  error: string;
  touched: boolean;
};

type ValidationRules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  matchWith?: string;
};

export default function FormValidator() {
  const [formFields, setFormFields] = useState<Record<string, FormField>>({
    username: { id: 'username', value: '', error: '', touched: false },
    email: { id: 'email', value: '', error: '', touched: false },
    password: { id: 'password', value: '', error: '', touched: false },
    password2: { id: 'password2', value: '', error: '', touched: false },
  });

  const validationRules: Record<string, ValidationRules> = {
    username: { required: true, minLength: 3, maxLength: 15 },
    email: { required: true, email: true },
    password: { required: true, minLength: 6, maxLength: 25 },
    password2: { required: true, matchWith: 'password' },
  };

  const getFieldName = (id: string): string => {
    return id.charAt(0).toUpperCase() + id.slice(1);
  };

  const checkRequired = (fieldId: string, value: string): string => {
    if (validationRules[fieldId]?.required && value.trim() === '') {
      return `${getFieldName(fieldId)} is required`;
    }
    return '';
  };

  const checkLength = (fieldId: string, value: string): string => {
    const rules = validationRules[fieldId];
    if (!rules) return '';
    
    if (rules.minLength && value.length < rules.minLength) {
      return `${getFieldName(fieldId)} must be at least ${rules.minLength} characters`;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `${getFieldName(fieldId)} must be less than ${rules.maxLength} characters`;
    }
    return '';
  };

  const checkEmail = (value: string): string => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(value.trim())) {
      return 'Email is not valid';
    }
    return '';
  };

  const checkPasswordsMatch = (): string => {
    if (formFields.password.value !== formFields.password2.value) {
      return 'Passwords do not match';
    }
    return '';
  };

  const validateField = (fieldId: string, value: string): string => {
    let error = '';
    
    error = checkRequired(fieldId, value);
    if (error) return error;
    
    error = checkLength(fieldId, value);
    if (error) return error;
    
    if (fieldId === 'email' && validationRules.email?.email) {
      error = checkEmail(value);
      if (error) return error;
    }
    
    if (fieldId === 'password2' && validationRules.password2?.matchWith) {
      error = checkPasswordsMatch();
    }
    
    return error;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    setFormFields(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        value,
        touched: true,
        error: validateField(id, value),
      },
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const updatedFields = { ...formFields };
    let hasErrors = false;
    
    Object.keys(formFields).forEach(fieldId => {
      const field = formFields[fieldId];
      const error = validateField(fieldId, field.value);
      
      if (error) {
        updatedFields[fieldId] = {
          ...field,
          error,
          touched: true,
        };
        hasErrors = true;
      }
    });
    
    setFormFields(updatedFields);
    
    if (!hasErrors) {
      alert('Form submitted successfully!');
    }
  };

  useEffect(() => {
    if (formFields.password2.touched && formFields.password2.value) {
      const error = checkPasswordsMatch();
      setFormFields(prev => ({
        ...prev,
        password2: {
          ...prev.password2,
          error,
        },
      }));
    }
  }, [formFields.password.value, formFields.password2.value]);

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Register With Us</h2>
        
        <div style={{
          ...styles.formControl,
          ...(formFields.username.error && formFields.username.touched ? styles.error : {}),
          ...(!formFields.username.error && formFields.username.touched ? styles.success : {})
        }}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter username"
            value={formFields.username.value}
            onChange={handleInputChange}
            style={styles.input}
          />
          {formFields.username.error && formFields.username.touched && (
            <small style={styles.small}>{formFields.username.error}</small>
          )}
        </div>
        
        <div style={{
          ...styles.formControl,
          ...(formFields.email.error && formFields.email.touched ? styles.error : {}),
          ...(!formFields.email.error && formFields.email.touched ? styles.success : {})
        }}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            placeholder="Enter email"
            value={formFields.email.value}
            onChange={handleInputChange}
            style={styles.input}
          />
          {formFields.email.error && formFields.email.touched && (
            <small style={styles.small}>{formFields.email.error}</small>
          )}
        </div>
        
        <div style={{
          ...styles.formControl,
          ...(formFields.password.error && formFields.password.touched ? styles.error : {}),
          ...(!formFields.password.error && formFields.password.touched ? styles.success : {})
        }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={formFields.password.value}
            onChange={handleInputChange}
            style={styles.input}
          />
          {formFields.password.error && formFields.password.touched && (
            <small style={styles.small}>{formFields.password.error}</small>
          )}
        </div>
        
        <div style={{
          ...styles.formControl,
          ...(formFields.password2.error && formFields.password2.touched ? styles.error : {}),
          ...(!formFields.password2.error && formFields.password2.touched ? styles.success : {})
        }}>
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            id="password2"
            placeholder="Enter password again"
            value={formFields.password2.value}
            onChange={handleInputChange}
            style={styles.input}
          />
          {formFields.password2.error && formFields.password2.touched && (
            <small style={styles.small}>{formFields.password2.error}</small>
          )}
        </div>
        
        <button type="submit" style={styles.button}>Submit</button>
      </form>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');
        
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
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    width: '400px',
  },
  form: {
    padding: '30px 40px',
  },
  formControl: {
    marginBottom: '10px',
    paddingBottom: '20px',
    position: 'relative' as const,
  },
  input: {
    border: '2px solid #f0f0f0',
    borderRadius: '4px',
    display: 'block',
    width: '100%',
    padding: '10px',
    fontSize: '14px',
  },
  success: {
    'input': {
      borderColor: '#2ecc71',
    },
  },
  error: {
    'input': {
      borderColor: '#e74c3c',
    },
  },
  small: {
    color: '#e74c3c',
    position: 'absolute' as const,
    bottom: '0',
    left: '0',
    visibility: 'visible' as const,
  },
  button: {
    cursor: 'pointer',
    backgroundColor: '#3498db',
    border: '2px solid #3498db',
    borderRadius: '4px',
    color: '#fff',
    display: 'block',
    fontSize: '16px',
    padding: '10px',
    marginTop: '20px',
    width: '100%',
  },
};