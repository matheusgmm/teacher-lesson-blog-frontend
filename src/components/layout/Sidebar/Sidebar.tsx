import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import BrandLogo from '@/components/ui/BrandLogo/BrandLogo';
import Avatar from '@/components/ui/Avatar/Avatar';
import Icon from '@/components/ui/Icon/Icon';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { getHomePath, getNavItemsForRole } from '@/navigation/nav';
import { getRoleLabel } from '@/utils/user-display';
import './Sidebar.scss';

function Sidebar() {
  const { user, logout } = useAuth();
  const {
    collapsed,
    isDesktop,
    mobileOpen,
    peeking,
    shortcut,
    setPeeking,
    toggleCollapsed,
    closeMobile,
  } = useSidebar();
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);

  const compact = collapsed && !peeking;
  const items = user ? getNavItemsForRole(user.role) : [];
  const homePath = user ? getHomePath(user.role) : '/posts';

  function dismissFlyouts() {
    closeMobile();
    setPeeking(false);
  }

  async function handleLogout() {
    setIsLeaving(true);

    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setIsLeaving(false);
    }
  }

  if (!user) {
    return null;
  }

  const className = [
    'sidebar',
    compact ? 'sidebar--compact' : '',
    peeking ? 'sidebar--peek' : '',
    !isDesktop ? 'sidebar--mobile' : '',
    mobileOpen ? 'sidebar--open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {isDesktop ? (
        <div
          className={`sidebar-rail${collapsed ? ' sidebar-rail--collapsed' : ''}`}
          aria-hidden="true"
        />
      ) : null}

      {!isDesktop && mobileOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Fechar menu"
          onClick={closeMobile}
        />
      ) : null}

      <aside
        className={className}
        aria-label="Navegação principal"
        id="navegacao-principal"
        onMouseEnter={() => {
          if (isDesktop && collapsed) {
            setPeeking(true);
          }
        }}
        onMouseLeave={() => setPeeking(false)}
      >
        <div className="sidebar__top">
          <div className="sidebar__brand" onClick={dismissFlyouts}>
            <BrandLogo to={homePath} size="sm" showTagline={false} />
          </div>

          {isDesktop ? (
            <button
              type="button"
              className="sidebar__icon-btn"
              onClick={toggleCollapsed}
              aria-label={collapsed ? `Expandir e fixar menu (${shortcut})` : `Recolher menu (${shortcut})`}
              title={collapsed ? `Expandir e fixar · ${shortcut}` : `Recolher · ${shortcut}`}
            >
              <Icon name="panel" />
            </button>
          ) : (
            <button
              type="button"
              className="sidebar__icon-btn"
              onClick={closeMobile}
              aria-label="Fechar menu"
            >
              <Icon name="close" />
            </button>
          )}
        </div>

        <nav className="sidebar__nav">
          <p className="sidebar__section" hidden={compact}>
            Navegação
          </p>
          <ul className="sidebar__list">
            {items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `sidebar__link${isActive ? ' is-active' : ''}`
                  }
                  onClick={dismissFlyouts}
                  aria-label={compact ? item.label : undefined}
                  title={compact ? item.label : item.description}
                >
                  <Icon name={item.icon} />
                  <span className="sidebar__label">{item.label}</span>
                  {compact ? (
                    <span className="sidebar__tooltip" role="tooltip">
                      {item.label}
                    </span>
                  ) : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {!compact ? (
          <p className="sidebar__hint">
            Atalho <kbd>{shortcut}</kbd> recolhe o menu
          </p>
        ) : null}

        <div className="sidebar__user">
          <div className="sidebar__user-main">
            <Avatar name={user.name} role={user.role} />
            <div className="sidebar__user-copy">
              <p className="sidebar__user-name">{user.name}</p>
              <p className="sidebar__user-email">{user.email}</p>
              <span className={`sidebar__role sidebar__role--${user.role.toLowerCase()}`}>
                {getRoleLabel(user.role)}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar__icon-btn sidebar__logout"
            onClick={handleLogout}
            disabled={isLeaving}
            aria-label="Sair da conta"
            title="Sair"
          >
            <Icon name="logout" />
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
