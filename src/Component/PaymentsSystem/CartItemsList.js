import React from 'react';

export function CartItemsList({ cart, updateQuantity, removeItem }) {
    return (
        <div className="cart-table">
            <table>
                <thead>
                <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Remove</th>
                </tr>
                </thead>
                <tbody>
                {cart.map((item) => (
                    <tr key={`${item.id}-${item.selectedType}`} className="cart-item">
                        <td>
                            <img
                                src={item.image || '/assets/placeholder.png'}
                                alt={item.name}
                                className="cart-item-image"
                            />
                        </td>
                        <td>
                            <div className="product-info">
                                <div className="product-name">{item.name}</div>
                                {item.selectedType && (
                                    <div className="product-type">Type: {item.selectedType}</div>
                                )}
                            </div>
                        </td>
                        <td>{item.price} AMD</td>
                        <td>
                            <div className="quantity-controls">
                                <button
                                    onClick={() => updateQuantity(item.id, item.selectedType, Math.max(item.quantity - 1, 1))}
                                    aria-label="Decrease quantity"
                                    className="quantity-btn"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        if (!isNaN(value) && value >= 1) {
                                            updateQuantity(item.id, item.selectedType, value);
                                        } else {
                                            updateQuantity(item.id, item.selectedType, 1);
                                        }
                                    }}
                                    aria-label="Quantity"
                                    className="quantity-input"
                                />
                                <button
                                    onClick={() => updateQuantity(item.id, item.selectedType, item.quantity + 1)}
                                    aria-label="Increase quantity"
                                    className="quantity-btn"
                                >
                                    +
                                </button>
                            </div>
                        </td>
                        <td>{(item.price * item.quantity).toFixed(2)} AMD</td>
                        <td>
                            <button
                                onClick={() => removeItem(item.id, item.selectedType)}
                                className="remove-button"
                                aria-label="Remove item"
                            >
                                ×
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}