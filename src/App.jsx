import axios from 'axios';
import "./App.css"
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import apiUrl from './apiUrl';
import toggleLoading from './redux/actions/loadingActions';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Login from './pages/Login';
import QuestionStructures from './pages/QuestionStructures';
import Loading from './components/Loading';

const App = () => {
  const loading = useSelector((state) => state.loading);
  const [serverWorking, setServerWorking] = useState(false);
  const dispatch = useDispatch();

  const checkServer = useCallback(async () => {
    let interval = setInterval(() => {
      axios.get(apiUrl)
        .then(() => {
          setServerWorking(true);
          dispatch(toggleLoading(false));
          clearInterval(interval);
        })
        .catch((error) => {
          setServerWorking(false);
        })
    }, 100);
  }, [dispatch])

  useEffect(() => {
    if (serverWorking !== true) {
      checkServer();
    }
  }, [checkServer, serverWorking])

  return (
    <>
      {
        loading ?
          <Loading />
          :
          <BrowserRouter>
            <Routes>
              <Route path='/' Component={Login} />
              <Route path='/start-assessment' Component={QuestionStructures} />
            </Routes>
          </BrowserRouter>
      }
    </>
  )
}

export default App