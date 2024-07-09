import React, { useState, useEffect } from 'react';
import '../index.css'

const DarkModeSwitch = () => {
    const [darkMode, setDarkMode] = useState(null);

    useEffect(() => {
        // Проверка сохраненной темы в локальном хранилище или на элементе root
        const root = document.documentElement;
        const isDark = root.style.getPropertyValue('--primaryColor') === '#012C6E';

        setDarkMode(isDark);
    }, []);

    const handleDarkModeToggle = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode); // Инвертируем текущее состояние темы
        updateTheme(newDarkMode); // Вызываем функцию для обновления темы

        // Сохраняем текущую тему в локальном хранилище
        localStorage.setItem('darkMode', newDarkMode);
    };

    const updateTheme = (isDarkMode) => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.style.setProperty('--primaryColor', '#012C6E');
            root.style.setProperty('--primaryHoverColor', '#001f55');
            root.style.setProperty('--backgroundWhite', '#fff');
            root.style.setProperty('--textWhite', '#FFFFFF');
            root.style.setProperty('--textBlack', '#fff');
            root.style.setProperty('--lineColor', '#888');
            root.style.setProperty('--linkActive', '#000');
        } else {
            // root.style.setProperty('--primaryColor', '#121212');
            // root.style.setProperty('--primaryHoverColor', '#0e0e0e');
            root.style.setProperty('--primaryColor', '#092332');
            root.style.setProperty('--primaryHoverColor', '#081b29');
            root.style.setProperty('--backgroundWhite', '#fff');
            root.style.setProperty('--textWhite', '#FFFFFF');
            root.style.setProperty('--textBlack', '#000');
            root.style.setProperty('--lineColor', '#ddd');
        }
    };

    // Не отображаем кнопку, пока не определена текущая тема
    if (darkMode === null) return null;

    return (
        <button
            type="button"
            className={`hs-dark-mode ${darkMode ? 'hs-dark-mode-active:hidden' : 'hs-dark-mode-active:inline-flex'} inline-flex items-center gap-x-2 py-3 px-3 bg-white/10 rounded-full text-sm text-white hover:bg-white/20`}
            onClick={handleDarkModeToggle}
            data-hs-theme-click-value={darkMode ? 'light' : 'dark'}
        >
            <svg
                className="flex-shrink-0 size-5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {darkMode ? (
                    <>
                        <circle cx="12" cy="12" r="4"></circle>
                        <path d="M12 2v2"></path>
                        <path d="M12 20v2"></path>
                        <path d="m4.93 4.93 1.41 1.41"></path>
                        <path d="m17.66 17.66 1.41 1.41"></path>
                        <path d="M2 12h2"></path>
                        <path d="M20 12h2"></path>
                        <path d="m6.34 17.66-1.41 1.41"></path>
                        <path d="m19.07 4.93-1.41 1.41"></path>
                    </>
                ) : (
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                )}
            </svg>
            {/*{darkMode ? 'Light' : 'Dark'}*/}
        </button>
    );
};

export default DarkModeSwitch;
