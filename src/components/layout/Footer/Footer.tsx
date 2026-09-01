import './Footer.scss';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>© {year} Portal Acadêmico — espaço de postagens para docentes e estudantes.</p>
    </footer>
  );
}

export default Footer;
