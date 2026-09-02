import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getNavItemsForRole } from '@/navigation/nav';
import { getFirstName } from '@/utils/user-display';
import './HomePage.scss';

function HomePage() {
  const { user } = useAuth();

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/posts" replace />;
  }

  const firstName = getFirstName(user);
  const shortcuts = getNavItemsForRole(user.role).filter((item) => item.to !== '/');

  return (
    <section className="home-page">
      <p className="home-page__kicker">Painel do administrador</p>
      <h2 className="home-page__title">Olá, {firstName}</h2>
      <p>
        Você entrou como <strong>{user.email}</strong>. Daqui você publica aulas e
        acompanha a comunidade do portal.
      </p>

      <ul className="home-page__cards">
        {shortcuts.map((item) => (
          <li key={item.to}>
            <Link className="home-page__card" to={item.to}>
              <span className="home-page__card-label">{item.label}</span>
              <span className="home-page__card-copy">{item.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default HomePage;
