import ProductCard from "./ProductCard";

export default function ProductGrid({products,addToCard}) {
  return (
    <>
      <div className="product-grid">
       {products.map((product)=>(
        <ProductCard key={product.id} product={product} addToCart={addToCard}/>
       ))}
      </div>
    </>
  );
}
