import { userData } from "../Redux/auth/auth-slice";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import routes from "../routes";

export const PrivateRoutes = ({ component: Component, redirectTo = routes.board }) => {
  const { isLoggedIn, isRefreshing } = useSelector(userData);
  const shouldRefresh = !isRefreshing && !isLoggedIn;

  return shouldRefresh ? <Navigate to={redirectTo} /> : <Component />;
};
