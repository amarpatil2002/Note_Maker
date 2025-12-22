import { use, useContext } from "react"
import { AuthContext } from "../Context/AuthContext"

function Profile() {

  const {user} = useContext(AuthContext)

  // console.log(user.name);

return (
  <div className="flex justify-center mt-9">
    <div className="max-w-sm w-full bg-blue-700 rounded-xl p-6 text-white shadow-lg">
      <h2 className="text-xl font-semibold mb-4 border-b border-blue-400 pb-2">
        User Details
      </h2>

      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium text-blue-200">Name:</span>{" "}
          <span>{user?.name || "N/A"}</span>
        </div>

        <div>
          <span className="font-medium text-blue-200">Email:</span>{" "}
          <span>{user?.email || "N/A"}</span>
        </div>
      </div>
    </div>
  </div>
);


}

export default Profile