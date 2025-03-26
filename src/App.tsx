import { useT } from '@hooks/useT';
import RootRoute from './routes';
import { ToastContainer } from 'react-toastify';
import { useRootStore } from './store/index';
import mainServices from './services/main';
import { useEffect } from 'react';

const App = () => {
  const setCurrentUser = useRootStore((state) => state.setCurrentUser);
  const restoreSession = useRootStore((state) => state.restoreSession);
  const isLoggedIn = useRootStore((state) => state.isLoggedIn);
  console.log(isLoggedIn);

  const getCurrentUser = async () => {
    try {
      const data: any = await mainServices.getCurrentUser();
      setCurrentUser?.(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getCurrentUser();
    }
  }, [isLoggedIn]);

  return (
    <div>
      <RootRoute />
      <ToastContainer
        stacked
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </div>
  );
};

export default App;
