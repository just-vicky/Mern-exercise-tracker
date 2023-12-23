import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditUser = (props) => {
  const [username, setUsername] = useState('');
   const { id } = useParams();


   useEffect(() => {
    console.log("Fetching user with ID:", id);
    axios.get(`http://localhost:5000/users/${id}`)
      .then((res) => {
        setUsername(res.data.username);
      })
      .catch((error) => {
        console.error('Fetch User Error:', error);
      });
  }, [id]);

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };


  const onSubmit = (e) => {
    e.preventDefault();
    // const exerciseId = id;

    if (!id) {
      console.error('User ID is undefined.');
      return;
    }

    const user = {
      username: username,
    };

    console.log('Submitting User:', id);
    console.log('User Object:', user);

    axios.post(`http://localhost:5000/users/update/${id}`, user)
      .then((res) => {
        console.log('Update Response:', res.data);
        // Update local state with new values
        setUsername(res.data.username);
       
        // Optionally, you can add a notification or redirect
        // window.location = '/';
      })
      .catch((error) => {

        console.error('Update Error:', error);
        console.error('Update Error Response:', error.response); // Log the detailed error response
        // Optionally, handle error with a notification
      });

  };

  return (
    <div>
      <h3>Edit User Log</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Description: </label>
          <input
            type="text"
            required
            className="form-control"
            value={username}
            onChange={onChangeUsername}
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Edit User Log" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
};

export default EditUser;
