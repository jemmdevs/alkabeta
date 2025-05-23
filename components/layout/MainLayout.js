'use client'

import Navbar from "./Navbar";
import SearchBar from "../search/SearchBar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-16 bg-secondary/60 border-b border-color">
        <SearchBar />
      </div>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      <footer className="bg-secondary border-t border-color py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-secondary">
            © {new Date().getFullYear()} AlkaBeta - Creado con Next.js 15
          </p>
        </div>
      </footer>
    </div>
  );
} 