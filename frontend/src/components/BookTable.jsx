import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const BookTable = () => {
  const [showCart, setShowCart] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [showAvailableTimes, setShowAvailableTimes] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalWithGST = 0, cart = [] } = location.state || {};
  const cartItems = Array.isArray(cart) ? cart : [];

  const times = [
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const handleFetchAvailableTimes = async () => {
    if (selectedOption && selectedDate) {
      try {
        const response = await axios.get('http://localhost:3001/api/orders/avail-time', {
          params: { tableId: selectedOption, selectedDate }
        });

        const bookedTimes = response.data.bookedTimes || [];
        const available = times.filter(time => !bookedTimes.includes(time));
        setAvailableTimes(available);
        setShowAvailableTimes(true);
      } catch (error) {
        toast.error('Failed to fetch available times.');
      }
    } else {
      toast.error('Please select a date and table.');
    }
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    let newTimes;

    if (selectedTimes.includes(value)) {
      newTimes = selectedTimes.filter(time => time !== value);
    } else {
      newTimes = [...selectedTimes, value];

      if (newTimes.length > 2) {
        toast.error('You can only select up to two time slots.');
        return;
      }

      if (newTimes.length === 2 && !areConsecutive(newTimes[0], newTimes[1])) {
        toast.error('Please select time slots that are exactly one hour apart.');
        return;
      }
    }

    setSelectedTimes(newTimes);
  };

  const areConsecutive = (time1, time2) => {
    const index1 = times.indexOf(time1);
    const index2 = times.indexOf(time2);
    return Math.abs(index1 - index2) === 1;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // Function to check if the selected time is at least 1 hour ahead of the current time
  const isAtLeastOneHourAhead = (selectedTime) => {
    const currentDate = new Date();
    const selectedDateTime = new Date(selectedDate);

    // Set the time based on the selected slot
    const [hours, minutes] = selectedTime.split(':');
    selectedDateTime.setHours(hours);
    selectedDateTime.setMinutes(minutes);

    // Check if the selected time is at least 1 hour ahead of the current time
    const oneHourLater = new Date(currentDate.getTime() + 60 * 60 * 1000);
    return selectedDateTime > oneHourLater;
  };

  // Function to check if the selected time is in the future (not in the past)
  const isInTheFuture = (selectedTime) => {
    const currentDate = new Date();
    const selectedDateTime = new Date(selectedDate);

    // Set the time based on the selected slot
    const [hours, minutes] = selectedTime.split(':');
    selectedDateTime.setHours(hours);
    selectedDateTime.setMinutes(minutes);

    return selectedDateTime > currentDate;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !email || !phone || !selectedDate || selectedTimes.length === 0) {
      toast.error('Please fill in all the fields and select up to two consecutive time slots.');
      return;
    }

    if (!validatePhone(phone)) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }

    if (selectedTimes.length === 1) {
      if (!isInTheFuture(selectedTimes[0])) {
        toast.error('The selected time should be in the future.');
        return;
      }

      if (!isAtLeastOneHourAhead(selectedTimes[0])) {
        toast.error('The selected time should be at least 1 hour ahead of the current time.');
        return;
      }
    } else if (selectedTimes.length === 2) {
      if (!areConsecutive(selectedTimes[0], selectedTimes[1])) {
        toast.error('Please select consecutive time slots.');
        return;
      }

      if (!isInTheFuture(selectedTimes[0])) {
        toast.error('The first selected time should be in the future.');
        return;
      }

      if (!isAtLeastOneHourAhead(selectedTimes[0])) {
        toast.error('The first selected time should be at least 1 hour ahead of the current time.');
        return;
      }
    }

    navigate('/payment', {
      state: {
        totalWithGST,
        cartItems,
        username,
        phone,
        selectedOption,
        selectedDate,
        selectedTimes,
        orderType: 'Table Booking'
      }
    });
  };

  const options = {
    tables: Array.from({ length: 15 }, (_, i) => ({ id: `Table ${i + 1}`, type: 'Table', seats: i < 5 ? 4 : i < 10 ? 6 : 8 })),
    diningHalls: [
      { id: 'Dining Hall 1', type: 'Dining Hall' },
      { id: 'Dining Hall 2', type: 'Dining Hall' }
    ],
    partyHall: [{ id: 'Party Hall', type: 'Party Hall' }]
  };

  return (
    <div className="bg1">
      <h2>Book a Table</h2>
      <div>Total Price with GST: ₹{totalWithGST}</div>

      <div className="selection-container">
        <h3>Select Your Option:</h3>

        <div className="table-options">
          <h4>Tables:</h4>
          {options.tables.map((option) => (
            <div key={option.id} className={`option-item ${selectedOption === option.id ? 'selected' : ''}`}>
              <span>{option.id} - {option.seats} seats</span>
              <button onClick={() => setSelectedOption(option.id)}>
                {selectedOption === option.id ? 'Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
        <hr />

        <div className="dining-hall-options">
          <h4>Dining Halls:</h4>
          {options.diningHalls.map((option) => (
            <div key={option.id} className={`option-item ${selectedOption === option.id ? 'selected' : ''}`}>
              <span>{option.id}</span>
              <button onClick={() => setSelectedOption(option.id)}>
                {selectedOption === option.id ? 'Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
        <hr />

        <div className="party-hall-option">
          <h4>Party Hall:</h4>
          {options.partyHall.map((option) => (
            <div key={option.id} className={`option-item ${selectedOption === option.id ? 'selected' : ''}`}>
              <span>{option.id}</span>
              <button onClick={() => setSelectedOption(option.id)}>
                {selectedOption === option.id ? 'Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="user-details">
        <h3>Enter Your Details:</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Phone:
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label>
          <label>
            Date:
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required />
          </label>
          <button type="button" onClick={handleFetchAvailableTimes}>Show Available Times</button>
          {showAvailableTimes && (
            <div className="time-slots">
              <h4>Select Time Slots:</h4>
              {availableTimes.length > 0 ? (
                availableTimes.map((time) => (
                  <label key={time}>
                    <input
                      type="checkbox"
                      value={time}
                      checked={selectedTimes.includes(time)}
                      onChange={handleTimeChange}
                    />
                    {time}
                  </label>
                ))
              ) : (
                <p>No available times for the selected date and table.</p>
              )}
            </div>
          )}
          <button type="submit">Submit</button>
        </form>
      </div>

      <button onClick={() => setShowCart(!showCart)}>
        {showCart ? 'Hide Cart' : 'Show Cart'}
      </button>
      {showCart && (
        <div className="cart-details">
          <h3>Cart Details:</h3>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.name} - {item.quantity} pcs - ₹{item.totalPrice}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default BookTable;


