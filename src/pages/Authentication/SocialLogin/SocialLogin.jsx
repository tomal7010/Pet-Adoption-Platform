
import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router';

const SocialLogin = () => {
  const { signInWithGoogle, signInWithGitHub } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Google login
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      //console.log('Google login success:', user);

      const userInfo = {
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
        role: 'user',
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      // Save user to DB
      await axiosSecure.post('/users', userInfo);

      // Get JWT Token
      const tokenRes = await axiosSecure.post('/jwt', { email: user.email });
      localStorage.setItem('access-token', tokenRes.data.token);
      //console.log('Token saved');

      navigate('/');
    } catch (error) {
      //console.error('Google login error:', error.message);
    }
  };

  // GitHub login
  const handleGitHubLogin = async () => {
    try {
      const result = await signInWithGitHub();
      const user = result.user;
      //console.log('GitHub login success:', user);

      if (!user.email) {
        //alert("GitHub didn't return an email. Please use Google or provide email manually.");
        return;
      }

      const userInfo = {
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
        role: 'user',
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      await axiosSecure.post('/users', userInfo);

      const tokenRes = await axiosSecure.post('/jwt', { email: user.email });
      localStorage.setItem('access-token', tokenRes.data.token);
      //console.log('Token saved');

      navigate('/');
    } catch (error) {
      //console.error('GitHub login error:', error.message);
    }
  };

  return (
    <div className="text-center">
      <p className="mb-2">OR</p>

      <div>
        {/* GitHub */}
        <button
          onClick={handleGitHubLogin}
          className="btn bg-black text-white border-black mb-2"
        >
          {/* GitHub Icon */}
          <svg aria-label="GitHub logo" width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 
                     9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,
                     16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 
                     6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,
                     16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,
                     8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,
                     7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 
                     14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,
                     8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 
                     16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,
                     19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,
                     21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
          </svg>
          Login with GitHub
        </button>

        {/* Google */}
        <button
          onClick={handleGoogleSignIn}
          className="btn bg-white text-black border-[#e5e5e5]"
        >
          {/* Google Icon */}
          <svg aria-label="Google logo" width="16" height="16" viewBox="0 0 512 512">
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
              <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
              <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
              <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
              <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
            </g>
          </svg>
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
