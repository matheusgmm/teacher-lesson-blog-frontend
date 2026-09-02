import EmptyState from '@/components/ui/EmptyState/EmptyState';

function UsersPage() {
  return (
    <EmptyState
      kicker="Comunidade"
      title="A lista de pessoas vem a seguir"
      description="Administradores vêem docentes e estudantes cadastrados. Membros comuns não acessam esta área."
    />
  );
}

export default UsersPage;
