import { useAuth } from '@/hooks/useAuth';
import './HomePage.scss';

function HomePage() {
  const { user } = useAuth();
  const firstName = user?.name.trim().split(/\s+/)[0] ?? 'visitante';

  return (
    <section className="home-page">
      <p className="home-page__kicker">Portal Acadêmico</p>
      <h1>Olá, {firstName}</h1>
      <p>
        Você entrou como <strong>{user?.email}</strong>
        {user?.role === 'ADMIN' ? ' (administrador)' : ''}. As postagens de
        docentes e estudantes vão aparecer nesta área.
      </p>
    </section>
  );
}

export default HomePage;
