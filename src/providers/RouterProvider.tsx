import { Routes, Route, Link, BrowserRouter } from 'react-router-dom';

import { Home } from '../pages';

export function RouterProvider() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        {/* <Route path="about" element={<About />} /> */}
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>404!</h2>
      <p>
        <Link to="/">Home</Link>
      </p>
    </div>
  );
}
