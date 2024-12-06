/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import liff from '@line/liff';
import { API_ENDPOINT } from '../auth/config';
import { formatDate } from '../FormatDate/formatDate';
import './Invoice.css'; // นำเข้าไฟล์ CSS
const ReportGenerator = ({ data }) => {
    const [onlineoder, setonlineoder] = useState([]);
    const [id, setid] = useState(data.value1);
    const [ticket, setticket] = useState(data.value2);
    const [qrcode, setqrcode] = useState(data.value3);
    const [Date, setDate] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        Getdataticket();
     
    }, [ticket]); // เมื่อ data.value1 เปลี่ยนแปลง

    useEffect(() => {
        setid(data.value1);
        setticket(data.value2);
        setqrcode(data.value3);
    }, [data.value1, data.value2, data.value3]);

 

    // const generatePDF = async () => {
    //     alert("กดยืนยันเพื่อดาวโหลด PDF...");

    //     const pdf = new jsPDF('p', 'mm', 'a4');
    //     const imgWidth = 210; // A4 width in mm
    //     const margin = 10; // Margin in mm

    //     await new Promise(resolve => setTimeout(resolve, 100));

    //     const generatePage = async (index) => {
    //         const pageContent = document.getElementById(`page-${index}`);
    //         if (!pageContent) {
    //             console.error(`No content found for page ${index}`);
    //             return;
    //         }

    //         const canvas = await html2canvas(pageContent, { useCORS: true });
    //         const imgData = canvas.toDataURL('image/png');
    //         const imgHeight = (canvas.height * imgWidth) / canvas.width;

    //         // Only add a new page if it's not the first page
    //         if (index > 1) pdf.addPage();
    //         pdf.addImage(imgData, 'PNG', margin, margin, imgWidth - 2 * margin, imgHeight - 2 * margin);

    //         // Add watermark
    //         const text = 'zoo e-Ticket';
    //         pdf.setFontSize(20);
    //         pdf.setTextColor(0, 0, 0, 0.09);
    //         const spacing = 56;

    //         for (let x = -spacing; x < imgWidth; x += spacing) {
    //             for (let y = -spacing; y < imgHeight; y += spacing) {
    //                 pdf.text(text, x + margin, y + margin, { angle: -50 });
    //             }
    //         }
    //     };

    //     try {
    //         await generatePage(1); // Adjust this if you have multiple pages
            
    //         pdf.save('zoo-e-ticket.pdf');
    //         alert("ดาวน์โหลด PDF เสร็จเรียบร้อยแล้ว");
    //     } catch (error) {
    //         console.error('Error generating PDF:', error);
    //         alert("เกิดข้อผิดพลาดในการดาวน์โหลด PDF");
    //     }
    // };


    const generatePDF = async () => {
        alert("กดยืนยันเพื่อดาวโหลด PDF...");
    
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const margin = 10; // Margin in mm
    
        await new Promise(resolve => setTimeout(resolve, 100));
    
        const generatePage = async (index) => {
            const pageContent = document.getElementById(`page-${index}`);
            if (!pageContent) {
                console.error(`No content found for page ${index}`);
                return;
            }
    
            const canvas = await html2canvas(pageContent, { useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
            if (index > 1) pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, margin, imgWidth - 2 * margin, imgHeight - 2 * margin);
    
            const text = 'zoo e-Ticket';
            pdf.setFontSize(20);
            pdf.setTextColor(0, 0, 0, 0.09);
            const spacing = 56;
    
            for (let x = -spacing; x < imgWidth; x += spacing) {
                for (let y = -spacing; y < imgHeight; y += spacing) {
                    pdf.text(text, x + margin, y + margin, { angle: -50 });
                }
            }
        };
    
        try {
            await generatePage(1); // Adjust this if you have multiple pages
            const blob = pdf.output("blob");
            const url = URL.createObjectURL(blob);
    
            // Open download in Chrome
            const a = document.createElement('a');
            a.href = url;
            a.download = 'zoo-e-ticket.pdf';
            a.click();
    
            URL.revokeObjectURL(url);
            alert("ดาวน์โหลด PDF เสร็จเรียบร้อยแล้ว");
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert("เกิดข้อผิดพลาดในการดาวน์โหลด PDF");
        }
    };
    




    const Getdataticket = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", localStorage.getItem('apikey'));
        const raw = JSON.stringify({ "id": ticket });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${API_ENDPOINT}/api/v1/zoo/e-member/online-order`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setonlineoder(result.online_tickets); // อัปเดตค่า onlineoder ด้วยข้อมูลที่ได้รับ
                console.log(result.onDate)
                setDate(result.online_tickets[0].expire_date)
            })
            .catch((error) => console.error(error));
    }

    const handleGoBack = () => {
        navigate(-1); // Navigate back to the previous page
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
                });
            }
            return acc;
        }, []);
    };

    const aggregatedTickets = aggregateTickets(onlineoder);

    return (
        <div >
            <button onClick={handleGoBack} style={styles.button}>ย้อนกลับ</button>
            <button onClick={generatePDF} style={styles.button}>ดาวโหลดบัตรเข้าชมสวนสัตว์</button>
            {/* <p>{id}</p>
            <p>{qrcode}</p>
            <p>{ticket}</p> */}
            <div className='overflow-auto'>
                <div id="report-content" style={styles.container} >

                    <div id={`page-1`}>

                        <div className='container h-150' style={styles.h}></div>
                        <div className="">
                            <div className="page-header text-blue-d2">
                                <h1 className="page-title text-secondary-d1">
                                    zoo e-ticket
                                    <small className="page-info">
                                        <i className="fa fa-angle-double-right text-80"></i>
                                        ID:
                                        {`${qrcode}`}
                                    </small>
                                </h1>

                            </div>

                            <div className="container">
                                <div className="row mt-4">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="text-center text-150">
                                                    {/* <i className="fa fa-book fa-2x text-success-m2 mr-1"></i> */}
                                                    <span className="text-default-d3">{id}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <hr className="row brc-default-l1 mx-n1 mb-4" />

                                        <div className="row">
                                            <div className="col-6">
                                                <div>
                                                    <span className="text-sm text-grey-m2 align-middle">Name:</span>
                                                    <span className="text-600 text-110 text-blue align-middle"> {localStorage.getItem('name')}</span>
                                                </div>
                                                <div className="text-grey-m2">
                                                    <div className="my-1">Ticket Date: {formatDate(Date)}
                                                        {/* {items.ticket_type.name} */}
                                                    </div>
                                                    <div className="my-1">ZOO: {id}</div>

                                                </div>
                                            </div>


                                        </div>



                                        <div className="mt-4">
                                            <table className="table">
                                                <thead>
                                                    <tr className="text-600 text-white bgc-default-tp1">
                                                        <th>#</th>
                                                        <th>รายการ</th>
                                                        <th>จำนวน</th>
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
                                                                <td className="text-secondary-d2">฿{ticket.price}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4">ไม่มีข้อมูล</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>

                                            <div className="row mt-3">
                                                <div className="col-12 text-center col-sm-7 text-grey-d2 text-95 mt-2 mt-lg-0">
                                                    <QRCodeCanvas value={`${qrcode}`} size={100} />
                                                </div>

                                                <div className="col-12 col-sm-5 text-grey text-90 order-first order-sm-last">
                                                    <div className="row my-2 align-items-center bgc-primary-l3 p-2">
                                                        <div className="col-7 text-right">รวมทั้งหมด</div>
                                                        <div className="col-5">
                                                            ฿{aggregatedTickets.reduce((sum, ticket) => sum + ticket.price, 0)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <hr />
                                            <div className="container mt-3 text-center fs-10 ">
                                                <p className='text-danger'>*****เงื่อนไขการใช้งานบัตร กรณีที่บัตรยังไม่ถึงวันที่เข้าชม สามารถเลื่อนวันที่เข้าชมได้หนึ่งครั้ง QRCode เป็นแบบสแกนเข้าชมได้ครั้งเดียวเท่านั้น และบัตรจะถูกใช้งานทั้งหมดนั้นวันที่เข้าชม*******</p>
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
    );
};

const styles = {
    h: {
        height: '3.5rem',
    },
    hh: {
        height: '18rem',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '20px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    container: {
        width: '210mm', // A4 width
        padding: '20px',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#ffffff',
        border: '1px solid #ddd',
        borderRadius: '10px',
        textAlign: 'left',
        position: 'relative',
        margin: 'auto',
        maxWidth: '800px',
    },
    headerContainer: {
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    logo: {
        width: '120px',
        marginBottom: '10px',
        filter: 'grayscale(100%)',
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        margin: '0',
    },
    infoContainer: {
        marginBottom: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
    },
    tableCell: {
        padding: '8px',
        borderBottom: '1px solid #ddd',
        fontSize: '16px',
        color: '#555',
    },
    qrContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginTop: '20px',
        right: '20px',
        bottom: '20px',
    },
    qrText: {
        marginTop: '10px',
        fontSize: '14px',
        color: '#333',
        textAlign: 'center',
    },
};

export default ReportGenerator;
