import { Route, Routes } from "react-router-dom";
import MainPage from "./MainPage/MainPage";
import { Auddio } from "./Auddio/Auddio";
import  Chat  from "./Chat/Chat";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<MainPage />} />
        <Route path="/audio" element={<Auddio />} />
        <Route path="/chat" element={<Chat />}/>
      </Routes>
    </>
  );
};

export default App;
