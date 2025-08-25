import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from 'react-redux'

function SecuredRoute({ component: Component, ...restOfProps }) {
  const user = useSelector((state) => state.user)

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        (user.logged || user.logged === null) ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

export default SecuredRoute;