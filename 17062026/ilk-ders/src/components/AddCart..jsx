export default function AddCart({
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  setView,
}) {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main className="container">
      <div className="cart-layout">
        <h2 className="form-title">Sepetim</h2>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Sepetiniz boş.</p>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="cart-item-image"
                  />

                  <div className="cart-item-info">
                    <h3 className="cart-item-title">{item.title}</h3>

                    <span className="cart-item-price">
                      {item.price} TL
                    </span>

                    <div className="cart-quantity">
                      <button
                        className="quantity-btn"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </button>

                      <span className="quantity-value">
                        {item.quantity}
                      </span>

                      <button
                        className="quantity-btn"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>

                    <span className="cart-item-total">
                      Ara Toplam: {item.price * item.quantity} TL
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3 className="cart-total">
                Toplam Tutar:{" "}
                {totalPrice.toLocaleString("tr-TR")} TL
              </h3>
            </div>
          </>
        )}

        <button
          className="form-submit"
          onClick={() => setView("home")}
        >
          Alışverişe Devam Et
        </button>
      </div>
    </main>
  );
}