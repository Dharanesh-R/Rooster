// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../orderManagement.css'; // Use the same CSS file
// import rooster from '../assets/rooster.png'; // Adjust the path if needed

// function CompletedOrders() {
//   const [completedOrders, setCompletedOrders] = useState([]);
//   const [searchCode, setSearchCode] = useState('');
//   const [filteredOrders, setFilteredOrders] = useState([]);

//   useEffect(() => {
//     const fetchCompletedOrders = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/completedOrders');
//         if (Array.isArray(response.data)) {
//           setCompletedOrders(response.data);
//           setFilteredOrders(response.data);
//         } else {
//           console.error('Unexpected response data format:', response.data);
//           setCompletedOrders([]);
//           setFilteredOrders([]);
//         }
//       } catch (error) {
//         console.error('Error fetching completed orders:', error);
//         setCompletedOrders([]);
//         setFilteredOrders([]);
//       }
//     };

//     fetchCompletedOrders();
//   }, []);

//   const handleSearch = () => {
//     const filtered = completedOrders.filter((order) =>
//       order.orderCode.includes(searchCode)
//     );
//     setFilteredOrders(filtered);
//   };

//   return (
//     <div className='abg'>
//       <div className='order-management-container'>
//         <div className='place'>
//           <img src={rooster} width={100} height={100} alt='Rooster Logo' />
//           <h2 className='hea'>Completed Orders</h2>
//         </div>
//         <hr /><br />

//         <div className='searchbar'>
//           <div className='search-bar'>
//             <input
//               type='text'
//               className='ip'
//               value={searchCode}
//               onChange={(e) => setSearchCode(e.target.value)}
//               placeholder='Search by order code'
//             />
//             <button onClick={handleSearch} className='btns'>Search</button>
//           </div>
//         </div>

//         {filteredOrders.length > 0 && (
//           <div>
//             <table className='orders-table'>
//               <thead>
//                 <tr>
//                   <th>User Name</th>
//                   <th>Items</th>
//                   <th>Total Amount</th>
//                   <th>Order Code</th>
//                   <th>Order Type</th>
//                   <th>Address</th>
//                   <th>Phone</th>
//                   <th>Payment</th>
//                   <th>Order Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredOrders.map((order) => (
//                   <tr key={order._id}>
//                     <td>{order.username}</td>
//                     <td>
//                       {Array.isArray(order.orderedItems) && order.orderedItems.length > 0 ? (
//                         <ul>
//                           {order.orderedItems.map((item, index) => (
//                             <li key={index}>
//                               {item.title} - ₹{item.price} x {item.quantity}
//                             </li>
//                           ))}
//                         </ul>
//                       ) : (
//                         <p>No items</p>
//                       )}
//                     </td>
//                     <td>₹{order.totalPrice}</td>
//                     <td>{order.orderCode}</td>
//                     <td>{order.orderType}</td>
//                     <td>{order.address}</td>
//                     <td>{order.phone}</td>
//                     <td>{order.paymentStatus}</td>
//                     <td>{new Date(order.createdAt).toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {filteredOrders.length === 0 && <p>No orders found</p>}
//       </div>
//     </div>
//   );
// }

// export default CompletedOrders;





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../orderManagement.css'; // Use the same CSS file
import rooster from '../assets/rooster.png'; // Adjust the path if needed

function CompletedOrders() {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [searchCode, setSearchCode] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/completedOrders');
        if (Array.isArray(response.data)) {
          setCompletedOrders(response.data);
          setFilteredOrders(response.data);
        } else {
          console.error('Unexpected response data format:', response.data);
          setCompletedOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error('Error fetching completed orders:', error);
        setCompletedOrders([]);
        setFilteredOrders([]);
      }
    };

    fetchCompletedOrders();
  }, []);

  const handleSearch = () => {
    const filtered = completedOrders.filter((order) =>
      order.orderCode.includes(searchCode)
    );
    setFilteredOrders(filtered);
  };

  const takeawayOrders = filteredOrders.filter(order => order.orderType === 'Takeaway');
  const tableBookingOrders = filteredOrders.filter(order => order.orderType === 'Table Booking');
  const homeDeliveryOrders = filteredOrders.filter(order => order.orderType === 'Home Delivery');

  return (
    <div className='abg'>
      <div className='order-management-container'>
        <div className='place'>
          <img src={rooster} width={100} height={100} alt='Rooster Logo' />
          <h2 className='hea'>Completed Orders</h2>
        </div>
        <hr /><br />

        {/* Display counts */}
        <div className='counts'>
          <p>Total Completed Orders: {completedOrders.length}</p>
          <p>Takeaway Orders: {takeawayOrders.length}</p>
          <p>Table Booking Orders: {tableBookingOrders.length}</p>
          <p>Home Delivery Orders: {homeDeliveryOrders.length}</p>
        </div>

        {/* Search functionality */}
        <div className='searchbar'>
          <div className='search-bar'>
            <input
              type='text'
              className='ip'
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder='Search by order code'
            />
            <button onClick={handleSearch} className='btns'>Search</button>
          </div>
        </div>

        {/* Takeaway Orders Table */}
        {takeawayOrders.length > 0 && (
          <div>
            <h3>Takeaway Orders</h3>
            <table className='orders-table'>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Order Code</th>
                  <th>Order Type</th>
                  <th>Payment</th>
                  <th>Phone</th>
                  <th>Takeaway Time</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {takeawayOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.username}</td>
                    <td>
                      {Array.isArray(order.orderedItems) && order.orderedItems.length > 0 ? (
                        <ul>
                          {order.orderedItems.map((item, index) => (
                            <li key={index}>
                              {item.title} - ₹{item.price} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No items</p>
                      )}
                    </td>
                    <td>₹{order.totalPrice}</td>
                    <td>{order.orderCode}</td>
                    <td>{order.orderType}</td>
                    <td>{order.paymentStatus}</td>
                    <td>{order.phone}</td>
                    <td>{order.takeawayTime}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Booking Orders Table */}
        {tableBookingOrders.length > 0 && (
          <div>
            <h3>Table Booking Orders</h3>
            <table className='orders-table'>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Order Code</th>
                  <th>Order Type</th>
                  <th>Selected Option</th>
                  <th>Selected Date</th>
                  <th>Phone</th>
                  <th>Selected Time</th>
                  <th>Payment</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {tableBookingOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.username}</td>
                    <td>
                      {Array.isArray(order.orderedItems) && order.orderedItems.length > 0 ? (
                        <ul>
                          {order.orderedItems.map((item, index) => (
                            <li key={index}>
                              {item.title} - ₹{item.price} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No items</p>
                      )}
                    </td>
                    <td>₹{order.totalPrice}</td>
                    <td>{order.orderCode}</td>
                    <td>{order.orderType}</td>
                    <td>{order.selectedOption}</td>
                    <td>{new Date(order.selectedDate).toLocaleDateString()}</td>
                    <td>{order.phone}</td>
                    <td>{order.selectedTimes}</td>
                    <td>{order.paymentStatus}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Home Delivery Orders Table */}
        {homeDeliveryOrders.length > 0 && (
          <div>
            <h3>Home Delivery Orders</h3>
            <table className='orders-table'>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Order Code</th>
                  <th>Order Type</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Payment</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {homeDeliveryOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.username}</td>
                    <td>
                      {Array.isArray(order.orderedItems) && order.orderedItems.length > 0 ? (
                        <ul>
                          {order.orderedItems.map((item, index) => (
                            <li key={index}>
                              {item.title} - ₹{item.price} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No items</p>
                      )}
                    </td>
                    <td>₹{order.totalPrice}</td>
                    <td>{order.orderCode}</td>
                    <td>{order.orderType}</td>
                    <td>{order.address}</td>
                    <td>{order.phone}</td>
                    <td>{order.paymentStatus}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* If no orders */}
        {filteredOrders.length === 0 && <p>No orders found.</p>}
      </div>
    </div>
  );
}

export default CompletedOrders;