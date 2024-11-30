
// import './App.css';
// import Addticket from './components/ticket/add_ticket';
// import Paymentlist from './components/ticket/payment_list';
// import Promptpay from './components/ticket/promptpay';
// import Payment from './components/ticket/Payment';
// import LineoaTicket from './components/auth/login_ticket';
// import LineoaOrderlist from './components/auth/login_orderlist';
// import Makepayment from './components/reserve/makepayment';
// import OrderList from './components/reserve/OrderItem';
// import Ticketpostpone from './components/reserve/ticketpostpone';
// import PDFViewer from './components/PDFViewer/PDFViewer';
// import ZooList from './components/zoodetalls/zoodetalls';
// import Lineconnext from './components/auth/line_context';
// import AddressShop from './components/shop/address_shop';
// import Listshop from './components/shop/list_shop';
// import Addcar from './components/shop/add_cart';
// import OrdeShop from './components/shop/order_shop';
// import Cart from './components/shop/cart';
// import CheckOrder from './components/auth/check_order';
// import { Routes, Route } from 'react-router-dom';
// function App() {
//   return (
//     <div>
//       <Routes>
//         <>
//           <Route path='/' element={<Addticket />} />
//           <Route path='/Promptpay' element={<Promptpay />} />
//           <Route path='/Payment' element={<Payment />} />
//           <Route path='/paymentlist' element={<Paymentlist />} />
//           <Route path="/Lineconnext" element={<Lineconnext />} />
//           <Route path="/LineoaTicket" element={<LineoaTicket />} />
//           <Route path="/LineoaOrderlist" element={<LineoaOrderlist />} />
//           <Route path='/makepayment' element={<Makepayment />} />
//           <Route path='/OrderList' element={<OrderList />} />
//           <Route path='/ticketpostpone' element={<Ticketpostpone />} />
//           <Route path='/PDFViewer' element={<PDFViewer/>} />
//           <Route path='/ZooList' element={<ZooList/>} />
//           <Route path='/Addticket' element={<Addticket />} />
//           <Route path='/AddressShop' element={<AddressShop />} />
//           <Route path='/Listshop' element={<Listshop />} />
//           <Route path='/Addcar' element={<Addcar />} />
//           <Route path='/Cart' element={<Cart />} />
//           <Route path='/OrdeShop' element={<OrdeShop />} />
//           <Route path='/CheckOrder' element={<CheckOrder />} />
//         </>
//       </Routes>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState } from 'react';
import './App.css';
import Addticket from './components/ticket/add_ticket';
import Paymentlist from './components/ticket/payment_list';
import Promptpay from './components/ticket/promptpay';
import Payment from './components/ticket/Payment';
import LineoaTicket from './components/auth/login_ticket';
import LineoaOrderlist from './components/auth/login_orderlist';
import Makepayment from './components/reserve/makepayment';
import OrderList from './components/reserve/OrderItem';
import Ticketpostpone from './components/reserve/ticketpostpone';
import PDFViewer from './components/PDFViewer/PDFViewer';
import ZooList from './components/zoodetalls/zoodetalls';
import Lineconnext from './components/auth/line_context';
import AddressShop from './components/shop/address_shop';
import Listshop from './components/shop/list_shop';
import Addcar from './components/shop/add_cart';
import OrdeShop from './components/shop/order_shop';
import Cart from './components/shop/cart';
import CheckOrder from './components/auth/check_order';
import ShopPayment from './components/shop/shop_payment';
import ReCheckTicket from './components/auth/recheck_ticket';
import TranslateComponent from './components/auth/TranslateComponent';
import OrderListv1 from './components/reserve/OrderItem_v1';
import Ticketpostponev1 from './components/reserve/ticketpostpone_v1';
import Listticket from './components/reserve/Listticket';
import { Routes, Route } from 'react-router-dom';
// import axios from 'axios';
function App() {
  const [showRoutes, setShowRoutes] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // translateText('Hello, how are you?','th')
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );

      // หากเวลาอยู่ในช่วง 23:00 ถึง 00:59
      // if ((hours === 23) || (hours === 0 && minutes < 60)) {
      //   setShowRoutes(false);
      // } else {
      //   setShowRoutes(true);
      // }
      if ((hours === 22 && minutes >= 30) || (hours === 23) || (hours === 0 && minutes < 60)) {
        setShowRoutes(false);
      } else {
        setShowRoutes(true);
      }
    };

    checkTime(); // เช็คเวลาเมื่อเริ่มต้น

    const intervalId = setInterval(checkTime, 5000); // เช็คทุกวินาที

    return () => clearInterval(intervalId); // ทำความสะอาดเมื่อ component ถูก unmount
  }, []);
  



  return (
    <div>
      {!showRoutes && (
        <div className="notificationtime">
          <h2>เวลาปัจจุบัน:  {currentTime}</h2>
          <p className='text-danger'>เวลานี้ระบบปิดให้บริการ เปิดให้บริการอีกในเวลา 01:00 น.</p>
        </div>
      )}

      {showRoutes && (
        <Routes>
          <>
            <Route path='/' element={<Addticket />} />
            <Route path='/Promptpay' element={<Promptpay />} />
            <Route path='/Payment' element={<Payment />} />
            <Route path='/paymentlist' element={<Paymentlist />} />
            <Route path="/Lineconnext" element={<Lineconnext />} />
            <Route path="/LineoaTicket" element={<LineoaTicket />} />
            <Route path="/LineoaOrderlist" element={<LineoaOrderlist />} />
            <Route path='/makepayment' element={<Makepayment />} />
            <Route path='/OrderList' element={<OrderList />} />
            <Route path='/ticketpostpone' element={<Ticketpostpone />} />
            <Route path='/OrderList_v1' element={<OrderListv1 />} />
            <Route path='/Ticketpostpone_v1' element={<Ticketpostponev1 />} />
            <Route path='/PDFViewer' element={<PDFViewer />} />
            <Route path='/ZooList' element={<ZooList />} />
            <Route path='/Addticket' element={<Addticket />} />
            <Route path='/AddressShop' element={<AddressShop />} />
            <Route path='/Listshop' element={<Listshop />} />
            <Route path='/Addcar' element={<Addcar />} />
            <Route path='/Cart' element={<Cart />} />
            <Route path='/OrdeShop' element={<OrdeShop />} />
            <Route path='/CheckOrder' element={<CheckOrder />} />
            <Route path='/ShopPayment' element={<ShopPayment />} />
            <Route path='/ReCheckTicket' element={<ReCheckTicket />} />
            <Route path='/TranslateComponent' element={<TranslateComponent />} />
            <Route path="/Listticket" element={<Listticket />} />
          </>
        </Routes>
      )}
    </div>
  );
}

export default App;
