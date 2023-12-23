import React,{Component} from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from 'react-router-dom';



const UserList = (props) => {
  const [users, setUsers] = useState([]);
   

  useEffect(()=> {
    axios.get("http://localhost:5000/users/")
    .then(res => setUsers(res.data))
    .catch(er => console.error(er))
  }, [])

  const handleDelete = (userId) => {
    // Send a delete request to your Express backend
    axios.delete(`http://localhost:5000/users/${userId}`)
      .then(response => {
        // If deletion is successful, update the users state
        setUsers(users.filter(user => user._id !== userId));
      })
      .catch(error => console.error('Error deleting user:', error));
  };


    return(
      <div>
        <h3>Logged Users</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {users.map((user, index) => (
            
            <tr key={user._id}>
              <td>{user.username}</td>
              <td><Link to={`/update/${user._id}`}>edit</Link>| <a href="#" onClick={()=>(handleDelete(user._id))}>Delete</a></td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      )
  }
  
  export default UserList;
