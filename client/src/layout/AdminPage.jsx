import React from 'react'
import { useSelector } from 'react-redux'
import IsAdmin from '../components/IsAdmin'

const AdminPage = ({children}) => {
    const user = useSelector(state => state.user)
    return (
        <>
            {
                IsAdmin(user.role) ? children : (<p className='bg-red-300 p-4'>No Resouces Available</p>)
            }
        </>
    )

}

export default AdminPage