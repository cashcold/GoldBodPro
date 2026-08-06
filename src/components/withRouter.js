import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export function withRouter(Component) {
  return function ComponentWithRouterProp(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    return (
      <Component
        {...props}
        router={{ navigate, location, params }}
      />
    );
  };
}
