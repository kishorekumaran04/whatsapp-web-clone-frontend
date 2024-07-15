import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { BsEmojiSmile, BsFilter, BsMicFill, BsThreeDotsVertical } from 'react-icons/bs';
import { TbCircleDashed } from 'react-icons/tb';
import ChatCard from './ChatCard/ChatCard';
import Profile from './Profile/Profile';
import MessageCard from './MessageCard/MessageCard';
import { ImAttachment } from 'react-icons/im';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import CreateGroup from './Group/CreateGroup';
import { useDispatch, useSelector } from 'react-redux';
import { currentUser, logoutAction, searchUser } from '../Redux/Auth/Action';
import { createChat, getUsersChat } from '../Redux/Chat/Action';
import { createMessage, getAllMessages } from '../Redux/Message/Action';


const HomePage = () => {

    const [queries, setQueries] = useState(null);
    const [currentChat, setCurrentChat] = useState(false);
    const [content, setContent] = useState('');
    const [isProfile, setIsProfile] = useState(false);
    const navigate = useNavigate();
    const [isGroup, setIsGroup] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const { auth, chat, message } = useSelector(store => store);
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    const open = Boolean(anchorEl);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSearch = (keyword) => {
        dispatch(searchUser({ keyword, token }))
    };

    const handleChatClick = (userId) => {
        // setCurrentChat(true);
        dispatch(createChat({ token, data: { userId } }));
        setQueries("")
    }

    const handleCreateNewMessage = () => {
        dispatch(createMessage({token, data:{chatId: currentChat.id, content: content}}))
        console.log("create new message");
    }

    useEffect(() => {
        dispatch(getUsersChat({ token }))
    }, [chat.createdChat, chat.createdGroup])

    useEffect(()=>{
        if(currentChat?.id)
            dispatch(getAllMessages({chatId: currentChat.id, token}))
    }, [currentChat, message.newMessage])

    const handleNavigate = () => {
        setIsProfile(true);
    }

    const handleCloseOpenProfile = () => {
        setIsProfile(false);
    }

    const handleCreateGroup = () => {
        setIsGroup(true);
    }

    useEffect(() => {
        dispatch(currentUser(token))
    }, [token])

    const handleLogout = () => {
        dispatch(logoutAction())
        navigate("/signup")
    }

    useEffect(() => {
        if (!auth.reqUser) {
            navigate("/signup")
        }
    }, [auth.reqUser])

    const handleCurrentChat = (item) => {
        setCurrentChat(item);
    }

    console.log("current chat ", currentChat)


    return (
        <div className='relative'>
            <div className='py-14 bg-[#00a884] w-full'></div>
            <div className='flex bg-[#f0f2f5] h-[90vh] absolute left-[2vw] top-[5vh] w-[96vw]'>
                <div className='left w-[30%] bg-[#e8e9ec] h-full'>

                    {/* profile */}
                    {isProfile && <div className='w-full h-full'><Profile handleCloseOpenProfile={handleCloseOpenProfile} /></div>}
                    {/* Create Group */}
                    {!isProfile && isGroup && <CreateGroup />}
                    {!isProfile && !isGroup && <div className='w-full'>

                        {/* home */}
                        <div className='flex justify-between items-center p-3'>
                            <div onClick={handleNavigate} className='flex item-center space-x-3'>
                                <img className="rounded-full w-10 h-10 cursor-poimter" src={auth.reqUser?.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} alt='' />
                                <p>{auth.reqUser?.fullName}</p>
                            </div>
                            <div className='space-x-3 text-2xl flex'>
                                <TbCircleDashed className='cursor-pointer' onClick={() => navigate("/status")} />
                                <BiCommentDetail />
                                <div>
                                    <BsThreeDotsVertical id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                    />

                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                                        <MenuItem onClick={handleCreateGroup}>Create Group</MenuItem>
                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    </Menu>
                                </div>

                            </div>
                        </div>

                        <div className='relative flex justify-center items-center bg-white py-4 px-3'>
                            <input className='border-none outline-none bg-slate-200 rounded-md w-[93%] pl-9 py-2'
                                type='text'
                                placeholder='Search or Start New Chat'
                                onChange={(e) => {
                                    setQueries(e.target.value)
                                    handleSearch(e.target.value)
                                }}
                                value={queries}
                            />
                            <AiOutlineSearch className='left-5 top-7 absolute' />
                            <div>
                                <BsFilter className='ml-4 text-3xl' />
                            </div>
                        </div>

                        {/* all user */}
                        <div className='bg-white overflow-y-scroll h-[72vh] px-3'>
                            {queries && auth.searchUser?.map((item) => (
                                <div onClick={() => handleChatClick(item.id)}>
                                    <hr />
                                    <ChatCard 
                                        name={item.fullName} 
                                        userImg={item.profilePicture || 
                                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                        } 
                                    />
                                </div>
                            ))}

                            {chat.chats.length>0 && !queries && chat.chats?.map((item) => (
                                <div onClick={() => handleCurrentChat(item)}>
                                    <hr />
                                    {item.isGroup ? (
                                        <ChatCard 
                                            name={item.isGroup} 
                                            userImg={item.chatImage || 
                                                "https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_1280.png"
                                            } 
                                        />
                                    ) : (
                                        <ChatCard
                                            isChat={true}
                                            name={
                                                auth.reqUser.id !== item.users[0]?.id 
                                                    ? item.users[0].fullName
                                                    : item.users[1].fullName
                                            }
                                            userImg={
                                                auth.reqUser.id !== item.users[0]?.id
                                                    ? item.users[0].profilePicture || 
                                                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                                    : item.users[1].profilePicture ||
                                                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>

                {/* default whats up page */}
                {!currentChat &&
                    <div className='w-[70%] flex flex-col items-center justify-center h-full'>
                        <div className='max-w-[70%] text-center'>
                            <img src='https://static.whatsapp.net/rsrc.php/v3/y6/r/wa669aeJeom.png' alt='' />
                            <h1 className='text-4xl text-gray-600'>WhatsApp Web</h1>
                            <p className='my-9'>Send and Receive messages without keeping your phone online.</p>
                        </div>
                    </div>
                }

                {/* message part */}
                {
                    currentChat &&
                    <div className='w-[70%] relative bg-blue-200'>
                        <div className='header absolute top-0 w-full bg-[#f0f2f5]'>
                            <div className='flex justify-between'>
                                <div className='py-3 space-x-4 flex items-center px-3'>
                                    <img 
                                        className='w-10 h-10 rounded-full' 
                                        src={currentChat.isGroup ? (currentChat.chatImage || "https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_1280.png")
                                                : (auth.reqUser.id !== currentChat.users[0]?.id
                                                    ? currentChat.users[0].profilePicture || 
                                                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                                    : currentChat.users[0].profilePicture ||
                                                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
                                            } 
                                        alt='' 
                                    />
                                    <p>{currentChat.isGroup ? currentChat.chatName : (auth.reqUser?.id==currentChat.users[0].id?currentChat.users[1].fullName:currentChat.users[0].fullName)}</p>
                                </div>
                                <div className='py-3 flex space-x-4 items-center px-3'>
                                    <AiOutlineSearch />
                                    <BsThreeDotsVertical />
                                </div>
                            </div>
                        </div>

                        {/* message section */}
                        <div className='px-10 h-[85vh] overflow-y-scroll'>
                            <div className='space-y-1 flex flex-col justify-center mt-20 py-2'>
                                {message.messages.length>0 && message.messages?.map((item, i) => (
                                    <MessageCard 
                                        isReqUserMessage={item.user.id!==auth.reqUser.id} 
                                        content={item.content} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* footer part */}
                        <div className='footer bg-[#f0f2f5] absolute bottom-0 w-full py-3 text-2xl'>
                            <div className='flex justify-between items-center px-5 relative'>

                                <BsEmojiSmile className='cursor-pointer' />
                                <ImAttachment />

                                <input
                                    className='py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]'
                                    type='text'
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder='Type message'
                                    value={content}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCreateNewMessage();
                                            setContent("");
                                        }
                                    }}
                                />
                                <BsMicFill />
                            </div>
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}

export default HomePage;