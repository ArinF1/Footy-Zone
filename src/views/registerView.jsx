import "/src/styling/login.css";


export function RegisterView({onRegister}){
    function handleRegisterACB(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        onRegister(email, password);
        window.location.hash="#/login"
    }

    function backToLoginACB(){
        window.location.hash="#/login"
    }

    return(
        <div className="container-login">
            <div className="form-card-login">
                <h3>Register</h3>

                <form onSubmit={handleRegisterACB}>
                    <input className="login-input" type="email" name="email" placeholder="Email" required />
                    <input className="login-input" type="password" name="password" placeholder="Password" required />
                    <button className="login-button" type="submit">Register</button>
                    <button className="login-button" onClick={backToLoginACB}>Back to login</button>
                </form>
            </div>
        </div>

    )}