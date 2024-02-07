import { useState } from 'react';
import Header from '../header/header';
import Footer from '../footer/footer';

type PropsType = {
  children: any;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

function Layout({
  children,
  token,
  setToken,
  submitting,
  closeModal,
}: PropsType) {
  return (
    <>
      <Header
        token={token}
        setToken={setToken}
        submitting={submitting}
        closeModal={closeModal}
      />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
