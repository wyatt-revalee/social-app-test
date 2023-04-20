import "./rightbar.css"
import CakeIcon from '@mui/icons-material/Cake';
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CircularProgress from '@mui/material/CircularProgress';

export default function Rightbar({user}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [friends, setFriends] = useState([])
    const {isFetching, user:currentUser, dispatch} = useContext(AuthContext)
    const [followed, setFollowed] = useState(currentUser.following.includes(user?.id))

    const descInfo = useRef()
    const cityInfo = useRef()
    const fromInfo = useRef()
    const relationshipInfo = useRef()

    let editSwitch = 0

    useEffect(()=>{
        setFollowed(currentUser.following.includes(user?.id))
    },[currentUser, user])

    useEffect(()=>{
        const getFriends = async ()=>{
            try{
                const friendList = await axios.get("/users/friends/"+user._id)
                setFriends(friendList.data)
            }catch(err){
                if(user)
                    console.log(err)
            }
        }
        getFriends()
    },[user])

    const handleClick = async () =>{
        try {
            if(followed){
                await axios.put("/users/"+user._id+"/unfollow", {userId:currentUser._id})
                dispatch({ type: "UNFOLLOW", payload: user._id })
            } else{
                await axios.put("/users/" + user._id + "/follow", { userId: currentUser._id })
                dispatch({ type: "FOLLOW",  payload: user._id})
            }
        } catch (err) {
            console.log(err)
        }
        setFollowed(!followed)
    }
    
    const handleProfileEdit = async () => {
        let editButton = document.getElementById("editProfButton")

        if(editSwitch === 0){
            editButton.innerHTML = "Cancel"
            editButton.style.backgroundColor = "red"
        }
        else {
            editButton.innerHTML = "Edit Info"
            editButton.style.backgroundColor = "#3568f5"
        }

       let info = document.getElementsByClassName("rightbarInfoValue")
       Array.from(info).forEach(infoVal => {
           if (editSwitch === 0)
           {
               infoVal.style.display = "none"
           }
           else
               infoVal.style.display = "inline"
       });

        let inputs = document.getElementsByClassName("editProfileInput")
        Array.from(inputs).forEach(input => {
            if (editSwitch === 0) {
                input.style.display = "inline"
            }
            else
                input.style.display = "none"
        });

        let editInfo = document.getElementsByClassName("editProfileInfo")
        Array.from(editInfo).forEach(info => {
            if (editSwitch === 0) {
                info.style.display = "inline"
            }
            else
                info.style.display = "none"
        });

        let saveButton = document.getElementById("saveProfEditButton")
        if (editSwitch === 0) {
            saveButton.style.display = "inline"
        }
        else
            saveButton.style.display = "none"

        editSwitch = editSwitch ? 0 : 1
       
    }

    const handleProfileSave = async () => {

        try {
            await axios.put("/users/" + user._id, {
                userId: currentUser._id,
                desc: descInfo.current.value,
                city: cityInfo.current.value,
                from: fromInfo.current.value,
                relationship: relationshipInfo.current.value,
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    const HomeRightBar = () => {
        return(
            <>
                <div className="birthdayContainer">
                    <CakeIcon className="birthdayImg" />
                    <span className="birthdayText">
                        <b>Pola Foster</b> and <b>3 other friends</b> have birthdays today.
                    </span>
                </div>
                <img src="assets/ad.png" alt="" className="rightbarAd" />
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="rightbarFriendList">
                </ul>
            </>
        )
    }

    const ProfileRightBar = () => {
        return (
            <>
            {user.username !== currentUser.username && (
                <button className="rightbarFollowButton" onClick={handleClick}>
                        {followed ? "Unfollow" : "Follow"}
                        {followed ? <RemoveIcon/> : <AddIcon/>}
                </button>
            )}
                <div className="profileInfoHeader">
                    {(user.username === currentUser.username) && <button className="editProfileButton" id="editProfButton" onClick={handleProfileEdit}>Edit Info</button>}
                    <h4 className="rightbarTitle" >User Information</h4>
                </div>
                <form onSubmit={handleProfileSave} className="editProfileForm">
                    <div className="rightbarInfo">
                        <div className="rightbarInfoItem">
                            <span className="rightbarInfoKey">City:</span>
                            <span className="rightbarInfoValue">{user.city}</span>
                            <input type="text" className="editProfileInput" defaultValue={user.city} ref={cityInfo}/>
                        </div>
                        <div className="rightbarInfoItem">
                            <span className="rightbarInfoKey">From:</span>
                            <span className="rightbarInfoValue">{user.from}</span>
                            <input type="text" className="editProfileInput" defaultValue={user.from} ref={fromInfo} />
                        </div>
                        <div className="rightbarInfoItem">
                            <span className="rightbarInfoKey">Relationship:</span>
                            <span className="rightbarInfoValue">{user.relationship}</span>
                            <input type="text" className="editProfileInput" defaultValue={user.relationship} ref={relationshipInfo} />
                        </div>
                        <div>
                            <span className="editProfileInfo">Description: </span>
                            <input type="text" placeholder="Description" className="editProfileInput" defaultValue={user.desc} ref={descInfo} />
                        </div>
                    </div>
                    <button id="saveProfEditButton" className="saveProfileEditButton" type="submit" disabled={isFetching}>{isFetching ? <CircularProgress size="40px" style={{ 'color': 'white', "marginTop": "4px" }} /> : "Save"}</button>
                </form>
                <h4 className="rightbarTitle" >User Friends</h4>
                <div className="rightbarFollowings">
                    {friends.map((friend=>(
                    <Link to={"/profile/"+friend.username} style={{textDecoration:"none"}}>
                        <div className="rightbarFollowing">
                            <img src={friend.profilePicture ? PF+friend.profilePicture : PF+"person/default.jpg"} alt="" className="rightbarFollowingImg" />
                            <span className="rightbarFollowingName">{friend.username}</span>
                        </div>
                    </Link>
                    )))}
                </div>
            </>
        )
    }
    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user ? <ProfileRightBar/> : <HomeRightBar/>}
            </div>
        </div>
    )
}