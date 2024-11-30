/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import {  API_ENDPOINT } from '../auth/config';
import './CookieConsent.css'; // อย่าลืมสร้างไฟล์ CSS เพื่อการจัดการรูปแบบ

const CookieConsent = () => {
  const [cookies, setCookie] = useCookies(['cookieConsent']);
  const [showPopup, setShowPopup] = useState(false);
  const [agreementText, setAgreementText] = useState('');
  const userid = localStorage.getItem('userid');
  const navigate = useNavigate();
  
  useEffect(() =>  {
    chack_cookie();
    c();
  
  }, [cookies.cookieConsent]);

  // const c = async () => {
  //   const requestOptions = {
  //     method: "POST",
  //     redirect: "follow"
  //   };
    
  //   fetch(`${API_ENDPOINT}/e-member/public/api/user_condition`,requestOptions)
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data.agreement_text)
  //       setAgreementText(data.agreement_text);
 
  //     })
  //     .catch(error => console.error('Error fetching data:', error));
  //   // ตรวจสอบว่ามีคุกกี้ที่บันทึกการยินยอมแล้วหรือไม่
  //   if (!cookies.cookieConsent) {
  //     setShowPopup(true);

  //     // ดึงข้อมูลจาก API

  //   }
  // }
  const c = async () => {
    const requestOptions = {
      method: "POST",
      redirect: "follow",
    };
  
    try {
      const response = await fetch(`https://zooe-ticket.com/e-member/public/api/user_condition`, requestOptions);
      const data = await response.json();
      
      console.log(data.agreement_text); // ลบ await ออก
      console.log(data); // ลบ await ออก
      setAgreementText(data.agreement_text);
  
      // ตรวจสอบว่ามีคุกกี้ที่บันทึกการยินยอมแล้วหรือไม่
      // if (!cookies.cookieConsent) {
      //   setShowPopup(true);
      // }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const chack_cookie = () =>{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "user_id": localStorage.getItem('userid'),
      "action": ""
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${API_ENDPOINT}/e-member/public/api/user_agreement`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.status === true) {
          console.log(result)
          setShowPopup(false);
        } else {
          setShowPopup(true);
        }
      })
      .catch((error) => console.error(error));
  }

  const handleAccept = () => {
    setCookie('cookieConsent', 'accepted', { path: '/' });
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "user_id": userid,
      "action": "insert"
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`${API_ENDPOINT}/e-member/public/api/user_agreement`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setShowPopup(false)
      })
      .catch((error) => console.error(error));
    // setShowPopup(false); // ปิด popup หลังจากการยินยอม
  };

  const handleDecline = () => {
    setCookie('cookieConsent', 'declined', { path: '/' });
    navigate('/Home');
    // setShowPopup(false); // ปิด popup หลังจากการปฏิเสธ
  };

  return (
    showPopup && (
      <div className="cookie-consent-overlay">
        <div className="cookie-consent-popup">

          <div dangerouslySetInnerHTML={{ __html: agreementText }} />

          <div className="cookie-consent-buttons">
            <button onClick={handleAccept}>ยินยอม</button>
            <button onClick={handleDecline}>ไม่ยินยอม</button>
          </div>
        </div>
      </div>
    )
  );
};

export default CookieConsent;
