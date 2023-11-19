import { Provider } from 'react-redux';
import './App.css'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { store } from './slices/store'
const persistor = persistStore(store);
import Home from './page.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import PlayersPage from './Players.tsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/players",
    element: <PlayersPage />
  }
]);
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router}/>
      </PersistGate>
    </Provider>
  );
};

export default App
