/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import './cder.css';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2
import Credit from './credit';
import imgzoos from '../model/imgmodel';
import Navbar from '../Navbar/Navbar';
// import imgtikket from '../img/imgticket.png';
import m1 from '../img_ticket/m-1.png';
import fm1 from '../img_ticket/fm-1.png';
import b1 from '../img_ticket/b-1.png';
import g1 from '../img_ticket/g1.png';
import b2 from '../img_ticket/b-2.png';
import g2 from '../img_ticket/g2.png';
import m2 from '../img_ticket/m-2.png';
import fm2 from '../img_ticket/fm-2.png';
import moto from '../img_ticket/c-bg-01.png';
import car from '../img_ticket/c-bg-2-01.png';
import but from '../img_ticket/c-bg-3-01.png';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookie from '../Cookie/Cookie';
import './ZooInfo.css'; // นำเข้าไฟล์ CSS ของคุณ
import QRCode from 'react-qr-code';
import { formatDate } from '../FormatDate/formatDate';
import { API_ENDPOINT } from '../auth/config';
function Addticket() {

  const [Ticket, setTicket] = useState([]);
  const [selectedTickets, setselectedTickets] = useState([]);
  const [date, setDate] = useState('');
  const [createdAt, setCreatedAt] = useState(new Date());
  const [remainingTime, setRemainingTime] = useState(300); // 300 วินาที = 5 นาที
  const [isExpired, setIsExpired] = useState(false);
  const [qrData, setqrData] = useState('');
  const [Ref, setRef1] = useState('');
  const [Ref2, setRef2] = useState('');
  const [idOrder, setidOrder] = useState('');
  const [ticketCounts, setTicketCounts] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const location = useLocation();
  const { state } = location;
  const [selectedId, setSelectedId] = useState(null);
  const [idzoo, setIdzood] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [name, setname] = useState(null);
  const [Payment, setPayment] = useState(0);
  const paymentSectionRef = useRef(null);
  const navigate = useNavigate();
  const iduser = localStorage.getItem('userid');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');


  const [countries, setCountries] = useState([]);
  const [show, setShow] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryid, setcountryid] = useState("");

  const handleScrollToPaymentSection = () => {
    if (paymentSectionRef.current) {
      paymentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
   
    const isLoggedIn = localStorage.getItem('token');
    if (isLoggedIn) {
      setIsLoggedIn(true);
      navigate('/'); // นำทางไปยังหน้าหลักโดยตรงหากผู้ใช้ล็อกอินอยู่แล้ว
    }
  }, [navigate]);





  const getImageUrl = (ticketName) => {
    switch (true) {
      case ticketName.includes("ผู้ใหญ่ ชาย"):
        return m1;
      case ticketName.includes("ผู้ใหญ่ หญิง"):
        return fm1;
      case ticketName.includes("เด็ก ชาย"):
        return b1;
      case ticketName.includes("เด็ก หญิง"):
        return g1;
      case ticketName.includes("Adult Male"):
        return m2;
      case ticketName.includes("Adult Female"):
        return fm2;
      case ticketName.includes("Child Male"):
        return b2;
      case ticketName.includes("Child Female"):
        return g2;
      case ticketName.includes("รถจักรยานยนต์"):
        return moto;
      case ticketName.includes("รถยนต์"):
        return car;
      case ticketName.includes("รถบัส"):
        return but;
      default:
        return imageUrl; // รูปเริ่มต้น
    }
  };
  // const onChange = (newDate) => {
  //   setDate(newDate);
  // };
  // สร้างอ็อบเจ็กต์ data
  const data = {
    value1: `${totalPrice}`, // ใช้ Template Literal สำหรับสร้างสตริง
    value2: `${Ref}`, // ใช้ Template Literal สำหรับสร้างสตริง
    value3: `${isLoggedIn}`,
  };
  const onChange = (newDate) => {
    // สร้างวันที่ปัจจุบัน
    const currentDate = new Date();

    // สร้างวันที่ปัจจุบันในเวลา 14:00
    const currentDateTimeLimit = new Date(currentDate);
    currentDateTimeLimit.setHours(14, 0, 0, 0);

    // ทำให้วันที่ที่เลือกและวันที่ปัจจุบันเป็นวันที่เวลา 00:00:00
    // เพื่อป้องกันปัญหาที่เกิดจากเวลา
    currentDate.setHours(0, 0, 0, 0);
    newDate.setHours(0, 0, 0, 0);

    // ตรวจสอบว่ามีการเลือกวันที่ในอนาคตหรือไม่
    if (newDate > currentDate) {
      // ดึงข้อมูลวันที่, เดือน, และปี
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, '0'); // เพิ่ม 1 เพราะเดือนเริ่มนับจาก 0
      const day = String(newDate.getDate()).padStart(2, '0');

      // สร้างรูปแบบใหม่ "YYYY-MM-DD"
      const formattedDate = `${year}-${month}-${day}`;

      // ตั้งค่าวันที่ใหม่
      setDate(formattedDate);
    } else if (newDate.getTime() === currentDate.getTime() && new Date() <= currentDateTimeLimit) {
      // ถ้าเลือกวันนี้และเวลาปัจจุบันยังไม่เกิน 14:00
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, '0'); // เพิ่ม 1 เพราะเดือนเริ่มนับจาก 0
      const day = String(newDate.getDate()).padStart(2, '0');

      // สร้างรูปแบบใหม่ "YYYY-MM-DD"
      const formattedDate = `${year}-${month}-${day}`;

      // ตั้งค่าวันที่ใหม่
      setDate(formattedDate);
    } else {
      alert('ขออภัยหมดเวลาจองสำหรับวันนี้แล้ว กรุณาเลือกวันที่ถัดไปหรือวันในอนาคต ');
    }
  };






  const decreaseCount = (ticketId) => {
    setTicketCounts((prevCounts) => {
      const updatedCounts = { ...prevCounts };
      if (updatedCounts[ticketId] > 0) {
        updatedCounts[ticketId]--;
      }
      return updatedCounts;
    });
  };

  const increaseCount = (ticketId) => {
    if (!date) {
      // If date is not selected, show error message
      alert('กรุณาเลือกวันที่');
      return;
    }
    setTicketCounts((prevCounts) => ({
      ...prevCounts,
      [ticketId]: (prevCounts[ticketId] || 0) + 1,
    }));

  };
  useEffect(() => {
    handleProceed();
    Country();
  }, [ticketCounts]);

  const Country = () => {
    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", localStorage.getItem('apikey'));

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(API_ENDPOINT + "/api/v1/zoo/etc/country", requestOptions)
      .then((response) => response.json())
      .then((result) => setCountries(result))
      .catch((error) => console.error(error));
  }

    // ฟังก์ชันสำหรับจัดการการค้นหา
    const filteredCountries = countries.filter((country) =>
      country.nicename.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    
  const handleSelectCountry = (country, country_id) => {
    setSelectedCountry(country);
    setcountryid(country_id)
    setShow(false);
  };

  const fetchData = async (id) => {
    if (!id) return; // ตรวจสอบว่า ID มีค่า
    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", localStorage.getItem('apikey'));
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      mode: "cors",
    };

    fetch(`${API_ENDPOINT}/api/v1/zoo/e-member/ticket-zoo/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        setTicket(result);
      })
      .catch((error) => console.error(error));
  }

  // ฟังก์ชันเพื่อจัดการเมื่อเลือกตัวเลือก
  const handleSelect = (id, img, name) => {
    setSelectedId(id);
    setImageUrl(img);
    setname(name);
  };

  // เมื่อ selectedId เปลี่ยนแปลง, บันทึกค่าลง localStorage
  useEffect(() => {
    if (selectedId) {
      localStorage.setItem('selectedId', selectedId);
      setIdzood(selectedId);
      fetchData(selectedId);

    } else {
      const defaultId = state?.id || idzoo; // ตรวจสอบว่า state มีค่าและมี id ก่อน
      localStorage.setItem('selectedId', defaultId)
      setIdzood(defaultId);
      fetchData(defaultId);


    }

  }, [idzoo, selectedId, state?.id]);

  useEffect(() => {
    const idFromStorage = localStorage.getItem('selectedId'); // ดึงข้อมูลจาก localStorage

    // ใช้ selectedId หากมีค่า หรือใช้ค่าเริ่มต้นหาก selectedId เป็น null
    const idToUse = selectedId || idFromStorage; // เปลี่ยน 'default-id' เป็น ID ที่คุณต้องการใช้เป็นค่าเริ่มต้น
    if (idToUse) {
      setIdzood(idToUse);
      fetchData(idToUse);
    }
  }, [selectedId]); // เรียกใช้ fetchData เมื่อ selectedId เปลี่ยนแปลง



  const handleProceed = () => {
    const selectedTickets = Ticket.filter((ticket) => ticketCounts[ticket.id] > 0);
    const totalPrice = selectedTickets.reduce((acc, ticket) => acc + (ticketCounts[ticket.id] * ticket.price), 0);
    setTotalPrice(totalPrice);
    setselectedTickets(selectedTickets);
    // console.log(selectedTickets);
    // ทำอะไรกับ selectedTickets เช่น ส่งไปยังหน้าต่อไป
  };

  const saveSelectedTickets = (payment_method) => {
    console.log(payment_method)
    // setPayment(1);
    // // สร้างชุดข้อมูลของบัตรที่เลือก
    // handleScrollToPaymentSection(); // เลื่อนไปที่ส่วนการชำระเงิน

    const selectedTicketsData = {
      tickets: selectedTickets.map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        price: ticket.price,
        amount: ticketCounts[ticket.id]
      })),
      // คำนวณผลรวมราคาทั้งหมด
      zoo_id: idzoo,
      amount: totalPrice,
      // กำหนดหมายเลขไอดีผู้ทำการสั่งซื้อ (ให้แทนด้วยค่าคงที่สำหรับตอนนี้)
      member: iduser,
      // กำหนดวันที่เข้ามาใช้งาน
      onDate: date, // ใช้ตัวแปรที่เก็บวันที่ที่เลือกมาก่อนหน้านี้
      payment_method: payment_method,
      line_token: localStorage.getItem('token'),
      country: countryid
    };
    // ทำการบันทึกข้อมูลที่ได้เป็น JSON
    // console.log(JSON.stringify(selectedTicketsData));

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-API-KEY", localStorage.getItem('apikey'));

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(selectedTicketsData),
      redirect: "follow"
    };

    fetch(`${API_ENDPOINT}/api/v1/zoo/e-member/onlinePayment`, requestOptions)
      .then(response => {
        // ตรวจสอบสถานะของการตอบกลับ
        if (response.status === 401) {
          // แสดง SweetAlert2 ถ้าสถานะเป็น 401
          Swal.fire({
            icon: 'error',
            title: 'Unauthorized',
            text: 'พบปัญหาระหว่างตรวจสอบผู้ใช้งาน กรุณาออกจากหน้าหนี้แล้วเข้าใช้งานใหม่',
            confirmButtonText: 'ตกลง'
          }).then(() => {
            navigate('/'); // เปลี่ยนเส้นทางไปยังหน้าโฮม
          });
          // หยุดการดำเนินการต่อในกรณีที่ได้รับสถานะ 401
          return Promise.reject('Unauthorized');
        }
        // แปลงการตอบกลับเป็น JSON
        return response.json();
      })
      .then(result => {
        // ตรวจสอบข้อมูลที่ได้รับ

        console.log(result);
        // เข้าถึงข้อมูล tqrc_qr และเก็บไว้ในตัวแปร qrCodeData
        if (result.error === "มีรายการตั๋วบางรายการที่ไม่ตรงกับสวนสัตว์ที่เลือก") {
          // console.log(result.error);
          Swal.fire({
            icon: 'error',
            title: 'Unauthorized',
            text: 'มีรายการตั๋วบางรายการที่ไม่ตรงกับสวนสัตว์ที่เลือก กรุณาทำรายการใหม่',
            confirmButtonText: 'ตกลง'
          }).then(() => {
            // window.location = "/emember/zoolineoa/Addticket";
            window.location = "/lineOA/Addticket";
            // navigate('/'); // เปลี่ยนเส้นทางไปยังหน้าโฮม
          });
        } else {
          const idOrder = result.id;
          const qrCodeData = result.order?.tqrc_qr; // ใช้ optional chaining เพื่อลดข้อผิดพลาด
          const ref1 = result.order?.ref1;
          const ref2 = result.order?.ref2;

          // นำข้อมูล QR code ไปใช้งานต่อได้ตามต้องการ เช่น แสดง QR code บนหน้าเว็บ
          // console.log(qrCodeData);
          // console.log(`555555555555555555555${result.order.created_at}`)
          setidOrder(idOrder);
          setqrData(qrCodeData);
          setRef1(ref1);
          setRef2(ref2);

          setCreatedAt(result.order?.created_at);

          // const timer = setInterval(() => {
          //   setRemainingTime(prevTime => {
          //     if (prevTime <= 1) {
          //       clearInterval(timer);
          //       setIsExpired(true);
          //       return 0;
          //     }
          //     return prevTime - 1;
          //   });
          // }, 1000);

          // // ล้าง timer เมื่อคอมโพเนนต์ถูก unmount
          // return () => clearInterval(timer);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        // เพิ่มการจัดการข้อผิดพลาดถ้าจำเป็น
      });



  };


  const handlePaymentChange = (event) => {
    saveSelectedTickets(event.target.value);
    setSelectedPaymentMethod(event.target.value);
  };

  const option_payment = () => {
    setPayment(1);


    handleScrollToPaymentSection();
    e()
  }
  const e = () => {
    setPayment(1);

    handleScrollToPaymentSection();
  }

  const handleSubmit = () => {
    if (selectedPaymentMethod === 'qrcode') {
      handlePayLater();
    } else {
      handleCredit();
    }
    console.log(`Selected payment method: ${selectedPaymentMethod}`);
  };

  const handlePayLater = () => {
    // ซ่อน modal โดยใช้ id ของ modal
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
    navigate('/Promptpay', {
      state: {
        qrData: qrData, ref: Ref, ref2: Ref2, total: totalPrice, createdAt: createdAt, idOrder: idOrder, date: date, zooname: name
      }
    });
  };
  const handleCredit = () => {
    // ซ่อน modal โดยใช้ id ของ modal
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
    navigate('/Payment', {
      state: {
        qrData: qrData, ref: Ref, ref2: Ref2, total: totalPrice, createdAt: createdAt, idOrder: idOrder, date: date
      }
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // const qrData = "00020101021230760016A0000006770101120115099400016486604021599112705670000203142024052713230153037645406400.005802TH6304D63C";
  return (
    <div style={{ height: '0%' }}>

<div
        className={`modal ${show ? "d-block" : "d-none"}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">เลือกสัญชาติ</h5>
              {/* <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                ></button> */}
            </div>
            <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="ค้นหาสัญชาติ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ul className="list-group">
                {filteredCountries.map((country) => (
                  <li
                    key={country.id}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSelectCountry(country, country.iso)}
                  >
                    {country.nicename} ({country.iso})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>


        {/* {selectedCountry && (
          <p className="mt-3">
            ประเทศที่เลือก: {selectedCountry.nicename} ({selectedCountry.iso})
          </p>
        )} */}
      </div>
      {/* <PaymentList datas={JSON.stringify(selectedTicketsData)}/> */}
      <section
        className=""

      >
        <Navbar />
        <Cookie />





        <div className='container  py-5'>
          <div className="row g-5 mb-5 align-items-end wow fadeInUp " data-wow-delay="0.1s" style={{ visibility: 'visible', animationDelay: '0.1s', animationName: 'fadeInUp' }}>
            <div className="col-lg-6">
              <div className="selected-info">
                {/* แสดงภาพและ ID เริ่มต้นหรือหลังการเลือก */}
                {imageUrl ? (
                  <div className="">

                    <h1 className="display-5 mb-0">
                      {name}
                      <span className="text-primary">Zoo E-Ticket</span>
                    </h1>

                  </div>
                ) : (
                  <div className="">

                    <h1 className="display-5 mb-0">
                      องค์การสวนสัตว์แห่งประเทศไทย ในพระบรมราชูปถัมภ์
                      <span className="text-primary">Zoo E-Ticket</span>
                    </h1>

                  </div>
                )}
              </div>

            </div>
            <div className="col-lg-6 text-lg-end">
              <div className="dropdown mt-2">
                <button
                  type="button"
                  className="btn  btn-lg dropdown-toggle btn btn-primary py-3 px-5"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  เลือกสวนสัตว์
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  {imgzoos.map((zoo) => (
                    <a
                      key={zoo.id}
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSelect(zoo.id, zoo.img, zoo.name)}
                    >
                      <img
                        src={zoo.img}
                        alt={zoo.name}
                        style={{ width: '30px', height: '30px', marginRight: '10px' }}
                      />
                      {zoo.name}
                    </a>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
        {imageUrl ? (

          <div className="zoo-info container">
            <img
              src={imageUrl}
              alt="Selected Zoo"
              className="zoo-image"
            />
            <div className="zoo-details">
              <p className="zoo-name"> <span>{name}</span></p>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <div className="expired-message mt-2 container">
                <div className="message-box">
                  <p className="message-text">กรุณาเลือกสวนสัตว์ก่อน</p>
                </div>
              </div>
            </div>
            {/* แสดงภาพเริ่มต้นหรือ placeholder หากต้องการ */}
          </div>
        )}




        <div className=" container py-2 g-4 mt-3 " style={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.30)' }}>
          <div className=" row ">
            <div className="col-lg-5 mt-5">





              <div class="alert alert-success text-danger" role="alert">
                เฉพาะประชาชนที่ถือสัญชาติไทย เท่านั้น ที่ได้รับการยกเว้น เด็กต่ำกว่า 3 ปี/ผู้สูงอายุ 60 ปีขึ้นไป/พระ/ทหารผ่านศึก/ผู้พิการ ไม่เสียค่าบัตร *ไม่ต้องเลือกซื้อบัตร* สามารถแจ้งพนักงานที่สวนสัตว์ได้เลย
              </div>

              <div className="calendar-container">
                {/* {date.toString()} */}
                <Calendar
                  onChange={onChange}
                  value={date}
                />
              </div>

              <div className="col-md-12 mt-2">
                <div className="text-center">
                  <button data-toggle="modal" data-target="#exampleModal" className="btn   btn btn-primary px-5">รายการที่เลือก</button>



                </div>
              </div>
              <div className="col-md-12 mt-2">
                <div className="text-center">
                  <button
                    // key={1}
                    // to="/paymentlist" state={{
                    //   selectedTickets: selectedTickets,

                    // }}
                    onClick={() => {


                      option_payment(); // เลื่อนไปที่ส่วนการชำระเงิน

                    }}
                    type="button" className={`btn btn-danger  px-5btn  mt-2 ${selectedTickets.length === 0 ? 'disabled' : ''}`}>ช่องทางชำระเงิน</button>
                </div>
              </div>
              {/* ชำละเงิน */}
              <section ref={paymentSectionRef} className='mt-5 '>
                {Payment === 1 && (
                  <div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-md-12 ">
                        <div className="card">
                          <div className="card-body">
                            <h4>เลือกช่องทางชำระเงิน</h4>

                            <div className="px-3 py-4 border border-primary border-2 rounded mt-4 d-flex justify-content-between">
                              <div className="d-flex flex-row align-items-center">
                                <img alt='' src={imageUrl} className="rounded" width="60" />
                                <div className="d-flex flex-column ms-4">
                                  <span className="h5 mb-1">รวมทั้งหมด</span>
                                  <span className="small text-muted">รวมค่าบริการ</span>
                                </div>
                              </div>
                              <div className="d-flex flex-row align-items-center">
                                <sup className="dollar font-weight-bold text-muted">฿</sup>
                                <span className="h2 mx-1 mb-0">{totalPrice}</span>
                              </div>
                            </div>

                            <h4 className="mt-5">Payment details</h4>

                            <div className="mt-4">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="paymentMethod"
                                  id="promptPay"
                                  value="qrcode"
                                  onChange={handlePaymentChange}
                                />
                                <label className="form-check-label" htmlFor="promptPay">
                                  <img alt='' src="https://secure1.zimple.cloud/images/thai_qr_payment.png" className="rounded" width="70" />
                                  PromptPay
                                </label>
                              </div>

                              {/* <div className="form-check mt-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="paymentMethod"
                                  id="creditCard"
                                  value="credit"
                                  onChange={handlePaymentChange}
                                />
                                <label className="form-check-label" htmlFor="creditCard">
                                  <img alt='' src="https://i.imgur.com/sB4jftM.png" className="rounded" width="70" />
                                  Credit Card
                                </label>
                              </div> */}
                            </div>

                            {selectedPaymentMethod && (
                              <button onClick={handleSubmit} type="button" className="btn btn-lg btn-primary mt-3">
                                ชำระเงิน
                              </button>
                            )}

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
              {/* ชำละเงิน */}

            </div>



            <div className="col-lg-7  ">
              <div className=" text-center">

                <div className=''>



                </div>
              </div>
              {/* overflow-scroll */}
              <div className="  mt-3">
                <div className=' mt-2 '>
                  <div className="row ">




                    <div className="col-lg-12">
                      <div className="">
                        <div className=" p-0">
                          <div className="row g-0">
                            <div className="col-lg-12">
                              <div className="">

                              <div className="d-flex justify-content-between">
                                  <h3 className="mb-1" style={{ color: '#38b000' }}>
                                    {selectedCountry
                                      ? name
                                        ? `${name} (${selectedCountry.iso})`
                                        : `${selectedCountry.nicename} (${selectedCountry.iso})`
                                      : "กรุณาเลือกสัญชาติ"}
                                  </h3>


                                  <h5 style={{ color: '#38b000' }}>{date ? formatDate(date.toString()) : 'ไม่มีวันที่ระบุ กรุณาเลือกวันที่'}</h5>
                                </div>



                                {Ticket.map((Tickets, index) => (


                                  <div key={Tickets.id} className="card mb-3 ">
                                    <div className="card-body">
                                      <div className="d-flex justify-content-between">
                                        <div className="d-flex flex-row align-items-center">
                                          <div>
                                            <img
                                              src={getImageUrl(Tickets.name)}
                                              className="img-fluid rounded-3"
                                              alt="Shopping item"
                                              style={{ width: '65px' }}
                                            />
                                          </div>
                                          <div className="ms-3">
                                            <h5>{Tickets.name}</h5>
                                            <p className="small mb-0">ราคา {Tickets.price} บาท</p>
                                          </div>
                                        </div>
                                        <div className="align-middle">
                                          <div className="d-flex flex-row">
                                            <button
                                              // className="btn btn-link px-2"
                                              className="quantity-btn decrease btn btn-link px-2" onClick={() => decreaseCount(Tickets.id)}
                                            >
                                              <i className="fas fa-minus"></i>
                                            </button>

                                            <input
                                              id="form1" min="0"
                                              name="quantity" value={ticketCounts[Tickets.id] || 0} type="number"
                                              className="form-control form-control-sm quantity-display"

                                              style={{ width: '50px' }}
                                              readOnly // ป้องกันการพิมพ์เข้าไป
                                            />

                                            <button className="quantity-btn increase btn-link px-2" onClick={() => increaseCount(Tickets.id)}
                                            // className="btn btn-link px-2"

                                            >
                                              <i className="fas fa-plus"></i>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>



                                ))}
                                <hr className="my-4" />

                                <div className="pt-5">
                                  <h6 className="mb-0">
                                    <a href="#!" className="text-body">
                                      {/* <i className="fas fa-long-arrow-alt-left me-2"></i>Back to shop */}
                                    </a>
                                  </h6>
                                </div>
                              </div>
                            </div>


                          </div>
                        </div>
                      </div>
                    </div>




                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>







      <div className="modal fade" id="exampleModal" tabindex="0" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" >
          <div className="modal-content" style={{ background: 'white', boxShadow: '0px 0px 7.699999809265137px rgba(0, 0, 0, 0.25)', borderRadius: 50, border: '2px #02F4BD solid' }}>
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">รายการบัตรเข้าชม วันที่        {formatDate(date.toString())}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <section >
                <div className=" ">
                  <div className="row d-flex justify-content-center">
                    <div className="col-md-12 col-lg-10 col-xl-8">
                      <div className="card">
                        <div className="card-body p-md-5">


                          <div className="px-3 py-4 border border-primary border-2 rounded mt-4 d-flex justify-content-between">
                            <div className="d-flex flex-row align-items-center">
                              <img alt='' src={imageUrl} className="rounded" width="60" />
                              <div className="d-flex flex-column ms-4">
                                <span className="h5 mb-1">รวมทั้งหมด</span>
                                <span className="small text-muted">รวมค่าบริการ</span>
                              </div>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                              <sup className="dollar font-weight-bold text-muted">฿</sup>
                              <span className="h2 mx-1 mb-0">{totalPrice} </span>

                            </div>
                          </div>





                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <div className="row py-5">

                {selectedTickets.map((tickets) => (
                  <div key={tickets.id} className="col-md-6 py-2">
                    <div className="container py-2" style={{ background: 'white', boxShadow: '0px 0px 7.699999809265137px rgba(0, 0, 0, 0.25)', borderRadius: 15, border: '2px #02F4BD solid' }}>
                      <div className="row">
                        <div className="col-3"><img src={getImageUrl(tickets.name)} width="60" alt="Ticket" /></div>
                        <div className="col-6">
                          <div style={{ textAlign: 'center', color: 'black', fontSize: 16, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}></div>
                          <div style={{ textAlign: 'center', color: 'black', fontSize: 15, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>รายการ : {tickets.name}</div>
                          <div style={{ textAlign: 'center', color: 'black', fontSize: 15, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>ราคา : {tickets.price} ฿</div>

                        </div>
                        <div className="col-3">

                          <div style={{ textAlign: 'center', color: 'black', fontSize: 15, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>x{ticketCounts[tickets.id]}</div>
                        </div>
                      </div>
                    </div>
                  </div>


                ))}

              </div>
            </div>
            <div className="modal-footer">

              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="exampleModalp" tabindex="0" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" >
          <div className="modal-content" style={{ background: 'white', boxShadow: '0px 0px 7.699999809265137px rgba(0, 0, 0, 0.25)', borderRadius: 50, border: '2px #02F4BD solid' }}>
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">รายการบัตรเข้าชม วันที่        {date.toString()}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">





              <div className="container " >
                <div className="">
                  <div className="col-md-12 text-center mt-5">

                    <div className="text-center"> <i className="fa fa-close close" data-dismiss="modal"></i> </div>
                    <div className="tabs mt-3">
                      <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation"> <a className="nav-link active" id="visa-tab"
                          data-toggle="tab" href="#visa" role="tab" aria-controls="visa" aria-selected="true">
                          <img alt='' src="https://i.imgur.com/sB4jftM.png" width="80" /> </a> </li>
                        <li className="nav-item" role="presentation"> <a className="nav-link" id="paypal-tab" data-toggle="tab"
                          href="#paypal" role="tab" aria-controls="paypal" aria-selected="false"> <img alt=''
                            src="https://secure1.zimple.cloud/images/thai_qr_payment.png" width="80" /> </a> </li>
                      </ul>
                      <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="visa" role="tabpanel" aria-labelledby="visa-tab">
                          <div className="mt-4 mx-4">
                            <div className="text-center">
                              <h5>Credit card</h5>
                            </div>
                            <div className="form mt-3">
                              <Credit data={data}></Credit>
                              <div className="px-5 pay">
                                {/* <button className="btn btn-success btn-block">Add card</button> */}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane fade" id="paypal" role="tabpanel" aria-labelledby="paypal-tab">
                          <div className="px-5 mt-5">
                            {!isExpired ? (
                              <>


                                <div className="countdown-container">
                                  <p className="countdown-text">เวลาชำระเงิน:</p>
                                  <div className="countdown-timer">{formatTime(remainingTime)}</div>
                                </div>

                                <div className='container' style={{ height: 670, background: 'white' }}>
                                  <div className='container ' style={{ textAlign: 'center', color: '#0C9331', fontSize: 25, fontFamily: 'Kanit', fontWeight: '400', }}>แสกน QR เพื่อชำระเงิน</div>

                                  <div className='container mt-5'>
                                    <QRCode value={qrData} />
                                  </div>
                                  <div className='container mt-5' style={{ textAlign: 'center', color: '#7C7C7C', fontSize: 30, fontFamily: 'Kanit', fontWeight: '400', wordWrap: 'break-word' }}>ยอดชำระเงินทั้งหมด {totalPrice} บาท</div>
                                  <div style={{ textAlign: 'center' }}>
                                    <span style={{ color: '#FF0000', fontSize: 20, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>หมายเหตุ </span><span style={{ color: 'black', fontSize: 20, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>: ท่านสามารถทำรายการชำระในภายหลัง<br /> ได้ที่หน้าเมนูรายการจอง (Booking List)</span>
                                  </div>
                                </div>


                              </>

                            )

                              : (
                                <div className="expired-message">
                                  <p>หมดเวลาสำหรับการชำระเงินของรายการนี้</p>
                                </div>
                              )}

                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="col-md-12 py-5">


                  </div>
                </div>
              </div>





            </div>
            <div className="modal-footer">

              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>

            </div>
          </div>
        </div>
      </div>


      {/* UI v2 */}






    </div>
  );
}

export default Addticket;


