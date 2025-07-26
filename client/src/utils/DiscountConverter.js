const DiscountConverter = (price,discount)=>{
    return (Number(price)*Number(discount))/100 + price
}
export default DiscountConverter