import { useState ,useEffect} from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../components/cart-item"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { calculatePrice, cartReducer, discountApplied, removeCartItem } from './../redux/reducer/cartReducer';
import { CartReducerInitialState } from "../types/reducer-types";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import axios from "axios";
import { server } from "../redux/store";



 
 
const Cart = () => {

  const dispatch=useDispatch()

const {cartItems,subtotal,tax,total,shippingCharges,discount}=useSelector(
  (state:{cartReducer:CartReducerInitialState})=> state.cartReducer)

  const [coupanCode,SetCoupanCode]=useState<string>("");
  const [isValidcoupanCode,SetisvalidCoupanCode]=useState<boolean>(false);

  const incrementHandler=(cartItem:CartItem)=>{
    if(cartItem.quantity>=cartItem.stock) return
    dispatch(addToCart({...cartItem,quantity:cartItem.quantity+1}));
} 
  const decrementHandler=(cartItem:CartItem)=>{
    if(cartItem.quantity <=1) return

    dispatch(addToCart({...cartItem,quantity:cartItem.quantity-1}));
} 
  const removeHandler=( productId:string)=>{
    dispatch(removeCartItem(productId) )
} 


  useEffect(() => {
    const{ token:cancelToken,cancel}=axios.CancelToken.source()

  const timeOutId=setTimeout(()=>{
     axios.get(`${server}/api/v1/payment/discount?coupon=${coupanCode}`,{
      cancelToken
    }).then((res)=>{
      dispatch(discountApplied(res.data.discount))
      SetisvalidCoupanCode(true)
     dispatch(calculatePrice())

    }).catch((e)=>{
      dispatch(discountApplied(0))
       SetisvalidCoupanCode(false)
      dispatch(calculatePrice())

    })
 
  },1000);
    return () => {
      clearTimeout(timeOutId);
      cancel();
      SetisvalidCoupanCode(false);
    }
  }, [coupanCode])
  
  useEffect(() => {
    dispatch(calculatePrice())
  }, [cartItems])
  
  return (


<div className="cart">
  <main>
{
  cartItems.length > 0 ? (
  cartItems.map((i,index)=> (<CartItemCard incrementHandler={incrementHandler} decrementHandler={decrementHandler} removeHandler={removeHandler} key={index}  cartItem={i}/> ))): <h1>No Items Added</h1>

}</main>
  <aside>
    <p>SubTotal:₹{subtotal}</p>
    <p>Shipping Charges :₹{shippingCharges}</p>
    <p>Tax:₹{tax}</p>
    <p>Discount :<em className="red"> - ₹{discount}</em></p>
    <p>
      <b>Total :₹{total}</b>
    </p>
    <input type="text" name="" id=""  placeholder="CoupanCode" value={coupanCode} onChange={(e)=>SetCoupanCode(e.target.value)}/>
    {
       coupanCode && (
        isValidcoupanCode ? (<span className="green">
        ₹{discount} off using the <code>{coupanCode}</code></span>): (<span className="red">InValid Coupon <VscError/></span>)
       )
    }
    {
      cartItems.length>0 && <Link to="/shipping">Checkout</Link>
      
    }
  </aside>
</div>
    )
}

export default Cart