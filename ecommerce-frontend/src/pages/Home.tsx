import { Link } from "react-router-dom"
import ProductCard from "../components/product-card"
import { useLatestProductsQuery } from "../redux/api/productAPI"
import toast from "react-hot-toast";
import  { Skeleton } from "../components/loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Home = () => {
  const {data,isLoading,isError}=useLatestProductsQuery("");
      const dispatch=useDispatch()

    const addTocartHandler=(cartItem:CartItem)=>{
    if(cartItem.stock  < 1)return toast.error("Out of Stock")
    dispatch(addToCart(cartItem))
     toast.success("Added to Cart")
    } 

  if(isError)toast.error("Cannot Fetch the Products")
  return (
    <div className="home">
      <section></section>
      <h1 className="heading">LATEST PRODUCTS
        <Link to="/search"className="findmore">More</Link>
      </h1>

      
      <main>
        {isLoading?(<Skeleton length={10} width="80vw"/>):(
          data?.products.map((i)=>(
        <ProductCard productId={i._id}  key={i._id}name={i.name} price={i.price} stock={i.stock} handler={addTocartHandler} photo=  {i.photo}/>

          ))
        )}
      </main>
    </div>
  )
}

export default Home
