import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';

import { useLocation, Link } from 'react-router-dom';
import { API_ENDPOINT } from '../auth/config';
import QRCode from 'react-qr-code';
import { formatDate } from '../FormatDate/formatDate';

function Listticket() {
    const location = useLocation();
    const state = location.state || {};
    const { name, id, onDate } = state;
    const [Ticket, setTicket] = useState([]);
    const [Qrcode1, setQrcode1] = useState('');
    const [selectedQR, setSelectedQR] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        Getdataticket();
    }, [id]);

    const Getdataticket = () => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('X-API-KEY', localStorage.getItem('apikey'));
        const raw = JSON.stringify({ id });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        };

        fetch(`${API_ENDPOINT}/api/v1/zoo/e-member/online-order`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setTicket(result.online_tickets || []);
                setQrcode1(result.ref1);
            })
            .catch((error) => console.error(error));
    };

    const handleCheckboxChange = (qrCodeValue) => {
        setSelectedQR(qrCodeValue); // ตั้งค่า QR Code ที่เลือก
        setShowModal(true); // แสดง Modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // ปิด Modal
        setSelectedQR(''); // ล้างค่าที่เลือก
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="card shadow p-4">
                    <h4 className="text-center">{name || 'ชื่อสวนสัตว์'}</h4>
                    <h5 className="text-center">เลขที่คำสั่งซื้อ: {Qrcode1 || 'ไม่พบข้อมูล'}</h5>
                    <h6 className="text-center">วันที่เข้าชม: {formatDate(onDate) || 'ไม่พบข้อมูล'}</h6>

                    <div className="text-center my-4">
                        <h5>QR Code หลัก</h5>
                        <QRCode value={Qrcode1} size={128} />
                    </div>

                    <div className="mt-4">
                        <h5 className="text-center">รายการบัตรออนไลน์</h5>
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr className="text-center">
                                        <th>#</th>
                                        <th>ชื่อรายการ</th>
                                        <th>วันที่</th>
                                        <th>QR Code</th>
                                        <th>เลือก</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Ticket.map((item, index) => (
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td>{item.ticket_type.name}</td>
                                            <td>
                                                {onDate
                                                    ? formatDate(onDate)
                                                    : item?.ticket_type.expire_date
                                                        ? formatDate(item.ticket_type.expire_date)
                                                        : 'ไม่ระบุ'}
                                            </td>
                                            <td className="text-center">
                                                <QRCode value={item.id || ''} size={64} />
                                            </td>
                                            <td className="text-center">
                                                <input
                                                    type="radio" // เปลี่ยนจาก Checkbox เป็น Radio เพื่อเลือกได้ทีละรายการ
                                                    name="ticketSelection" // ใช้ name เดียวกันเพื่อให้เลือกได้เพียงรายการเดียว
                                                    onChange={() =>
                                                        handleCheckboxChange(`${Qrcode1}/${item.id}`)
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {Ticket.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted">
                                                ไม่มีข้อมูลรายการ
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="  mt-3 col-12 col-sm-6 mb-3 p-0 mb-md-0 text-center">
                        <Link
                            to="/OrderList"
                            className="btn btn-primary btn-lg btn-block"
                            data-toggle="modal"
                            data-target="#exampleModal"
                            type="button"
                        >
                            ย้อนกลับ
                        </Link>
                    </div>
                </div>
            </div>

            {/* Modal สำหรับแสดง QR Code */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">QR Code ที่เลือก</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body text-center">
                                <h5 className="text-center">เลขที่ ID: {selectedQR || 'ไม่พบข้อมูล'}</h5>
                                <QRCode value={selectedQR} size={256} />

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    ปิด
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    
        </div>
    );
}

export default Listticket;
