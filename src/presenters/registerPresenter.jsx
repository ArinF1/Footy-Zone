import { observer } from "mobx-react-lite";
import { registerWithEmailAndPassword } from "../models/firebaseModel";
import { RegisterView } from "../views/registerView";

export const Register = observer(function Register({model}){
    return(
        <RegisterView
            onRegister={registerWithEmailAndPassword}
        />
    );
})