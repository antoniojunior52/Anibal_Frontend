import React from "react";

const Footer = () => (
  <footer className="bg-[#4455a3] text-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
      <p>&copy; {new Date().getFullYear()} Portal da Escola Anibal do Prado e Silva. Todos os direitos reservados.</p>
      <p className="text-sm text-gray-300 mt-2">Feito com ❤️ para a comunidade escolar.</p>
    </div>
  </footer>
);

export default Footer;
