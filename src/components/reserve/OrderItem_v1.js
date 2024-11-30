/* eslint-disable react-hooks/exhaustive-deps */


import Swal from 'sweetalert2'; // นำเข้า SweetAlert2
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './listbooking.css';
import Navbar from '../Navbar/Navbar';
import Zpotlogo from '../img/ZPOT_LOGO.png';
import imgzoos from '../model/imgmodel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { API_ENDPOINT } from '../auth/config';
import { formatDate } from '../FormatDate/formatDate';
function OrderItem({ order }) {
  let statusText;
  let statusColor;
  const getStatusLink = (status) => {
    switch (status) {
      case 'approved':
        return (
          <Link
            key={order.id}
            to="/ticketpostpone_v1"
            state={{ id: order.id, postpone: order.postpone, ticketstatus: order.action }}
            onClick={(e) => {
              if (order.action === "active" || order.status === "cancel") {
                e.preventDefault(); // ป้องกันการนำทาง
              }
            }}
            className={` ${order.action === "finished" || order.status === "cancel" ? "disabledorder disabled" : ""}`}
          >
            ดูรายการ

            <FontAwesomeIcon
              icon={faAngleRight}
              className={`icon mx-0 px-0 mx-md-0 px-md-0 d-none d-sm-inline ${order.action === "finished" || order.status === "cancel" ? "disabledorder disabled" : ""}`}
            />
          </Link>
        );
      case 'pending':
        return (
          <Link
            key={order.id}
            to="/ticketpostpone_v1"
            state={{ id: order.id, ticketstatus: order.action }}
            onClick={(e) => {
              if (order.action === "active" || order.status === "cancel") {
                e.preventDefault(); // ป้องกันการนำทาง
              }
            }}
            className={`status text-primary ${order.action === "finished" || order.status === "cancel" ? "disabledorder disabled" : ""}`}
          >
            ดูรายการ
            <FontAwesomeIcon
              icon={faAngleRight}
              className={`icon mx-0 px-0 mx-md-0 px-md-0 d-none d-sm-inline ${order.action === "finished" || order.status === "cancel" ? "disabledorder disabled" : ""}`}

            />
          </Link>
        );
      case 'cancel':
        return null;
      default:
        return null;
    }
  };

  let zooImg;
  let zooname;
  if (order.zoo_id !== null) {
    const foundZoo = imgzoos.find((item) => item.id === order.zoo_id);
    zooImg = foundZoo ? foundZoo.img : null;
    zooname = foundZoo ? foundZoo.name : null;
  } else {
    zooImg = 'https://placeholder.com/150';
    zooname = 'องค์การสวนสัตว์แห่งประเทศไทย';
  }

  switch (order.action) {
    case null:
      statusText = "ยังไม่มีการทำรายการ";
      statusColor = "MediumSeaGreen"; // สีเขียว
      break;
    case "active":
      statusText = "รายการแสกนเข้าใช้งาน";
      statusColor = "Orange"; // สีเหลือง
      break;
    case "finished":
      statusText = "รายการใช้งานแล้ว";
      statusColor = "red"; // สีแดง
      break;
    default:
      statusText = "สถานะไม่ทราบ";
      statusColor = "black"; // สีดำสำหรับสถานะที่ไม่ทราบ
      break;
  }

  return (
    <div>
      <Link
        key={order.id}
        to="/ticketpostpone_v1"
        state={{ id: order.id, ticketstatus: order.action }}
        onClick={(e) => {
          if (order.action === "active" || order.status === "cancel") {
            e.preventDefault(); // ป้องกันการนำทาง
          }
        }}
        className={`status text-primary ${order.action === "finished" || order.status === "cancel" ? "disabledorder disabled" : ""}`} >
   

        <div className={`cardContent ${order.action === "finished" || order.status === "cancel" ? "disabledorder disabled" : ""}`}>
          <div className="row box-card  " style={{ borderRadius: 15 }}>
            <div className="col-9 col-sm-12 col-md-9 ">
              <div className="row  ">
                <img src={Zpotlogo} alt="Zpot Logo" style={{ width: '80px', height: '60px' }} />
                {/* <img src={Addpay} alt="Add Pay" style={{ width: '80px', height: '60px' }}/> */}
              </div>
              <h5>{zooname}</h5>
              <h5>รหัสอ้างอิง: {order.ref1}</h5>
              <h5 style={{ color: statusColor }}>สถานะบัตร: {statusText}</h5>
              <p className={order.action === "finished" || order.status === "cancel" ? "disabledText" : ""}>
                วันที่: {order.postpone === null ? formatDate(order.onDate) : formatDate(order.postpone)}
              </p>
              <p className={order.action === "finished" || order.status === "cancel" ? "disabledText" : ""}>
                ราคา: {order.amount} บาท
              </p>
            </div>
            <div className="col-3 col-sm-12 col-md-3">
              <div className="container" style={{ width: '80px', height: '80px' }}>
                <img style={{ width: '50px', height: '50px' }} src={zooImg} alt="Zoo" />
              </div>
            </div>
            <div className="col-12 mt-2 border-dark border-top py-2">
              <div className="d-flex justify-content-between">
                <span
                  className={` ${order.status === 'approved'
                    ? 'text-success'
                    : order.status === 'cancel'
                      ? 'text-danger'
                      : 'text-warning'
                    }${order.action === "finished" || order.status === "cancel" ? "disabledText" : ""}`}
                >
                  สถานะ:  {order.status === 'approved' ? 'ชำระเงินแล้ว'
                    : order.status === 'pending' ? 'รอชำระเงิน'
                      : 'ยกเยกรายการ'}
                </span>
                {getStatusLink(order.status)}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function OrderList_v1() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('approved'); // ค่าเริ่มต้นเป็น 'approved'
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); // จำนวนรายการที่ต้องการแสดงต่อหน้า
  const iduser = localStorage.getItem('userid_v1')
  const navigate = useNavigate();

  useEffect(() => {

    const fetchData = async () => {
      const formdata = new FormData();
      const myHeaders = new Headers();
      myHeaders.append("X-API-KEY", localStorage.getItem('apikey_v1'));
      formdata.append('user_id', `${iduser}`);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        headers: myHeaders,
        redirect: 'follow',
      };

      try {
        const response = await fetch(`${API_ENDPOINT}/api/v1/zoo/e-member/orderList`, requestOptions);

        if (response.status === 401) {
          // จัดการกรณี Unauthorized (401)
          setError('พบปัญหาระหว่างตรวจสอบผู้ใช้งาน  Connext เข้าใช้งานใหม่');

          Swal.fire({
            icon: 'error',
            title: 'Unauthorized',
            text: 'พบปัญหาระหว่างตรวจสอบผู้ใช้งาน กรุณาออกจากหน้าหนี้แล้วเข้าใช้งานใหม่',
            confirmButtonText: 'ตกลง'
          }).then(() => {
            navigate('/'); // เปลี่ยนเส้นทางไปยังหน้าโฮม
          });
          return;
        }

        const result = await response.json();


        const filteredResults = result.filter((item) => {
          const isDateMatch = selectedDate ? item.onDate === selectedDate : true;
          return item.status === filterStatus && isDateMatch;
        });
        setOrders(filteredResults);
      } catch (error) {
        setError('Failed to fetch data');
        console.error('Error:', error);
      }
    };
    // const fetchData = async () => {
    //   const formdata = new FormData();
    //   const myHeaders = new Headers();
    //   // myHeaders.append("X-API-KEY", localStorage.getItem('apikey'));
    //   formdata.append('user_id', `${iduser}`);

    //   const requestOptions = {
    //     method: 'POST',
    //     body: formdata,
    //     headers: myHeaders,
    //     redirect: 'follow',
    //   };

    //   try {
    //     const response = await fetch(`${API_ENDPOINT}/api/v1/zoo/e-member/orderList`, requestOptions);
    //     const result = await response.json();
    //     console.log(result)
    //     const filteredResults = result.filter((item) => {
    //       const isDateMatch = selectedDate ? item.onDate === selectedDate : true;
    //       return item.status === filterStatus && isDateMatch;
    //     });
    //     setOrders(filteredResults);

    //   } catch (error) {
    //     setError('Failed to fetch data');
    //     console.error('Error:', error);
    //   }
    // };

    fetchData();
  }, [filterStatus, selectedDate]);

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Custom clamp function
  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

  // Calculate the range of pages to display
  const pageRange = () => {
    const range = [];
    const start = clamp(currentPage - 4, 1, totalPages - 9);
    const end = clamp(start + 9, 5, totalPages);
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div>
      <section className="bg-section">
        <Navbar />


        {/* <!-- Page Header Start --> */}

        {/* <!-- Page Header End --> */}
        <div className="container">
          <div className="py-4 py-md-4 py-lg-5">
            <div className="toplist box-card py-2 py-md-4 py-lg-5 px-4">
              {error && <p>{error}</p>}

              {/* Status Filter */}
              <div className="mb-3">
                <label htmlFor="statusFilter" className="form-label">
                  เลือกสถานะ: (line Version.1 รายการคำสั่งซื้อของวันที่ 4-14 ตุลาคม 2567)
                </label>
                <select
                  id="statusFilter"
                  className="form-control"
                  value={filterStatus}
                  onChange={(e) => handleFilterStatus(e.target.value)}
                >
                  <option value="approved">ชำระเงินแล้ว</option>
                  <option value="cancel">รายการที่ยกเลิก</option>
                  <option value="pending">รอชำระเงิน</option>
                  {/* เพิ่มตัวเลือกสถานะอื่นๆ ได้ที่นี่ */}
                </select>
              </div>

              {/* Date Filter */}
              <div className="mb-3">
                <label htmlFor="dateFilter" className="form-label">
                  เลือกวันที่:
                </label>
                <input
                  type="date"
                  id="dateFilter"
                  className="form-control"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </div>

              {/* Tabs Content */}
              <div className="tab-content mt-3" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="st-panding"
                  role="tabpanel"
                  aria-labelledby="-tab"
                >
                  <div className="row">
                    {currentOrders.map((order) => (
                      <div key={order.id} className="col-12 col-sm-6 col-lg-4 mb-4">
                        <OrderItem order={order} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <nav aria-label="Page navigation">
                    <ul className="pagination">
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {pageRange().map((number) => (
                        <li key={number} className="page-item">
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(number)}
                            aria-current={number === currentPage ? 'page' : undefined}
                          >
                            {number}
                          </button>
                        </li>
                      ))}
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}

export default OrderList_v1;




