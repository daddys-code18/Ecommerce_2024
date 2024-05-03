import { useState } from "react"
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { User } from "../types/types"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import toast from "react-hot-toast"



interface PropsType{
    user:User |null
}

const Header = ({user}:PropsType) => {

    const [isOpen,SetIsOpen]=useState <boolean>(false);
    
    const logoutHandler=async()=>{
        try {
             await signOut(auth)
             toast.success("Sign out Successfully")
            SetIsOpen(false)

        } catch (error) {
            toast.error("Sign out Failed")
            
        }
    }

  return (
    <nav className="header">
        <Link onClick={()=>{SetIsOpen(false)}} to={"/"}  >Home</Link>
        <Link onClick={()=>{SetIsOpen(false)}} to={"/search"}> <FaSearch/></Link>
        <Link onClick={()=>{SetIsOpen(false)}} to={"/cart"}> <FaShoppingBag/></Link>
        {
            user?._id?(
                <>
                <button onClick={()=>{SetIsOpen((prev)=>!prev)}}>
                    <FaUser/></button>
                    <dialog open={isOpen}>
                        <div>
                            {user.role ==="admin" &&(
                                <Link onClick={()=>{SetIsOpen(false)}} to="/admin/dashboard">Admin</Link>
                                )}
                                <Link onClick={()=>{SetIsOpen(false)}} to="/orders">Orders </Link>
                                <button onClick={logoutHandler}>
                                    <FaSignOutAlt/>
                                </button>
                        </div>
                    </dialog>
                    </>
        ):
        <Link to={"/login"}> <FaSignInAlt/></Link>

        }
    </nav>
  )
}

export default Header
