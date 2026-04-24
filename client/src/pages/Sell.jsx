import ProductForm from "../components/ProductForm";
import { fashionCategories } from "../data/fashionCategories";

export default function Sell() {
  return (
    <div className="page-shell retail-page-shell">
      <div className="page-container grid gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-start">
        <section className="space-y-10">
          <section className="inner-hero">
            <div className="inner-hero-copy">
              <span className="section-kicker">Sell on CircuTrade</span>
              <h1 className="inner-hero-title">
                Present men&apos;s and women&apos;s fashion with a more polished listing experience.
              </h1>
              <p className="inner-hero-text">
                Stronger imagery, clearer category placement, and a cleaner product story help your resale
                listings feel premium.
              </p>
            </div>
            <div className="inner-hero-media inner-hero-split">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
                alt="Menswear model"
                className="h-full w-full object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
                alt="Womenswear model"
                className="h-full w-full object-cover"
              />
            </div>
          </section>

          <section className="brand-strip-section">
            <div className="section-heading-row">
              <div>
                <span className="section-kicker">Collections</span>
                <h2 className="section-display-title">Choose the right category before you list</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {fashionCategories.map((category) => (
                <article key={category.slug} className="service-pillar-card">
                  <h3 className="service-pillar-title">{category.label}</h3>
                  <p className="service-pillar-copy">{category.description}</p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <ProductForm mode="sell" />
      </div>
    </div>
  );
}
