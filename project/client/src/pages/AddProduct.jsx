import ProductForm from "../components/ProductForm";

export default function AddProduct() {
  return (
    <div className="page-shell">
      <div className="page-container grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <section className="accent-panel px-8 py-10">
          <p className="section-kicker">Add Product</p>
          <h1 className="page-title">Create a polished listing from one dedicated workspace.</h1>
          <p className="page-subtitle">
            This route now uses the shared listing form so the experience stays visually consistent with the rest of the marketplace.
          </p>
        </section>

        <ProductForm mode="sell" />
      </div>
    </div>
  );
}
