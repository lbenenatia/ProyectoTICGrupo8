import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import PersonalInfo from './components/PersonalInfo';
import AddressInfo from './components/AddressInfo';
import CardInfo from './components/CardInfo';
import Button from 'components/ui/Button';

const RegisterPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const [label, setLabel] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [number, setNumber] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phone, setPhone] = useState('');

    const [cardNumber, setCardNumber] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCVV, setCardCVV] = useState("");

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        const userData = {
            name,
            surname,
            email,
            birthDate,
            passwordHash: password,
            isActive: true,
            address: {
                label,
                address1,
                address2,
                number,
                city,
                state,
                zipCode,
                phone
            },
            card: {
                cardNumber: cardNumber.replace(/\s/g, ""),
                cardHolder,
                cardExpiry,
                cardCVV
            }
        };

        const response = await fetch("http://localhost:4028/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        if (response.ok) navigate('/login');
        else setError("Error al crear usuario");
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-5xl">

                <h1 className="text-2xl font-semibold mb-4 text-center">
                    Crear cuenta
                </h1>

                {error && <div className="text-red-600 mb-2">{error}</div>}

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded shadow grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    <div className="lg:col-span-3 lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna 1 */}
                        <div className="space-y-3">
                            <PersonalInfo
                                name={name} setName={setName}
                                surname={surname} setSurname={setSurname}
                                email={email} setEmail={setEmail}
                                birthDate={birthDate} setBirthDate={setBirthDate}
                                password={password} setPassword={setPassword}
                            />
                        </div>

                        {/* Columna 2 */}
                        <div className="space-y-3">
                            <AddressInfo
                                label={label} setLabel={setLabel}
                                address1={address1} setAddress1={setAddress1}
                                address2={address2} setAddress2={setAddress2}
                                number={number} setNumber={setNumber}
                                city={city} setCity={setCity}
                                state={state} setState={setState}
                                zipCode={zipCode} setZipCode={setZipCode}
                                Phone={phone} setPhone={setPhone}
                            />
                        </div>

                        {/* Columna 3 */}
                        <div className="space-y-3">
                            <CardInfo
                                cardNumber={cardNumber} setCardNumber={setCardNumber}
                                cardHolder={cardHolder} setCardHolder={setCardHolder}
                                cardExpiry={cardExpiry} setCardExpiry={setCardExpiry}
                                cardCVV={cardCVV} setCardCVV={setCardCVV}
                            />
                        </div>

                        <div className="col-span-full">
                            <Button
                                type="submit"
                                className="bg-primary text-white px-4 py-2 rounded w-full"
                            >
                                Crear cuenta
                            </Button>
                        </div>
                    </div>
                </form>

                <div className="text-sm text-center mt-4">
                    <Link to="/forgot-password" className="text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                    </Link>
                    <span className="mx-2 text-text-secondary">|</span>
                    <Link to="/login" className="text-primary hover:underline">
                    Iniciar Sesión
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default RegisterPage;
