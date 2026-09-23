import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch('password');

  const onSubmit = async (formData) => {
    setServerError('');
    try {
      await registerUser(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="page">
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <label>
          Name
          <input {...register('name', { required: 'Name is required' })} />
          {errors.name && <span className="field-error">{errors.name.message}</span>}
        </label>

        <label>
          Email
          <input type="email" {...register('email', { required: 'Email is required' })} />
          {errors.email && <span className="field-error">{errors.email.message}</span>}
        </label>

        <label>
          Password
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'At least 6 characters' },
            })}
          />
          {errors.password && <span className="field-error">{errors.password.message}</span>}
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message}</span>}
        </label>

        {serverError && <p className="form-error">{serverError}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Register;