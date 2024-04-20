import { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Layout from '../layout/layout';
import styles from './login.module.css';
import usernameIcon from '../../assets/icons8-username-64.png';
import passwordIcon from '../../assets/icons8-password-50.png';

type PropsType = {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

type ErrorMessageType = {
  usernameError: string | null;
  passwordError: string | null;
};

function Login({ setToken }: PropsType) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<ErrorMessageType | null>(
    null,
  );
  const navigate = useNavigate();

  const handleToken = (BearerToken: string) => {
    const oneHour = new Date(new Date().getTime() + 1000 * 60 * 1000);
    Cookies.set('token', BearerToken, {
      expires: oneHour,
      secure: true,
    });
    setToken(Cookies.get('token'));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        'https://blog-api-stalloyde.fly.dev/mod/login',
        {
          mode: 'cors',
          credentials: 'same-origin',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        },
      );

      const responseData = await response.json();
      if (!responseData.user && !responseData.Bearer) {
        setErrorMessage(responseData);
      } else {
        setUsername('');
        setPassword('');
        setErrorMessage(null);
        handleToken(responseData.Bearer);
        navigate('/mod/posts');
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <Layout>
      <>
        <div className={styles.mainHeader}>
          <h2>LOGIN</h2>
        </div>

        <div className={styles.content}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              {errorMessage && errorMessage.usernameError && (
                <p className={styles.errorMessage}>
                  {errorMessage.usernameError}
                </p>
              )}
              <img src={usernameIcon} alt='username' />
              <input
                type='text'
                id='username'
                name='username'
                placeholder='Username'
                required
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                value={username}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div>
              {errorMessage && errorMessage.passwordError && (
                <p className={styles.errorMessage}>
                  {errorMessage.passwordError}
                </p>
              )}
              <img src={passwordIcon} alt='password' />
              <input
                type='password'
                id='password'
                name='password'
                placeholder='Password'
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <button value='Log In'>Log In</button>
            </div>
          </form>
        </div>
      </>
    </Layout>
  );
}

export default Login;
