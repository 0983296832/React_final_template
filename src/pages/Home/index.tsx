import { useRootStore } from '@store/index';
import React from 'react';

interface Props {}

const Home = (props: Props) => {
  const currentUser = useRootStore.getState().currentUser;

  return <div>Home</div>;
};

export default Home;
