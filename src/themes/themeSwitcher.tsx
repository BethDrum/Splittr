//This will store the current theme and allow toggling to change to high contrast
import { createContext, ReactNode, useContext, useState } from "react";

import { themes } from "./themes";

type ThemeName = "default" | "highContrast";

type ThemeContextType = {
    theme: typeof themes.default;
    themeName: ThemeName;

    changeTheme: (themeName: ThemeName) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({children,}: {children: ReactNode;}) => {
    const [themeName, setThemeName] = useState<ThemeName>('default');

    const changeTheme = (selectedTheme: ThemeName) => {
        setThemeName(selectedTheme);
    };

    const toggleTheme = () => {
        setThemeName(current => current === 'default' ? 'highContrast' : 'default')
    }

    return(
        <ThemeContext.Provider
        value={{
            theme: themes[themeName],
            themeName,
            changeTheme,
            toggleTheme,
        }}>
        {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    
    if (!context){
        throw new Error("useTheme must be used win ThemeProvider");
    }
    return context;
}


