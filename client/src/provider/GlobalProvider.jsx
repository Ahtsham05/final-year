import { useState, createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCartStore } from "../store/cartSlice";
import Axios from "../utils/Axios";
import summery from "../common/summery";
import DiscountConverter from "../utils/DiscountConverter";
import { addAddress } from "../store/addressSlice";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const cartItem = useSelector(state => state?.cart?.cartItems)
  const [totalPrice,setTotalPrice] = useState(0)
  const [totalQty,setTotalQty] = useState(0)
  const [notDicountedPrice,setNotDiscountedPrice] = useState(0)

  const fetchCartItems = async () => {
    try {
      const response = await Axios({
        ...summery.getCartItems,
      });
      const { data: responseData } = response;
      if (responseData?.success) {
        dispatch(addToCartStore(responseData?.data));
      }
    } catch (error) {
      console.log("Error fetching cart items: ", error);
    }
  };

  const updateCartHandler = async (_id, quantity) => {
    try {
      const response = await Axios({
        ...summery.updateCartItem,
        data: {
          _id,
          quantity,
        },
      });
      const { data: responseData } = response;
      if (responseData?.success) {
        fetchCartItems();
        return responseData;
      }
    } catch (error) {
      return error;
    }
  };

  const deleteCartItem = async (_id) => {
    try {
      const response = await Axios({
        ...summery.deleteCartItem,
        data: {
          _id,
        },
      });
      const { data: responseData } = response;
      if (responseData?.success) {
        fetchCartItems();
        return responseData;
      }
    } catch (error) {
      return error;
    }
  };

  const fetchAddress = async ()=>{
    try {
      const response = await Axios({
        ...summery.getAddress
      })
      const { data : responseData } = response
      if(responseData?.success){
        dispatch(addAddress(responseData?.data))
      }
    } catch (error) {
      console.log('Error fetching address: ',error)
    }
  }

  useEffect(() => {
    fetchCartItems();
    fetchAddress();
  }, []);

  useEffect(()=>{
    if(cartItem[0]){
      const qty = cartItem.reduce((prev,curr)=>{
        return prev + curr.quantity
      },0)
      setTotalQty(qty)

      const price = cartItem.reduce((prev,curr)=>{
        return prev + (curr?.productId?.price * curr?.quantity)
      },0)
      setTotalPrice(price)

      const noDisPrice = cartItem.reduce((prev,curr)=>{
        return prev + (DiscountConverter(curr?.productId?.price,curr?.productId?.discount) * curr?.quantity)
      },0)
      setNotDiscountedPrice(noDisPrice)
    }
  },[cartItem])

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItems,
        updateCartHandler,
        deleteCartItem,
        totalPrice,
        totalQty,
        notDicountedPrice,
        fetchAddress
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
