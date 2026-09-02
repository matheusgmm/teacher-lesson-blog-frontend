import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '@/components/ui/BrandLogo/BrandLogo';
import Button from '@/components/ui/Button/Button';
import ThemeToggle from '@/components/ui/ThemeToggle/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import './Header.scss';

type HeaderProps = {
  title?: string;
};

function Header({ title }: HeaderProps) {
  const pageTitle = title?.trim();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);

  async function handleLogout() {
    setIsLeaving(true);

    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setIsLeaving(false);
    }
  }

  return (
    <header className="header">
      <BrandLogo to="/" size="md" />

      {pageTitle ? <p className="header__page">{pageTitle}</p> : null}

      <div className="header__actions">
        {isAuthenticated && user ? (
          <div className="header__session">
            <p className="header__user" title={user.email}>
              {user.name}
            </p>
            <Button
              variant="ghost"
              onClick={handleLogout}
              loading={isLeaving}
              aria-label="Sair da conta"
            >
              Sair
            </Button>
          </div>
        ) : null}
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Header;
