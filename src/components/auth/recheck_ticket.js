/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { RE_CHECK_TICKET, API_ENDPOINT,API_ENDPOINT_USER } from './config';
import liff from '@line/liff';
import re from '../img/004.gif'; // นำเข้ารูปภาพ
function ReCheckTicket() {
  const queryParameters = new URLSearchParams(window.location.search)
  const iduser = queryParameters.get("iduser")
  const token = queryParameters.get("token")
  const name = queryParameters.get("name")
  const img = queryParameters.get("img")
  
  // const [isLoggedIn, setIsLoggedIn] = useState(false); 
  // const navigate = useNavigate();
  const date = new Date();
  const time = date.toISOString().replace(/[-:T.]/g, '').slice(0, 14); // 'YmdH' format
  const timeWithKey = time + '@pay';
  const saltRounds = 10;
  


  useEffect(() => {
    const isLoggedInv1 = localStorage.getItem('token_v1');
    const apiKeyv1 = localStorage.getItem('apikey_v1');
    const useridv1 = localStorage.getItem('userid_v1');

    if (isLoggedInv1 && apiKeyv1 && useridv1) {
      setIsLoggedIn(true);
      console.log(`token===login อยู่แล้ว ${isLoggedInv1} ${apiKeyv1}`);
      window.location = "/lineOA/OrderList_v1";
      users_log(1);
    } else {
      if (!apiKeyv1) {
        console.warn("API key is missing or empty.");
        liff.init({ liffId: `${RE_CHECK_TICKET}`, withLoginOnExternalBrowser: true })
          .then(() => {
            handleLogin();
          });
      }
      liff.init({ liffId: `${RE_CHECK_TICKET}`, withLoginOnExternalBrowser: true })
        .then(() => {
          handleLogin();
        });

    }
  }, [ iduser, name, token]);

  // useEffect(() => {
  //   liff.init({ liffId: `${RE_CHECK_TICKET}`,withLoginOnExternalBrowser: true })
  //     .then(() => {
  //       handleLogin();
  //     })

  // }, [])


  const handleLogin = async () => {
    // Slogin("", "line", iduser.slice(0, 10).replace(/\D/g, ''), name, token);
    try {
      const profile = await liff.getProfile();
      console.log(profile);
    //   Slogin("", "line", iduser.slice(0, 10).replace(/\D/g, ''), name, token);
    await  Slogin("", "line", profile.userId.slice(0, 10).replace(/\D/g, ''), profile.displayName, profile.userId);
      localStorage.setItem('profile', profile.pictureUrl,);
   
    } catch (err) {
      console.log(err);
    }
  }

  const Slogin = (email, provider, provider_id, name, token) => {
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("provider", provider);
    formdata.append("provider_id", provider_id);
    formdata.append("name", name);
    formdata.append("line_token", token);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch(`${API_ENDPOINT_USER}/e-member/public/api/slogin`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "true") {
          bcrypt.hash(timeWithKey, saltRounds, (err, hash) => {
            if (err) {
              console.error('Error hashing password:', err);
              return;
            }
            genApiKey(result.msg.id, hash);
            // SendLine(token,name);
            console.log(hash);
            console.log(result);
            console.log(timeWithKey);
          });
          localStorage.setItem('email_v1', result.msg.email);
          localStorage.setItem('userid_v1', result.msg.id);
          localStorage.setItem('name_v1', result.msg.name);
          localStorage.setItem('token_V1', token);
   
      
          // window.location = "/Home";
      
        }
      })
      .catch((error) => console.error(error));

  }

  const genApiKey = (iduset, auth) => {


    // สร้าง URL พร้อม query parameters
    const url = new URL(`${API_ENDPOINT}/api/v1/zoo/public/e-member/genApiKey`);
    url.searchParams.append("model", "web");
    url.searchParams.append("member_id", iduset);
    url.searchParams.append("time", time);
    url.searchParams.append("auth", auth);

    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(url, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // เปลี่ยนเป็น response.text() ถ้าคุณต้องการรับข้อมูลเป็นข้อความ
      })
      .then(result => {
        console.log(result[0]); // แสดงผลลัพธ์ใน console
        console.log(result[1]); // แสดงผลลัพธ์ใน console
        localStorage.setItem('apikey_v1', result[0].replace(/^"|"$/g, '')); // เก็บข้อมูลใน localStorage
        localStorage.setItem('credit_v1', result[1].replace(/^"|"$/g, '')); // เก็บข้อมูลใน localStorage
  
        // navigate('/OrderList');
                 window.location = "/lineOA/OrderList_v1";
                //  window.location = "/lineOA/OrderList";
      })
      .catch(error => {
        console.error('Fetch error:', error); // จัดการข้อผิดพลาด
      });
  }


  const SendLine = (token, name) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch(`${API_ENDPOINT}/emember/zoolineoa/Connected/Connected.php?token=${token}&name=${name}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }
  return (
    <div>
      <section className="vh-90">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-12 col-xl-4">

              <div className="card" style={{ borderRadius: '15px' }}>
                <div className="card-body text-center">
                  <div className="mt-3 mb-4">
                    <img
                      src={re}
                      className="rounded-circle img-fluid"
                      style={{ width: '100px' }}
                      alt="User Avatar"
                    />
                  </div>
                  <h4 className="mb-2">{name || "กำลังโหลด"}</h4>
                  <p className="text-muted mb-4">เชื่อมต่อกับเรา <span className="mx-2">|</span> <a href="#!">Zoo e-Ticket By @pay</a></p>
               
                  <button
                    type="button"
                    onClick={() =>handleLogin()}
                    className="btn btn-primary btn-rounded btn-lg"
                  >
                    เช็คคำสั่งซื้อ ก่อนหน้านี้ วัน 4-14 ตุลาคม 2567 {localStorage.getItem('userid_v1')}
                  </button>

   
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default ReCheckTicket
