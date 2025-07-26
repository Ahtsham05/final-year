const IsAdmin = (userRole) => {
    if(userRole === 'ADMIN') {
        return true;
    }
    return false;
}

export default IsAdmin