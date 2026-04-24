import ProductForm from "../components/ProductForm";
import { fashionCategories } from "../data/fashionCategories";

export default function Rent() {
  return (
    <div className="page-shell retail-page-shell">
      <div className="page-container grid gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-start">
        <section className="space-y-10">
          <section className="inner-hero">
            <div className="inner-hero-copy">
              <span className="section-kicker">Rent on CircuTrade</span>
              <h1 className="inner-hero-title">
                Create rental listings for men&apos;s and women&apos;s occasionwear with a premium catalogue feel.
              </h1>
              <p className="inner-hero-text">
                Daily pricing, clearer presentation, and better visual hierarchy make rental inventory easier to
                trust and discover.
              </p>
            </div>
            <div className="inner-hero-media inner-hero-split">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80"
                alt="Menswear occasion model"
                className="h-full w-full object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80"
                alt="Womenswear occasion model"
                className="h-full w-full object-cover"
              />
            </div>
          </section>

          <section className="brand-strip-section">
            <div className="section-heading-row">
              <div>
                <span className="section-kicker">Rental Categories</span>
                <h2 className="section-display-title">Build the right edit for every occasion</h2>
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

        <ProductForm mode="rent" />
      </div>
    </div>
  );
}
