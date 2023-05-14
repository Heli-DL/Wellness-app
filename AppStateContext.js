import { createContext, useState } from "react";

export const AppStateContext = createContext();

// This component will be used to share the state between the components
const AppStateProvider = props => {
  const [percentage, setPercentage] = useState(0);
  const [totalTime, setTotalTime] = useState(null);

  const contextValue = {
    percentage,
    setPercentage,
    totalTime,
    setTotalTime,
  };

  return (
    <AppStateContext.Provider value={contextValue}>
      {props.children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;