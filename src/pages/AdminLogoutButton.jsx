import {BiLogOut} from 'react-icons/bi'
import useAdminLogout from '../hooks/useAdminLogout'

const AdminLogoutButton = () => {

  const {loading,Adminlogout}= useAdminLogout();

  return (
    <div className="mt-auto">
      {!loading?(
        <BiLogOut className="w-6 h-6 text-white cursor-pointer" onClick = {Adminlogout} />
      ) : (
        <span className='loading loading-spinner'></span>
      )}
    </div>
  )
}

export default AdminLogoutButton