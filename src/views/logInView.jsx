export function LoginView({onLogin, onLogout, user, onAnonymousLogin, onEmailLogin}){
    function logInHandlerACB(){
        window.location.hash="#/search"
    }
    function goToRegisterACB() {
        window.location.hash="#/register"
    }

    function handleEmailLoginACB(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        onEmailLogin(email, password);
    }

    return(
        <div className="container-login">
            <div className="form-card-login">
                <h1>Welcome to FootyZone</h1>

                {user ?(
                    <div>
                        <p>Welcome, {user.displayName || user.email}!</p>
                        <button className="login-button" onClick={logInHandlerACB}>Go to homepage</button>
                        <button className="login-button" onClick={onLogout}>Logout</button>

                    </div>
                ): (
                    <div>
                        <div className="nav-buttons-login">
                            <button className="login-button" onClick={onLogin}>Login with Google</button>
                            <button className="login-button" onClick={onAnonymousLogin}>Login Anonymously</button>
                            <button className="login-button" onClick={goToRegisterACB}>Register</button>
                        </div>
                        <form onSubmit={handleEmailLoginACB}>
                            <h3>Login with Email</h3>
                            <input className="login-input" type="email" name="email" placeholder="Email" required />
                            <input className="login-input" type="password" name="password" placeholder="Password" required />
                            <button className="login-button" type="submit">Login</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}