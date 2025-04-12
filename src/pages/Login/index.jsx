import React, { useEffect, useState } from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import apiUrl from '../../apiUrl';
import { setUser } from '../../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import toggleLoading from '../../redux/actions/loadingActions';
import data from "../../assets/AnganwadiCentreData.json"
import Header from '../../components/Header';

const Login = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [year, setYear] = useState("none");
  const [month, setMonth] = useState("none");
  const [gender, setGender] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCentre, setSelectedCentre] = useState("");

  const states = [...new Set(data.map((item) => item.state))];
  const districts = selectedState
    ? [...new Set(data.filter((item) => item.state === selectedState).map((item) => item.district))]
    : [];
  const centres = selectedDistrict
    ? [...new Set(data.filter((item) => item.district === selectedDistrict).map((item) => item.awcentre))]
    : [];
  const dispatch = useDispatch();

  const fullScreenMode = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // For Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // For Safari
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // For IE/Edge
      element.msRequestFullscreen();
    }
  }

  const submitUserDetails = async () => {
    // console.log();
    if (name === "" || year === "none" || month === "none" || gender === "" || selectedCentre === "") {
      toast("Fill all details to proceed", {
        type: "warning",
        autoClose: 2000,
        theme: "colored",
        hideProgressBar: true
      })
    }
    else {
      dispatch(toggleLoading(true))
      let userData = {
        name,
        age: Number(year) === 3 ? "3-4" : Number(year) === 4 ? "4-5" : Number(year) === 5 ? "5-6" : "",
        rollno: Number(month) >= 10 ? Number(year) + (Number(month) / 100) : Number(year) + (Number(month) / 10),
        gender,
        awcentre: selectedState + " - " + selectedDistrict + " - " + selectedCentre,
        startTime: Date.now()
      }
      await axios.post(apiUrl + "user", userData)
        .then(({ data }) => {
          if (data.message === "Success") {
            // console.log(data.user);
            dispatch(setUser(data.user));
            dispatch(toggleLoading(false));
            toast("Registered. Starting assessment", {
              type: "success",
              autoClose: 3000,
              theme: "colored",
              hideProgressBar: true
            })
            fullScreenMode();
            navigate('/start-assessment');
          }
          else {
            dispatch(toggleLoading(false));
            console.log("Error in submitting form");
            toast("Error in registering", {
              type: "error",
              autoClose: 3000,
              theme: "colored",
              hideProgressBar: true
            })
          }
        })
        .catch(({ message }) => {
          dispatch(toggleLoading(false));
          toast(message, {
            type: "error",
            autoClose: 3000,
            theme: "colored",
            hideProgressBar: true
          })
        })
    }
  }

  useEffect(() => {
    if (user?.name !== undefined) navigate("/start-assessment/")
  }, [user, navigate])

  return (
    <>
      <div className='form-container'>
        <Header page="login" />
        <div className="form-subcontainer">
          <div className="form-heading-container">
            <h1 className="form-heading">Let’s Get Started!</h1>
            <h3 className="form-subheading">Fill in your details to begin your fun assessment. 😊</h3>
          </div>
          <div className="form" id='userForm'>
            <div className='form-field-container'>
              <label className="form-field-label">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.currentTarget.value)} name="name" id="name" className="form-field" placeholder='Enter your full name' />
            </div>
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
              <div style={{ width: "47%" }} className='form-field-container'>
                <label className="form-field-label">Years</label>
                <select name="ageGroup" id="ageGroup" className='form-field' value={year} onChange={(e) => setYear(e.currentTarget.value)}>
                  <option value="none">Select years</option>
                  {
                    [3, 4, 5].map((age) => {
                      return <option key={age} value={age}>{age}</option>
                    })
                  }
                </select>
              </div>
              <div style={{ marginTop: 0, width: "47%" }} className='form-field-container'>
                <label className="form-field-label">Months</label>
                <select name="ageGroup" id="ageGroup" className='form-field' value={month} onChange={(e) => setMonth(e.currentTarget.value)}>
                  <option value="none">Select months</option>
                  {
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((age) => {
                      return <option key={age} value={age}>{age}</option>
                    })
                  }
                </select>
              </div>
            </div>
            <div className='form-field-container'>
              <label className="form-field-label">Gender</label>
              <select name="gender" id="gender" className='form-field' value={gender} onChange={(e) => setGender(e.currentTarget.value)}>
                <option value="none">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
              <div style={{ width: "47%" }} className='form-field-container'>
                <label className="form-field-label">State</label>
                <select name="ageGroup" id="ageGroup" className='form-field' value={selectedState} onChange={(e) => setSelectedState(e.currentTarget.value)}>
                  <option value="none">Select state</option>
                  {
                    states.map((age) => {
                      return <option key={age} value={age}>{age}</option>
                    })
                  }
                </select>
              </div>
              <div style={{ marginTop: 0, width: "47%" }} className='form-field-container'>
                <label className="form-field-label">District</label>
                <select name="ageGroup" id="ageGroup" className='form-field' value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.currentTarget.value)}>
                  <option value="none">Select district</option>
                  {
                    districts.map((age) => {
                      return <option key={age} value={age}>{age}</option>
                    })
                  }
                </select>
              </div>
            </div>
            <div className='form-field-container'>
              <label className="form-field-label">Anganwadi Centre</label>
              <select name="ageGroup" id="ageGroup" className='form-field' value={selectedCentre} onChange={(e) => setSelectedCentre(e.currentTarget.value)}>
                <option value="none">Select anganwadi centre</option>
                {
                  centres.map((age) => {
                    return <option key={age} value={age}>{age}</option>
                  })
                }
              </select>
            </div>
          </div>
          <div className="form-submit" onClick={submitUserDetails}>
            Start Assessment ➡
          </div>
        </div>
      </div>
    </>
  )
}

export default Login