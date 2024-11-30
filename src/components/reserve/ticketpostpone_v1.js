
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import QRCode from 'react-qr-code';
import imgzoos from '../model/imgmodel';
import Zpotlogo from '../img/ZPOT_LOGO.png';
import Calendar from 'react-calendar';
import "./ticketpostpone.css"
import { formatDate } from '../FormatDate/formatDate';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINT } from '../auth/config';


function Ticketpostpone_v1() {
    const [date, setDate] = useState('');
    // const [isChecked, setIsChecked] = useState(null);
    const location = useLocation();
    const { state } = location;
    const [idzoo, setidzoo] = useState([]);
    const [onlineoder, setonlineoder] = useState([]);
    // const [amount, setamount] = useState([]);
    // const [qrData, setontqrData] = useState([]);
    const [onDate, setonDate] = useState([]);
    const [idbill, setidbill] = useState([]);
    const [status, setstatus] = useState([]);
    const [postpone, setpostpone] = useState(null);
    const [ticket, setidticket] = useState('');
    const [rf2, setidrf2] = useState('');
    const [Qrpayment, setpayment] = useState('');
    const qrValue = `${idbill}/${ticket}`;
    const navigate = useNavigate();
    // const [isAnyItemChecked, setIsAnyItemChecked] = useState(false);
    const [zooname, setname] = useState('');
    const [zooImg, setImage] = useState(Zpotlogo);


    const handlPdf = () => {
        navigate('/PDFViewer', {
            state: {
                name: zooname, id: state.id, ticket: idbill, onDate: onDate
            }
        });
    };
    useEffect(() => {

        Getdataticket();
    }, []); // ให้ useEffect ทำงานเมื่อ filterStatus เปลี่ยนแปลง

    const Getdataticket = () => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", localStorage.getItem('apikey_v1'));
        const raw = JSON.stringify({
            "id": state.id
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${API_ENDPOINT}/api/v1/zoo/e-member/online-order`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result)
                setonlineoder(result.online_tickets);
                // setontqrData(result.ref1);
                setidzoo(result.zoo_id);
                setpayment(result.tqrc_qr);
                setstatus(result.status);
                setonDate(result.online_tickets[0].expire_date);
                setidbill(result.ref1);
                setidrf2(result.ref2);
                setpostpone(result.postpone)
                if (result.status === 'pending') {
                    const intervalId = setInterval(() => {
                        checkPayment(result.ref1, result.ref2);
                    }, 5000); // 5000 milliseconds = 5 seconds

                    // ทำความสะอาด interval เมื่อคอมโพเนนต์ถูก unmount
                    return () => clearInterval(intervalId);
                } else {

                }
            })
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        if (idzoo !== null) {
            const foundZoo = imgzoos.find(item => item.id === idzoo);
            if (foundZoo) {
                setImage(foundZoo.img);
                setname(foundZoo.name);
            } else {
                // กำหนดรูปภาพเริ่มต้นในกรณีที่ไม่พบข้อมูล
                setImage(Zpotlogo);
                setname('องค์การสวนสัตว์แห่งประเทศไทย');
            }
        } else {
            // กำหนดรูปภาพเริ่มต้นในกรณีที่ zoo_id เป็น null
            setImage(Zpotlogo);
            setname('องค์การสวนสัตว์แห่งประเทศไทย');
        }
    }, [idzoo, imgzoos]); // ให้ useEffect ทำงานเมื่อ idzoo หรือ imgzoos เปลี่ยนแปลง
    const handleCheckboxChange = (id) => {
        // setIsChecked(id);
        setidticket(id);
        // setIsAnyItemChecked(true); // หรือใช้วิธีการเพื่อเช็คว่าสินค้าใดถูกเลือกหรือไม่
        // console.log(id);
    };
    const Ticketpostpone = (date) => {
        // console.log(id)
        // console.log(date)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", localStorage.getItem('apikey_v1'));
        const raw = JSON.stringify({
            "oid": state.id,
            "onDate": date
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        Swal.fire({
            title: 'ยืนยันการเลื่อนวันเข้าชม',
            text: `คุณต้องการเลื่อนวันเข้าชมบัตร ID: ${qrValue} หรือไม่?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ไม่ใช่',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        }).then((result) => {
            setpostpone(result.postpone)
            if (result.isConfirmed) {
                // ดำเนินการเลื่อนวันเข้าชมถ้าผู้ใช้เลือก 'ใช่'
                fetch(`${API_ENDPOINT}/api/v1/zoo/e-member/order-postpone`, requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        Swal.fire({
                            title: `${result.status}`,
                            text: `${result.msg}`,
                            icon: `${result.status}`,
                            confirmButtonText: 'ตกลง'
                        }).then(() => {
                            Getdataticket(); // เรียกใช้ฟังก์ชันเพื่อโหลดข้อมูลบัตรใหม่
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            title: 'ข้อผิดพลาด',
                            text: 'ไม่สามารถเลื่อนวันที่บัตรเข้าชมได้',
                            icon: 'error',
                            confirmButtonText: 'ตกลง'
                        });
                        console.error(error);
                    });
            }
        });
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
            alert('ขออภัยไม่สามารถเลื่อนบัตรได้สำหรับวันนี้แล้ว กำหนดเวลาถึง 14:00 กรุณาเลือกวันที่ถัดไป');
        }
    };

    const aggregateTickets = (tickets) => {
        return tickets.reduce((acc, item) => {
            const existing = acc.find(t => t.id === item.ticket_type.id);
            if (existing) {
                existing.quantity += 1; // Assuming each item in onlineoder represents one ticket
                existing.price += item.ticket_type.price; // Sum the price
            } else {
                acc.push({
                    id: item.ticket_type.id,
                    name: item.ticket_type.name,
                    quantity: 1,
                    price: item.ticket_type.price,
                    expire_date: item.expire_date
                });
            }
            return acc;
        }, []);
    };

    const aggregatedTickets = aggregateTickets(onlineoder);



    const checkPayment = (ref1, ref2) => {

        console.log(localStorage.getItem('apikey_v1'))
        console.log(ref1)
        console.log(ref2)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", `${localStorage.getItem('apikey_v1')}`);

        const raw = JSON.stringify({
            "ref1": ref1,
            "ref2": ref2
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

                if (result.respMsg === "Unsuccess") {
                    console.log(result)
                } else if (result.status === 'approved') {
                    console.log(result)

                    // แสดงการแจ้งเตือนเมื่อชำระเงินสำเร็จ
                    Swal.fire({
                        title: 'Payment Successful',
                        text: 'Your payment was successful!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // เปลี่ยนเส้นทางไปยังหน้า /OrderList
                            // window.location = "/emember/zoolineoa/OrderList";
                            window.location = "/lineOA/OrderList";
                        }
                    });
                } else {

                }


            })
            .catch((error) => console.error(error));



    }


    return (
        <div>
            <section>
                <Navbar />


                <div className=" px-1 ">
                    <div className="row flex-column-reverse flex-md-row">
                        <div className="col-md-5  mt-2 mt-lg-5">
                            <div className="card card-scan py-5">
                                <div className="text-center fs-3 fw-bold">
                                    <p className="display-6 text-primary mb-0">สแกน QR</p>
                                    <p className="display-8 mb-0">
                                        {status === 'pending' ? 'เพื่อชำระเงิน' : 'เพื่อเข้าชมสวนสัตว์'}
                                    </p>
                                    <p className={`display-8 mb-0 ${status === 'approved' ? 'text-success' :
                                        status === 'pending' ? 'text-warning' :
                                            status === 'cancel' ? 'text-danger' : ''
                                        }`}>
                                        สถานะ: {status}
                                    </p>

                                </div>
                                <div className="mt-2 text-center">
                                    {status === 'pending' ? (
                                        <QRCode size={150} value={Qrpayment} />
                                    ) : (
                                        <QRCode size={150} value={ticket === '' ? idbill : qrValue} />
                                    )}


                                </div>
                                <div className="mt-3 text-center fs-4 fw-light">
                                    เลขที่คำสั่งซื้อ : {ticket === '' ? idbill : qrValue}

                                </div>
                                <div className="container mt-3 text-center fs-10 ">
                                    <p className='text-danger'>*****เงื่อนไขการใช้งานบัตร กรณีที่บัตรยังไม่ถึงวันที่เข้าชม สามารถเลื่อนวันที่เข้าชมได้หนึ่งครั้ง QRCode เป็นแบบสแกนเข้าชมได้ครั้งเดียวเท่านั้น และบัตรจะถูกใช้งานทั้งหมดนั้นวันที่เข้าชม*******</p>
                                </div>

                                <div className="mt-3 text-center fs-4 fw-normal">

                                    <div className="container mt-4 text-center">

                                        {/* {status === 'pending' && (
                                            
                                            <div className="  col-12  text-center">
                                      
                                            <button
                                                className="btn btn-primary btn-lg btn-block"
                                                data-toggle="modal"
                                                data-target="#exampleModal"
                                                type="button"
                                            >
                                                ชำระเงิน
                                            </button>
                                            </div>
                                        )} */}


                                        <div className="  col-12  text-center mt-3">
                                            <Link
                                                to="/OrderList_v1"
                                                className="btn btn-primary btn-lg btn-block"
                                                data-toggle="modal"
                                                data-target="#exampleModal"
                                                type="button"
                                            >
                                                ย้อนกลับ
                                            </Link>
                                        </div>

                                        {/* <div className="col-12 col-sm-6 p-0 text-center">
                                        <button
                                            className={`btn btn-primary btn-lg btn-block `}
                                            onClick={handlPdf}

                                        >
                                            Report PDF
                                        </button>
                                    </div> */}

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-7 mt-2 mt-lg-5">
                            <div className="row bg-light py-3 card-title">
                                <div className="col-12 col-md-3 col-xl-2 text-center">
                                    <div>
                                        <img
                                            style={{ width: "auto", height: "7em" }}
                                            src={zooImg}
                                            alt="Ticket"
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-9 col-xl-10 mt-0 mt-md-3 mt-xl-4">
                                    <div className="text-center text-md-start fs-5 fw-normal text-primary">
                                        รหัสอ้างอิง : {idbill}
                                    </div>
                                    <div className="text-center text-md-start fs-6 fw-normal">
                                        บัตรเข้าชม{zooname}
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-2 se-date">


                                <div className="text-center mt-2 se-date">
                                    <button type="button" className="btn btn-outline-primary" onClick={handlPdf}>report pdf</button>


                                    {postpone === null ? (

                                        <button

                                            data-toggle="modal"
                                            data-target="#staticBackdrop"
                                            className='btn btn-success'


                                            type="button"
                                        // ปิดการใช้งานปุ่มหากไม่มีการเลือก และไม่ใช่สถานะ 'ready'
                                        >
                                            เลื่อนวันข้าชม
                                        </button>
                                    ) : (

                                        <button
                                            className={`btn ${postpone !== null ? 'btn-danger' : 'btn-success'}`} // ใช้คลาสตามสถานะ
                                            type="button"
                                            disabled
                                        >
                                            {postpone !== null ? 'เลื่อนวันแล้ว' : 'ไม่สามารถเลื่อนวันข้าชมได้'}
                                        </button>

                                    )}
                                </div>

                            </div>

                            <div className=" ">
                                <div className="mt-3 d-flex flex-wrap">

                                    <table className="table">
                                        <thead>
                                            <tr className="text-600 text-white bg-success">
                                                <th>#</th>
                                                <th>รายการ</th>
                                                <th>จำนวน</th>
                                                <th>วันที่</th>
                                                <th>ราคา</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-secondary-d3">
                                            {aggregatedTickets.length > 0 ? (
                                                aggregatedTickets.map((ticket, index) => (
                                                    <tr key={ticket.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{ticket.name} </td>
                                                        <td>{ticket.quantity}x</td>
                                                        <td>    {postpone === null ? (formatDate(onDate)) : (formatDate(ticket.expire_date))}</td>
                                                        <td className="text-secondary-d2">{ticket.price} บาท</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4">ไม่มีข้อมูล</td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <thead>
                                            <tr className="text-600 text-white bgc-default-tp1">
                                                <th>รวม</th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th>  {aggregatedTickets.reduce((sum, ticket) => sum + ticket.price, 0)} บาท</th>
                                            </tr>
                                        </thead>
                                    </table>

                                    {/* {onlineoder.map((items) => (
                                        <div className="p-2 mx-auto card" key={items.id}>
                                            <div className="">
                                                <div className="card-item mx-auto rounded-5">
                                                    <input className='input'
                                                        type="radio"
                                                        id={`flexRadioDefault${items.id}`}
                                                        name="flexRadioDefault"
                                                        onChange={() => handleCheckboxChange(items.id)}
                                                        disabled={items.status !== 'ready' && items.status !== 'active'} // ปิดการใช้งาน radio button สำหรับสถานะที่ไม่ใช่ 'ready' หรือ 'active'
                                                    />
                                                    <label htmlFor={`flexRadioDefault${items.id}`} className="p-3 labell">
                                                        <p className="text-start p-0 m-0">วันที่ : {formatDate(items.expire_date)}</p>
                                                        <p className="text-start p-0 m-0">รายการ : {items.ticket_type.name}</p>
                                                        <p className="text-start p-0 m-0">ราคา : {items.ticket_type.price}฿</p>
                                                        <p className={`text-start p-0 m-0 ${items.status === 'ready' ? 'text-success ' : // สีเขียว
                                                            items.status === 'active' ? 'text-warning ' : // สีเหลือง
                                                                'text-secondary ' // สีแดงสำหรับ finished, expire, cancel
                                                            }`}>
                                                            สถานะ : {
                                                                items.status === 'ready' ? 'บัตรพร้อมใช้งาน' :
                                                                    items.status === 'active' ? 'บัตรกำลังใช้งาน' :
                                                                        items.status === 'finished' ? 'บัตรใช้งานแล้ว' :
                                                                            items.status === 'expire' ? 'บัตรหมดอายุ' :
                                                                                items.status === 'cancel' ? 'บัตรถูกยกเลิก' :
                                                                                    'บัตรหมดอายุการใช้งาน'
                                                            } 
                                                        </p>

                                                        <div className="text-center mt-2 se-date">
                                                            {items.postpone === null ? (
                                                                <></>
                                                                // <button
                                                                //     data-toggle="modal"
                                                                //     data-target="#staticBackdrop"
                                                                //     className={`btn ${items.status === 'ready' ? 'btn-success' : // สีเขียว
                                                                //         items.status === 'active' ? 'btn-warning' : // สีเหลือง
                                                                //             'btn-secondary' // สีแดงสำหรับ finished, expire, cancel
                                                                //         }`}
                                                                //     type="button"
                                                                //     disabled={!isAnyItemChecked && items.status === 'ready'} // ปิดการใช้งานปุ่มหากไม่มีการเลือก และไม่ใช่สถานะ 'ready'
                                                                // >
                                                                //     เลื่อนวันข้าชม
                                                                // </button>
                                                            ) : (
                                                                <button
                                                                    className={`btn ${items.postpone !== null ? 'btn-danger' : // สีแดงเมื่อมีการเลื่อนวันแล้ว
                                                                        (items.status === 'ready' ? 'btn-success' : // สีเขียวเมื่อบัตรพร้อมใช้งาน
                                                                            'btn-secondary') // สีแดงสำหรับ finished, expire, cancel
                                                                        }`}
                                                                    type="button"
                                                                    disabled
                                                                >
                                                                    {items.postpone !== null ? 'เลื่อนวันแล้ว' : 'ไม่สามารถเลื่อนวันข้าชมได้'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </label>
                                                </div>

                                            </div>

                                        </div>
                                    ))} */}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <div
                className="modal fade"
                id="staticBackdrop"
                data-backdrop="static"
                data-keyboard="false"
                tabindex="0"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog  modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">
                                เลื่อนบัตรวันที่เข้าชมสวนสัตว์ วันที่เลือก: {formatDate(date.toString())}
                            </h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="calendar-container">
                                <Calendar onChange={onChange} value={date} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    if (date) {
                                        Ticketpostpone(date);
                                    }
                                }}
                                type="button"
                                className="btn btn-primary"
                                data-dismiss="modal"
                            >
                                เลือก
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default Ticketpostpone_v1








