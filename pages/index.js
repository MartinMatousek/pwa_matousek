import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from "react";

var W3CWebSocket = require('websocket').w3cwebsocket;
let allMessages = [];

var client = new W3CWebSocket('ws://localhost:5000/', 'echo-protocol');


export default function Home() {

    const [username, setUsername] = useState('');
    const [chatName, setChatName] = useState('');
    const [newChat, setNewChat] = useState('');
    const [usersForNewChat, setUsersForNewChat] = useState([]);
    const [chats, setChats] = useState([]);
    const [allUsers, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    if (allUsers.length == 0) {
        getAllUsers();
    }

    const submit = async (e) => {
        e.preventDefault();
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "user": username,
            "chat": chatName,
            "text": message
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch("https://pwamatousek-production.up.railway.app:7163/api/message/1", requestOptions);
        client.send(chatName);
        await getAllMessagesForChat(chatName);
    }

    async function getAllMessagesForChat(chat) {
        let responseMessages = await fetch("https://pwamatousek-production.up.railway.app:7163/api/messages/" + chat)
        let obj = await responseMessages.text();

        var objects = JSON.parse(obj);
        var res = [];
        for (let i = 0; i < objects.length; i++) {
            res.push(objects[i]);
        }
        setMessages(res);
        setMessage('');
        delay(1).then(() => document.getElementById("scrollarea").scrollTo(0, document.getElementById("scrollarea").scrollHeight + 20));
    }

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    const submitNewChat = async (e) => {
        e.preventDefault();
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "users": usersForNewChat
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch("https://pwamatousek-production.up.railway.app:7163/api/chat/" + newChat, requestOptions);

        setChatName(newChat);
        setNewChat('');
        getAllChatsForUser(username);
    }

    async function getAllUsers() {
        let response = await fetch("https://pwamatousek-production.up.railway.app:7163/api/users")
        let obj = await response.text();

        var objects = JSON.parse(obj);
        var res = [];
        for (let i = 0; i < objects.length; i++) {
            res.push(objects[i]);
        }
        setUsers(res);
    }

    async function getAllChatsForUser(userName) {
        let response = await fetch("https://pwamatousek-production.up.railway.app:7163/api/chats/" + userName)
        let obj = await response.text();

        var objects = JSON.parse(obj);
        var res = [];
        for (let i = 0; i < objects.length; i++) {
            res.push(objects[i]);
        }
        setChats(res);
        if (chatName != "chatName" && res.includes(chatName)) {
            await setChat(chatName);
        } else if (res.length > 0) {
            await setChat(res[0].name);
        } else {
            setChatName("No chat found for this user");
        }
    }

    function setUser(value) {
        setUsername(value);
        getAllChatsForUser(value);
    }

    function setUsersForChat(val) {
        var selected = [];
        for (var option of val) {
            if (option.selected) {
                selected.push(option.value);
            }
        }
        setUsersForNewChat(selected)
    }

    async function setChat(value) {
        await setChatName(value);
        await getAllMessagesForChat(value);
    }

    client.onmessage = async function (e) {
        let responseMessages = await fetch("https://pwamatousek-production.up.railway.app:7163/api/messages/" + e.data)
        let obj = await responseMessages.text();

        var objects = JSON.parse(obj);
        var res = [];
        for (let i = 0; i < objects.length; i++) {
            res.push(objects[i]);
        }
        setMessages(res);
        setMessage('');
        delay(1).then(() => document.getElementById("scrollarea").scrollTo(0, document.getElementById("scrollarea").scrollHeight));

    };

    return (
        <div>
            <Head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
                    integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
                    crossOrigin="anonymous" />
            </Head>
            <div className="d-flex flex-nowrap" style={{ "margin-left": "10px" }}>
                <div>
                    <div>
                        <select style={{ "margin-top": "30px", width: "250px" }} id="selectUser" onClick={e => setUser(e.target.value)}>
                            {allUsers.map(user => {
                                return (
                                    <option value={user.name}>{user.name}</option>
                                )
                            })}
                        </select>
                        <div style={{ "margin-top": "10px" }} className="text">Přihlášený uživatel: {username}</div>
                    </div>

                    <div>
                        <select style={{ "margin-top": "30px", width: "250px" }} id="selectChat"
                            onChange={e => setChat(e.target.value)}>
                            {chats.map(chat => {
                                return (
                                    <option value={chat.name}>{chat.name}</option>
                                )
                            })}
                        </select>
                        <div style={{ "margin-top": "10px" }} className="text">Current chat: {chatName}</div>
                        <form>
                            <input style={{ "margin-top": "30px", width: "250px" }} className="input"
                                placeholder="Chat name" value={newChat}
                                onChange={e => setNewChat(e.target.value)}
                            />
                        </form>
                        <select style={{ "margin-top": "10px", width: "250px" }} id="multiple" multiple
                            onChange={e => setUsersForChat(e.target)}>
                            {allUsers.map(user => {
                                return (
                                    <option value={user.name}>{user.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <button style={{ "margin-top": "10px", width: "250px" }} className="btn btn-primary btn-lg px-4 gap-3"
                        onClick={submitNewChat}>Add chat
                    </button>
                </div>
            </div>

            <div className="container">
                <div className="list-group list-group-flush border-bottom scrollarea" id="scrollarea"
                    style={{ height: "600px", "overflow-y": "scroll", "margin-top": "-300px" }}>
                    {messages.map(message => {
                        return (
                            <div className="list-group-item list-group-item-action py-3 lh-tight">
                                <div className="d-flex w-100 align-items-center justify-content-between">
                                    <strong className="mb-1">{message.user}</strong>
                                </div>
                                <div className="col-10 mb-1 small" style={{ "word-break": "break-all" }} >{message.text}</div>
                            </div>
                        )
                    })}
                </div>
                <form onSubmit={submit}>
                    <input className="form-control" placeholder="Write a message" value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                </form>
            </div>
        </div>

    )
}