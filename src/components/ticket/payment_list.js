
import React, {  useEffect } from 'react';

import './cder.css';
import backgroundImage from '../img/bgg.png';

import imgtikket from '../img/imgticket.png';
import QRCode from 'react-qr-code';

function PaymentList() {
    // const location = useLocation();
    // const { state } = location;
    // const [ticketCounts, setTicketCounts] = useState({});
    // // const [Tickets, setTicket] = useState([]);


    useEffect(() => {

        // if (state && state.selectedTickets) {
        //     const counts = state.selectedTickets.reduce((acc, ticket) => {
        //       acc[ticket.id] = (acc[ticket.id] || 0) + 1;
        //       return acc;
        //     }, {});
        //     setTicketCounts(counts);
        //   }
        // const requestOptions = {
        //     method: 'GET',
        //     redirect: 'follow',
        //     mode: "cors", // เพิ่มโหมด 'no-cors' เข้าไป
        // };

        // fetch(`https://addpay.net/api/v1/zoo/e-member/ticket-zoo/1`, requestOptions)
        //     .then((response) => response.json())
        //     .then((result) => {
        //         console.log(result);
        //         setTicket(result);
        //     })
        //     .catch((error) => console.error(error));
    }, []);

    const qrData = "00020101021230760016A0000006770101120115099400016486604021599112705670000203142024052713230153037645406400.005802TH6304D63C";

    return (
        <div style={{ height: '100%' }}>
            <section
                className="text-center"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
              
                <div className="mt-2" style={{ textAlign: 'center', color: 'black', fontSize: 24, fontFamily: 'Kanit', fontWeight: '275', wordWrap: 'break-word' }}>BUY ZOO TICKET</div>
                <div style={{ textAlign: 'center', color: 'black', fontSize: 48, fontFamily: 'Kanit', fontWeight: '400', wordWrap: 'break-word' }}>จองตั๋วสวนสัตว์</div>
                <div className="container py-2 " style={{ background: 'rgba(255, 255, 255, 0.80)', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.30)', borderRadius: 72 }}>
                    <div className="row">
                        <div className="col-md-6 mt-5">

                            <div className='container' style={{ height: 670, background: 'white', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.30)', borderRadius: 72 }}>
                                <div className='container ' style={{ textAlign: 'center', color: '#0C9331', fontSize: 36, fontFamily: 'Kanit', fontWeight: '400', }}>แสกน QR เพื่อชำระเงิน</div>

                                <div className='container mt-5'>
                                <QRCode value={qrData} />
                                </div>
                                <div className='container mt-5' style={{ textAlign: 'center', color: '#7C7C7C', fontSize: 30, fontFamily: 'Kanit', fontWeight: '400', wordWrap: 'break-word' }}>ยอดชำระเงินทั้งหมด 440.00 บาท</div>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ color: '#FF0000', fontSize: 20, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>หมายเหตุ </span><span style={{ color: 'black', fontSize: 20, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>: ท่านสามารถทำรายการชำระในภายหลัง<br /> ได้ที่หน้าเมนูรายการจอง (Booking List)</span>
                                </div>
                            </div>

                        </div>
                        <div className="col-md-6 py-5">
                            <div className="row mt-2">
                                <div className="col-md-3 col-sm-12 text-center">
                                    <div style={{ width: 130, height: 139, background: 'white', borderRadius: 17, border: '2px #007DF1 solid' }}>
                                        <img style={{ width: 100, height: 120 }} src='https://www.investopedia.com/thmb/hJrIBjjMBGfx0oa_bHAgZ9AWyn0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/qr-code-bc94057f452f4806af70fd34540f72ad.png' alt="Ticket" />
                                    </div>
                                </div>
                                <div className="col-md-9 col-sm-12 ">
                                    <div style={{ color: 'black', fontSize: 40, fontFamily: 'Kanit', fontWeight: '400' }}></div>
                                    <div style={{ color: 'black', fontSize: 30, fontFamily: 'Kanit', fontWeight: '300' }}>เปิดทุกวัน เวลา 09.00 น.-17.00น.</div>
                                </div>
                            </div>
                            <div className="overflow-scroll">
                                <div className='row'>
                                
                                        <div  className="col-md-12 py-2">
                                            <div className="container py-2" style={{ background: 'white', boxShadow: '0px 0px 7.699999809265137px rgba(0, 0, 0, 0.25)', borderRadius: 15, border: '2px #02F4BD solid' }}>
                                                <div className="row">
                                                    <div className="col-3"><img src={imgtikket} alt="Ticket" /></div>
                                                    <div className="col-6">
                                                        <div style={{ textAlign: 'center', color: 'black', fontSize: 16, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>Ticket.name</div>
                                                        <div style={{ textAlign: 'center', color: 'black', fontSize: 15, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>รายการ : Ticket.name</div>
                                                        <div style={{ textAlign: 'center', color: 'black', fontSize: 15, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>ราคา : Ticket.price ฿</div>

                                                    </div>
                                                    <div className="col-3">

                                                        <div style={{ textAlign: 'center', color: 'black', fontSize: 15, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>xticketCountsTicket.id</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                 
                                </div>
                            </div>



                            <div className="col-md-12 mt-2">
                                <div className="container">
                                    <div style={{ textAlign: 'center' }}><span style={{ color: 'black', fontSize: 20, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>ยอดชำระเงินทั้งหมด   </span><span style={{ color: '#FF0000', fontSize: 36, fontFamily: 'Kanit', fontWeight: '300', wordWrap: 'break-word' }}>440 ฿</span></div>
                                </div>

                            </div>
                            <div className="col-md-12 mt-2">
                                <div className="container">
                                    <button data-toggle="modal" data-target="#exampleModal" style={{ width: 292, height: 58, background: 'linear-gradient(180deg, #02F4BD 0%, #0075F4 100%)', borderRadius: 124, border: '2px #0075F4 solid' }} type="button" className="btn btn-primary">ชำระภายหลัง</button>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </section>




        </div>
    );
}

export default PaymentList