import React from 'react';

interface Props {
  children: React.ReactNode;
}

const Layout = (props: Props) => {
  const { children } = props;
  return <div>{children}</div>;
};

export default Layout;
