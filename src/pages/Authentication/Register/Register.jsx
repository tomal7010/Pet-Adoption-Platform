/*import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxios from '../../../hooks/useAxios';

const Register = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const [profilePic, setProfilePic] = useState('');
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    const onSubmit = data => {
         console.log(data);

         createUser(data.email, data.password)
         .then( async (result) => {
            console.log( result.user);
            navigate("/");


            //update userinfo database
            const userInfo = {
                    name: data.name,
                    email: data.email,
                    role: 'user', // default role
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString()
                }

                const userRes = await axiosInstance.post('/users', userInfo);
                console.log(userRes.data); //


            //update user profile in firebase
            const userProfile = {
              displayName : data.name,
              photoURL : profilePic
            }
            updateUserProfile(userProfile)
            .then(() => {
                        console.log('profile name pic updated');
                        
                    })
                    .catch(error => {
                        console.log(error)
                    })



         })
         .catch(error => {
            console.error(error);
         })
            
    }

    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        console.log(image)

        const formData = new FormData();
        formData.append('image', image);




        const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`
        const res = await axios.post(imagUploadUrl, formData)

        //console.log(res.data.data.url);

        setProfilePic(res.data.data.url);


    }
    



    return (
        <div>
            

            <form className=" flex  justify-center" onSubmit={handleSubmit(onSubmit)}>
  <fieldset className="bg-white p-8 rounded shadow-md w-full max-w-sm">

    <h2 className='font-bold text-3xl text-center pb-6 text-red-500'>Create An Account</h2>


    <label className="label">Your Name</label>
    <input type="text" {...register('name', { required: true })} className="input" placeholder="Your Name" />
        {
          errors.email?.type === 'required' && <p className='text-red-500'>Name is required</p>
         }
                       


    <label className="label mt-4">Your Profile picture</label>
    <input type="file" onChange={handleImageUpload} className="input" placeholder="Your Profile picture" />


    <label className="label mt-4">Email</label>
    <input type="email" {...register('email', { required: true })} className="input input-bordered w-full" placeholder="Email" />

    {
         errors.email?.type === 'required' && <p className='text-red-500'>Email is required</p>
    }


    <label className="label mt-4">Password</label>
    <input type="password" {...register('password', { required: true, minLength: 6})} className="input input-bordered w-full" placeholder="Password" />


      {
        errors.password?.type === 'required' && <p className='text-red-500'>Password is required</p>
       }

      {
       errors.password?.type === 'minLength' && <p className='text-red-500'>Password Must be 6 characters or longer</p>
      }



   {/* <div className="mt-2">
      <a className="link link-hover text-sm text-blue-500">Forgot password?</a>
    </div> /}

    <button className="btn btn-neutral mt-4 w-full">Register</button>
    <p className='mb-2'><small>Already have an account? <Link className="btn-link text-blue-800" to="/auth/login">Login</Link></small></p>
    <SocialLogin></SocialLogin>
  </fieldset>
</form>

        </div>
    );
};

export default Register;
*/

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState('');
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const result = await createUser(data.email, data.password);
      //console.log(result.user);

      //  Update user profile in Firebase
      await updateUserProfile({
        displayName: data.name,
        photoURL: profilePic
      });
      //console.log('Profile updated');

      //  Save user info to DB
      const userInfo = {
        name: data.name,
        email: data.email,
        image: profilePic,
        role: 'user',
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString()
      };

      const userRes = await axiosSecure.post('/users', userInfo);
      //console.log('User saved to DB:', userRes.data);

      //  Get JWT token and save to localStorage
      const jwtRes = await axiosSecure.post('/jwt', { email: data.email });
      localStorage.setItem('access-token', jwtRes.data.token);
      //console.log('Token saved to localStorage');

      //  Redirect
      navigate('/');
    } catch (error) {
      //console.error('Registration Error:', error.message);
    }
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image);
    const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
    const res = await axios.post(uploadUrl, formData);
    setProfilePic(res.data.data.url);
  };

  return (
    <div>
      <form className="flex justify-center" onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className='font-bold text-3xl text-center pb-6 text-red-500'>Create An Account</h2>

          <label className="label">Your Name</label>
          <input type="text" {...register('name', { required: true })} className="input" placeholder="Your Name" />
          {errors.name && <p className='text-red-500'>Name is required</p>}

          <label className="label mt-4">Your Profile picture</label>
          <input type="file" onChange={handleImageUpload} className="input" />

          <label className="label mt-4">Email</label>
          <input type="email" {...register('email', { required: true })} className="input input-bordered w-full" placeholder="Email" />
          {errors.email && <p className='text-red-500'>Email is required</p>}

          <label className="label mt-4">Password</label>
          <input type="password" {...register('password', { required: true, minLength: 6 })} className="input input-bordered w-full" placeholder="Password" />
          {errors.password?.type === 'required' && <p className='text-red-500'>Password is required</p>}
          {errors.password?.type === 'minLength' && <p className='text-red-500'>Password must be 6 characters or longer</p>}

          <button className="btn btn-neutral mt-4 w-full">Register</button>
          <p className='mb-2'><small>Already have an account? <Link className="btn-link text-blue-800" to="/auth/login">Login</Link></small></p>

          <SocialLogin />
        </fieldset>
      </form>
    </div>
  );
};

export default Register;
