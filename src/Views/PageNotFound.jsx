import React from "react";

import { useRouteError } from "react-router-dom";

const PageNotFound = () => {
  const error = useRouteError;

  return (
    <>
      <h2> Page not found </h2>
      <br />
      <hr></hr>
      <br />
      <h2>Или попытка войти в админку Джанги. Работает нормально если запускаться в Джанго </h2>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </>
  );
};

export default PageNotFound;
