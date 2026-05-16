//Protocolo http para solicitudes al backend

import { enviroment } from '../enviroment';

const BASE_URL = enviroment.urlApi;

export async function request (path, {method='GET', body, headers}= {}){
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token? {Authorization: `Bearer ${token}`}: {}),
            ...headers,
        },
        body: body? JSON.stringify(body) : undefined,
    });

    if (!res.ok || !res) {
        let message = `HTTP ${res.status}`;
        try {
            const errorPayload = await res.json();
            message = errorPayload?.message ?? errorPayload?.error ?? errorPayload?.detail ?? message;

            if (message === `HTTP ${res.status}` && errorPayload && typeof errorPayload === 'object') {
                const firstValue = Object.values(errorPayload).flat?.()?.[0] ?? Object.values(errorPayload)[0];
                if (typeof firstValue === 'string') {
                    message = firstValue;
                }
            }
        } catch (e) {
            // Error generico de respuesta por si la lectura del mensaje falla
        }
        throw new Error(message);
    }

    if(res.status ===204) return null;

    return res.json();
}