import { ArrowRight, BadgeCheck, Building2, ChevronRight, CircleDollarSign, Factory, Handshake, Mail, MapPin, MessageCircle, PackageCheck, Phone, Search, ShieldCheck, ShoppingCart, Star, Users, X } from 'lucide-react';

const currency = (value) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
  }).format(value);
};

const whatsappLink = (text) => `https://wa.me/27783665807?text=${encodeURIComponent(text)}`;

function App() {
  const [page, setPage] = useState('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('cornercartProducts');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [brands, setBrands] = useState(() => {
    const saved = localStorage.getItem('cornercartBrands');
    return saved ? JSON.parse(saved) : initialBrands;
  });
  const [enquiries, setEnquiries] = useState(() => {
    const saved = localStorage.getItem('cornercartEnquiries');
    return saved ? JSON.parse(saved) : [];
  });
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('cornercartApplications');
    return saved ? JSON.parse(saved) : [];
  });
  const [pricingMode, setPricingMode] = useState('unit');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notice, setNotice] = useState('');
  const [adminMode, setAdminMode] = useState(false);
  const [adminTab, setAdminTab] = useState('products');
  const [adminData, setAdminData] = useState({ username: '', password: '' });
  const [productForm, setProductForm] = useState({
    id: null,
    name: '',
    category: 'Snacks & Chips',
    size: '',
    unitPrice: '',
    bulkPrice: '',
    bulkQty: '',
    inStock: true,
    image: '',
  });
  const [brandForm, setBrandForm] = useState({ id: null, name: '', description: '', categories: '', logo: '' });

  useEffect(() => {
    localStorage.setItem('cornercartProducts', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cornercartBrands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('cornercartEnquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('cornercartApplications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    const timer = setTimeout(() => setNotice(''), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const searchText = `${product.name} ${product.category} ${product.size}`.toLowerCase();
      const matchesSearch = searchText.includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const handleContactSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      type: formData.get('type'),
      message: formData.get('message'),
      createdAt: new Date().toISOString(),
    };
    setEnquiries((prev) => [payload, ...prev]);
    setNotice('Your enquiry has been sent successfully.');
    event.currentTarget.reset();
  };

  const handleApplicationSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: formData.get('fullName'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      location: formData.get('location'),
      employmentStatus: formData.get('employmentStatus'),
      businessExperience: formData.get('businessExperience'),
      motivation: formData.get('motivation'),
      createdAt: new Date().toISOString(),
    };
    setApplications((prev) => [payload, ...prev]);
    setNotice('Application submitted successfully. The business administration team will review it.');
    event.currentTarget.reset();
  };

  const handleAdminLogin = (event) => {
    event.preventDefault();
    if (adminData.username === 'cornercart' && adminData.password === 'admin2026') {
      setAdminMode(true);
      setNotice('Admin access granted.');
      setAdminData({ username: '', password: '' });
    } else {
      setNotice('Invalid administrator credentials.');
    }
  };

  const handleProductSave = (event) => {
    event.preventDefault();
    const item = {
      id: productForm.id || Date.now(),
      name: productForm.name,
      category: productForm.category,
      size: productForm.size,
      unitPrice: Number(productForm.unitPrice),
      bulkPrice: Number(productForm.bulkPrice),
      bulkQty: Number(productForm.bulkQty),
      inStock: productForm.inStock,
      image: productForm.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
    };

    setProducts((prev) => {
      if (productForm.id) {
        return prev.map((product) => (product.id === productForm.id ? item : product));
      }
      return [item, ...prev];
    });

    setProductForm({
      id: null,
      name: '',
      category: 'Snacks & Chips',
      size: '',
      unitPrice: '',
      bulkPrice: '',
      bulkQty: '',
      inStock: true,
      image: '',
    });
    setNotice('Product saved successfully.');
  };

  const handleBrandSave = (event) => {
    event.preventDefault();
    const item = {
      id: brandForm.id || Date.now(),
      name: brandForm.name,
      description: brandForm.description,
      categories: brandForm.categories.split(',').map((value) => value.trim()).filter(Boolean),
      logo: brandForm.logo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    };

    setBrands((prev) => {
      if (brandForm.id) {
        return prev.map((brand) => (brand.id === brandForm.id ? item : brand));
      }
      return [item, ...prev];
    });

    setBrandForm({ id: null, name: '', description: '', categories: '', logo: '' });
    setNotice('Brand saved successfully.');
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    setNotice('Product removed.');
  };

  const handleDeleteBrand = (id) => {
    setBrands((prev) => prev.filter((brand) => brand.id !== id));
    setNotice('Brand removed.');
  };

  const renderHome = () => (
    <>
      <section className="relative overflow-hidden bg-mesh-dark">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-electricPurple/20 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-96 w-96 rounded-full bg-neonRed/15 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 xl:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center rounded-full border border-silver/25 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-silver">
                Trusted FMCG wholesale partner
              </div>
              <h1 className="max-w-xl text-5xl font-black uppercase leading-none text-white sm:text-6xl">
                WHOLESALE PRICES. <span className="text-neonRed">TRUSTED BRANDS.</span> BETTER BUSINESS.
              </h1>
              <p className="mt-6 max-w-lg text-lg text-silver/90">
                Your trusted partner for affordable FMCG wholesale products and community distribution opportunities.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={() => setPage('wholesale')} className="rounded-full bg-neonRed px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5">
                  VIEW WHOLESALE PRICE LIST
                </button>
                <button onClick={() => setPage('pep')} className="rounded-full border border-silver/40 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-electricPurple hover:text-electricPurple">
                  JOIN THE PEP PRENEUR PROGRAMME
                </button>
                <a href="tel:0766408808" className="rounded-full border border-silver/40 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:border-neonRed hover:text-neonRed">
                  CONTACT OUR TEAM
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[32px] border border-silver/20 bg-white/5 p-4 shadow-card backdrop-blur-xl">
                <div className="rounded-[24px] border border-red-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-4">
                  <div className="mb-4 flex items-center justify-between text-silver">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-electricPurple to-neonRed text-xl font-black text-white">C</div>
                      <div>
                        <div className="font-bold uppercase tracking-[0.18em] text-white">Cornercart</div>
                        <div className="text-xs text-silver/80">TRADERS</div>
                      </div>
                    </div>
                    <div className="rounded-full border border-silver/30 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-silver">
                      Retail Ready
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {products.slice(0, 4).map((product) => (
                      <div key={product.id} className="rounded-2xl border border-silver/10 bg-white/5 p-3 shadow-lg backdrop-blur-sm">
                        <div className="mb-3 h-20 overflow-hidden rounded-xl">
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover grayscale-[0.15]" />
                        </div>
                        <div className="text-xs uppercase tracking-[0.16em] text-electricPurple">{product.category}</div>
                        <p className="mt-2 text-sm font-semibold text-white">{product.name}</p>
                        <p className="mt-2 text-lg font-bold text-neonRed">{currency(product.unitPrice)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {featureCards.map((card) => (
            <div key={card.title} className="rounded-3xl border border-silver/10 bg-gradient-to-br from-white/8 to-white/3 p-8 shadow-card backdrop-blur-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-electricPurple/30 to-neonRed/30 text-neonRed">
                <PackageCheck size={20} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-[0.12em] text-white">{card.title}</h3>
              <p className="mt-4 text-silver/90">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-electricPurple">Trusted brands</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-white">Featured products & brands</h2>
          </div>
          <button onClick={() => setPage('wholesale')} className="hidden rounded-full border border-silver/30 px-5 py-2 text-sm font-medium text-silver transition hover:border-neonRed hover:text-white md:inline-flex">
            View wholesale range
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {['Simba', "Lay's", 'Doritos', 'Nik Naks', 'Bokomo', 'Weet-Bix', 'Futurelife', 'Fruittree', 'Liqui-Fruit'].map((brand, index) => (
            <div key={index} className="group rounded-3xl border border-silver/10 bg-white/5 p-4 shadow-card transition hover:-translate-y-1 hover:border-electricPurple/40">
              <div className="mb-4 h-24 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700">
                <img
                  src={brands.find((entry) => entry.name === brand)?.logo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'}
                  alt={brand}
                  className="h-full w-full object-cover opacity-80 grayscale-[0.1] transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="text-xl font-bold uppercase text-white">{brand}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-silver/10 bg-gradient-to-r from-[#0d1218] via-[#131922] to-[#0b0d12] p-8 shadow-card lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-electricPurple">Why choose us</p>
              <h2 className="mt-4 text-4xl font-black uppercase text-white">A trusted link between leading brands and local communities.</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-silver/10 bg-white/5 p-5">
                <ShieldCheck className="mb-3 text-neonRed" />
                <h3 className="font-bold uppercase text-white">Trusted brands</h3>
                <p className="mt-2 text-silver/80">High-demand FMCG products selected for household demand and repeat purchases.</p>
              </div>
              <div className="rounded-2xl border border-silver/10 bg-white/5 p-5">
                <Users className="mb-3 text-neonRed" />
                <h3 className="font-bold uppercase text-white">Community focus</h3>
                <p className="mt-2 text-silver/80">We support retailers, spaza shops, and local micro-distributors across communities.</p>
              </div>
              <div className="rounded-2xl border border-silver/10 bg-white/5 p-5">
                <CircleDollarSign className="mb-3 text-neonRed" />
                <h3 className="font-bold uppercase text-white">Competitive pricing</h3>
                <p className="mt-2 text-silver/80">Wholesale pricing designed for healthier margins and lower acquisition costs.</p>
              </div>
              <div className="rounded-2xl border border-silver/10 bg-white/5 p-5">
                <BadgeCheck className="mb-3 text-neonRed" />
                <h3 className="font-bold uppercase text-white">Reliable service</h3>
                <p className="mt-2 text-silver/80">Fast communication, delivery quotations, and partnership-minded support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-electricPurple">Pep Preneur Programme</p>
          <h2 className="mt-2 text-4xl font-black uppercase text-white">Build your own business. Grow your community.</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[28px] border border-silver/10 bg-white/5 p-8">
            <p className="text-silver/80">
              The Pep Preneur Programme helps entrepreneurs start and grow their own micro-distribution businesses by selling leading FMCG brands directly within their communities.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-silver/10 bg-slate-900/70 p-4">
                <Building2 className="text-neonRed" />
                <div className="mt-4 font-bold uppercase text-white">Business opportunity</div>
              </div>
              <div className="rounded-2xl border border-silver/10 bg-slate-900/70 p-4">
                <Factory className="text-neonRed" />
                <div className="mt-4 font-bold uppercase text-white">Training & support</div>
              </div>
            </div>
            <button onClick={() => setPage('pep')} className="mt-8 rounded-full bg-gradient-to-r from-electricPurple to-neonRed px-6 py-3 font-semibold text-white">
              LEARN MORE
            </button>
          </div>

          <div className="rounded-[28px] border border-silver/10 bg-gradient-to-br from-electricPurple/10 to-neonRed/10 p-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm uppercase tracking-[0.18em] text-silver">Programme structure</span>
            </div>
            <div className="space-y-4">
              {serviceSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-4 rounded-2xl border border-silver/10 bg-slate-950/50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neonRed font-bold text-white">{index + 1}</div>
                  <div className="text-silver">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-silver/10 bg-gradient-to-r from-slate-900 to-slate-950 p-8 shadow-card lg:p-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-electricPurple">Wholesale enquiry</p>
              <h2 className="mt-2 text-3xl font-black uppercase text-white">Need a trusted supply partner?</h2>
            </div>
            <button onClick={() => setPage('contact')} className="inline-flex items-center gap-2 rounded-full bg-neonRed px-6 py-3 font-semibold text-white">
              CONTACT OUR TEAM <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </>
  );

  const renderWholesale = () => (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-electricPurple">Wholesale price list</p>
          <h1 className="mt-2 text-4xl font-black uppercase text-white">Wholesale catalogue</h1>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex items-center rounded-full border border-silver/20 bg-white/5 px-4 py-2 text-silver">
            <Search size={16} className="mr-2" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products or brands"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-silver/60 md:w-72"
            />
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {productCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              selectedCategory === category
                ? 'border-neonRed bg-neonRed text-white'
                : 'border-silver/20 bg-white/5 text-silver hover:border-electricPurple hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mb-8 inline-flex rounded-full border border-silver/20 bg-white/5 p-1">
        <button
          onClick={() => setPricingMode('unit')}
          className={`rounded-full px-5 py-2 text-sm font-medium ${pricingMode === 'unit' ? 'bg-neonRed text-white' : 'text-silver'}`}
        >
          Unit Prices
        </button>
        <button
          onClick={() => setPricingMode('bulk')}
          className={`rounded-full px-5 py-2 text-sm font-medium ${pricingMode === 'bulk' ? 'bg-neonRed text-white' : 'text-silver'}`}
        >
          Bulk Prices
        </button>
      </div>

      <div className="mb-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-200">
        Prices include VAT. While stocks last. Delivery charges are calculated according to your location. Prices and availability are subject to change.
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <article key={product.id} className="overflow-hidden rounded-[28px] border border-silver/15 bg-white/5 shadow-card">
            <div className="relative h-56 overflow-hidden">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-silver">
                {product.category}
              </div>
              {!product.inStock && (
                <div className="absolute bottom-4 right-4 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white">Out of stock</div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-electricPurple">{product.size}</div>
                  <h3 className="mt-2 text-xl font-bold text-white">{product.name}</h3>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] ${product.inStock ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
                  {product.inStock ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className="mt-6 space-y-3 rounded-2xl border border-silver/10 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between text-sm text-silver">
                  <span>Unit price</span>
                  <span className="font-bold text-white">{currency(product.unitPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-silver">
                  <span>Bulk price</span>
                  <span className="font-bold text-white">{currency(product.bulkPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-silver">
                  <span>Bulk quantity</span>
                  <span className="font-bold text-white">{product.bulkQty} units</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={whatsappLink(`Hello Cornercart Traders, I would like to enquire about ${product.name} (${product.size})`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-full border border-silver/20 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:border-neonRed hover:text-neonRed"
                >
                  ENQUIRE NOW
                </a>
                <button
                  onClick={() => setPage('contact')}
                  className="rounded-full bg-neonRed px-4 py-3 text-sm font-medium text-white shadow-glow"
                >
                  BULK QUOTE
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const renderBrands = () => (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-electricPurple">Our brands</p>
        <h1 className="mt-3 text-4xl font-black uppercase text-white">Trusted FMCG brands brought closer to your community.</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {brands.map((brand) => (
          <div key={brand.id} className="rounded-[28px] border border-silver/10 bg-white/5 p-6 shadow-card">
            <div className="mb-5 h-28 overflow-hidden rounded-2xl bg-slate-900">
              <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold uppercase text-white">{brand.name}</h3>
            <p className="mt-4 text-silver/80">{brand.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {brand.categories.map((category) => (
                <span key={category} className="rounded-full border border-silver/20 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-silver">
                  {category}
                </span>
              ))}
            </div>
            <button onClick={() => setPage('wholesale')} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase text-neonRed">
              View products <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );

  const renderPep = () => (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-electricPurple">Pep Preneur Programme</p>
        <h1 className="mt-3 text-4xl font-black uppercase text-white">BUILD YOUR OWN BUSINESS. GROW YOUR COMMUNITY. CREATE YOUR FUTURE.</h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg text-silver/80">
          The Pep Preneur Programme helps entrepreneurs start and grow their own micro-distribution businesses by selling leading FMCG brands directly within their communities.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[28px] border border-silver/10 bg-white/5 p-8">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-electricPurple/15 text-electricPurple">
            <Handshake size={22} />
          </div>
          <div className="text-sm uppercase tracking-[0.2em] text-silver">Supported by</div>
          <div className="mt-4 text-2xl font-black uppercase text-white">Kgodiso Development Fund</div>
        </div>
        <div className="rounded-[28px] border border-silver/10 bg-white/5 p-8">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-electricPurple/15 text-electricPurple">
            <Building2 size={22} />
          </div>
          <div className="text-sm uppercase tracking-[0.2em] text-silver">Implemented by</div>
          <div className="mt-4 text-2xl font-black uppercase text-white">Sonke Sales Solutions</div>
        </div>
        <div className="rounded-[28px] border border-silver/10 bg-white/5 p-8">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-electricPurple/15 text-electricPurple">
            <ShoppingCart size={22} />
          </div>
          <div className="text-sm uppercase tracking-[0.2em] text-silver">Operational support</div>
          <div className="mt-4 text-2xl font-black uppercase text-white">Pepsico Direct-to-Consumer</div>
        </div>
      </div>

      <div className="mt-14 rounded-[32px] border border-silver/10 bg-gradient-to-r from-slate-900 to-slate-950 p-8">
        <h2 className="mb-8 text-3xl font-black uppercase text-white">Brands you can sell</h2>
        <div className="flex flex-wrap gap-3">
          {programmeBrands.map((brand) => (
            <span key={brand} className="rounded-full border border-silver/20 bg-white/5 px-4 py-2 text-sm text-silver">{brand}</span>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="mb-8 text-3xl font-black uppercase text-white">What the programme offers</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            ['Business Opportunity', 'Run your own micro-distribution business in your community.'],
            ['Training', 'Structured training covering sales, business operations, customer service, and financial basics.'],
            ['Starter Tools', 'Receive starter tools and business starter kits to help you begin trading.'],
            ['Competitive Pricing', 'Access competitive wholesale pricing designed to provide strong margins and attractive earning potential.'],
            ['Mentorship', 'Ongoing mentorship and field coaching to help you grow your sales.'],
            ['Business Support', 'Access business support and stock funding assistance for a limited period, subject to programme terms.'],
          ].map(([title, description]) => (
            <div key={title} className="rounded-[28px] border border-silver/10 bg-white/5 p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-electricPurple/20 to-neonRed/20 text-neonRed">
                <Star size={20} />
              </div>
              <h3 className="text-xl font-bold uppercase text-white">{title}</h3>
              <p className="mt-3 text-silver/80">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 rounded-[32px] border border-silver/10 bg-gradient-to-r from-[#111824] to-[#131313] p-8">
        <h2 className="mb-8 text-3xl font-black uppercase text-white">Programme structure</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {serviceSteps.map((step, index) => (
            <div key={step} className="rounded-[24px] border border-silver/10 bg-white/5 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neonRed font-black text-white">{index + 1}</div>
              <div className="text-sm uppercase tracking-[0.18em] text-electricPurple">Step {index + 1}</div>
              <p className="mt-3 text-silver/80">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="mb-8 text-3xl font-black uppercase text-white">Success targets</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {quickStats.map((stat) => (
            <div key={stat.value} className="rounded-[28px] border border-silver/10 bg-gradient-to-br from-electricPurple/10 to-neonRed/10 p-8">
              <div className="text-4xl font-black text-white">{stat.value}</div>
              <div className="mt-3 text-silver/80">{stat.title}</div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-silver/70">
          These figures are programme targets and illustrative earning potential, not guaranteed income.
        </p>
      </div>

      <div className="mt-14 rounded-[32px] border border-neonRed/20 bg-[#130d12] p-8 shadow-glow sm:p-10">
        <h2 className="mb-6 text-3xl font-black uppercase text-white">READY TO BECOME A PEP PRENEUR?</h2>
        <form onSubmit={handleApplicationSubmit} className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-silver">
            <span>Full name</span>
            <input name="fullName" required className="w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
          </label>
          <label className="space-y-2 text-sm text-silver">
            <span>Contact number</span>
            <input name="phone" required className="w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
          </label>
          <label className="space-y-2 text-sm text-silver">
            <span>Email address</span>
            <input type="email" name="email" required className="w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
          </label>
          <label className="space-y-2 text-sm text-silver">
            <span>Location / community</span>
            <input name="location" required className="w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
          </label>
          <label className="space-y-2 text-sm text-silver">
            <span>Current employment status</span>
            <input name="employmentStatus" required className="w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
          </label>
          <label className="space-y-2 text-sm text-silver">
            <span>Business experience</span>
            <input name="businessExperience" required className="w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
          </label>
          <label className="space-y-2 text-sm text-silver md:col-span-2">
            <span>Why would you like to join the programme?</span>
            <textarea name="motivation" rows="5" required className="w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
          </label>

          <div className="md:col-span-2 mt-2">
            <button type="submit" className="rounded-full bg-neonRed px-7 py-3 font-semibold text-white shadow-glow">
              APPLY NOW
            </button>
            <p className="mt-4 text-sm text-silver/70">Applications are sent to the business administration team for review.</p>
            <p className="mt-2 text-sm text-silver/70">Programme participation, funding, and support are subject to eligibility and programme approval.</p>
          </div>
        </form>
      </div>
    </section>
  );

  const renderContact = () => (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-electricPurple">Contact us</p>
        <h1 className="mt-3 text-4xl font-black uppercase text-white">Let’s build your next successful wholesale relationship.</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="rounded-[28px] border border-silver/10 bg-white/5 p-6">
            <div className="mb-5 flex items-center gap-3 text-white">
              <Phone size={18} className="text-neonRed" />
              <span className="font-medium">Telephone</span>
            </div>
            <p className="text-silver/80">076 640 8808</p>
            <p className="text-silver/80">063 155 3549</p>
          </div>

          <div className="rounded-[28px] border border-silver/10 bg-white/5 p-6">
            <div className="mb-5 flex items-center gap-3 text-white">
              <MessageCircle size={18} className="text-neonRed" />
              <span className="font-medium">WhatsApp</span>
            </div>
            <a href={whatsappLink('Hello Cornercart Traders, I would like to speak to your team.')} target="_blank" rel="noreferrer" className="text-silver/80 hover:text-neonRed">
              078 366 5807
            </a>
          </div>

          <div className="rounded-[28px] border border-silver/10 bg-white/5 p-6">
            <div className="mb-5 flex items-center gap-3 text-white">
              <Mail size={18} className="text-neonRed" />
              <span className="font-medium">Email</span>
            </div>
            <a href="mailto:Mokobanelesego861@gmail.com" className="text-silver/80 hover:text-neonRed">Mokobanelesego861@gmail.com</a>
          </div>

          <div className="rounded-[28px] border border-silver/10 bg-white/5 p-6">
            <div className="mb-5 flex items-center gap-3 text-white">
              <MapPin size={18} className="text-neonRed" />
              <span className="font-medium">Delivery & region</span>
            </div>
            <p className="text-silver/80">South Africa-based operations serving local wholesale and community distribution demands.</p>
            <p className="mt-3 text-silver/80">Delivery charges are calculated based on your delivery location. Contact our team for a delivery quotation.</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-silver/10 bg-white/5 p-6 lg:p-8">
          <form onSubmit={handleContactSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-silver">
                <span>Name</span>
                <input name="name" required className="w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
              </label>
              <label className="space-y-2 text-sm text-silver">
                <span>Phone number</span>
                <input name="phone" required className="w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-silver">
                <span>Email</span>
                <input type="email" name="email" required className="w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
              </label>
              <label className="space-y-2 text-sm text-silver">
                <span>Enquiry type</span>
                <select name="type" defaultValue="Wholesale product enquiry" className="w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed">
                  <option>Wholesale product enquiry</option>
                  <option>Bulk order enquiry</option>
                  <option>Pep Preneur Programme</option>
                  <option>Partnership opportunities</option>
                  <option>General enquiry</option>
                </select>
              </label>
            </div>

            <label className="space-y-2 text-sm text-silver">
              <span>Message</span>
              <textarea name="message" rows="6" required className="w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
            </label>

            <button type="submit" className="rounded-full bg-neonRed px-6 py-3 font-semibold text-white shadow-glow">SEND ENQUIRY</button>
          </form>
        </div>
      </div>
    </section>
  );

  const renderAdmin = () => (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {!adminMode ? (
        <div className="mx-auto max-w-lg rounded-[32px] border border-silver/10 bg-white/5 p-8 shadow-card">
          <h2 className="mb-6 text-3xl font-black uppercase text-white">Admin Access</h2>
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <label className="block text-sm text-silver">
              <span>Username</span>
              <input value={adminData.username} onChange={(event) => setAdminData({ ...adminData, username: event.target.value })} className="mt-2 w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
            </label>
            <label className="block text-sm text-silver">
              <span>Password</span>
              <input type="password" value={adminData.password} onChange={(event) => setAdminData({ ...adminData, password: event.target.value })} className="mt-2 w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
            </label>
            <button className="w-full rounded-full bg-neonRed px-6 py-3 font-semibold text-white">Login</button>
          </form>
          <p className="mt-4 text-xs text-silver/70">Demo credentials: username <span className="text-white">cornercart</span> password <span className="text-white">admin2026</span></p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-electricPurple">Admin dashboard</p>
              <h2 className="mt-2 text-3xl font-black uppercase text-white">Website management</h2>
            </div>
            <button onClick={() => setAdminMode(false)} className="rounded-full border border-silver/20 px-5 py-2 text-sm text-silver">Logout</button>
          </div>

          <div className="flex flex-wrap gap-3">
            {['products', 'brands', 'enquiries', 'applications'].map((tab) => (
              <button key={tab} onClick={() => setAdminTab(tab)} className={`rounded-full px-4 py-2 text-sm font-medium uppercase ${adminTab === tab ? 'bg-neonRed text-white' : 'bg-white/5 text-silver'}`}>
                {tab}
              </button>
            ))}
          </div>

          {adminTab === 'products' && (
            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
              <form onSubmit={handleProductSave} className="rounded-[28px] border border-silver/10 bg-white/5 p-6">
                <h3 className="mb-5 text-xl font-bold uppercase text-white">{productForm.id ? 'Edit product' : 'Add product'}</h3>
                <div className="space-y-4 text-sm text-silver">
                  <label className="block">
                    <span>Name</span>
                    <input value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} className="mt-2 w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
                  </label>
                  <label className="block">
                    <span>Category</span>
                    <select value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} className="mt-2 w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed">
                      {productCategories.filter((item) => item !== 'All').map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span>Size</span>
                    <input value={productForm.size} onChange={(event) => setProductForm({ ...productForm, size: event.target.value })} className="mt-2 w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span>Unit price</span>
                      <input type="number" step="0.01" value={productForm.unitPrice} onChange={(event) => setProductForm({ ...productForm, unitPrice: event.target.value })} className="mt-2 w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
                    </label>
                    <label className="block">
                      <span>Bulk price</span>
                      <input type="number" step="0.01" value={productForm.bulkPrice} onChange={(event) => setProductForm({ ...productForm, bulkPrice: event.target.value })} className="mt-2 w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span>Bulk quantity</span>
                      <input type="number" value={productForm.bulkQty} onChange={(event) => setProductForm({ ...productForm, bulkQty: event.target.value })} className="mt-2 w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
                    </label>
                    <label className="flex items-center gap-3 pt-8">
                      <input type="checkbox" checked={productForm.inStock} onChange={(event) => setProductForm({ ...productForm, inStock: event.target.checked })} className="h-4 w-4 accent-neonRed" />
                      <span>Available</span>
                    </label>
                  </div>
                  <label className="block">
                    <span>Image URL</span>
                    <input value={productForm.image} onChange={(event) => setProductForm({ ...productForm, image: event.target.value })} className="mt-2 w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
                  </label>
                </div>

                <button type="submit" className="mt-6 rounded-full bg-neonRed px-6 py-3 font-semibold text-white">
                  Save product
                </button>
              </form>

              <div className="rounded-[28px] border border-silver/10 bg-white/5 p-6">
                <h3 className="mb-5 text-xl font-bold uppercase text-white">Current products</h3>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-silver/10 bg-slate-950/60 p-4">
                      <img src={product.image} alt={product.name} className="h-16 w-16 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-white">{product.name}</div>
                        <div className="text-xs uppercase tracking-[0.12em] text-silver">{product.size} • {product.category}</div>
                        <div className="mt-2 text-sm text-silver">{currency(product.unitPrice)} • {currency(product.bulkPrice)} / {product.bulkQty}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => setProductForm({ ...product, id: product.id, unitPrice: String(product.unitPrice), bulkPrice: String(product.bulkPrice), bulkQty: String(product.bulkQty) })} className="rounded-full border border-silver/20 px-3 py-1 text-xs text-silver">Edit</button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-300">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'brands' && (
            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
              <form onSubmit={handleBrandSave} className="rounded-[28px] border border-silver/10 bg-white/5 p-6">
                <h3 className="mb-5 text-xl font-bold uppercase text-white">{brandForm.id ? 'Edit brand' : 'Add brand'}</h3>
                <div className="space-y-4 text-sm text-silver">
                  <label className="block">
                    <span>Name</span>
                    <input value={brandForm.name} onChange={(event) => setBrandForm({ ...brandForm, name: event.target.value })} className="mt-2 w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
                  </label>
                  <label className="block">
                    <span>Description</span>
                    <textarea value={brandForm.description} onChange={(event) => setBrandForm({ ...brandForm, description: event.target.value })} className="mt-2 w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
                  </label>
                  <label className="block">
                    <span>Categories</span>
                    <input value={brandForm.categories} onChange={(event) => setBrandForm({ ...brandForm, categories: event.target.value })} className="mt-2 w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
                  </label>
                  <label className="block">
                    <span>Logo URL</span>
                    <input value={brandForm.logo} onChange={(event) => setBrandForm({ ...brandForm, logo: event.target.value })} className="mt-2 w-full rounded-2xl border border-silver/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-neonRed" />
                  </label>
                </div>
                <button type="submit" className="mt-6 rounded-full bg-neonRed px-6 py-3 font-semibold text-white">Save brand</button>
              </form>

              <div className="rounded-[28px] border border-silver/10 bg-white/5 p-6">
                <h3 className="mb-5 text-xl font-bold uppercase text-white">Brand roster</h3>
                <div className="space-y-4">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center gap-4 rounded-2xl border border-silver/10 p-4">
                      <img src={brand.logo} alt={brand.name} className="h-16 w-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <div className="font-semibold text-white">{brand.name}</div>
                        <div className="text-sm text-silver">{brand.description}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => setBrandForm({ id: brand.id, name: brand.name, description: brand.description, categories: brand.categories.join(', '), logo: brand.logo })} className="rounded-full border border-silver/20 px-3 py-1 text-xs text-silver">Edit</button>
                        <button onClick={() => handleDeleteBrand(brand.id)} className="rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-300">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'enquiries' && (
            <div className="rounded-[28px] border border-silver/10 bg-white/5 p-6">
              <h3 className="mb-5 text-xl font-bold uppercase text-white">Customer enquiries</h3>
              <div className="space-y-4">
                {enquiries.length === 0 ? <p className="text-silver/70">No customer enquiries yet.</p> : enquiries.map((entry, index) => (
                  <div key={index} className="rounded-2xl border border-silver/10 bg-slate-950/60 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-semibold text-white">{entry.name}</div>
                        <div className="text-sm text-silver">{entry.email} • {entry.phone}</div>
                      </div>
                      <span className="rounded-full border border-silver/20 px-3 py-1 text-xs uppercase tracking-[0.16em] text-silver">{entry.type}</span>
                    </div>
                    <p className="mt-3 text-silver/80">{entry.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'applications' && (
            <div className="rounded-[28px] border border-silver/10 bg-white/5 p-6">
              <h3 className="mb-5 text-xl font-bold uppercase text-white">Programme applications</h3>
              <div className="space-y-4">
                {applications.length === 0 ? <p className="text-silver/70">No applications submitted yet.</p> : applications.map((entry, index) => (
                  <div key={index} className="rounded-2xl border border-silver/10 bg-slate-950/60 p-4">
                    <div className="font-semibold text-white">{entry.fullName}</div>
                    <div className="mt-2 text-sm text-silver">{entry.email} • {entry.phone} • {entry.location}</div>
                    <div className="mt-2 text-sm text-silver">Employment: {entry.employmentStatus}</div>
                    <p className="mt-3 text-silver/80">{entry.motivation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );

  const currentPage = page === 'home' ? renderHome() : page === 'wholesale' ? renderWholesale() : page === 'brands' ? renderBrands() : page === 'pep' ? renderPep() : page === 'contact' ? renderContact() : null;

  return (
    <div className="min-h-screen bg-[#070a0d] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080A0E]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button onClick={() => setPage('home')} className="flex items-center gap-3 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-electricPurple to-neonRed font-black text-white shadow-glow">C</div>
            <div>
              <div className="font-black uppercase tracking-[0.12em] text-white">Cornercart</div>
              <div className="text-[10px] uppercase tracking-[0.32em] text-silver">Traders</div>
            </div>
          </button>

          <nav className="hidden items-center gap-6 lg:flex">
            {['home', 'wholesale', 'brands', 'pep', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => setPage(item)}
                className={`text-sm font-medium uppercase tracking-[0.16em] transition ${page === item ? 'text-neonRed' : 'text-silver hover:text-white'}`}
              >
                {item === 'home' ? 'HOME' : item === 'wholesale' ? 'WHOLESALE' : item === 'brands' ? 'OUR BRANDS' : item === 'pep' ? 'PEP PRENEUR PROGRAMME' : 'CONTACT'}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href={whatsappLink('Hello Cornercart Traders, I would like to talk to your team.')} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full border border-silver/20 bg-white/5 text-neonRed transition hover:border-neonRed">
              <MessageCircle size={18} />
            </a>
            <button onClick={() => setAdminMode(true)} className="hidden rounded-full border border-silver/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-silver lg:inline-flex">
              Admin
            </button>
            <button onClick={() => setMobileNavOpen((prev) => !prev)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-silver/20 bg-white/5 lg:hidden">
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="border-t border-white/10 bg-[#080A0E] px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {['home', 'wholesale', 'brands', 'pep', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setPage(item);
                    setMobileNavOpen(false);
                  }}
                  className="text-left text-sm font-medium uppercase tracking-[0.16em] text-silver"
                >
                  {item === 'home' ? 'HOME' : item === 'wholesale' ? 'WHOLESALE' : item === 'brands' ? 'OUR BRANDS' : item === 'pep' ? 'PEP PRENEUR PROGRAMME' : 'CONTACT'}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>
        {page === 'admin' ? renderAdmin() : currentPage}
      </main>

      {notice && (
        <div className="fixed bottom-6 right-6 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-200 shadow-lg backdrop-blur-md">
          {notice}
        </div>
      )}

      <footer className="border-t border-white/10 bg-[#070a0d]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-electricPurple to-neonRed text-lg font-black">C</div>
              <div>
                <div className="font-black uppercase text-white">Cornercart</div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-silver">TRADERS</div>
              </div>
            </div>
            <p className="text-silver/70">Bringing Trusted FMCG Brands Closer to Your Community.</p>
          </div>

          <div>
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white">Navigation</div>
            <ul className="space-y-2 text-silver/70">
              <li>Home</li>
              <li>Wholesale</li>
              <li>Our Brands</li>
              <li>Pep Preneur Programme</li>
            </ul>
          </div>

          <div>
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white">Contact</div>
            <ul className="space-y-2 text-silver/70">
              <li>076 640 8808</li>
              <li>063 155 3549</li>
              <li>078 366 5807</li>
              <li>Mokobanelesego861@gmail.com</li>
            </ul>
          </div>

          <div>
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white">Notice</div>
            <p className="text-silver/70">Prices include VAT. While stocks last. Delivery charges are calculated according to your location.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
