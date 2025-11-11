import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// NavButton component using ModuWeb Design System
const NavButton: React.FC<{ 
  children: React.ReactNode; 
  to?: string; 
  selected?: boolean; 
  onClick?: () => void;
}> = ({ children, to, selected, onClick }) => {
  const className = `${selected ? 'nav-link-active' : 'nav-link'} whitespace-nowrap`;

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Check if current route matches
  const isCurrentRoute = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      {/* Top navbar */}
      <header className="sticky top-0 z-40 bg-bg-card border-b border-border shadow-soft">
        <div className="page-container !py-0">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="text-2xl font-bold text-text-primary">
                <Link to="/" className="hover:text-brand transition-colors">ModuWeb</Link>
              </div>

              <nav className="hidden md:flex items-center gap-1">
                <NavButton to="/" selected={isCurrentRoute('/')}>
                  Homepage
                </NavButton>
                {user && (
                  <>
                    <NavButton to="/dashboard" selected={isCurrentRoute('/dashboard')}>
                      Dashboard
                    </NavButton>
                    <NavButton to="/dashboard/bookings" selected={location.pathname.includes('/bookings')}>
                      Bookings
                    </NavButton>
                    <NavButton to="/webshop" selected={isCurrentRoute('/webshop')}>
                      Webshop
                    </NavButton>
                  </>
                )}
                <NavButton to="/about" selected={isCurrentRoute('/about')}>
                  About
                </NavButton>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="text-sm text-text-secondary hidden sm:block">
                    Welcome, {user.userName}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="btn-secondary text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavButton to="/login">Login</NavButton>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="page-container">
        <div className="grid grid-cols-12 gap-8">
          {/* Left column: sidebar for app pages - only show when user is logged in */}
          {user && (
            <aside className="col-span-12 md:col-span-3">
              <div className="sticky top-24">
                <div className="card p-4 space-y-4 fade-in">
                  <div className="text-sm font-semibold text-text-secondary">App</div>
                  <div className="flex flex-col gap-1">
                    <Link
                      to="/dashboard"
                      className={`${
                        isCurrentRoute('/dashboard') 
                          ? 'sidebar-link-active' 
                          : 'sidebar-link'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/bookings"
                      className={`${
                        location.pathname.includes('/bookings')
                          ? 'sidebar-link-active' 
                          : 'sidebar-link'
                      }`}
                    >
                      Booking Manager
                    </Link>
                    <Link
                      to="/webshop"
                      className={`${
                        isCurrentRoute('/webshop')
                          ? 'sidebar-link-active' 
                          : 'sidebar-link'
                      }`}
                    >
                      Webshop
                    </Link>
                    <Link
                      to="/containers"
                      className={`${
                        isCurrentRoute('/containers')
                          ? 'sidebar-link-active' 
                          : 'sidebar-link'
                      }`}
                    >
                      Containers & Config
                    </Link>
                    <Link
                      to="/account/settings"
                      className={`${
                        isCurrentRoute('/account/settings')
                          ? 'sidebar-link-active' 
                          : 'sidebar-link'
                      }`}
                    >
                      Account Settings
                    </Link>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="text-xs text-text-secondary">Product</div>
                    <div className="text-sm font-medium text-text-primary mt-2">ModuWeb Platform</div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-text-secondary">
                  💡 Tips: Each customer runs in their own container with separate DB & YAML config.
                </div>
              </div>
            </aside>
          )}

          {/* Main content area */}
          <section className={user ? "col-span-12 md:col-span-9" : "col-span-12"}>
            <div className="slide-up">
              {children}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BaseLayout;