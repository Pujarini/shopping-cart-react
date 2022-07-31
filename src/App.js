import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [products, setproducts] = useState([]);
  const [cartItems, setcartItems] = useState([])

  const getProducts = async ()=>{
    await axios.get('https://dummyjson.com/products').then( ({data})=> {
    // handle success
    setproducts(data.products)
  })
  .catch( (error) =>{
    // handle error
    console.log(error);
  });
  }

 useEffect(() => {
   getProducts();
 }, []);

 const isAdded = (id)=> cartItems.some((i)=>i.id===id) // change method checking if item already present or not

 const addToCart = ({id, title, thumbnail, price})=>{
   if(!isAdded(id)){
   setcartItems([...cartItems,{
     id,
     title,
     thumbnail,
     qty: 1,
     price
   }]);
  } else{
    let removeItem = cartItems.filter(item => item.id !== id);
    setcartItems(removeItem);
  }
 }

 const changeQty = (item)=>{
      let changed= cartItems.filter(prod => prod.id ===item.id? prod.qty=item.qty : prod.qty)
      setcartItems(changed)
 }

 const getTotalCartDetails = ()=>{
   let totalAmount, totalQty = 0;
   totalAmount  = cartItems.reduce((sum, current)=> {
     if(current.qty > 1){
       return sum + current.price * current.qty;
     } else {
    return sum + current.price;
     }
  }, 0);

  totalQty= cartItems.length;

   return {totalAmount, totalQty}
 }
 

  return (
    <div className="App">
      <div className={`product-list ${cartItems && cartItems.length>0 ? "width80" : ""} `}>
      {products.map((item,i)=>{
        return (
          <div className='container' key={i}>
            <img src={item.thumbnail} alt=''/>
            <div className='prod-details'>
              <span>{item.title}</span>
              <b>$ {item.price}</b>
            </div>
           <button className={`prod-button ${!isAdded(item.id) ? "add-btn":"remove-btn"}`} onClick={()=> addToCart(item)} >{isAdded(item.id)? "Remove to Cart":"Add to Cart"}</button>
          </div>
        )
      })}
      </div>
      { cartItems && cartItems.length > 0 && <div className='cart-list'>
        <div>
          <h3>Your Cart Items</h3>
          <div className='cart-details'>
          <span>{`Total Amount : $ ${getTotalCartDetails().totalAmount}`}</span>
          <span>{`Total Items: ${getTotalCartDetails().totalQty}`}</span>
          </div>
          
        </div>

        {cartItems.map(item=>{
          return (
            <div className='cart-item' key={item}>
              <img src={item.thumbnail} alt={item.title}/>
              <span>{item.title}</span>
              <div className='prod-details'>
                <div className='qty-counter'>
                  <button onClick={()=>changeQty({id:item.id,qty:item.qty-1})}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={()=>changeQty({id:item.id,qty:item.qty+1})}>+</button></div>
              <b>$ {item.price}</b>
            </div>
            </div>
          )

          
        })}
        </div>}
    </div>
  );
}

export default App;
