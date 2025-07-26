const currencyConverter = (amount)=> {
    // Create a number formatter for Pakistani Rupees (PKR)
    const formatter = new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Format the amount as PKR currency
    return formatter.format(amount);
}
export {currencyConverter}