import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { LINE_CONNEXT, API_ENDPOINT ,API_ENDPOINT_USER} from './config';
import liff from '@line/liff';
import Swal from 'sweetalert2';
import re from '../img/004.gif'; // นำเข้ารูปภาพ
function Line_connext() {
  const queryParameters = new URLSearchParams(window.location.search);
  const iduser = queryParameters.get("iduser");
  const token = queryParameters.get("token");
  const name = queryParameters.get("name");
  const img = queryParameters.get("img");
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const date = new Date();
  const time = date.toISOString().replace(/[-:T.]/g, '').slice(0, 14); // 'YmdH' format
  const timeWithKey = time + '@pay';
  const saltRounds = 10;

  useEffect(() => {
    liff.init({ liffId: `${LINE_CONNEXT}`,withLoginOnExternalBrowser: true })
    .then(() => {
      handleLogin();
    })
    
  }, []);

  const handleLogin = async () => {
    try {
      const profile = await liff.getProfile();
      console.log(profile);
      Slogin("", "line", profile.userId, profile.displayName, profile.userId);
      localStorage.setItem('profile', profile.pictureUrl);
    } catch (err) {
      console.log(err);
    }
  };

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
          });
          localStorage.setItem('email', result.msg.email);
          localStorage.setItem('userid', result.msg.id);
          localStorage.setItem('name', result.msg.name);
          localStorage.setItem('token', token);
        //   setIsConnected(true); // ตั้งค่าสถานะเชื่อมต่อเป็น true

          // แสดง SweetAlert2 เมื่อเชื่อมต่อสำเร็จ
          Swal.fire({
            title: 'เชื่อมต่อสำเร็จ!',
            text: 'คุณสามารถใช้งานต่อได้ที่ห้องแชท',
            icon: 'success',
            confirmButtonText: 'ดำเดินการต่อ',
          }).then((result) => {
            if (result.isConfirmed) {
              // ลิงก์ไปที่ LINE Chat
              navigate('/');
            }
          });
        }
      })
      .catch((error) => console.error(error));
  };


  const genApiKey = (iduset, auth) => {
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
        return response.json();
      })
      .then(result => {
        console.log(result[0]);
        console.log(result[1]);
        localStorage.setItem('apikey', result[0].replace(/^"|"$/g, ''));
        localStorage.setItem('credit', result[1].replace(/^"|"$/g, ''));
      })
      .catch(error => {
        console.error('Fetch error:', error);

      });
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
                  <h4 className="mb-2">{name || "เชื่อมต่อกับเรา"}</h4>
                  <p className="text-muted mb-4">เชื่อมต่อกับเรา <span className="mx-2">|</span> <a href="#!">Zoo e-Ticket By @pay</a></p>
                  <button
                      type="button"
                      onClick={() => handleLogin()}
                      className="btn btn-primary btn-rounded btn-lg"
                    >
                      Connect
                    </button>
                  {/* {isConnected ? (
                    <button className="btn btn-success btn-rounded btn-lg">
                      ขอบคุณที่เชื่อต่อกับเรา Line OA กลับไปที่ห้องเเชท
                    </button>
                  ) : (
                 
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Line_connext;












