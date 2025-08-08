import React, { useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import emailjs from "@emailjs/browser";

function Footer({ onApropos, onContact,setMentionType, onCarriere }) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");
  //emailJs
  const SERVICE_ID = "service_4sx33jn";
  const TEMPLATE_ID = "template_2vlovks";
  const PUBLIC_KEY = "kYNg3fGtO-rwkqvZf";

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setNewsletterMsg("Veuillez entrer un email valide.");
      return;
    }
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { user_email: newsletterEmail },
        PUBLIC_KEY
      );
      setNewsletterMsg("Un email de bienvenue a été envoyé à " + newsletterEmail + " !");
      setNewsletterEmail("");
    } catch (err) {
      setNewsletterMsg("Erreur lors de l'envoi. Réessaie plus tard.");
    }
  };
  return (
  <footer className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 text-white relative z-30 mt-16 overflow-hidden">
    <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 opacity-20 rounded-full filter blur-3xl animate-blob1"></div>
    <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-400 opacity-20 rounded-full filter blur-3xl animate-blob2"></div>
    <div className="pointer-events-none absolute inset-0 opacity-10" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>
    <div className="max-w-7xl mx-auto px-6 py-14 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Section MAGASINER */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-green-400 tracking-widest">MAGASINER</h3>
          <ul className="space-y-2 text-base">
            <li><a href="#" className="hover:text-green-400 transition-colors">Nouveautés</a></li>
          </ul>
        </div>
        {/* Section A PROPOS DE NOUS */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-green-400 tracking-widest">À PROPOS DE NOUS</h3>
          <ul className="space-y-2 text-base">
            <li>
              <button
                onClick={onApropos}
                className="hover:text-green-400 transition-colors bg-transparent p-0 m-0 text-left"
              >
                Notre mission
              </button>
            </li>
            <li>
              <button
                onClick={onApropos}
                className="hover:text-green-400 transition-colors bg-transparent p-0 m-0 text-left"
              >
                Notre histoire
              </button>
            </li>
            <li>
              <button
  onClick={onCarriere}
  className="hover:text-green-400 transition-colors bg-transparent p-0 m-0 text-left"
>
  Carrières
</button>
            </li>
          </ul>
        </div>
        {/* Section BESOIN D'AIDE */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-green-400 tracking-widest">BESOIN D'AIDE ?</h3>
          <ul className="space-y-2 text-base">
            <li>
              <button
                onClick={onContact}
                className="hover:text-green-400 transition-colors bg-transparent p-0 m-0 text-left"
              >
                Contactez-nous
              </button>
            </li>
            <li><a href="#" className="hover:text-green-400 transition-colors">Clavardez avec nous</a></li>
            <li>
              <button
                onClick={onApropos}
                className="hover:text-green-400 transition-colors bg-transparent p-0 m-0 text-left"
              >
                Notre histoire
              </button>
            </li>            
            <li><a href="#" className="hover:text-green-400 transition-colors">Concours</a></li>
          </ul>
        </div>
        {/* Section Newsletter et reseaux sociaux */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-green-400 tracking-widest">NEWSLETTER</h3>
          <p className="text-gray-300 mb-4">Restez informé de nos dernières news</p>
          <form className="mb-6" onSubmit={handleNewsletterSubmit}>
            <div className="flex">
              <input
                type="email"
                placeholder="Votre email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-l-md focus:outline-none focus:border-green-400 text-white placeholder-gray-400"
              />
              <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-r-md transition-colors font-semibold"
                >
                  S'inscrire
                </button>
              </div>
              {newsletterMsg && (
                <div className="mt-2 text-sm text-green-400">{newsletterMsg}</div>
              )}
          </form>
          {/* reseaux sociaux */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-300">SUIVEZ-NOUS</h4>
            <div className="flex space-x-4">
              <a href="https://github.com/kirito1338" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="mailto:contact@covoituragepro.com" className="text-gray-400 hover:text-green-400 transition-colors" aria-label="Email">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Mentions legales */}
      <div className="border-t border-gray-800 mt-12 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <span className="inline-block w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xl animate-pulse-glow">
              🚗
            </span>
            <span className="text-lg font-semibold tracking-wide">VroomVroom</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
          <a href="#" onClick={() => setMentionType("cgu")} className="text-gray-400 hover:text-green-400 transition-colors">Conditions générales</a>
          <a href="#" onClick={() => setMentionType("privacy")} className="text-gray-400 hover:text-green-400 transition-colors">Politique de confidentialité</a>
          <a href="#" onClick={() => setMentionType("access")} className="text-gray-400 hover:text-green-400 transition-colors">Accessibilité</a>
          <a href="#" onClick={() => setMentionType("transparency")} className="text-gray-400 hover:text-green-400 transition-colors">Transparence</a>
          </div>
          <div className="text-sm text-gray-500 font-medium text-center md:text-right mt-4 md:mt-0">
            © {new Date().getFullYear()} Covoiturage Pro. Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
    <style>{`
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 16px 4px #22d3ee; }
        50% { box-shadow: 0 0 32px 12px #22c55e; }
      }
      @keyframes blob1 {
        0%,100% { transform: translateY(0) scale(1);}
        50% { transform: translateY(40px) scale(1.1);}
      }
      @keyframes blob2 {
        0%,100% { transform: translateY(0) scale(1);}
        50% { transform: translateY(-40px) scale(1.05);}
      }
      .animate-pulse-glow { animation: pulse-glow 2.5s infinite; }
      .animate-blob1 { animation: blob1 18s ease-in-out infinite; }
      .animate-blob2 { animation: blob2 22s ease-in-out infinite; }
    `}</style>
  </footer>
  );
}

export default Footer;