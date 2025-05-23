'use client'

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  return (
    <nav className="bg-secondary border-b border-color fixed w-full top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              AlkaBeta
            </Link>
          </div>
          
          <div className="flex items-center">
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
                    <span className="hidden sm:inline">Mi Perfil</span>
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
        </div>
      </div>
    </nav>
  );
} 