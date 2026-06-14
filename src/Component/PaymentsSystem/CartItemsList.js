import React from 'react';
import { useTranslation } from 'react-i18next';

export function CartItemsList({ cart, updateQuantity, removeItem }) {
    const { t } = useTranslation();

    return (
        <div className="cart-list">
            {cart.map(item => (
                <div key={item.cartRowId} className="cart-card">

                    {/* INFO */}
                    <div className="cart-card-info">
                        <div className="cart-product-name">{item.name}</div>

                        {item.selectedType && (
                            <div className="cart-product-type">
                                {item.displayType}
                                {" / "}
                                {item.billing === "monthly"
                                    ? t("course.packages.monthly")
                                    : t("course.packages.full")}
                            </div>

                        )}

                        <div className="cart-unit-price">
                            {t("cart.table.unit_price")}: <strong>{item.price} ֏</strong>
                        </div>
                    </div>

                    {/* QUANTITY */}
                    <div className="cart-quantity">
                        <button
                            onClick={() =>
                                updateQuantity(
                                    item.id,
                                    item.selectedType,
                                    Math.max(item.quantity - 1, 1)
                                )
                            }
                        >
                            −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                            onClick={() =>
                                updateQuantity(
                                    item.id,
                                    item.selectedType,
                                    item.quantity + 1
                                )
                            }
                        >
                            +
                        </button>
                    </div>

                    {/* TOTAL */}
                    <div className="cart-total">
                        {(item.price * item.quantity).toFixed(2)} ֏
                    </div>

                    {/* REMOVE */}
                    <button
                        className="cart-remove"
                        onClick={() =>
                            removeItem(item.id, item.selectedType)
                        }
                        aria-label="Remove item"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}
