import { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import styles from './header.module.css';
import homeLogo from '../../assets/icons8-home-50.png';
import loginLogo from '../../assets/icons8-login-50.png';
import logoutLogo from '../../assets/icons8-logout-50.png';

type PropsType = {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

function Header({ token, setToken, closeModal }: PropsType) {
  const logOut = () => {
    setToken('');
    Cookies.remove('token');
  };

  return (
    <header className={styles.header} onClick={closeModal}>
      {token ? (
        <Link to='/mod/posts' className={styles.navbtn}>
          <img src={homeLogo} alt='home-logo'></img>
          Home
        </Link>
      ) : (
        <Link to='/mod/login' className={styles.navbtn}>
          <img src={homeLogo} alt='home-logo'></img>
          Home
        </Link>
      )}
      <h1>Stalloyde's Blog - CMS</h1>
      <div className={styles.nav}>
        {!token ? (
          <>
            <Link to='/mod/login' className={styles.navbtn}>
              <img src={loginLogo} alt='login-logo'></img>
              Login
            </Link>
          </>
        ) : (
          <div className={styles.navbtn} onClick={logOut}>
            <img src={logoutLogo} alt='logout-logo'></img>
            Log out
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
