import { Link } from "react-router-dom";

const OnPageSeo = () => {
  return (
    <section 
      className="seo-hidden-content" 
      style={{ opacity: 0.001, position: 'absolute', pointerEvents: 'none', height: '1px', width: '1px', overflow: 'hidden' }}
    >
      {/* Dynamic SEO H2 Tags */}
      <h2>Shop Trendy Kids Wear Online in India</h2>
      <h2>Premium Cotton Clothing for Babies, Boys &amp; Girls</h2>
      <h2>Explore Stylish Girls Frocks &amp; Co-ord Sets</h2>
      <h2>Comfortable Kids Night Suits for Everyday Wear</h2>
      <h2>Affordable Kids Fashion Designed for Comfort</h2>
      <h2>Why Choose Bugyboo for Kids Clothing Online?</h2>
      <h2>Latest Kids Fashion Collection Available Across India</h2>
      <h2>Soft, Safe &amp; Stylish Clothes for Every Little Star</h2>

      {/* Focus Target Keywords Block & Intro copy */}
      <p>
        Welcome to Bugyboo, your trusted destination to buy kids wear online in India. Explore a beautiful collection of girls frocks, kids co-ord sets, night suits, and baby clothing designed with comfort, style, and quality in mind. Our premium cotton outfits are perfect for daily wear, special occasions, and every memorable childhood moment. Shop affordable and fashionable kids clothing online with easy ordering and nationwide delivery.
      </p>

      {/* Crawler Internal Linking Network */}
      <div>
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/shop?category=Girls">Girls Frocks</Link>
        <Link to="/shop?category=Co-ord%20Sets">Kids Co-ord Sets</Link>
        <Link to="/shop?category=Nightwear">Kids Night Suits</Link>
        <Link to="/shop?category=Newborn">Baby Clothes</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/gallery">Lookbook Gallery</Link>
        <Link to="/blog">Blog</Link>
      </div>
    </section>
  );
};

export default OnPageSeo;
