import { Outlet } from 'react-router-dom';
import Footer from '@/components/layout/Footer/Footer';
import Header from '@/components/layout/Header/Header';
import Main from '@/components/layout/Main/Main';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import { SidebarProvider } from '@/context/SidebarProvider';

function AppShell() {
  return (
    <div className="app-frame">
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Sidebar />
      <div className="app-frame__shell">
        <Header />
        <Main>
          <Outlet />
        </Main>
        <Footer />
      </div>
    </div>
  );
}

function AppLayout() {
  return (
    <SidebarProvider>
      <AppShell />
    </SidebarProvider>
  );
}

export default AppLayout;
