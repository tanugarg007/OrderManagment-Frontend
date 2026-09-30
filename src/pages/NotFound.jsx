import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="page page--404">
      <div className="container notfound-inner">
        <span className="notfound-code">404</span>
        <h1>Page not found</h1>
        <p className="page-subtitle">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="hero-actions notfound-actions">
          <Link to="/" className="btn btn-primary btn-lg">Back to Home</Link>
          <Link to="/dashboard" className="btn btn-outline btn-lg">Go to Dashboard</Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
