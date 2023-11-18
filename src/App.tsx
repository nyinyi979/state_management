import { Provider } from 'react-redux';
import './App.css'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { store } from './slices/store'
import Home from './page';
import {Route , HashRouter as Router} from 'react-router-dom'
import PlayersPage from './Players';
const persistor = persistStore(store);
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Route path='/' Component={Home}>Home</Route>
          <Route path='/players' Component={PlayersPage}>Players</Route>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App
