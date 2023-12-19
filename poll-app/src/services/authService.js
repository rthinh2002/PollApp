import { login, logout } from "../slice/authSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default class AuthService {
    async signIn(username, password, dispatch) {
        try {
            await signInWithEmailAndPassword(auth, username, password);
            const currentUser = auth.currentUser;
            if (currentUser) {
                const user = {
                    username: currentUser.email,
                    uid: currentUser.uid,
                };
                dispatch(login(user));           
                return true;
            } else {
                dispatch(login(null));
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };
    
    async logOut(dispatch) {
        dispatch(logout());
        return true;
    };
}


