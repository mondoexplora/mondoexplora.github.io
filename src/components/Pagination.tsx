'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalHotels: number;
  hotelsPerPage: number;
  onPageChange: (page: number) => void;
  lang?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalHotels,
  hotelsPerPage,
  onPageChange,
  lang = 'en'
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const startHotel = (currentPage - 1) * hotelsPerPage + 1;
  const endHotel = Math.min(currentPage * hotelsPerPage, totalHotels);

  // Language-specific text
  const getText = () => {
    switch (lang) {
      case 'es':
        return {
          showing: `Mostrando ${startHotel}-${endHotel} de ${totalHotels} hoteles`,
          previous: 'Anterior',
          next: 'Siguiente'
        };
      case 'fr':
        return {
          showing: `Affichage de ${startHotel}-${endHotel} sur ${totalHotels} hôtels`,
          previous: 'Précédent',
          next: 'Suivant'
        };
      case 'it':
        return {
          showing: `Mostrando ${startHotel}-${endHotel} di ${totalHotels} hotel`,
          previous: 'Precedente',
          next: 'Successivo'
        };
      default: // 'en'
        return {
          showing: `Showing ${startHotel}-${endHotel} of ${totalHotels} hotels`,
          previous: 'Previous',
          next: 'Next'
        };
    }
  };

  const text = getText();

  return (
    <div className="flex justify-end items-center gap-4 py-8">
      <div className="text-sm text-gray-500">
        {text.showing}
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          {text.previous}
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-2 py-1 text-sm ${
                page === currentPage 
                  ? 'text-gray-900 font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          {text.next}
        </button>
      </div>
    </div>
  );
} 