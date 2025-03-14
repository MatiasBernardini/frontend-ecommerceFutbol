import { useDispatch, useSelector } from 'react-redux'; 
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NewProduct from './pages/newProduct';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import ScrollToTop from './components/ScrollToTop';
import CartPage from './pages/CartPage';
import 'font-awesome/css/font-awesome.min.css';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import EditProductPage from './pages/EditProductPage';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { addNotification } from './features/userSlice';


function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(()=>{
    const socket = io("ws://localhost:8080");
    socket.off("notification").on("notification", (msgObj, user_id) => {
      if(user_id === user_id){
        dispatch(addNotification(msgObj))
      }
    });

    socket.off("new-order").on("new-order", (msgObj) => {
      if (user.isAdmin) {
          dispatch(addNotification(msgObj));
      }
    });
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop/>
        <Navigation />
        <Routes>
          <Route index element={<Home />} />
          {!user && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}

          {user && (
            <>
              <Route path='/cart' element={<CartPage />}/> 
              <Route path='/orders' element={<OrdersPage />}/> 
            </>
          )}

          {user && user.isAdmin && (
            <>
              <Route path='/admin' element={<AdminDashboard />}/> 
              <Route path='/product/:id/edit' element={<EditProductPage />}/> 

            </>
          )}

          <Route path="*" element={<Home />} />
          <Route path="/new-Product" element={<NewProduct />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
