import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { API_ENDPOINT } from './config';
function Lineoa() {
  const queryParameters = new URLSearchParams(window.location.search)
  const iduser = queryParameters.get("iduser")
  const token = queryParameters.get("token")
  const name = queryParameters.get("name")
    const navigate = useNavigate();
    const date = new Date();
    const time = date.toISOString().replace(/[-:T.]/g, '').slice(0, 14); // 'YmdH' format
    const timeWithKey = time + '@pay';
    const saltRounds = 10;
    // useEffect(() => {
    //   Slogin("", "line", iduser.slice(0, 10).replace(/\D/g, ''), name, token);
    //   }, [])
    
    // const Slogin = (email, provider, provider_id, name, token) => {
    //     const formdata = new FormData();
    //     formdata.append("email", email);
    //     formdata.append("provider", provider);
    //     formdata.append("provider_id", provider_id);
    //     formdata.append("name", name);

    //     const requestOptions = {
    //         method: "POST",
    //         body: formdata,
    //         redirect: "follow"
    //     };

    //     fetch(`${API_ENDPOINT}/e-member/public/api/slogin`, requestOptions)
    //         .then((response) => response.json())
    //         .then((result) => {
    //             if (result.status === "true") {
    //                 bcrypt.hash(timeWithKey, saltRounds, (err, hash) => {
    //                     if (err) {
    //                         console.error('Error hashing password:', err);
    //                         return;
    //                     }
    //                     genApiKey(result.msg.id, hash)
    //                     // console.log(hash);
    //                     // console.log(timeWithKey);
    //                 });
    //                 localStorage.setItem('email', result.msg.email);
    //                 localStorage.setItem('userid', result.msg.id);
    //                 localStorage.setItem('name', result.msg.name);
    //                 localStorage.setItem('token', token);

    //                 // window.location = "/Home";
    //                 navigate('/Home');
    //             }
    //         })
    //         .catch((error) => console.error(error));

    // }

    // const genApiKey = (iduset, auth) => {


    //     // สร้าง URL พร้อม query parameters
    //     const url = new URL(`${API_ENDPOINT}/api/v1/zoo/public/e-member/genApiKey`);
    //     url.searchParams.append("model", "web");
    //     url.searchParams.append("member_id", iduset);
    //     url.searchParams.append("time", time);
    //     url.searchParams.append("auth", auth);

    //     const requestOptions = {
    //         method: "GET",
    //         redirect: "follow"
    //     };

    //     fetch(url, requestOptions)
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! Status: ${response.status}`);
    //             }
    //             return response.json(); // เปลี่ยนเป็น response.text() ถ้าคุณต้องการรับข้อมูลเป็นข้อความ
    //         })
    //         .then(result => {
    //             // console.log(result[0]); // แสดงผลลัพธ์ใน console
    //             // console.log(result[1]); // แสดงผลลัพธ์ใน console
    //             localStorage.setItem('apikey', result[0].replace(/^"|"$/g, '')); // เก็บข้อมูลใน localStorage
    //             localStorage.setItem('credit', result[1].replace(/^"|"$/g, '')); // เก็บข้อมูลใน localStorage
    //         })
    //         .catch(error => {
    //             console.error('Fetch error:', error); // จัดการข้อผิดพลาด
    //         });
    // }
   
    return (
        <div>
        <p>token: {token}</p>
        <p>Name: {name}</p>
        <p>iduser: {iduser}</p>
      </div>
    )
}

export default Lineoa
