import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import ForgotPage from './pages/ForgotPage';
import DashboardAppPage from './pages/DashboardAppPage';
import NetworksPage from './pages/NetworksPage';
import ExnessPage from './pages/ExnessPage';
import SignupPage from './pages/SignupPage';
import TransactionPage from './pages/TransactionPage';
import Profile from './pages/Profile';
import FAGuard from './pages/FAGuard';
import UploadFile from "./pages/UploadFile";
import WithdrawPage from './pages/WithdrawPage';
import CommissionPage from './pages/CommissionPage';

// ----------------------------------------------------------------------

export default function Router() {
  const email = localStorage.getItem("email");

  // Kiểm tra xem email có tồn tại không
  const isEmailExists = !!email;
  
  const routes = useRoutes([
        {
      path: '/',
      element: <ExnessPage />,
    },
    // {
    //   path: '/',
    //   element: isEmailExists ? <DashboardLayout /> : <Navigate to="/login" />,
    //   children: [
    //     { element: <Navigate to="/dashboard" />, index: true },
    //     { path: 'dashboard', element: <DashboardAppPage /> },
    //     { path: 'user', element: <UserPage /> },
    //     { path: 'exness', element: <ExnessPage /> },
    //     { path: 'profile', element: <Profile /> },
    //     // { path: 'withdraw', element: <WithdrawPage /> },
    //     { path: '2fa', element: <FAGuard /> },
    //     { path: 'shareib', element: <UploadFile /> },
    //     { path: 'transaction', element: <TransactionPage /> },
    //     { path: 'commission', element: <CommissionPage /> },
    //     { path: 'upload', element: <UploadFile /> },
    //     { path: 'network', element: <NetworksPage /> },
    //     // { path: 'blog', element: <BlogPage /> },
    //   ],
    // },
    // {
    //   path: 'login',
    //   element: isEmailExists ? <Navigate to="/dashboard" /> : <LoginPage />,
    // },
    // {
    //   path: 'signup',
    //   element: isEmailExists ? <Navigate to="/dashboard" /> : <SignupPage />,
    // },
    // {
    //   path: 'forgot',
    //   element: isEmailExists ? <Navigate to="/dashboard" /> : <ForgotPage />,
    // },
    // // {
    // //   element: <SimpleLayout />,
    // //   children: [
    // //     { element: <Navigate to="/dashboard/app" />, index: true },
    // //     { path: '404', element: <Page404 /> },
    // //     { path: '*', element: <Navigate to="/404" /> },
    // //   ],
    // // },
    // {
    //   path: '*',
    //   element: <Navigate to="/404" replace />,
    // },
  ]);

  return routes;
}
