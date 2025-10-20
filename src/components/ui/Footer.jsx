import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const schoolName = "E.E Profº Anibal do Prado e Silva";
  const address = "R. Antônio Paes de Camargo - Bairro Talavasso, Taquaritinga - SP, 15900-000";
  const phone = "(16) 3252-2911";
  const phoneLink = "tel:+551632522911";
  const instagramUrl = "https://www.instagram.com/eeanibalprado/";
  
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <footer className="bg-[#4455a3] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Seção principal do rodapé */}
        <div className="flex flex-col md:flex-row justify-between text-center md:text-left space-y-8 md:space-y-0">
          
          {/* Nome da Escola */}
          <div className="md:w-1/3">
            <h2 className="text-xl font-bold mb-2">{schoolName}</h2>
            <p className="text-sm text-blue-200">Taquaritinga - SP</p>
          </div>

          {/* Informações de Contato */}
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-3">Contato</h3>
            <div className="space-y-2 text-sm">
              <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center md:justify-start hover:text-gray-300 transition-colors duration-300"
              >
                <FaMapMarkerAlt className="mr-3 flex-shrink-0" />
                <span>{address}</span>
              </a>
              <a 
                href={phoneLink} 
                className="flex items-center justify-center md:justify-start hover:text-gray-300 transition-colors duration-300"
              >
                <FaPhone className="mr-3 flex-shrink-0" />
                <span>{phone}</span>
              </a>
            </div>
          </div>
          
          {/* Redes Sociais */}
          <div className="md:w-1/3 flex flex-col items-center md:items-end">
             <h3 className="text-lg font-semibold mb-3">Siga-nos</h3>
             <a 
               href={instagramUrl} 
               target="_blank" 
               rel="noopener noreferrer" 
               aria-label={`Instagram da ${schoolName}`}
               className="text-3xl hover:text-gray-300 transition-colors duration-300"
             >
               <FaInstagram />
             </a>
          </div>

        </div>
        
        {/* Linha divisória e Copyright */}
        <div className="mt-8 pt-6 border-t border-blue-400 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {schoolName}. Todos os direitos reservados.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;