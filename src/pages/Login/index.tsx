import React, { useState } from 'react';
import AuthServices from '@services/auth';
import { useRootStore } from '@store/index';
import { useT } from '@hooks/useT';
import { Toast } from '@components/toast';
import { useNavigate } from 'react-router-dom';
import { saveRefreshToken, saveToken } from '@lib/JwtHelper';

interface Props {}

const Login = (props: Props) => {
  const { t } = useT();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const setIsLoggedIn = useRootStore((state) => state?.setIsLoggedIn);
  const navigate = useNavigate();
  const setCurrentUser = useRootStore((state) => state.setCurrentUser);

  const onLogin = async () => {
    try {
      const data: any = await AuthServices.login({ username, password, expiresInMins: 60 });
      if (data?.status === 200) {
        setIsLoggedIn?.(true);
        Toast('success', t('login_successfully'));
        navigate('/');
        saveToken(data.data.accessToken);
        saveRefreshToken(data.data.refreshToken);
      }
    } catch (error: any) {
      Toast('error', error?.response?.data?.message);
    }
  };

  return (
    <div>
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <img
            alt='Your Company'
            src='https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600'
            className='mx-auto h-10 w-auto'
          />
          <h2 className='mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900'>
            Sign in to your account
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form className='space-y-6'>
            <div>
              <label htmlFor='username' className='block text-sm/6 font-medium text-gray-900'>
                User Name
              </label>
              <div className='mt-2'>
                <input
                  id='username'
                  name='username'
                  value={username}
                  onChange={(e) => {
                    setUsername(e?.target?.value);
                  }}
                  required
                  autoComplete='username'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border'
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label htmlFor='password' className='block text-sm/6 font-medium text-gray-900'>
                  Password
                </label>
                <div className='text-sm'>
                  <a href='#' className='font-semibold text-indigo-600 hover:text-indigo-500'>
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  // type='password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e?.target?.value);
                  }}
                  required
                  autoComplete='current-password'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border'
                />
              </div>
            </div>

            <div>
              <button
                onClick={onLogin}
                className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                Sign in
              </button>
            </div>
          </form>

          <p className='mt-10 text-center text-sm/6 text-gray-500'>
            Not a member?{' '}
            <a href='#' className='font-semibold text-indigo-600 hover:text-indigo-500'>
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
