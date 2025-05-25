import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store, { persistor } from "./Redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import routes from "./routes";
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";
// import "./libs/time.js";
import "./index.css";
import { RestrictedRout } from "./Components/RestrictedRout.jsx";
import { PrivateRoutes } from "./Components/PrivateRoutes.jsx";

import LoginForm from "./Components/LoginForm.tsx"

const App = lazy(() => import("./App" /* webpackChunkName: 'App' */));
const BoardView = lazy(() => import("./Views/BoardView" /* webpackChunkName: 'BoardView' */));
const PageNotFound = lazy(() =>
  import("./Views/PageNotFound" /* webpackChunkName: 'PageNotFound' */)
);

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <App />,
    errorElement: <PageNotFound />,
    children: [
      {
        path: routes.board,
        element:<PrivateRoutes component={BoardView} redirectTo={routes.logIn} />,
      },
      {
        path: routes.logIn,
        element: <RestrictedRout component={LoginForm} redirectTo={routes.board} />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense>
          <ScopedCssBaseline>
            <RouterProvider router={router} />
          </ScopedCssBaseline>
        </Suspense>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

