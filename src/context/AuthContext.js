import {createContext, useReducer} from "react"
import AuthReducer from "./AuthReducer"

const INTITIAL_STATE = {
    // user: {
    //     "_id": "6433138452ff80778ffc1e87",
    //     username: "wyatt",
    //     email: "wyatt@gmail.com", 
    //     profilePicture: "1681957210282yusuke.jpg",
    //     coverPicture: "1681957224355PLUSULTRA.png",
    //     followers: ["64334f1317d9743cd95ea9d8"], 
    //     following: ["64334f1317d9743cd95ea9d8"], 
    // },
    user:null,
    isFetching:false,
    error:false
}

export const AuthContext = createContext(INTITIAL_STATE)

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer,INTITIAL_STATE)

    return(
        <AuthContext.Provider value={{
            user:state.user, 
            isFetching:state.isFetching, 
            error:state.error,
            dispatch
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}