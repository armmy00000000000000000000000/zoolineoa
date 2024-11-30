
import { useLocation } from 'react-router-dom';
import React from 'react';
import Credit from './credit';


function Payment() {
    const location = useLocation();
    const { state } = location;
    const data = {
        value1: `${state.total}`, // ใช้ Template Literal สำหรับสร้างสตริง
        value2: `${state.ref}`, // ใช้ Template Literal สำหรับสร้างสตริง
        value3: `${state.createdAt}`, // ใช้ Template Literal สำหรับสร้างสตริง
        value4: `${state.idOrder}`, // ใช้ Template Literal สำหรับสร้างสตริง
      };
     // State to trigger a re-render
    //  const [ setRefresh] = useState(0);

    //  useEffect(() => {
    //      // Set up an interval to refresh the state every 2 seconds
    //     //  const intervalId = setInterval(() => {
    //     //      setRefresh(prevRefresh => prevRefresh + 1);
    //     //  }, 2000);
 
    //      // Clear the interval when the component unmounts
    //      return () => clearInterval(intervalId);
    //  }, [setRefresh]);
  return (
    <div>
      
          <Credit data={data}></Credit>
      {/* <p>{state.ref2}</p>
      <p>{state.ref}</p>
      <p>{state.qrData}</p>
      <p>{state.total}</p>
      <p>{state.createdAt}</p> */}


    


    </div>
  )
}

export default Payment
