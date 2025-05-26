'use client'

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // No mostrar en páginas de autenticación
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  // Solo mostrar si el usuario está autenticado
  if (!session) {
    return null;
  }

  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-secondary border-t border-color z-30">
      <div className="flex justify-around items-center py-2">
        {/* Home */}
        <Link 
          href="/"
          className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
            isActive('/') 
              ? 'text-primary bg-primary/10' 
              : 'text-secondary hover:text-primary hover:bg-secondary/50'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill={isActive('/') ? 'currentColor' : 'none'}
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth="2"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
            />
          </svg>
          <span className="text-xs mt-1">Inicio</span>
        </Link>

        {/* Create Post */}
        <Link 
          href="/new-post"
          className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
            isActive('/new-post') 
              ? 'text-primary bg-primary/10' 
              : 'text-secondary hover:text-primary hover:bg-secondary/50'
          }`}
        >
          <div className="relative">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              isActive('/new-post') 
                ? 'border-primary bg-primary/20' 
                : 'border-secondary'
            }`}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth="2"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
            </div>
          </div>
          <span className="text-xs mt-1">Crear</span>
        </Link>

        {/* Profile */}
        <Link 
          href={`/profile/${session.user.username}`}
          className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
            isActive(`/profile/${session.user.username}`) 
              ? 'text-primary bg-primary/10' 
              : 'text-secondary hover:text-primary hover:bg-secondary/50'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
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
          <span className="text-xs mt-1">Perfil</span>
        </Link>
      </div>
    </div>
  );
} 