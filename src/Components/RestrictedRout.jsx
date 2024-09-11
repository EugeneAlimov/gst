import { userData } from "../Redux/auth/auth-slice";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import routes from "../routes";

export const RestrictedRout = ({ component: Component, redirectTo = routes.logIn }) => {
  const { isLoggedIn } = useSelector(userData);

  return isLoggedIn ? <Navigate to={redirectTo} /> : <Component />;
};
