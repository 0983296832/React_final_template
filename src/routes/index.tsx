import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';


const Home = lazy(() => import('@pages/Home'));
const Login = lazy(() => import('@pages/Login'));
const ProtectedRoute = lazy(() => import('./ProtectedRoute'));


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const RootRoute = () => {
  return (
    <HashRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <ScrollToTop />
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
         

          <Route path='/login' element={<Login />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default RootRoute;
