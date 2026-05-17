import { useState, useRef, useEffect } from 'react';
import menuIcon from '../assets/person-circle.svg';

export default function UserDropdown({ nombre, documento, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={dropdownRef}
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '72px',
                height: '72px',
                borderRadius: '9999px',
                padding: '0',
                backgroundColor: 'rgba(30, 41, 59, 0.96)',
                border: '1px solid rgba(148, 163, 184, 0.18)',
            }}
        >
            <div
                onClick={toggleDropdown}
                style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    borderRadius: 'inherit',
                }}
            >
                <img src={menuIcon} alt="Menu" width={44} height={44} style={{ display: 'block' }} />
            </div>
            {isOpen && (
                <ul
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        transformOrigin: 'top right',
                        marginTop: '8px',
                        backgroundColor: '#0f172a',
                        boxShadow: '0 20px 40px rgba(2, 6, 23, 0.35)',
                        listStyle: 'none',
                        padding: '10px',
                        margin: 0,
                        zIndex: 1000,
                        width: '200px',
                        color: '#e2e8f0',
                        borderRadius: '12px',
                        border: '1px solid rgba(148, 163, 184, 0.16)',
                    }}
                >
                    <li><span style={{fontWeight:"bold"}}>Nombre:</span><p>{nombre}</p></li>
                    <li><span style={{fontWeight:"bold"}}>Documento:</span><p>{documento}</p></li>
                    <br></br>
                    <li><button onClick={onLogout} style={{backgroundColor: '#7c3aed', color: '#ffffff', border: 'none'}}>Cerrar Sesión</button></li>
                </ul>
            )}
        </div>
    );
}