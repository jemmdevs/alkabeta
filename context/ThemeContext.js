'use client';

import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  // Usar mounted para evitar errores de hidratación en SSR
  const [mounted, setMounted] = useState(false);
  
  // Al montar el componente, leer la preferencia del usuario desde localStorage
  useEffect(() => {
    setMounted(true);
    
    // Solo acceder a localStorage en el cliente
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.setAttribute('data-theme', storedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        setTheme('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);
  
  const toggleTheme = () => {
    // Solo cambiar el tema si estamos en el cliente
    try {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };
  
  // No renderizar contenido con valores específicos de tema hasta que estemos montados
  // para evitar problemas de hidratación entre cliente y servidor
  if (!mounted) {
    return <>{children}</>;
  }
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 