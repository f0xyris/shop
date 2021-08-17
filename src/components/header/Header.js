import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import auth, { provider } from '../../firebase';
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
    let [user] = useAuthState(auth);

    const history = useHistory();
    const dispatch = useDispatch();

    const signIn = () => {
        if(userActive) {
            dispatch(logout())
        } else {
            auth.signInWithRedirect(provider).catch((error) => 
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
      }, [dispatch])
    

    return (
        <header className="header container-fluid">
            <img onClick={() => history.push('/')} className="header__logo" src={logo} alt="logo"/>
            <Nav />
            <div className="header__right">
                <div className="header__favorites">
                    <img src={heart} alt="heart"/>
                    <span onClick={() => history.push('/favorites')}>Favorites</span>
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
