import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (formData) => {
    setServerError('');
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <label>
          Email
          <input type="email" {...register('email', { required: 'Email is required' })} />
          {errors.email && <span className="field-error">{errors.email.message}</span>}
        </label>

        <label>
          Password
          <input type="password" {...register('password', { required: 'Password is required' })} />
          {errors.password && <span className="field-error">{errors.password.message}</span>}
        </label>

        {serverError && <p className="form-error">{serverError}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Login;