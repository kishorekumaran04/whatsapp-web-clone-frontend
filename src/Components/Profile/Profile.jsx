import React, { useState } from 'react';
import { BsArrowLeft, BsCheck, BsPencil } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../../Redux/Auth/Action';

const Profile = ({ handleCloseOpenProfile }) => {

    const [flag, setFlag] = useState(false);
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);
    const [tempPicture, setTempPicture] = useState(null);
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();

    const handleFlag = () => {
        setFlag(true);
    }

    const handleCheckClick = () => {
        setFlag(false);
        const data = {
            id: auth.reqUser?.id,
            token: localStorage.getItem("token"),
            data: { fullName: userName },
        };
        dispatch(updateUser(data))
    }

    const handleChange = (e) => {
        setUserName(e.target.value);
        console.log(userName);
    }

    const uploadToCloudinary = (pics) => {

        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "whatsapp-clone");
        data.append("cloud_name", "dc8zcnlj6");
        fetch("https://api.cloudinary.com/v1_1/dc8zcnlj6/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("imgUrl", data);
                setTempPicture(data.url.toString());

                const dataa = {
                    id: auth.reqUser.id,
                    token: localStorage.getItem("token"),
                    data: { profilePicture: data.url.toString() },
                };
                // userUpdate(id, )
                dispatch(updateUser(dataa));
            });
    }

    const handleUpdateName = (e) => {
        const data = {
            id: auth.reqUser?.id,
            token: localStorage.getItem("token"),
            data: { fullName: userName },
        };
        if (e.key === "Enter") {
            dispatch(updateUser(data))
            setFlag(false);
        }
    }

    return (
        <div className='w-full h-full'>
            <div className='flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5'>
                <BsArrowLeft
                    className='cursor-pointer text-2xl font-bold'
                    onClick={handleCloseOpenProfile}
                />
                <p className='cursor-pointer font-semibold'>Profile</p>
            </div>

            {/* update profile pic section */}
            <div className='flex flex-col justify-center items-center my-12'>
                <label htmlFor='imgInput'>
                    <img
                        className='rounded-full w-[15vw] h-[15vw] cursor-pointer'
                        src={auth.reqUser?.profilePicture || tempPicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                        alt=''
                    />
                </label>
                <input onChange={(e) => uploadToCloudinary(e.target.files[0])} type='file' id='imgInput' className='hidden' />
            </div>

            {/* name section */}
            <div className='bg-white px-3'>
                <p className='py-3'>Your Name</p>

                {!flag && <div className='w-full flex justify-between items-center'>
                    <p className='py-3'>{auth?.reqUser.fullName || "Username"}</p>
                    <BsPencil onClick={handleFlag} className='cursor-pointer' />
                </div>}

                {flag && <div className='w-full flex justify-between items-center py-2'>
                    <input
                        className='w-[80%] outline-none border-b-2 border-blue-700 p-2'
                        type='text'
                        placeholder='Enter your name'
                        onChange={handleChange}
                        onKeyPress={handleUpdateName}
                    />
                    <BsCheck onClick={handleCheckClick} className='cursor-pointer text-2xl' />
                </div>}

            </div>

            <div className='px-3 my-5'>
                <p className='py-10'>This is not your username. This name will be visible to your Whatsapp contacts</p>
            </div>

        </div>
    );
}

export default Profile;