import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { ShortsFeed } from "./pages/ShortsFeed";
import { HomeFeed } from "./pages/HomeFeed";
import "./styles/App.module.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeFeed />} />
          <Route path="/shorts" element={<ShortsFeed />} />
          <Route path="/shorts/:id" element={<ShortsFeed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
