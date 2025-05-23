'use client'

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();
  
  // Controlar el cierre del dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Efecto para buscar usuarios en tiempo real
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data);
            setShowResults(true);
          }
        } catch (error) {
          console.error('Error buscando usuarios:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300); // Pequeño timeout para evitar demasiadas peticiones

    return () => clearTimeout(searchTimer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  const navigateToProfile = (username, e) => {
    // Evitar que el evento se propague al formulario
    if (e) e.preventDefault();
    
    // Navegar al perfil
    router.push(`/profile/${username}`);
    setShowResults(false);
    setSearchQuery('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-3" ref={searchRef}>
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="w-full bg-background border border-color rounded-full py-2 sm:py-3 px-4 sm:px-5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary-dark"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* Resultados de búsqueda en tiempo real */}
          {showResults && (
            <div className="absolute mt-1 w-full bg-secondary border border-color rounded-md shadow-lg z-50 max-h-60 sm:max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="p-2 sm:p-3 text-center">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm sm:text-base">Buscando...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((user) => (
                    <li 
                      key={user._id}
                      className="cursor-pointer hover:bg-background hover:border-primary border-transparent border p-2 sm:p-3"
                      onClick={(e) => navigateToProfile(user.username, e)}
                    >
                      <button 
                        className="w-full text-left flex items-center" 
                        onClick={(e) => navigateToProfile(user.username, e)}
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-foreground flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                            />
                          ) : (
                            <span className="text-background text-xs font-bold">
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-medium text-sm sm:text-base truncate">{user.name}</p>
                          <p className="text-xs sm:text-sm text-secondary truncate">@{user.username}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-2 sm:p-3 text-center text-secondary text-sm sm:text-base">No se encontraron usuarios</p>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
} 