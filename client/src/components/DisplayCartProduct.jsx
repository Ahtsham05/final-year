import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { useGlobalContext } from "../provider/GlobalProvider";
import { currencyConverter } from "../utils/currencyConverter";
import AddToCartButton from "./AddToCartButton";
import { IoMdArrowDropright } from "react-icons/io";
import emptycart from "../assets/empty_cart.webp";
import { Link, useNavigate } from "react-router-dom";

const DisplayCartProduct = ({ close }) => {
  const cartItem = useSelector((state) => state.cart.cartItems);
  const { totalQty, totalPrice, notDicountedPrice } = useGlobalContext();
  const navigate = useNavigate()
  const redirectToCheckOut = ()=>{
    navigate("/checkout")
    if(close){
      close()
    }
  }

  return (
    <section className="lg:fixed top-0 bottom-0 left-0 right-0 bg-neutral-700 bg-opacity-60 z-[100]">
      <div className="bg-white s-full lg:max-w-md ml-auto p-4 h-full">
        <div className="justify-between shadow p-2 px-4 flex">
          <h1 className="font-semibold">Product cart</h1>
          <button className="hidden lg:block" onClick={close && close}>
            <IoMdClose size={25} />
          </button>
        </div>
        {cartItem[0] ? (
          <div className="py-4 flex flex-col gap-2">
            <div className="bg-green-100 p-2 flex justify-between items-center rounded">
              <p>You have save</p>
              <p>{currencyConverter(notDicountedPrice - totalPrice)}</p>
            </div>
            <div className="flex flex-col gap-2 min-h-[20vh] max-h-[45vh] lg:max-h-[45vh] lg:min-h-[45vh] overflow-hidden overflow-y-scroll p-2">
              {cartItem[0] &&
                cartItem.map((product) => (
                  <div key={product?._id + "addToCartDisplayPage"}>
                    <div className="flex gap-2 items-center justify-between">
                      <div className="flex gap-2 items-center">
                        <div className="h-16 min-w-16 max-w-16 bg-red-400">
                          <img
                            src={product?.productId?.image[0]}
                            alt={product?.productId?.name}
                            className="object-scale-down"
                          />
                        </div>
                        <div className="text-sm">
                          <p className="line-clamp-2">
                            {product?.productId?.name}
                          </p>
                          <p className="text-neutral-400">
                            {product?.productId?.unit}
                          </p>
                        </div>
                      </div>
                      <div>
                        <AddToCartButton product={product?.productId} />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold">Bill Details</p>
              <div className="text-sm px-2 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <h1>Items Totall</h1>
                  <h1 className="flex gap-2">
                    <span className="line-through text-neutral-400">
                      {currencyConverter(notDicountedPrice)}
                    </span>
                    <span>{currencyConverter(totalPrice)}</span>
                  </h1>
                </div>
                <div className="flex justify-between items-center">
                  <h1>Total Items</h1>
                  <h1>{totalQty} Items</h1>
                </div>
                <div className="flex justify-between items-center">
                  <h1>Delivery Charges</h1>
                  <h1>free</h1>
                </div>
              </div>
              <div className="font-semibold flex justify-between items-center">
                <h1>Grand Total</h1>
                <h1>{currencyConverter(totalPrice)}</h1>
              </div>
            </div>
            <div>
              <button onClick={redirectToCheckOut} className="flex justify-between items-center bg-green-700 hover:bg-green-800 w-full p-4 rounded text-white">
                <p>{currencyConverter(totalPrice)}</p>
                <p className="flex">
                  <span>Proceed</span>
                  <IoMdArrowDropright size={25} />
                </p>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center h-full my-2">
            <img
              src={emptycart}
              alt="empty cart"
              className="object-scale-down"
            />
            <p>Your cart is empty</p>
            <Link to={'/'} onClick={()=> close && close()} className="my-4 bg-green-700 hover:bg-green-800 p-2 rounded text-white px-4">Shop Now</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default DisplayCartProduct;
