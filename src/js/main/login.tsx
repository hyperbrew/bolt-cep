
import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, useNavigate, Link} from 'react-router-dom';
import { supabase } from '../services/supabase';


const WM_Login: React.FC = () => {


    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    let navigate = useNavigate();


   useEffect(() => {
    if (localStorage.getItem("supabase.auth.token")!== null) {
      navigate("/home")
    }
     
   }, [navigate])
  

   


    function handleClick() {
        console.log(userEmail)
        // navigate('/home')
      
        
      }

    const login = async (userEmail: string, userPassword: string) => {
      try {
        const{error} = await supabase.auth.signIn({
          email: userEmail,
          password: userPassword
        })

        if (error) throw error
        if (localStorage.getItem("supabase.auth.token")!== null) {
          navigate("/home")
        }
      } catch (error) {
         alert(error)
      }
      
    }

    const Signup = async () => {
      try {
        const{error} = await supabase.auth.signUp({
          email: userEmail,
          password: userPassword
        })

        if (error) throw error
        alert('Account Created')
        if (localStorage.getItem("supabase.auth.token")!== null) {
          navigate("/home")
        }

      } catch (error) {
        alert(error)
        
      }
    }

    const logOut = async () =>{

      let { error } = await supabase.auth.signOut()
      navigate("/")

    }

    return(

      
   
    <div style={{backgroundColor:"var(--active)",  height:"100vh" ,display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
    }} >

    <input type={"email"} value={userEmail} onChange={(e)=>{setUserEmail(e.target.value), console.log(e.target.value)}}></input>
    <br/>
    <input type={"password"} value={userPassword} onChange={(e)=>{setUserPassword(e.target.value), console.log(e.target.value) }}></input>
    <br/>
    <button type="button" onClick={() => {login(userEmail, userPassword)}} style={{height:"39px", padding:"9px 30px", display:"flex", borderRadius:"3px" }}>
      Login
    </button>

    <button type="button" onClick={Signup} style={{height:"39px", padding:"9px 30px", display:"flex", borderRadius:"3px" }}>
      Signup
    </button>

    <button type="button" onClick={logOut} style={{height:"39px", padding:"9px 30px", display:"flex", borderRadius:"3px" }}>
      Logout
    </button>
      
    </div>




    );

};

export default WM_Login;