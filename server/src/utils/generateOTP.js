function generateOTP(length = 6) {
    let otp = '';
    for (let i = 0; i < length; i++) {
        const randomDigit = Math.floor(Math.random() * 10); // Random number between 0-9
        otp += randomDigit;
    }
    const expiresIn = Date.now() + 60 * 60 * 1000;
    return {otp,expiresIn};
}

export {generateOTP}
