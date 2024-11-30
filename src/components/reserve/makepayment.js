/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react'
import {  API_ENDPOINT } from '../auth/config';
import Navbar from '../Navbar/Navbar';
import imgtikket from '../img/imgticket.png';
import QRCode from 'react-qr-code';
import imgzoos from '../model/imgmodel';

import Credit from '../ticket/credit';
import Zpotlogo from '../img/ZPOT_LOGO.png';
import { useLocation, Link } from 'react-router-dom';
function Listreserve() {
    const location = useLocation();
    const { state } = location;
    const [idzoo, setidzoo] = useState([]);
    const [onlineoder, setonlineoder] = useState([]);
    const [amount, setamount] = useState([]);
    const [qrData, setontqrData] = useState([]);
    const [status, setstatus] = useState([]);
    const [Ref, setRef] = useState('');
    // สร้างอ็อบเจ็กต์ data
    const data = {
        value1: `${amount}`, // ใช้ Template Literal สำหรับสร้างสตริง
        value2: `${Ref}`, // ใช้ Template Literal สำหรับสร้างสตริง
        value3: 'Data 3',
    };
    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", localStorage.getItem('apikey'));
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
                setonlineoder(result.online_tickets);
                setontqrData(result.tqrc_qr);
                setidzoo(result.zoo_id);
                setamount(result.amount);
                setstatus(result.status);
                setRef(result.ref1)
            })
            .catch((error) => console.error(error));
    }, []); // ให้ useEffect ทำงานเมื่อ filterStatus เปลี่ยนแปลง
    let zooImg;
    let zooname;
    if (idzoo !== null) {
        const foundZoo = imgzoos.find(item => item.id === idzoo);
        zooImg = foundZoo ? foundZoo.img : null;
        zooname = foundZoo ? foundZoo.name : null;
    } else {
        // กำหนดรูปภาพเริ่มต้นในกรณีที่ zoo_id เป็น null
        zooImg = Zpotlogo;
        zooname = 'องค์การสวนสัตว์แห่งประเทศไทย';
    }
    // const qrData = "00020101021230760016A0000006770101120115099400016486604021599112705670000203142024052713230153037645406400.005802TH6304D63C";

    return (
        <div>
            <section
                className=" text-center"

            >
                <Navbar />
                <div className="mt-2" style={{ textAlign: 'center', color: 'black', fontSize: 24, fontFamily: 'Kanit', fontWeight: '275', wordWrap: 'break-word' }}>BUY ZOO TICKET</div>
                <div style={{ textAlign: 'center', color: 'black', fontSize: 48, fontFamily: 'Kanit', fontWeight: '400', wordWrap: 'break-word' }}>จองตั๋วสวนสัตว์</div>
                <div className="container py-2 " style={{ background: 'rgba(255, 255, 255, 0.80)', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.30)', borderRadius: 72 }}>
                    <div className="row">

                        <div className="col-md-6 mt-5">

                            <div className="text-right"> <i className="fa fa-close close" data-dismiss="modal"></i> </div>
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
                                            <div className='container' style={{ background: 'white', width: 488, height: 670, borderRadius: 72, border: '3px #02F4BD solid' }} >
                                                <div className='container ' style={{ textAlign: 'center', color: '#0C9331', fontSize: 36, fontFamily: 'Kanit', fontWeight: '400', }}>แสกน QR เพื่อชำระเงิน</div>
                                                <div style={{ textAlign: 'center', color: '#007DF1', fontSize: 20, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>สถานะ : {status}</div>
                                                <div className='container mt-5'>
                                                    <QRCode value={qrData} />
                                                </div>
                                                <div className='container mt-5' style={{ textAlign: 'center', color: '#7C7C7C', fontSize: 30, fontFamily: 'Kanit', fontWeight: '400', wordWrap: 'break-word' }}>ยอดชำระเงินทั้งหมด {amount} บาท</div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <span style={{ color: '#FF0000', fontSize: 20, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>หมายเหตุ </span><span style={{ color: 'black', fontSize: 20, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>: ท่านสามารถทำรายการชำระในภายหลัง<br /> ได้ที่หน้าเมนูรายการจอง (Booking List)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className='container' style={{ background: 'white', width: 488, height: 670, borderRadius: 72, border: '3px #02F4BD solid' }} >
                                <div className='container ' style={{ textAlign: 'center', color: '#0C9331', fontSize: 36, fontFamily: 'Kanit', fontWeight: '400', }}>แสกน QR เพื่อชำระเงิน</div>
                                <div style={{ textAlign: 'center', color: '#007DF1', fontSize: 20, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>สถานะ : {status}</div>
                                <div className='container mt-5'>
                                    <QRCode value={qrData} />
                                </div>
                                <div className='container mt-5' style={{ textAlign: 'center', color: '#7C7C7C', fontSize: 30, fontFamily: 'Kanit', fontWeight: '400', wordWrap: 'break-word' }}>ยอดชำระเงินทั้งหมด {amount} บาท</div>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ color: '#FF0000', fontSize: 20, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>หมายเหตุ </span><span style={{ color: 'black', fontSize: 20, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>: ท่านสามารถทำรายการชำระในภายหลัง<br /> ได้ที่หน้าเมนูรายการจอง (Booking List)</span>
                                </div>
                            </div> */}

                        </div>
                        <div className="col-md-6 py-5">
                            <div className="row mt-2">
                                <div className="col-md-3 col-sm-12 text-center">
                                    <div style={{ width: 130, height: 139, background: 'white', borderRadius: 17, border: '3px #02F4BD solid' }}>
                                        <img style={{ width: 100, height: 120 }} src={zooImg} alt="Ticket" />
                                    </div>
                                </div>
                                <div className="col-md-9 col-sm-12 ">
                                    <div style={{ textAlign: 'center', color: 'black', fontSize: 40, fontFamily: 'Kanit', fontWeight: '400', wordWrap: 'break-word' }}>{zooname}</div>
                                    <div style={{ color: 'black', fontSize: 30, fontFamily: 'Kanit', fontWeight: '300' }}>เปิดทุกวัน เวลา 09.00 น.-17.00น.</div>
                                </div>
                            </div>
                            <div className="overflow-scroll">
                                <div className='row'>
                                    {onlineoder.map(items => (


                                        <div className="col-md-12 py-2">
                                            <div className="container py-2" style={{ background: 'white', boxShadow: '0px 0px 7.699999809265137px rgba(0, 0, 0, 0.25)', borderRadius: 15, border: '2px #02F4BD solid' }}>
                                                <div className="row">
                                                    <div className="col-3"><img src={imgtikket} alt="Ticket" /></div>
                                                    <div className="col-6">
                                                        <div style={{ textAlign: 'center', color: 'black', fontSize: 16, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>{zooname}</div>
                                                        <div style={{ textAlign: 'center', color: 'black', fontSize: 15, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>รายการ : {items.ticket_type.name}</div>
                                                        <div style={{ textAlign: 'center', color: 'black', fontSize: 15, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>ราคา : {items.ticket_type.price} ฿</div>

                                                    </div>
                                                    <div className="col-3">

                                                        <div style={{ textAlign: 'center', color: 'black', fontSize: 15, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>x1</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div className='row'>

                                <div className="col-md-6 mt-2">

                                    <div className="container">
                                        <button data-toggle="modal" data-target="#exampleModal" style={{ width: 200, height: 58, background: 'linear-gradient(180deg, #FFBA3F 0%, #E96100 63%)', borderRadius: 124, border: '2px #FFBA3F solid' }} type="button" className="btn btn-primary">ยกลิกรายการ</button>
                                    </div>


                                </div>
                                <div className="col-md-6 mt-2">
                                    <div className="container">
                                        <Link to='/OrderList' data-toggle="modal" data-target="#exampleModal" style={{ width: 200, height: 58, background: 'linear-gradient(180deg, #02F4BD 0%, #0075F4 100%)', borderRadius: 124, border: '2px #0075F4 solid' }} type="button" className="btn btn-primary">ย้อนกลับ</Link>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </section>




            

        </div>
    )
}

export default Listreserve