'use client'

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("mobile-sidebar");
      const hamburgerButton = document.getElementById("hamburger-button");
      
      if (isOpen && 
          sidebar && 
          hamburgerButton && 
          !sidebar.contains(event.target) && 
          !hamburgerButton.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Prevent scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <nav className="bg-secondary border-b border-color fixed w-full top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                AlkaBeta
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center">
              <ThemeToggle />
              
              <div className="ml-4">
                {loading ? (
                  <div className="text-primary">Cargando...</div>
                ) : session ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/new-post"
                      className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-full"
                    >
                      Nuevo Post
                    </Link>
                    
                    <Link 
                      href={`/profile/${session.user.username}`} 
                      className="flex items-center space-x-2 py-2 px-3 hover:bg-secondary/80 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
                        {session.user.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <span className="text-background text-sm font-bold">
                            {session.user.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span>Mi Perfil</span>
                    </Link>
                    
                    <button 
                      onClick={() => signOut()}
                      className="text-primary hover:text-foreground"
                    >
                      Salir
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Link
                      href="/auth/signin"
                      className="text-foreground hover:text-primary px-3 py-2"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-full"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile hamburger button */}
            <div className="md:hidden flex items-center">
              <ThemeToggle />
              
              <button 
                id="hamburger-button"
                className="ml-2 p-2 rounded-md hover:bg-secondary/80 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-foreground" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar/drawer */}
      <div 
        id="mobile-sidebar" 
        className={`fixed md:hidden top-0 right-0 bottom-0 w-64 bg-background border-l border-color z-20 shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-end">
            <button 
              className="p-2 rounded-md hover:bg-secondary/80" 
              onClick={() => setIsOpen(false)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col space-y-4 mt-8">
            <Link 
              href="/"
              className="text-foreground hover:text-primary text-lg py-2 px-4 rounded-md hover:bg-secondary"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            
            {loading ? (
              <div className="text-primary px-4 py-2">Cargando...</div>
            ) : session ? (
              <>
                <Link 
                  href={`/profile/${session.user.username}`}
                  className="flex items-center space-x-2 text-foreground hover:text-primary py-2 px-4 rounded-md hover:bg-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center shrink-0">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <span className="text-background text-xs font-bold">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span>Mi Perfil</span>
                </Link>
                
                <Link 
                  href="/new-post"
                  className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Nuevo Post
                </Link>
                
                <button 
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="text-foreground hover:text-primary py-2 px-4 rounded-md hover:bg-secondary text-left"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin"
                  className="text-foreground hover:text-primary py-2 px-4 rounded-md hover:bg-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                
                <Link 
                  href="/auth/signup"
                  className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Overlay when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground bg-opacity-50 md:hidden z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
} 