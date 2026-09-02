import BrandLogo from '@/components/ui/BrandLogo/BrandLogo';
import Icon from '@/components/ui/Icon/Icon';
import ThemeToggle from '@/components/ui/ThemeToggle/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { getHomePath, getTitleForPath } from '@/navigation/nav';
import { useLocation } from 'react-router-dom';
import './Header.scss';

function Header() {
  const location = useLocation();
  const { user } = useAuth();
  const { isDesktop, mobileOpen, openMobile } = useSidebar();
  const title = getTitleForPath(location.pathname);
  const homePath = user ? getHomePath(user.role) : '/posts';

  return (
    <header className="header">
      {!isDesktop ? (
        <button
          type="button"
          className="header__menu"
          onClick={openMobile}
          aria-label="Abrir menu"
          aria-expanded={mobileOpen}
          aria-controls="navegacao-principal"
        >
          <Icon name="menu" />
        </button>
      ) : null}

      {!isDesktop ? <BrandLogo to={homePath} size="sm" showTagline={false} /> : null}

      <h1 className="header__title">{title}</h1>

      <ThemeToggle />
    </header>
  );
}

export default Header;
