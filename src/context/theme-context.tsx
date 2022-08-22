import React from "react";
import { createContext, useContext, useReducer } from "react";
type Action = { type: "LIGHTMODE" } | { type: "DARKMODE" };
type Dispatch = (action: Action) => void;
type State = { darkMode: boolean };

export const ThemeContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

export const themeReducer = (state: any, action: { type: any }) => {
  switch (action.type) {
    case "LIGHTMODE":
      return { darkMode: false };
    case "DARKMODE":
      return { darkMode: true };
    default:
      return state;
  }
};

const ThemeProvider = ({ children }: { children: JSX.Element }) => {
  const initialState = { darkMode: false };
  const [state, dispatch] = useReducer(themeReducer, initialState);
  return (
    <ThemeContext.Provider value={{ state: state, dispatch: dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
};
const useCustomTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
export { ThemeProvider, useCustomTheme };
