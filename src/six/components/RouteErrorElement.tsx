import React from 'react';
import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom';

const RouteErrorElement: React.FC = () => {
  const error = useRouteError();

  let title = 'Oops!';
  let message = 'An unexpected error occurred.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    const data = (error as unknown as { data?: unknown }).data;
    if (data && typeof data === 'object' && 'message' in data) {
      const m = (data as { message?: string }).message;
      if (m) message = m;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>{title}</h2>
      <p>{message}</p>
      <Link to="/">Go back home</Link>
    </div>
  );
};

export default RouteErrorElement;
