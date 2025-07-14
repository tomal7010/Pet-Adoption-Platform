
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router'; 
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signIn } = useAuth();
  const axiosSecure = useAxiosSecure(); // Secure Axios instance
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const result = await signIn(data.email, data.password);
      const loggedInUser = result.user;

      // Get JWT from secure Axios
      const res = await axiosSecure.post('/jwt', { email: loggedInUser.email });

      //  Save token to localStorage
      localStorage.setItem('access-token', res.data.token);

      //alert("Login successful");
      navigate('/');
    } catch (error) {
      //console.error("Login error:", error.message);
      //alert("Login failed! Check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form className="w-full max-w-sm bg-white p-8 rounded shadow-md" onSubmit={handleSubmit(onSubmit)}>
        <h2 className='font-bold text-3xl text-center pb-6 text-red-500'>Login Your Account</h2>

        <label className="label">Email</label>
        <input
          type="email"
          {...register('email', { required: true })}
          className="input input-bordered w-full"
          placeholder="Email"
        />
        {errors.email && <p className="text-red-500 text-sm">Email is required</p>}

        <label className="label mt-4">Password</label>
        <input
          type="password"
          {...register('password', { required: true, minLength: 6 })}
          className="input input-bordered w-full"
          placeholder="Password"
        />
        {errors.password?.type === 'required' && <p className='text-red-500 text-sm'>Password is required</p>}
        {errors.password?.type === 'minLength' && <p className='text-red-500 text-sm'>Password must be 6 characters or longer</p>}

        <div className="mt-2">
          <a className="link link-hover text-sm text-blue-500">Forgot password?</a>
        </div>

        <button type="submit" className="btn btn-neutral mt-4 w-full">Login</button>

        <p className='mt-2 text-sm text-center'>
          New to this website? <Link className="text-blue-800 underline" to="/auth/register">Register</Link>
        </p>

        
        <SocialLogin />
      </form>
    </div>
  );
};

export default Login;
