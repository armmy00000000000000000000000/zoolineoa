// App.js
import React  from 'react';
import ReportGenerator from './PDFreport';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
function PDFViewer() {
    const location = useLocation();
    const { state } = location;
    const data = {
        value1: `${state.name}`, // ใช้ Template Literal สำหรับสร้างสตริง
        value2: `${state.id}`, // ใช้ Template Literal สำหรับสร้างสตริง
        value3: `${state.ticket}`, // ใช้ Template Literal สำหรับสร้างสตริง
      };
  return (
    <div className="App">
        <Navbar></Navbar>
      <h1 className=' mt-5'>PDF Report บัตรเข้าชมสวนสัตว์ Zoo e-Ticket</h1>
   <ReportGenerator  data={data}></ReportGenerator>
    </div>
  );
}

export default PDFViewer;
