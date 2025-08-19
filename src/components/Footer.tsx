import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';

interface FooterProps {
  currentLang?: string;
}

export default function Footer({ currentLang }: FooterProps) {
  return (
    <footer>
      <div className="max-w-7xl mx-auto px-4">
                 {/* Navigation Links */}
         <div className="footer-nav-container">
           {/* Top Countries */}
           <div>
             <h4 className="text-white font-semibold mb-3 text-sm">Countries</h4>
             <ul className="space-y-1">
               <li><Link href={`/${currentLang}/country/thailand`} className="text-gray-300 hover:text-white transition-colors text-sm">Thailand</Link></li>
               <li><Link href={`/${currentLang}/country/spain`} className="text-gray-300 hover:text-white transition-colors text-sm">Spain</Link></li>
               <li><Link href={`/${currentLang}/country/italy`} className="text-gray-300 hover:text-white transition-colors text-sm">Italy</Link></li>
               <li><Link href={`/${currentLang}/country/france`} className="text-gray-300 hover:text-white transition-colors text-sm">France</Link></li>
               <li><Link href={`/${currentLang}/country/japan`} className="text-gray-300 hover:text-white transition-colors text-sm">Japan</Link></li>
               <li><Link href={`/${currentLang}/country/germany`} className="text-gray-300 hover:text-white transition-colors text-sm">Germany</Link></li>
             </ul>
           </div>
           
           {/* Top Destinations */}
           <div>
             <h4 className="text-white font-semibold mb-3 text-sm">Destinations</h4>
             <ul className="space-y-1">
               <li><Link href={`/${currentLang}/destination/bangkok`} className="text-gray-300 hover:text-white transition-colors text-sm">Bangkok</Link></li>
               <li><Link href={`/${currentLang}/destination/phuket`} className="text-gray-300 hover:text-white transition-colors text-sm">Phuket</Link></li>
               <li><Link href={`/${currentLang}/destination/bali`} className="text-gray-300 hover:text-white transition-colors text-sm">Bali</Link></li>
               <li><Link href={`/${currentLang}/destination/tokyo`} className="text-gray-300 hover:text-white transition-colors text-sm">Tokyo</Link></li>
               <li><Link href={`/${currentLang}/destination/paris`} className="text-gray-300 hover:text-white transition-colors text-sm">Paris</Link></li>
               <li><Link href={`/${currentLang}/destination/london`} className="text-gray-300 hover:text-white transition-colors text-sm">London</Link></li>
             </ul>
           </div>
           
           {/* Top Routes */}
           <div>
             <h4 className="text-white font-semibold mb-3 text-sm">Routes</h4>
             <ul className="space-y-1">
               <li><Link href={`/${currentLang}/route/bangkok/chiang-mai`} className="text-gray-300 hover:text-white transition-colors text-sm">Bangkok → Chiang Mai</Link></li>
               <li><Link href={`/${currentLang}/route/london/paris`} className="text-gray-300 hover:text-white transition-colors text-sm">London → Paris</Link></li>
               <li><Link href={`/${currentLang}/route/new-york/tokyo`} className="text-gray-300 hover:text-white transition-colors text-sm">NY → Tokyo</Link></li>
               <li><Link href={`/${currentLang}/route/sydney/melbourne`} className="text-gray-300 hover:text-white transition-colors text-sm">Sydney → Melbourne</Link></li>
               <li><Link href={`/${currentLang}/route/madrid/barcelona`} className="text-gray-300 hover:text-white transition-colors text-sm">Madrid → Barcelona</Link></li>
               <li><Link href={`/${currentLang}/route/rome/milan`} className="text-gray-300 hover:text-white transition-colors text-sm">Rome → Milan</Link></li>
             </ul>
           </div>
         </div>
        
        {/* Logo and Language */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-700">
          {/* Logo */}
          <Link href={`/${currentLang || 'en'}`} className="flex items-center gap-2" aria-label="MondoExplora Home">
            <span className="text-lg font-light">Mondo</span>
            <span className="text-lg font-bold bg-white/30 text-blue-900 px-2 py-1 rounded">Explora</span>
          </Link>
          
          {/* Language Switcher */}
          {currentLang && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Idioma / Language:</span>
              <LanguageSwitcher currentLang={currentLang} />
            </div>
          )}
        </div>
        

      </div>
    </footer>
  );
} 