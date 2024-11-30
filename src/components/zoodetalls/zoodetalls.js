import React, { useState } from 'react';
import './ZooList.css'; // ไฟล์ CSS สำหรับการจัดรูปแบบ
import kk from '../img/KK-zoo.png';
import cm from '../img/CM-zoo.png';
import kn from '../img/KN-zoo.png';
import nm from '../img/NM-zoo.png';
import sk from '../img/SK-zoo.png';
import ub from '../img/UB-zoo.png';

import Navbar from '../Navbar/Navbar';


import ubon001 from '../imzoopage/ubon01.png';
import ubon002 from '../imzoopage/ubon002.png';

import kk001 from '../imzoopage/kk001.png';
import kk002 from '../imzoopage/kk002.png';

import korat01 from '../imzoopage/korat01.jpg';
import korat02 from '../imzoopage/korat02.jpg';


import sk001 from '../imzoopage/sk01.jpg';
import sk002 from '../imzoopage/sk002.jpg';

import kn001 from '../imzoopage/kn001.jpg';
import kn002 from '../imzoopage/kn002.jpg';

import cm001 from '../imzoopage/cm001.jpg';
import cm002 from '../imzoopage/cm002.jpg';
// ข้อมูลสวนสัตว์
const zooPages = [ 
    {logo: kk, sheet: kk001, show_time: kk002, name: "สวนสัตว์เปิดเขาเขียว", url: "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fkkopenzoo&tabs=timeline&width=1000&height=800&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=404165548973233" },
    {logo: ub, sheet: ubon001, show_time: ubon002, name: "สวนสัตว์อุบลราชธานี", url: "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Feduubonzoo&tabs=timeline&width=1000&height=800&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=404165548973233" },
    {logo: cm, sheet: cm001, show_time: cm002, name: "สวนสัตว์เชียงใหม่", url: "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FFanpageChiangMaiZoo&tabs=timeline&width=1000&height=800&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=404165548973233" },
    {logo: nm, sheet: korat01, show_time: korat02, name: "สวนสัตว์นครราชสีมา", url: "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FNakhonratchasimaZoo&tabs=timeline&width=1000&height=800&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=404165548973233" },
    {logo: kn, sheet: kn001, show_time: kn002, name: "สวนสัตว์ขอนแก่น", url: "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FKhonkaenzoo&tabs=timeline&width=1000&height=800&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=404165548973233" },
    {logo: sk, sheet: sk001, show_time: sk002, name: "สวนสัตว์สงขลา", url: "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FSongkhlaZooPage&tabs=timeline&width=1000&height=800&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=404165548973233" }
];

const ZooList = () => {
    const [selectedZoo, setSelectedZoo] = useState(zooPages[0]); // เลือกสวนสัตว์แรกเป็นค่าเริ่มต้น

    return (
        <>
        <Navbar></Navbar>
        <div className="container">
            <div className="row">
                <div className="col-md-4">
                    <div className="list-group">
                        {zooPages.map(zoo => (
                            <button
                                key={zoo.name}
                                type="button"
                                className={`list-group-item list-group-item-action ${selectedZoo.name === zoo.name ? 'active' : ''}`}
                                onClick={() => setSelectedZoo(zoo)}
                            >
                                <img src={zoo.logo} alt={`${zoo.name} Logo`} className="img-thumbnail me-2" style={{ width: '50px', height: '50px' }} />
                                {zoo.name}
                            </button>
                        ))}
                    </div>
                  
                        {/* <iframe 
                            src={selectedZoo.url}
                    
                            style={{  width: '100%', height: '600px', border: 'none' }}
                            scrolling="no"
                            frameBorder="0"
                            allowFullScreen
                            title={`Facebook Page - ${selectedZoo.name}`}
                        ></iframe> */}
                   
                </div>
                <div className="col-md-8">
                    <div className='col-md-12'>
                    <img src={selectedZoo.sheet} alt="Sheet" className="img-fluid my-3" style={{ height: 'auto', width: 'auto' }} />
                   
                    </div>
                    <div className='col-md-12'>
                    <img src={selectedZoo.show_time} alt="Show Time" className="img-fluid my-3" style={{ height: 'auto', width: 'auto' }} />
                    </div>
              
              
              
                </div>
            </div>
        </div>

        </>
      
    );
};

export default ZooList;
