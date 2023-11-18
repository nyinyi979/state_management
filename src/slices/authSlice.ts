/* eslint-disable */
import { createSlice , PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
    value: auth_state
}
type auth_state = {
    isLogin: boolean,
    username: string,
    uuid?: string
}
const init = {
    value:{
        isLogin: false,
        username: "",
        uuid: ""
    } as auth_state
} as InitialState


export const auth = createSlice({
    name: "auth",
    initialState : init,
    reducers:{ 
        LogOut: () =>{
            setTimeout(()=>{
                window.location.replace('/');
            })
            return init;
        },
        LogIn: (_state , action: PayloadAction<string>) =>{
            return {
                value:{
                    isLogin: true,
                    username: action.payload,
                    uuid: 'uuid_generator'
                }
            }
        }
    }
})

export const {LogOut , LogIn} = auth.actions
export default auth.reducer