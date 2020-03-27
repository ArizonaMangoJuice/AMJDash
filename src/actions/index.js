import Axios from "axios"
import jwtDecode from 'jwt-decode'
import {saveToken} from '../localStorage/localStorage'

export const CHANGE_TITLE = 'CHANGE_TITLE'
export const CHANGE_BODY = 'CHANGE_BODY'

let REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL

// action creators 

export function changeTitle(title){
    return {
        type: CHANGE_TITLE,
        title
    }
}

export function changeBody(body){
    return {
        type: CHANGE_BODY,
        body
    }
}

export function submitPage(title, body, authToken) {
    let linkName = title;
    return (dispatch) => {
        Axios.post(`${REACT_APP_SERVER_URL}/api/page`, {
            title,
            body,
            linkName
        },{
            headers: { Authorization: `Bearer ${authToken}` }
        })
        .then(response => {
            console.log('response', response)
        })
        .catch(error => console.log(error))
    }
}

// **********************************************************
export const FETCH_PAGES = 'FETCH_PAGES'
export const ADD_PAGES = 'ADD_PAGES'

// thunk action for getting the pages in the front page

export function fetchPages(){
    return (dispatch) => {
        // dispatch()
        Axios.get(`${REACT_APP_SERVER_URL}/api/page`)
            .then(response => {
                dispatch(addPages(response.data))
                console.log(response.data)
                return
            })
            .catch(error => {
                console.log(error)
                return
            })
    }
}

export function addPages(pages){
    return {
        type: ADD_PAGES,
        pages
    }
}

// **********************************************************
export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
export const AUTH_ERROR = 'AUTH_ERROR'
export const CLEAR_AUTH = 'CLEAR_AUTH'

export function setAuthToken(token){
    return {
        type: SET_AUTH_TOKEN,
        token
    }
}

export function authSuccess(user){
    return {
        type: AUTH_SUCCESS,
        user
    }
}

export function authError(error){
    return {
        type: AUTH_ERROR,
        error
    }
}

export function clearAuth(){
    return {
        type: CLEAR_AUTH
    }
}

export const storeAuthInfo = (authToken, dispatch) => {
    const decodeToken = jwtDecode(authToken)
    dispatch(setAuthToken(authToken))
    dispatch(authSuccess(decodeToken.user))
    saveToken(authToken)
}

export const login = (username, password) => dispatch => {
    return (
        Axios.post(`${REACT_APP_SERVER_URL}/api/login`,{
            username: username,
            password: password
        })
        .then(response => {
            let authToken = response.data.authToken;
            console.log('this is the response',response);
            storeAuthInfo(authToken, dispatch)
            return
        })
        .catch(err => {
            // let {message} = err.error;
            // let message;
            //incorrect username or password on server side
            // if(message === 'Unauthorized'){
            //     message = 'Invalid username or password';
            // }else{
            //     message = 'Unable to login, please try again later';
            // }
            console.log('this is the erro',err)
            return 
        })
    )
}