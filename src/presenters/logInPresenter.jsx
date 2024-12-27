import { observer } from "mobx-react-lite";
import { LoginView } from "../views/logInView";
import { signInWithGoogle, handleSignOut, loginWithEmailAndPassword } from "../models/firebaseModel.js";;
import { anonymousSignIn } from "../models/firebaseModel.js";

export const Login = observer(function Login({model}){
    return(
        <LoginView
        user = {model.user}
        onLogin={signInWithGoogle}
        onLogout={handleSignOut}
        onAnonymousLogin={anonymousSignIn}
        onEmailLogin={loginWithEmailAndPassword}/>
    );
});