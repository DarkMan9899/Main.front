import React from 'react';

function CartItem({item, updateQuantity, removeItem}) {
    return (
        <div className="cart-item">
            <img src={item.image} loading="lazy" alt={item.name}/>
            <div>
                <h3>{item.name}</h3>
                <p>Type: {item.selectedType}</p>
                <p>Price per unit: ${item.price}</p>
                <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.selectedType, item.quantity - 1)}
                            disabled={item.quantity <= 1}>-
                    </button>
                    <input type="number" value={item.quantity}
                           onChange={(e) => updateQuantity(item.id, item.selectedType, Number(e.target.value))}/>
                    <button onClick={() => updateQuantity(item.id, item.selectedType, item.quantity + 1)}>+</button>
                </div>
                <p>Total Price: ${(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeItem(item.id, item.selectedType)}>Remove</button>
            </div>
        </div>
    );
}

export default CartItem;
