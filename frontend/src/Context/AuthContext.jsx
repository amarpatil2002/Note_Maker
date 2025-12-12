import { useState , createContext } from "react";

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {

    const [user , setUser] = useState(null)

    const login = (data) => {
        localStorage.getItem("accessToken" , data.accessToken)
        setUser(data.user)
    }

    const logout = () => {
        localStorage.removeItem("accessToken")
        setUser(null)
    }

    return(
        <AuthContext.Provider value={{user , login , logout}} >
            {children}
        </AuthContext.Provider>
    )

}