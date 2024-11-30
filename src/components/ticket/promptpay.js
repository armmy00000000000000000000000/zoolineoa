/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, Link, useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
// import QRCodeLib from 'qrcode'; // นำเข้า qrcode
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2
import { API_ENDPOINT } from '../auth/config';
// import { obfuscateCode } from '../auth/obfuscateCode';

function Promptpay() {
    const location = useLocation();
    const { state } = location;
    const [remainingTime, setRemainingTime] = useState(300); // Initial value of 5 minutes in seconds
    const [isExpired, setIsExpired] = useState(false);
    const [selectedId, setselectedId] = useState(['']);
    const navigate = useNavigate();
    // const qrRef = useRef(null);
    // const downloadQRCode = () => {
    //     const qrValue = state.qrData; // ใช้ค่า QR จาก state
    //     QRCodeLib.toDataURL(qrValue, { errorCorrectionLevel: 'H' })
    //         .then((url) => {
    //             const link = document.createElement('a');
    //             link.href = url;
    //             link.download = 'QRCode.png';
    //             link.click();
    //         })
    //         .catch((error) => console.error(error));
    // };
    useEffect(() => {
        setselectedId(state.idOrder);
        SendLine(state.total, localStorage.getItem('token'), localStorage.getItem('name'), state.ref, state.date, 'Unsuccess', state.zooname);
    }, [state.date, state.idOrder, state.ref]);
    // เมื่อ selectedId เปลี่ยนแปลง, บันทึกค่าลง localStorage

    const handleCancel = (id) => {
        // console.log(id)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", localStorage.getItem('apikey'));
        const raw = JSON.stringify({
            "order_id": id
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${API_ENDPOINT}/api/v1/zoo/e-member/online-order-cancel`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status === "cancel") {
                    Swal.fire({
                        title: 'ยกเลิกการชำระเงิน',
                        text: 'คุณต้องการยกเลิกการชำระเงินนี้หรือไม่?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'ใช่',
                        cancelButtonText: 'ไม่ใช่'
                    }).then((result) => {

                        if (result.isConfirmed) {
                            SendLine(state.total, localStorage.getItem('token'), localStorage.getItem('name'), state.ref, state.date, 'cancel', state.zooname)
                            Swal.fire(
                                'ยกเลิกแล้ว!',
                                'รายการของคุณถูกยกเลิกแล้ว',
                                'success'
                            ).then(() => {
                                navigate('/OrderList'); // เปลี่ยนเส้นทางไปยังหน้า /OrderList
                            });
                        }
                    });
                } else {


                }
            })
            .catch((error) => console.error(error));
    };
    // const autoleCancel = (id) => {
    //     // console.log(id)
    //     const myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");
    //     myHeaders.append("X-API-KEY", localStorage.getItem('apikey'));
    //     const raw = JSON.stringify({
    //         "order_id": id
    //     });

    //     const requestOptions = {
    //         method: "POST",
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: "follow"
    //     };

    //     fetch(`${API_ENDPOINT}/api/v1/zoo/e-member/online-order-cancel`, requestOptions)
    //         .then(response => response.json())
    //         .then(result => {
    //             if (result.status === "cancel") {
    //                 SendLine(state.total, localStorage.getItem('token'), localStorage.getItem('name'), state.ref, state.date, 'cancel', state.zooname)
    //                 Swal.fire({
    //                     title: 'เกินเวลาที่กำหนด!',
    //                     text: 'รายการของคุณถูกยกเลิกแล้ว',
    //                     icon: 'error', // เปลี่ยนเป็น 'error' สำหรับข้อผิดพลาด
    //                     confirmButtonText: 'ตกลง'
    //                 }).then(() => {
    //                     navigate('/OrderList'); // เปลี่ยนเส้นทางไปยังหน้า /OrderList
    //                 });
    //             } else {
    //                 // เรียกใช้ฟังก์ชัน obfuscateCode

    //                 //  const obfuscatedCode = obfuscateCode('notsuccessful');

    //                 //  // แสดงผลลัพธ์ในคอนโซล
    //                 //  console.log('Obfuscated Code:', obfuscatedCode);
    //             }
    //         })
    //         .catch((error) => console.error(error));
    // };

    useEffect(() => {
        const calculateRemainingTime = () => {
            const createdAt = new Date(state.createdAt);
            const now = new Date();
            const timeElapsed = Math.floor((now - createdAt) / 1000); // Time elapsed in seconds
            const timeLeft = 300 - timeElapsed; // 300 seconds is the initial countdown duration

            if (timeLeft <= 0) {
                setIsExpired(true);
                // const myHeaders = new Headers();
                // myHeaders.append("Content-Type", "application/json");
                // myHeaders.append("X-API-KEY", localStorage.getItem('apikey'));
                // const raw = JSON.stringify({
                //     "order_id": selectedId
                // });

                // const requestOptions = {
                //     method: "POST",
                //     headers: myHeaders,
                //     body: raw,
                //     redirect: "follow"
                // };

                // fetch(`${API_ENDPOINT}/api/v1/zoo/e-member/online-order-cancel`, requestOptions)
                //     .then(response => response.json())
                //     .then(result => {
                //         if (result.status === "cancel") {
                //             SendLine(state.total, localStorage.getItem('token'), localStorage.getItem('name'), state.ref, state.date, 'cancel', state.zooname)
                //         } else {

                //         }
                //     })
                //     .catch((error) => console.error(error));
                return 0;
            }

            return timeLeft;
        };



        const checkPayment = () => {
            // console.log(state.ref, state.ref2)
            // console.log(localStorage.getItem('apikey'))
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("X-API-KEY", `${localStorage.getItem('apikey')}`);

            const raw = JSON.stringify({
                "ref1": state.ref,
                "ref2": state.ref2
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${API_ENDPOINT}/api/v1/zoo/e-member/check_payment`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result)
                    if (result.respMsg === "Unsuccess") {

                    } else if (result.status === 'approved') {
                        // ถ้าการชำระเงินสำเร็จ
                        clearInterval(timer); // หยุดตัวจับเวลา
                        SendLine(state.total, localStorage.getItem('token'), localStorage.getItem('name'), state.ref, state.date, 'approved', state.zooname)
                        // แสดงการแจ้งเตือนเมื่อชำระเงินสำเร็จ
                        Swal.fire({
                            title: 'Payment Successful',
                            text: 'Your payment was successful!',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // เปลี่ยนเส้นทางไปยังหน้า /OrderList
                                window.location = "/lineOA/OrderList";
                                // navigate('/OrderList');
                            }
                        });
                    } else {

                    }


                })
                .catch((error) => console.error(error));

            // fetch(`${API_ENDPOINT}/api/v1/zoo/e-member/check_payment`, requestOptions)
            // .then(response => {
            // //   if (response.status === 401) {
            // //     // แสดง SweetAlert2 ถ้าสถานะเป็น 401
            // //     Swal.fire({
            // //       icon: 'error',
            // //       title: 'Unauthorized',
            // //       text: 'พบปัญหาระหว่างตรวจสอบผู้ใช้งาน กรุณาออกจากระบบและเข้าระบบอีกครั้ง',
            // //       confirmButtonText: 'ตกลง'
            // //     }).then(() => {
            // //       navigate('/'); // เปลี่ยนเส้นทางไปยังหน้าโฮม
            // //     });
            // //     // หยุดการดำเนินการต่อในกรณีที่ได้รับสถานะ 401
            // //     return Promise.reject('Unauthorized');
            // //   }

            //   // แปลงการตอบกลับเป็น JSON
            //   return response.json();
            // })
            // .then(result => {
            //   if (result.respMsg === "Unsuccess") {

            //   } else {
            //     // ถ้าการชำระเงินสำเร็จ
            //     clearInterval(timer); // หยุดตัวจับเวลา
            //     SendLine(state.total,localStorage.getItem('token'), localStorage.getItem('name'),state.ref,state.date,'approved')
            //     // แสดงการแจ้งเตือนเมื่อชำระเงินสำเร็จ
            //     Swal.fire({
            //       title: 'Payment Successful',
            //       text: 'Your payment was successful!',
            //       icon: 'success',
            //       confirmButtonText: 'OK'
            //     }).then((result) => {
            //       if (result.isConfirmed) {
            //         // เปลี่ยนเส้นทางไปยังหน้า /OrderList
            //         navigate('/OrderList');
            //       }
            //     });
            //   }
            // })
            // .catch(error => {
            //   // จัดการข้อผิดพลาดทั่วไป
            //   console.error('Error:', error);
            // //   Swal.fire({
            // //     icon: 'error',
            // //     title: 'Error',
            // //     text: 'เกิดข้อผิดพลาดในการตรวจสอบการชำระเงิน',
            // //     confirmButtonText: 'ตกลง'
            // //   });
            // });

        }
        // Set initial remaining time
        setRemainingTime(calculateRemainingTime());

        const timer = setInterval(() => {
            checkPayment();
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setIsExpired(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 2000); // Update every second

        return () => clearInterval(timer); // Cleanup interval on component unmount
    }, [navigate, selectedId, state.createdAt, state.ref, state.ref2, state.total]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };
    if (!isExpired) {

    } else {
        // autoleCancel(selectedId);
    }

    // const Testapprove = (ref1, ref2) => {
    //     const myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");
    //     myHeaders.append("X-API-KEY", localStorage.getItem('apikey'));

    //     const raw = JSON.stringify({
    //         "ref1": { ref1 },
    //         "ref2": { ref2 }
    //     });

    //     const requestOptions = {
    //         method: "POST",
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: "follow"
    //     };

    //     fetch(`${API_ENDPOINT}/api/v1/zoo/e-member/test_approve`, requestOptions)
    //         .then((response) => response.text())
    //         .then((result) => console.log(result))
    //         .catch((error) => console.error(error));
    // }

    
    const SendLine = (totall, token, name, ref, date, status, zoo) => {
        const myHeaders = new Headers();
        myHeaders.append("Cookie", "XSRF-TOKEN=eyJpdiI6Im1aWUlnSFNwTEdPMXNDOENNRFozbmc9PSIsInZhbHVlIjoiNWJLNi9WNFJkem4xcEhzdFkwZGsrL3VNOG1rRnY3Ryt0WEpFVVljQjRZaDlTeFI3NkJGd29yOElKajhiRHE3SWJqNkpnRFZlcFJKNklLUkF6S0tOakdzOG9lMWk4YllZaU9rMEZLcWlYcXVweVZSOFB3RGxsRTVGWDdDYjhaSjciLCJtYWMiOiJiNTAwZmVlYTQ3MmExNGU0MTMyYjcwMzcyNTQwYmJkYmY3ODdiYzFlN2E2ZGM2ZWIzMGJjNThjNGIyNjdkMjdhIiwidGFnIjoiIn0%3D; emember_session=eyJpdiI6IjlKRFY3NUFCaTFaS3Z3QnpJOXcwRHc9PSIsInZhbHVlIjoiNDRvaGpjdnJUQVI0ajdwUlhyK042Q0JMV0lFdUcxZmQwZmJDa0cvbE9VSGpDbTVhTHZkTnU0aU43MUZvN0dXL2ZhQkFpdXg0bzM2NmhXS1F1UjhwN3hTMVlyNlFva0ZqMSt0UC9NZ0JmNGpVTWxnbDhFWEFLR2hwNmZGM0w4VTAiLCJtYWMiOiIxYTg5N2VlNjNlODU2N2IwYTYwYTlkZWMxMDg5ZmU0YTFlYWY2ZTIzZDRjYjg1OWE5NjE5ZmU3M2U1YmUwZWM4IiwidGFnIjoiIn0%3D");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`${API_ENDPOINT}/emember/zoolineoa/Connected/Check_payment.php?token=${token}&name=${name}&ref=${ref}&date=${date}&status=${status}&total=${totall}&zoo=${zoo}`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }
    return (
        <div>

            {/* <p>{state.ref}</p>
            <p>{state.ref2}</p>

            <p>{state.qrData}</p>
            <p>{state.total}</p>
            <p>{state.createdAt}</p> */}
            <div className=" container mt-5 text-center" >
                {!isExpired ? (
                    <>
                        <div className="countdown-container">
                            <p className="countdown-text">เวลาชำระเงิน:</p>
                            <div className="countdown-timer">{formatTime(remainingTime)}</div>
                        </div>

                        <div className='container' >
                            <div className='container' style={{ textAlign: 'center', color: '#0C9331', fontSize: 25, fontFamily: 'Kanit', fontWeight: '400' }}>
                                สแกน QR เพื่อชำระเงิน
                            </div>
                            <div className="mt-3 text-center fs-4 fw-light">
                                เลขที่คำสั่งซื้อ : {state.ref}
                            </div>

                            <div className='container text-center mt-5' >
                                <QRCode size={150} value={state.qrData} />
                            </div>
                            <div className="container mt-3 text-center fs-10 ">
                                <p className='text-danger'>*****กรุณาอย่ากดออกจากหน้าจอนี้ ในระหว่างการชำระงิน เพื่อไม่ให้การชำระเงินเกิดข้อผิดพลาด*******</p>
                            </div>
                  .
                            {/* <button onClick={downloadQRCode} className="btn btn-primary mt-3">
                                    ดาวน์โหลด QR Code
                                </button> */}
                            {/* <div className='container text-center mt-5'>
                            <h3>Ref 1:{state.ref}</h3>
                        
                            </div>
                            <div className='container text-center mt-5'>
                            <h3>Ref 2:{state.ref2}</h3>
                            </div> */}
                            <div className='container mt-5' style={{ textAlign: 'center', color: '#7C7C7C', fontSize: 30, fontFamily: 'Kanit', fontWeight: '400', wordWrap: 'break-word' }}>
                                ยอดชำระ {state.total} บาท
                            </div>

                            {/* <div className="container mt-5" style={{ textAlign: 'center' }}>
                                <button
                                    className="btn btn-danger  btn-block"
                                    onClick={() => handleCancel(selectedId)}
                                    style={{
                                        background: 'linear-gradient(180deg, #E11010 0%, #C90848 63%)',
                                        borderRadius: 124,
                                        border: '2px #F10E0E solid'
                                    }}
                                >
                                    ยกเลิกการชำระเงิน
                                </button>
                            </div> */}
                        </div>
                    </>
                ) : (
                    <div className="expired-message">
                        <p>หมดเวลาสำหรับการชำระเงินของรายการนี้ กรุณาทำรายการต่อที่หน้ารายการจอง หรือหากได้ชำระเงินแล้ว สถานะบัตรไม่ขึ้น ชำระงิน ให้ส่งสลิปให้ทางเจ้าหน้าที่เพื่อทำการแก้ไขให้ ขอบคุณที่ใช้บริการนะคะ</p>
                        <Link to="/OrderList" type="button" className="btn  btn-lg btn btn-primary "  >ดำเนินการต่อที่หน้ารายการจอง</Link>
                    </div>
                )}
            </div>


        </div>
    );
}

export default Promptpay;
