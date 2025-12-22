import { useContext } from "react"
import { AuthContext } from "../Context/AuthContext"

function Profile() {

  const user = useContext(AuthContext)

  console.log(user);

  return (
    <div>Profile</div>
  )
}

export default Profile