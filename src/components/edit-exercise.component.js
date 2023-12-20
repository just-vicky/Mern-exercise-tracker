import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';

const EditExercise = (props) => {
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(0);
  const [date, setDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const userInput = useRef();


  const { id } = useParams();

  useEffect(() => {

    // console.log('Exercise ID:', id);



    const fetchExercise = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/exercises/${id}`);
        const data = response.data;
        // console.log(data);

        setUsername(data.username);
        setDescription(data.description);
        setDuration(data.duration);
        setDate(new Date(data.date));
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users/');
        const data = response.data;

        if (data.length > 0) {
          setUsers(data.map(user => user.username));
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchExercise();
    }

    fetchUsers();
  }, [id]);

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const onChangeDuration = (e) => {
    setDuration(e.target.value);
  };

  const onChangeDate = (date) => {
    console.log("onChangeDate: edit " + date)
    setDate(date);
  };

  const debug = (res) => {
    console.log("res: " + res)

  };

  const onSubmit = (e) => {
    e.preventDefault();
    // const exerciseId = id;

    if (!id) {
      console.error('Exercise ID is undefined.');
      return;
    }

    const exercise = {
      username: username,
      description: description,
      duration: duration,
      date: date,
    };

    console.log('Submitting Exercise:', exercise);

    axios.post(`http://localhost:5000/exercises/update/${id}`, exercise)
      .then((res) => {
        // console.log('Update Response:', res.data);
        // Update local state with new values
        debug(res.data.date);
        setUsername(res.data.username);
        setDescription(res.data.description);
        setDuration(res.data.duration);
        setDate(new Date(res.data.date));
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
      <h3>Edit Exercise Log</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username: </label>
          <select
            ref={userInput}
            required
            className="form-control"
            value={username}
            onChange={onChangeUsername}
          >
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Description: </label>
          <input
            type="text"
            required
            className="form-control"
            value={description}
            onChange={onChangeDescription}
          />
        </div>
        <div className="form-group">
          <label>Duration (in minutes): </label>
          <input
            type="text"
            className="form-control"
            value={duration}
            onChange={onChangeDuration}
          />
        </div>
        <div className="form-group">
          <label>Date: </label>
          <div>
            <DatePicker selected={date} onChange={onChangeDate} />
          </div>
        </div>

        <div className="form-group">
          <input type="submit" value="Edit Exercise Log" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
};

export default EditExercise;
