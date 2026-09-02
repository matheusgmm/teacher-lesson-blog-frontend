import { Link } from 'react-router-dom';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import { useAuth } from '@/hooks/useAuth';

function PostsPage() {
  const { user } = useAuth();
  const canPublish = user?.role === 'ADMIN';

  return (
    <EmptyState
      kicker="Lições"
      title="Ainda não há postagens por aqui"
      description="Quando as aulas forem publicadas, elas aparecem nesta lista para toda a comunidade autenticada."
      action={
        canPublish ? (
          <Link to="/posts/new">Escrever a primeira aula</Link>
        ) : null
      }
    />
  );
}

export default PostsPage;
