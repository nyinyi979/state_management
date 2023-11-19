import { Provider } from 'react-redux';
import './App.css'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { store } from './slices/store'
import Home from './page';
import {Route , BrowserRouter as Router , Routes} from 'react-router-dom'
import PlayersPage from './Players';
const persistor = persistStore(store);
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/players' element={<PlayersPage />} />
        </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App
