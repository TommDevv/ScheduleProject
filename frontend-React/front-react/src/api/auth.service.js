//Protocolo de autenticacion usando token JWT exendiendo del servicio http

import {request} from "./http"

export async function requestLogin(credentials){
    try{
        return await request('login/', {
            method: "POST",
            body: credentials
        });
    }catch (err){
        throw new Error(err.message);
    }
}

export function logout(){
    localStorage.removeItem("token");
}

export async function whoami(){
    return request('whoami/');
}