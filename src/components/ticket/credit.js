import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2
import { formatDate } from '../FormatDate/formatDate';
import { API_ENDPOINT } from '../auth/config';
const Credit = ({ data }) => {
  const [amount, setAmount] = useState(data.value1);
  const [orderRef, setOrderRef] = useState(data.value2);
  const [CreatedAt, setCreatedAt] = useState(data.value3);
  const [idOrder, setidOrder] = useState(data.value4);
  const [remark, setRemark] = useState('Zoo Ticket');
  const [securityKey, setSecurityKey] = useState('');
  const navigate = useNavigate();
  const merchantId = '900000960';
  const currCode = '764';
  const SecureHashKey = localStorage.getItem('credit');
  // const SecureHashKey = '7nRP3lULxw5BL3c94STU8tHBXsiy9Sw5';
  const payType = 'N';
  const lang = 'E';

  const hasher = () => {
    const securityKey = `${merchantId}|${orderRef}|${currCode}|${amount}|${payType}|${SecureHashKey}`;
    const hash = CryptoJS.SHA512(securityKey).toString(CryptoJS.enc.Hex);
    setSecurityKey(hash);
    // console.log(hash)
    // console.log(securityKey)
  };
  // useEffect เพื่ออัพเดตสถานะเมื่อ props เปลี่ยนแปลง
  useEffect(() => {
    setAmount(data.value1);
  }, [data.value1]);

  useEffect(() => {
    setCreatedAt(data.value3);
  }, [data.value3]);

  useEffect(() => {
    setidOrder(data.value4);
  }, [data.value4]);

  useEffect(() => {
    setOrderRef(data.value2);
  }, [data.value2]);
  useEffect(() => {
    hasher();
  });

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
  return (
    <div className="container mt-3">
      {/* <p>Value 1: {data.value1}</p>
      <p>Value 2: {data.value2}</p>
      <p>Value 3: {data.value3}</p>
      <p>Value 4: {data.value4}</p> */}
      <form
        name="payFormCcard"
        method="post"
        action="https://ktbfastpay.ktb.co.th/KTB/eng/payment/payForm.jsp"
      >

        <input
          type="hidden"
          id="merchantId"
          name="merchantId"
          className="form-control"
          value={merchantId}
          readOnly
        />


        <div className="mb-3 row">
          {/* <label htmlFor="amount" className="col-sm-3 col-form-label">Amount</label> */}
          <div className="col-sm-9">
            <input
              type="hidden"
              id="amount"
              name="amount"
              className="form-control"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                hasher();
              }}
            />
          </div>
        </div>

        <div className="mb-3 row">
          {/* <label htmlFor="orderRef" className="col-sm-3 col-form-label">Order Ref</label> */}
          <div className="col-sm-9">
            <input
              type="hidden"
              id="orderRef"
              name="orderRef"
              className="form-control"
              value={orderRef}
              onChange={(e) => {
                setOrderRef(e.target.value);
                hasher();
              }}
            />
          </div>
        </div>


        <input
          type="hidden"
          id="currCode"
          name="currCode"
          className="form-control"
          value={currCode}
          readOnly
        />


        <div className="mb-3 row">
          {/* <label htmlFor="remark" className="col-sm-3 col-form-label">Remark</label> */}
          <div className="col-sm-9">
            <input
              type="hidden"
              id="remark"
              name="remark"
              className="form-control"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>
        </div>

        <input
          type="hidden"
          id="SecureHashKey"
          name="SecureHashKey"
          className="form-control"
          value={SecureHashKey}
          readOnly
        />


        <input
          type="hidden"
          id="payType"
          name="payType"
          className="form-control"
          value={payType}
          readOnly
        />



        <input
          type="hidden"
          id="lang"
          name="lang"
          className="form-control"
          value={lang}
          readOnly
        />


        <input type="hidden" name="successUrl" value={`${API_ENDPOINT}/api/zoo/ktb/payment-success.php`} />
        <input type="hidden" name="failUrl" value={`${API_ENDPOINT}/api/zoo/ktb/payment-fail.php`} />
        <input type="hidden" name="cancelUrl" value={`${API_ENDPOINT}/api/zoo/ktb/payment-cancel.php`} />
        <input type="hidden" name="securityKey" id="securityKey" value={securityKey} />
        {/* <button type="submit" class="btn btn-success btn-block">ชำระเงิน</button> */}
        {/* <button type="submit" className="btn btn-primary">Submit</button> */}


        <div className="text-center card">
          <div className="row">
            <div className=" col-xs-10 col-sm-10 col-md-12 col-xs-offset-1 col-sm-offset-1 col-md-offset-3">
              <div className="row">
                <div className="col-xs-6 col-sm-6 col-md-12">
                  <address>
                    <strong>ID: {orderRef} </strong>
                    <br />
                    ZOO E-TICKET


                  </address>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-12 ">
                  <p>
                    <em>Date: {formatDate(CreatedAt)}</em>
                  </p>

                </div>
              </div>
              <div className="row">

                <table className="table table-hover text-center">
                  <thead>

                  </thead>
                  <tbody className='text-center'>
                    <tr>

                      <td className="col-md-12 text-center">ยอด {amount} บาท</td>
                      <td className="col-md-1 text-center"></td>

                    </tr>
                    <tr>

                      <td className="col-md-1 text-center">เลข orderref {orderRef}</td>
                      <td className="col-md-1 text-center"></td>

                    </tr>
                    <tr>

                      <td className="col-md-1 text-center">Order on website </td>
                      <td className="col-md-1 text-center"></td>

                    </tr>

                    {/* <tr>
           
                  <td> </td>
                  <td className="text-right">
                    <h4>
                      <strong>Total:</strong>
                    </h4>
                  </td>
                  <td className="text-center text-danger">
                    <h4>
                      <strong>${amount}</strong>
                    </h4>
                  </td>
                </tr> */}
                  </tbody>
                </table>

              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-success  btn-block mt-3">
            Pay Now <span className="glyphicon glyphicon-chevron-right"></span>
          </button>
          <button
            type="button"
            className="btn btn-danger  btn-block mt-2"
            onClick={() => handleCancel(idOrder)}
          >
            Cancel <span className="glyphicon glyphicon-remove"></span>
          </button>
        </div>

      </form>
    </div>
  );
}

export default Credit;
