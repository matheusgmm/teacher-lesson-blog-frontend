import EmptyState from '@/components/ui/EmptyState/EmptyState';

function NewPostPage() {
  return (
    <EmptyState
      kicker="Publicar"
      title="O editor de aulas vem a seguir"
      description="Somente administradores publicam. Em breve você poderá escrever título, conteúdo e status da lição nesta tela."
    />
  );
}

export default NewPostPage;
