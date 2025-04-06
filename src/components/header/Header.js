import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';

import logo from '../../images/ninja-logo.svg';
import heart from '../../images/heart.svg';
import people from '../../images/people.svg';
import { useDispatch, useSelector } from 'react-redux';
import "./Header.css";
import {login, logout, selectUser } from '../../features/user/userSlice';
import Nav from '../nav/Nav';

function Header() {

    const userActive = useSelector(selectUser);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    let [user] = useAuthState(auth);

    const history = useNavigate();
    const dispatch = useDispatch();

    const signIn = () => {
        if(userActive) {
            dispatch(logout())
        } else {
            signInWithRedirect(auth, provider).catch((error) => 
            alert(error.message))
        } 
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((userAuth) => {
          if(userAuth) {
            dispatch(
                login({
                    uid: userAuth.uid,
                    email: userAuth.email
                }))
          } else {
            // Logged out
            dispatch(logout())
          }
        })
        return unsubscribe;
      }, [dispatch, auth])
    

    return (
        <header className="header container-fluid">
            <img onClick={() => history('/')} className="header__logo" src={logo} alt="logo"/>
            <Nav />
            <div className="header__right">
                <div className="header__favorites" onClick={() => history('/favorites')}>
                    <img src={heart} alt="heart"/>
                    <span>Favorites</span>
                </div>
                <div onClick={signIn} className="header__login">
                    <img src={people} alt="people"/>
                    { userActive ?  <span>{user.displayName}</span> : <span>Log in</span>}
                </div>
            </div>
        </header>
    )
}

export default Header
