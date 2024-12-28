import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const App = () => {
  const [orderid, setOrderId] = useState('');
  const [pdname, setPdname] = useState('');
  const [quantity, setQuantity] = useState('');
  const [response, setResponse] = useState('');
  const [vieworder, setVieworder] = useState('');
  const [orderdetails, setOrderdetails] = useState(null);
  const [updateorder, setUpdateorder] = useState('');
  const [updatequant, setUpdatequant] = useState('');
  const [allorders, setAllorders] = useState([]);

  const submitorder = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/submit', {
        OrderId: orderid,
        Name: pdname,
        Quantity: quantity,
      });
      setResponse(res.data.message);
      setOrderId('');
      setPdname('');
      setQuantity('');
      getAllorders(); // Refresh orders list after submission
    } catch (error) {
      setResponse(error.message);
    }
  };

  const vieworders = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/api/order/${vieworder}`);
      setOrderdetails(res.data);
      setResponse('');
    } catch (error) {
      setOrderdetails(null);
      setResponse(error.message);
    }
  };

  const updateorders = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/api/update/${updateorder}`, {
        Quantity: updatequant,
      });
      setResponse(res.data.message);
      setUpdateorder('');
      setUpdatequant('');
      getAllorders(); // Refresh orders list after update
    } catch (error) {
      setResponse(error.message);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/order/${orderId}`);
      setResponse(res.data.message);
      getAllorders(); // Refresh orders list after deletion
    } catch (error) {
      setResponse(error.message);
    }
  };

  const getAllorders = async () => {
    try {
      const ord = await axios.get('http://localhost:5000/api/orders');
      setAllorders(ord.data);
    } catch (error) {
      setResponse(error.message);
    }
  };

  useEffect(() => {
    getAllorders();
  }, []);

  return (
    <Router>
      <nav>
        <Link to="/submit">Submit Order</Link>
        <Link to="/view">View Order</Link>
        <Link to="/update">Update Order</Link>
        <Link to="/orders">All Orders</Link>
      </nav>
      <Routes>
        <Route
          path="/submit"
          element={
            <div>
              <h3>Submit Order</h3>
              <form onSubmit={submitorder}>
                <input type="text" value={orderid} onChange={(e) => setOrderId(e.target.value)} required placeholder="Order ID"/>
                <input type="text" value={pdname} onChange={(e) => setPdname(e.target.value)} required placeholder="Product Name"/>
                <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} required placeholder="Quantity"/>
                <button type="submit">Submit</button>
              </form>
              {response && <p>{response}</p>}
            </div>
          }
        />

        <Route
          path="/view"
          element={
            <div>
              <h3>View Orders</h3>
              <form onSubmit={vieworders}>
                <input type="text" value={vieworder} onChange={(e) => setVieworder(e.target.value)} required placeholder="Order ID"/>
                <button type="submit">View Order</button>
              </form>
              {orderdetails && (
                <div>
                  <p>Order ID: {orderdetails.OrderId}</p>
                  <p>Order Name: {orderdetails.Name}</p>
                  <p>Order Quantity: {orderdetails.Quantity}</p>
                </div>
              )}
              {response && <p>{response}</p>}
            </div>
          }
        />

        <Route
          path="/update"
          element={
            <div>
              <h3>Update Order</h3>
              <form onSubmit={updateorders}>
                <input type="text" value={updateorder} onChange={(e) => setUpdateorder(e.target.value)} required placeholder="Order ID"/>
                <input type="text" value={updatequant} onChange={(e) => setUpdatequant(e.target.value)} required placeholder="New Quantity"/>
                <button type="submit">Update</button>
              </form>
              {response && <p>{response}</p>}
            </div>
          }
        />

        <Route
          path="/orders"
          element={
            <div>
              <h3>Order Details</h3>
              {allorders.length === 0 ? (
                <p>No orders available.</p>
              ) : (
                <ul>
                  {allorders.map((order) => (
                    <li key={order.OrderId}>
                      <strong>Order ID:</strong> {order.OrderId} | 
                      <strong> Name:</strong> {order.Name} | 
                      <strong> Quantity:</strong> {order.Quantity} 
                      <button onClick={() => deleteOrder(order.OrderId)}>Delete</button>
                    </li>
                  ))}
                </ul>
              )}
              {response && <p>{response}</p>}
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;


/*import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import './App.css';

const App = () => {
  const [response, setResponse] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [allOrders, setAllOrders] = useState([]);

  const { register, handleSubmit, reset } = useForm();

  // Submit Order function
  const submitOrder = async (data) => {
    try {
      const res = await axios.post('http://localhost:5000/api/submit', {
        OrderId: data.orderid,
        Name: data.pdname,
        Quantity: data.quantity,
      });
      setResponse(res.data.message || "Order submitted successfully");
      reset(); // Reset form fields after submission
    } catch (error) {
      setResponse(error.response?.data?.message || "Failed to submit order");
    }
  };

  // View Order function
  const viewOrder = async (data) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/order/${data.vieworder}`);
      setOrderDetails(res.data);
      setResponse('');
    } catch (error) {
      setOrderDetails(null);
      setResponse(error.response?.data?.message || "Order not found");
    }
  };

  // Update Order function
  const updateOrder = async (data) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/update/${data.updateorder}`, {
        Quantity: data.updatequant,
      });
      setResponse(res.data.message || "Order updated successfully");
      reset(); // Reset form fields after update
    } catch (error) {
      setResponse(error.response?.data?.message || "Failed to update order");
    }
  };

  // Get All Orders function
  const getAllOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/order');
      setAllOrders(res.data);
      setResponse('');
    } catch (error) {
      setResponse("Failed to fetch orders");
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <Router>
      <nav>
        <Link to="/submit">Submit Order</Link>
        <Link to="/view">View Order</Link>
        <Link to="/update">Update Order</Link>
        <Link to="/orders">All Orders</Link>
      </nav>
      <Routes>
        <Route
          path="/submit"
          element={
            <div>
              <h3>Submit Order</h3>
              <form onSubmit={handleSubmit(submitOrder)}>
                <input
                  {...register('orderid', { required: true })}
                  placeholder="Order ID"
                />
                <input
                  {...register('pdname', { required: true })}
                  placeholder="Product Name"
                />
                <input
                  type="number"
                  {...register('quantity', { required: true, min: 1 })}
                  placeholder="Quantity"
                />
                <button type="submit">Submit</button>
              </form>
              {response && <p>{response}</p>}
            </div>
          }
        />

        <Route
          path="/view"
          element={
            <div>
              <h3>View Order</h3>
              <form onSubmit={handleSubmit(viewOrder)}>
                <input
                  {...register('vieworder', { required: true })}
                  placeholder="Order ID"
                />
                <button type="submit">View Order</button>
              </form>
              {orderDetails ? (
                <div>
                  <p>Order ID: {orderDetails.OrderId}</p>
                  <p>Order Name: {orderDetails.Name}</p>
                  <p>Order Quantity: {orderDetails.Quantity}</p>
                </div>
              ) : response && <p>{response}</p>}
            </div>
          }
        />

        <Route
          path="/update"
          element={
            <div>
              <h3>Update Order</h3>
              <form onSubmit={handleSubmit(updateOrder)}>
                <input
                  {...register('updateorder', { required: true })}
                  placeholder="Order ID"
                />
                <input
                  type="number"
                  {...register('updatequant', { required: true, min: 1 })}
                  placeholder="New Quantity"
                />
                <button type="submit">Update</button>
              </form>
              {response && <p>{response}</p>}
            </div>
          }
        />

        <Route
          path="/orders"
          element={
            <div>
              <h3>All Orders</h3>
              {allOrders.length === 0 ? (
                <p>No orders available.</p>
              ) : (
                <ul>
                  {allOrders.map((order) => (
                    <li key={order.OrderId}>
                      <strong>Order ID:</strong> {order.OrderId} | 
                      <strong> Name:</strong> {order.Name} | 
                      <strong> Quantity:</strong> {order.Quantity}
                    </li>
                  ))}
                </ul>
              )}
              {response && <p>{response}</p>}
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
*/


/*import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const App = () => {
  const [orderid, setOrderid] = useState('');
  const [pdname, setPdname] = useState('');
  const [quantity, setQuantity] = useState('');
  const [viewid, setViewid] = useState('');
  const [vieworder, setVieworder] = useState(null);
  const [updateid, setUpdateid] = useState('');
  const [updatequant, setUpdatequant] = useState('');
  const [allorders, setAllorders] = useState([]);
  const [response, setResponse] = useState('');

  const onsubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/submit', {
        OrderID: orderid,
        Name: pdname,
        Quantity: quantity,
      });
      setResponse(res.data);
      setOrderid('');
      setPdname('');
      setQuantity('');
      getAll();
    } catch (error) {
      setResponse(error.message);
    }
  };

  const onview = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/api/order/${viewid}`);
      setVieworder(res.data);
      setViewid('');
    } catch (error) {
      setResponse(error.message);
    }
  };

  const onupdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/api/order/${updateid}`, {
        Quantity: updatequant,
      });
      setResponse(res.data.message);
      setUpdateid('');
      setUpdatequant('');
    } catch (error) {
      setResponse(error.message);
    }
  };

  const getAll = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setAllorders(res.data);
    } catch (error) {
      setResponse(error.message);
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  return (
    <Router>
      <nav>
        <Link to="/submit">Submit</Link>
        <span> | </span>
        <Link to="/view">View</Link>
        <span> | </span>
        <Link to="/update">Update</Link>
        <span> | </span>
        <Link to="/get">All Orders</Link>
      </nav>

      <Routes>
        <Route
          path="/submit"
          element={
            <div>
              <h3>Submitting...</h3>
              <form onSubmit={onsubmit}>
                <input type="text" value={orderid} onChange={(e) => setOrderid(e.target.value)} placeholder="Order ID" />
                <input type="text" value={pdname} onChange={(e) => setPdname(e.target.value)} placeholder="Product Name" />
                <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" />
                <button type="submit">Submit</button>
              </form>
              {response && <p>{response}</p>}
            </div>
          }
        />

        <Route
          path="/view"
          element={
            <div>
              <h3>Retrieving details...</h3>
              <form onSubmit={onview}>
                <input type="text" value={viewid} onChange={(e) => setViewid(e.target.value)} placeholder="Order ID to view" />
                <button type="submit">View</button>
              </form>
              {vieworder && (
                <div>
                  <p><strong>ID:</strong> {vieworder.OrderID}</p>
                  <p><strong>Name:</strong> {vieworder.Name}</p>
                  <p><strong>Quantity:</strong> {vieworder.Quantity}</p>
                </div>
              )}
            </div>
          }
        />

        <Route
          path="/update"
          element={
            <div>
              <h3>Updating details...</h3>
              <form onSubmit={onupdate}>
                <input type="text" value={updateid} onChange={(e) => setUpdateid(e.target.value)} placeholder="Order ID to update" />
                <input type="text" value={updatequant} onChange={(e) => setUpdatequant(e.target.value)} placeholder="New Quantity" />
                <button type="submit">Update</button>
              </form>
              {response && <p>{response}</p>}
            </div>
          }
        />

        <Route
          path="/get"
          element={
            <div>
              <h3>All Orders</h3>
              {allorders.length === 0 ? (
                <p>No orders available</p>
              ) : (
                <ul>
                  {allorders.map((order) => (
                    <li key={order.OrderID}>
                      <strong>ID:</strong> {order.OrderID} | <strong>Name:</strong> {order.Name} | <strong>Quantity:</strong> {order.Quantity}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;*/
