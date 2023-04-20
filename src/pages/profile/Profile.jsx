import "./profile.css"
import Topbar from "../../components/topbar/Topbar"
import Leftbar from "../../components/leftbar/Leftbar"
import Feed from "../../components/feed/Feed"
import Rightbar from "../../components/rightbar/Rightbar"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [user, setUser] = useState({})
  const [profPicFile, setProfPicFile] = useState(null)
  const [coverPicFile, setCoverPicFile] = useState(null)
  const username = useParams().username
  const { user:currentUser } = useContext(AuthContext)

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`)
      setUser(res.data)
    }
    fetchUser()
  }, [username])

  const handleProfilePictureChange = (e) => {
    console.log("currentUser: ", currentUser, "user: ", user)
    setProfPicFile(e)
    let updateButton = document.getElementById("profileUpdater")
    updateButton.style.display = "inline"
  }

  const handleCoverPictureChange = (e) => {
    setCoverPicFile(e)
    let updateButton = document.getElementById("profileUpdater")
    updateButton.style.display = "inline"
  }

  const handleProfileUpdate = async () => {

    let profPic = user.profilePicture
    let coverPic = user.coverPicture
    if (profPicFile) {
      const profPicData = new FormData();
      const pictureName = Date.now() + profPicFile.name
      profPicData.append("name", pictureName)
      profPicData.append("file", profPicFile)
      profPic = pictureName
      try {
        await axios.post("/upload", profPicData)
      } catch (err) {
        console.log("Error uploading")
      }
    }

    if (coverPicFile) {
      const coverData = new FormData();
      const coverName = Date.now() + coverPicFile.name
      coverData.append("name", coverName)
      coverData.append("file", coverPicFile)
      coverPic = coverName
      try {
        await axios.post("/upload", coverData)
      } catch (err) {
        console.log("Error uploading")
      }
    }

    try {
      await axios.put("/users/" + user._id, {
        userId: user._id,
        profilePicture: profPic,
        coverPicture: coverPic
      })
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <>
      <Topbar />
      <div className="profile">
        <Leftbar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              {(user.username === currentUser.username) &&<label htmlFor="coverPicInput" className="shareOption">
                <img className="profileCoverImg" src={user.coverPicture ? PF+user.coverPicture : PF+"person/defaultcover.jpg"} alt="" />
                 <input style={{ display: "none" }} type="file" id="coverPicInput" accept=".png, .jpeg, .jpg" onChange={(e) => handleCoverPictureChange(e.target.files[0])} />
              </label>}
              {(user.username !== currentUser.username) && <img className="profileCoverImg" src={user.coverPicture ? PF+user.coverPicture : PF+"person/defaultcover.jpg"} alt="" />}
              {(user.username === currentUser.username) && <label htmlFor="profPicInput" className="shareOption">
                <img className="profileUserImg" src={user.profilePicture ? PF + user.profilePicture : PF + "person/default.jpg"} alt="" />
                <input style={{ display: "none" }} type="file" id="profPicInput" accept=".png, .jpeg, .jpg" onChange={(e) => handleProfilePictureChange(e.target.files[0])} />
              </label>}
              {(user.username !== currentUser.username) && <img className="profileUserImg" src={user.profilePicture ? PF + user.profilePicture : PF + "person/default.jpg"} alt="" />}
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName" >{user.username}</h4>
              <span className="profileInfoDesc" >{user.desc}</span>
              <button id="profileUpdater" className="profileUpdateButton" onClick={handleProfileUpdate}>Save Changes</button>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username}/>
            <Rightbar user={user}/>
          </div>
        </div>
      </div>

    </>
  )
}
