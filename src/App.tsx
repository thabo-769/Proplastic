import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Menu, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowRight, Download, FileText, 
  Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, Building2, 
  ShieldCheck, Award, Factory, ArrowUpRight, Search, ExternalLink, 
  Clock, Globe, Users, TrendingUp, Sparkles, AlertCircle, ShoppingCart, 
  Trash2, Plus, Minus, ZoomIn, SlidersHorizontal, Check, Eye, Warehouse, Truck
} from 'lucide-react';
import { Logo } from './components/Logo';
import { ImageWithFallback } from './components/ImageWithFallback';
import { ScrollRevealHeading, ScrollRevealParagraph, CounterReveal } from './components/ScrollRevealText';
import { ImageZoomModal } from './components/ImageZoomModal';
import { ScrollProgressBar } from './components/ScrollProgressBar';

// Interfaces
interface Product {
  id: string;
  name: string;
  category: 'PVC' | 'HDPE' | 'DRAINAGE' | 'CASINGS' | 'DUCTING' | 'AGRICULTURE' | 'ACCESSORIES' | 'STORAGE' | 'VALVES';
  description: string;
  image: string;
  applications: string[];
  sizes: string;
  technicalInfo: string;
  price: number; // in USD
  unit: string;
  inStock: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Project {
  id: string;
  name: string;
  location: string;
  industry: string;
  products: string;
  image: string;
  description: string;
}

interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  summary: string;
}

interface Resource {
  id: string;
  title: string;
  type: string;
  size: string;
  category: string;
}

interface FacilityItem {
  id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  icon: React.ElementType;
}

export default function App() {
  // Navigation & Scroll-Spy State
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Interactive Zoom Lightbox State
  const [zoomModal, setZoomModal] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    subtitle?: string;
    badge?: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
    subtitle: '',
    badge: '',
  });

  // Product Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart & Checkout State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  // Floating Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatStep, setChatStep] = useState<'menu' | 'form' | 'success'>('menu');
  const [chatTopic, setChatTopic] = useState('');
  const [chatForm, setChatForm] = useState({ name: '', contact: '', message: '' });

  // Projects Carousel State
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Responsive Search & Filter State in Products Section
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Hero Slides Data with authentic, verified 200 OK imagery
  const heroSlides = [
    {
      title: "PIPE SYSTEMS\nTHAT LAST",
      subtitle: "Zimbabwe's leading manufacturer of high-performance plastic piping systems for water infrastructure and beyond.",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1920&auto=format&fit=crop",
      tag: "CIVIL INFRASTRUCTURE"
    },
    {
      title: "BOREHOLE CASINGS\nFOR AFRICA",
      subtitle: "Heavy-duty PVC borehole casings and slotted screens engineered for maximum lifespan and reliable aquifer access.",
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1920&auto=format&fit=crop",
      tag: "GEOTECHNICAL & WATER"
    },
    {
      title: "AGRICULTURAL\nIRRIGATION",
      subtitle: "Precision uPVC and LDPE irrigation piping ensuring efficient water delivery across African commercial farmland.",
      image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=1920&auto=format&fit=crop",
      tag: "COMMERCIAL FARMING"
    },
    {
      title: "MINING &\nINDUSTRIAL",
      subtitle: "Robust PE100 HDPE pipelines built to withstand severe slurry abrasion and high operating pressures.",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1920&auto=format&fit=crop",
      tag: "MINING & SLURRY"
    },
    {
      title: "SEWER & DRAINAGE\nSYSTEMS",
      subtitle: "Corrosion-proof uPVC gravity sewer and storm drainage pipes built to rigorous SANS specifications.",
      image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=1920&auto=format&fit=crop",
      tag: "MUNICIPAL WORKS"
    }
  ];

  // Comprehensive Product Catalog (12 High-Demand Items with Real Specifications & USD Pricing)
  const productsList: Product[] = [
    {
      id: 'pvc-pressure-110',
      name: 'uPVC PRESSURE PIPES (110MM)',
      category: 'PVC',
      description: 'High-strength unplasticized PVC pressure pipes manufactured to rigorous SANS 966 Part 1 specifications for municipal reticulation.',
      image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=800&auto=format&fit=crop',
      applications: ['Municipal water distribution', 'Agricultural irrigation mains', 'Borehole rising mains', 'Industrial fluid transport'],
      sizes: '110mm diameter (6m length with integral socket)',
      technicalInfo: 'SANS 966-1 certified. Working pressure Class 9 (0.9 MPa / 9 Bar). Smooth hydraulic bore minimizes friction loss.',
      price: 68.00,
      unit: '6m length',
      inStock: true
    },
    {
      id: 'hdpe-pipes-90',
      name: 'HDPE PE100 HIGH-PRESSURE COIL',
      category: 'HDPE',
      description: 'High-Density Polyethylene pipes offering maximum flexibility, corrosion resistance, and high burst impact strength.',
      image: 'https://images.unsplash.com/photo-1534398079543-7ae6d016b86a?q=80&w=800&auto=format&fit=crop',
      applications: ['Mining slurry and tailing lines', 'Trenchless water pipelines', 'Agricultural main lines', 'Overland undulating terrain'],
      sizes: '90mm OD (50m continuous coil, PN16 / Class 16)',
      technicalInfo: 'Manufactured from virgin PE100 raw polymer. 50+ year operational design life. Butt-fusion and electrofusion compatible.',
      price: 245.00,
      unit: '50m coil',
      inStock: true
    },
    {
      id: 'sewer-pipes-160',
      name: 'uPVC GRAVITY SEWER PIPES (160MM)',
      category: 'DRAINAGE',
      description: 'Heavy-duty solid-wall underground sewer and drainage pipes engineered to resist shifting soil pressure and corrosive effluent.',
      image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop',
      applications: ['Municipal sewage infrastructure', 'Underground civil stormwater', 'Industrial wastewater gravity flow'],
      sizes: '160mm diameter (6m length, Class 34 Heavy Duty)',
      technicalInfo: 'SANS 791 approved. Elastomeric rubber ring sealing system ensures 100% leak-proof underground performance.',
      price: 88.00,
      unit: '6m length',
      inStock: true
    },
    {
      id: 'borehole-casings-160',
      name: 'uPVC BOREHOLE CASING & SCREEN',
      category: 'CASINGS',
      description: 'Non-toxic, high-collapse resistant plain and slotted uPVC borehole casings engineered for secure subterranean water extraction.',
      image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=800&auto=format&fit=crop',
      applications: ['Deep water borehole drilling', 'Geotechnical piezometer wells', 'Agricultural borehole casing'],
      sizes: '160mm outer diameter (6m length with precision male/female thread)',
      technicalInfo: 'Deep collapse-resistant rib design. Corrosion-proof in acidic or saline groundwater environments.',
      price: 96.00,
      unit: '6m length',
      inStock: true
    },
    {
      id: 'electrical-conduits-25',
      name: 'PVC ELECTRICAL CONDUIT (25MM)',
      category: 'DUCTING',
      description: 'Rigid PVC electrical conduits and fittings engineered for cable protection in residential, commercial, and industrial facilities.',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
      applications: ['Building electrical wiring', 'Underground power cable ducting', 'Data communication cable banks'],
      sizes: '25mm diameter (4m length)',
      technicalInfo: 'Self-extinguishing fire-retardant compound. High dielectric insulation strength adhering to building safety codes.',
      price: 24.50,
      unit: 'Pack of 5 (4m each)',
      inStock: true
    },
    {
      id: 'ldpe-pipes-irrigation',
      name: 'LDPE LOW-PRESSURE IRRIGATION PIPE',
      category: 'AGRICULTURE',
      description: 'Flexible Low-Density Polyethylene piping specifically engineered for micro-irrigation, orchard drip lines, and nursery watering.',
      image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=800&auto=format&fit=crop',
      applications: ['Drip irrigation laterals', 'Centre pivot spray drops', 'Horticultural and greenhouse watering'],
      sizes: '20mm diameter (100m coil, Class 3)',
      technicalInfo: 'Carbon black UV-stabilized against harsh sub-Saharan solar degradation. Puncture and kink resistant.',
      price: 48.00,
      unit: '100m coil',
      inStock: true
    },
    {
      id: 'compression-fittings',
      name: 'PP COMPRESSION FITTINGS & ADAPTERS',
      category: 'ACCESSORIES',
      description: 'Comprehensive series of precision polypropylene compression fittings, elbows, equal tees, and female adapters for HDPE lines.',
      image: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?q=80&w=800&auto=format&fit=crop',
      applications: ['Fast mechanical jointing of HDPE pipes without heat fusion', 'Farm reticulation maintenance', 'Meter box connections'],
      sizes: '20mm to 110mm assortments',
      technicalInfo: 'PN16 pressure rated. High mechanical pull-out resistance with EPDM rubber O-rings.',
      price: 12.50,
      unit: 'Per fitting (Avg)',
      inStock: true
    },
    {
      id: 'water-storage-tanks',
      name: 'ROTOMOLDED POLY WATER TANK (2,500L)',
      category: 'STORAGE',
      description: 'Heavy-duty rotationally molded food-grade polyethylene water storage tank for domestic, commercial, and agricultural rain harvesting.',
      image: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?q=80&w=800&auto=format&fit=crop',
      applications: ['Rainwater harvesting', 'Municipal water interruption backup', 'Borehole overhead storage'],
      sizes: '2,500 Litres Capacity (Vertical Cylindrical)',
      technicalInfo: 'Multi-layer food grade polymer. Black inner liner prevents algae formation. UV-stabilized outer skin.',
      price: 360.00,
      unit: 'Per unit',
      inStock: true
    },
    {
      id: 'hdpe-culvert-large',
      name: 'CORRUGATED HDPE CULVERT PIPE (400MM)',
      category: 'DRAINAGE',
      description: 'Double-wall corrugated high-density polyethylene storm culverts providing high ring stiffness at a fraction of concrete pipe weight.',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=800&auto=format&fit=crop',
      applications: ['Road culverts & highway drainage', 'Mining site run-off management', 'Heavy civil stormwater diversions'],
      sizes: '400mm internal diameter (6m length)',
      technicalInfo: 'SN8 ring stiffness rating. Extreme resistance to acidic soils and vehicle axle loadings.',
      price: 195.00,
      unit: '6m length',
      inStock: true
    },
    {
      id: 'pvc-swv-soil-waste',
      name: 'uPVC SWV SOIL, WASTE & VENT PIPE',
      category: 'PVC',
      description: 'Sanitary plumbing drainage pipe system designed for interior and exterior soil, waste, and vent plumbing stacks in commercial buildings.',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
      applications: ['Multi-storey building plumbing stacks', 'Commercial kitchen waste lines', 'Roof vent pipes'],
      sizes: '110mm diameter (6m length, White)',
      technicalInfo: 'Manufactured to SANS 967 plumbing standards. Compatible with standard solvent weld SWV fittings.',
      price: 52.00,
      unit: '6m length',
      inStock: true
    },
    {
      id: 'high-pressure-valves',
      name: 'INDUSTRIAL uPVC BALL & CHECK VALVES',
      category: 'VALVES',
      description: 'Chemical-resistant true union industrial uPVC ball valves and non-return check valves with PTFE seats for process control.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      applications: ['Water treatment plant manifolds', 'Irrigation line isolation', 'Chemical dosage lines'],
      sizes: '50mm to 110mm True Union configurations',
      technicalInfo: '16 bar pressure rating at 20°C. Ergonomic handle and non-corroding thermoplastic body.',
      price: 34.00,
      unit: 'Per unit',
      inStock: true
    },
    {
      id: 'solvent-cement-primers',
      name: 'PROPLASTICS WELDING SOLVENT CEMENT',
      category: 'ACCESSORIES',
      description: 'High-strength solvent weld cement specially formulated for pressure jointing uPVC piping networks in tropical temperatures.',
      image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=800&auto=format&fit=crop',
      applications: ['Solvent welding PVC pressure and drainage pipelines', 'Borehole casing jointing'],
      sizes: '500ml Can with applicator brush',
      technicalInfo: 'Rapid bond formation. Gap-filling formula certified to withstand up to 25 bar hydrostatic pressure.',
      price: 14.50,
      unit: '500ml can',
      inStock: true
    }
  ];

  // Manufacturing Facilities & Quality Testing Showcase
  const facilities: FacilityItem[] = [
    {
      id: 'fac-1',
      title: 'Advanced Extrusion Lines (Harare)',
      description: 'High-speed automated Battenfeld-Cincinnati extrusion lines delivering precise wall-thickness control and high output capacity.',
      image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=1000&auto=format&fit=crop',
      tag: 'MANUFACTURING',
      icon: Factory
    },
    {
      id: 'fac-2',
      title: 'Hydrostatic & Tensile Quality Lab',
      description: 'In-house certified testing facility conducting 1000-hour hydrostatic burst tests, MFI checks, and impact resistance certification.',
      image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?q=80&w=1000&auto=format&fit=crop',
      tag: 'ISO 9001 QUALITY',
      icon: ShieldCheck
    },
    {
      id: 'fac-3',
      title: 'Harare Storage Yard & Coil Logistics',
      description: 'Extensive 5-hectare paved pipe staging yard at Tilbury Road ensuring immediate dispatch availability for large national projects.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop',
      tag: 'STAGING & INVENTORY',
      icon: Warehouse
    },
    {
      id: 'fac-4',
      title: 'Regional Heavy Haulage Fleet',
      description: 'Dedicated fleet of specialized flatbed and crane trucks providing prompt job-site deliveries across Zimbabwe and the SADC region.',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1000&auto=format&fit=crop',
      tag: 'LOGISTICS & SADC DISPATCH',
      icon: Truck
    }
  ];

  // Projects Data with real Zimbabwean context
  const projects: Project[] = [
    {
      id: 'proj-1',
      name: 'Harare Municipal Water Augmentation',
      location: 'Harare, Zimbabwe',
      industry: 'Civils & Municipal Water',
      products: '400mm PVC Pressure Pipes & HDPE PE100 Mains',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
      description: 'Supplying bulk high-pressure transmission piping to upgrade municipal water reticulation pipelines and improve urban clean water distribution.'
    },
    {
      id: 'proj-2',
      name: 'Great Dyke Platinum Mining Slurry Pipeline',
      location: 'Mashonaland West, Zimbabwe',
      industry: 'Mining & Mineral Extraction',
      products: 'HDPE PE100 Heavy Duty Pipes (500mm, PN16)',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1200&auto=format&fit=crop',
      description: 'Providing ultra-durable abrasion-resistant HDPE piping systems for heavy mineral slurry transport and acid leach line conveyance.'
    },
    {
      id: 'proj-3',
      name: 'Lowveld Commercial Irrigation Scheme',
      location: 'Chiredzi, Zimbabwe',
      industry: 'Agriculture & Irrigation',
      products: 'uPVC Pressure Pipes & LDPE Sub-Main Lines',
      image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=1200&auto=format&fit=crop',
      description: 'Outfitting thousands of hectares of sugarcane and commercial cereal fields with high-flow agricultural irrigation networks.'
    },
    {
      id: 'proj-4',
      name: 'National Rural Borehole Rehabilitation',
      location: 'Nationwide, Zimbabwe',
      industry: 'Water Infrastructure & Community',
      products: 'Threaded uPVC Borehole Casings (160mm & 200mm)',
      image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=1200&auto=format&fit=crop',
      description: 'Partnering in national borehole rehabilitation initiatives by supplying collapse-resistant uPVC casings for rural water security.'
    }
  ];

  // Resources Data
  const resources: Resource[] = [
    { id: 'res-1', title: 'Comprehensive Product Catalogue 2026', type: 'PDF', size: '14.2 MB', category: 'Catalogues' },
    { id: 'res-2', title: 'uPVC & HDPE Pipe Installation Technical Manual', type: 'PDF', size: '8.5 MB', category: 'Technical' },
    { id: 'res-3', title: 'Borehole Casing & Screen Installation Best Practices', type: 'PDF', size: '4.1 MB', category: 'Guides' },
    { id: 'res-4', title: 'Proplastics Corporate Capabilities & ESG Profile', type: 'PDF', size: '6.8 MB', category: 'Company' },
    { id: 'res-5', title: 'Annual Audited Financial Report 2025', type: 'PDF', size: '11.0 MB', category: 'Investor' },
    { id: 'res-6', title: 'Agricultural Irrigation Network Design Guide', type: 'PDF', size: '5.4 MB', category: 'Brochures' }
  ];

  // News Data
  const newsList: NewsItem[] = [
    {
      id: 'news-1',
      title: 'Proplastics Expands Large-Diameter HDPE Manufacturing Lines in Harare',
      date: 'March 28, 2026',
      category: 'Manufacturing',
      image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=800&auto=format&fit=crop',
      summary: 'Multimillion-dollar investment in advanced extrusion lines doubles regional capacity for heavy civil and mining water infrastructure pipes.'
    },
    {
      id: 'news-2',
      title: 'Commitment to Sustainability: Closed-Loop Polymer Recycling in Ducting',
      date: 'February 14, 2026',
      category: 'Sustainability',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop',
      summary: 'Pioneering circular economy initiatives in Zimbabwean manufacturing without compromising on strict structural compliance.'
    },
    {
      id: 'news-3',
      title: 'Proplastics Showcases High-Pressure Mining Solutions at SADC Symposium',
      date: 'January 20, 2026',
      category: 'Events',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
      summary: 'Our materials engineering team presents research on abrasion-resistant polymers in deep gold and platinum mining operations.'
    }
  ];

  // Sticky Navbar & Scroll-Spy Detection
  useEffect(() => {
    const handleScroll = () => {
      // Navbar background trigger
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Scroll-spy active section detection
      const sections = ['home', 'about', 'sectors', 'products', 'facilities', 'projects', 'resources', 'investors', 'media', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Cart Helper functions
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Form handlers
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderComplete(true);
    setTimeout(() => {
      setOrderComplete(false);
      setCheckoutOpen(false);
      setCart([]);
      setCheckoutForm({ name: '', company: '', email: '', phone: '', address: '', notes: '' });
    }, 3800);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', company: '', email: '', phone: '', subject: '', message: '' });
    }, 4000);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChatStep('success');
    setTimeout(() => {
      setChatOpen(false);
      setChatStep('menu');
      setChatForm({ name: '', contact: '', message: '' });
    }, 3000);
  };

  // Open Zoom Modal Helper
  const openZoom = (imageUrl: string, title: string, subtitle?: string, badge?: string) => {
    setZoomModal({
      isOpen: true,
      imageUrl,
      title,
      subtitle,
      badge: badge || 'Technical Inspection',
    });
  };

  // Filter & Sort Products (Responsive Live Search)
  const filteredProducts = useMemo(() => {
    let result = productsList.filter((p) => {
      const q = productSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sizes.toLowerCase().includes(q) ||
        p.technicalInfo.toLowerCase().includes(q) ||
        p.applications.some((app) => app.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [productsList, productSearch, selectedCategory, sortBy]);

  // Display only 8 products initially with View More functionality
  const displayedProducts = useMemo(() => {
    if (showAllProducts) return filteredProducts;
    return filteredProducts.slice(0, 8);
  }, [filteredProducts, showAllProducts]);

  const categories = [
    'ALL',
    'PVC',
    'HDPE',
    'DRAINAGE',
    'CASINGS',
    'DUCTING',
    'AGRICULTURE',
    'ACCESSORIES',
    'STORAGE',
    'VALVES'
  ];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-red-600 selection:text-white relative font-sans overflow-x-hidden">
      
      {/* 1. SCROLL PROGRESS BAR AT TOP */}
      <ScrollProgressBar />

      {/* 2. SIMPLE STICKY NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-neutral-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#home" className="flex items-center">
            <Logo className="h-9 sm:h-10" variant="dark" />
          </a>

          {/* Simple Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-semibold tracking-wide">
            {[
              { label: 'Home', href: '#home', id: 'home' },
              { label: 'About', href: '#about', id: 'about' },
              { label: 'Products', href: '#products', id: 'products' },
              { label: 'Facilities', href: '#facilities', id: 'facilities' },
              { label: 'Projects', href: '#projects', id: 'projects' },
              { label: 'Resources', href: '#resources', id: 'resources' },
              { label: 'Contact', href: '#contact', id: 'contact' },
            ].map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a 
                  key={item.label}
                  href={item.href}
                  className={`transition-colors py-1 ${
                    isActive ? 'text-red-500 font-bold' : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Simple Cart Button */}
            <button 
              onClick={() => setCartOpen(true)}
              className="p-2 text-neutral-300 hover:text-white relative flex items-center gap-1.5 border border-neutral-800 hover:border-neutral-700 rounded-md bg-neutral-900 transition-colors cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={17} />
              <span className="text-xs font-semibold hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Simple Get Quote Button */}
            <a 
              href="#contact" 
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-colors"
            >
              Get Quote
            </a>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* 3. SIMPLE MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 text-white pt-24 px-6 flex flex-col justify-between lg:hidden animate-in fade-in duration-200">
          <div className="flex flex-col gap-3 text-base font-medium">
            {[
              { label: 'Home', href: '#home' },
              { label: 'About Us', href: '#about' },
              { label: 'Products & Pricing', href: '#products' },
              { label: 'Plant & Facilities', href: '#facilities' },
              { label: 'Projects', href: '#projects' },
              { label: 'Resources', href: '#resources' },
              { label: 'Contact Us', href: '#contact' },
            ].map((item) => (
              <a 
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-neutral-300 hover:text-white border-b border-neutral-800 pb-2.5"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="py-6 border-t border-neutral-800 flex flex-col gap-3">
            <a 
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-red-600 text-white font-semibold text-center uppercase tracking-wider rounded-md text-xs"
            >
              Get Quote
            </a>
          </div>
        </div>
      )}

      {/* 4. HERO SECTION */}
      <section id="home" className="relative min-h-[90vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden bg-black pt-20">
        
        {/* Background Slides with Slow Ken Burns Zoom Effect */}
        {heroSlides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Scrim overlay for crisp typography legibility */}
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img 
              src={slide.image} 
              alt={slide.title}
              className={`w-full h-full object-cover object-center transform transition-transform duration-[12000ms] ${
                index === currentSlide ? 'scale-106' : 'scale-100'
              }`}
              referrerPolicy="no-referrer"
            />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          
          {/* Clean Main Headline */}
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white mb-6 uppercase leading-none">
            {heroSlides[currentSlide].title.split('\n')[0]} <br />
            <span className="text-red-600">
              {heroSlides[currentSlide].title.split('\n')[1] || ''}
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-neutral-200 font-normal mb-10 leading-relaxed">
            {heroSlides[currentSlide].subtitle}
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#products" 
              className="w-full sm:w-auto px-7 py-3.5 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-md hover:bg-red-700 transition-all shadow-md text-center flex items-center justify-center gap-2 group"
            >
              <span>Explore Products & Prices</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              onClick={() => openZoom(heroSlides[currentSlide].image, heroSlides[currentSlide].title.replace('\n', ' '), heroSlides[currentSlide].subtitle, 'Featured Application')}
              className="w-full sm:w-auto px-6 py-3.5 bg-neutral-900 border border-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded-md hover:bg-neutral-800 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <ZoomIn size={16} />
              <span>Inspect Infrastructure</span>
            </button>

            <a 
              href="#contact" 
              className="w-full sm:w-auto px-7 py-3.5 bg-transparent border border-white text-white font-bold text-xs uppercase tracking-wider rounded-md hover:bg-white hover:text-black transition-all text-center"
            >
              Contact Sales Team
            </a>
          </div>
        </div>

        {/* Hero Slider Controls (Left/Right Arrows) */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-20 flex justify-between max-w-7xl mx-auto pointer-events-none px-2 sm:px-6">
          <button 
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
            className="pointer-events-auto w-12 h-12 rounded-full bg-black/40 hover:bg-red-600 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 border border-white/20 group cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="pointer-events-auto w-12 h-12 rounded-full bg-black/40 hover:bg-red-600 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 border border-white/20 group cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight size={24} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Bottom Slider Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentSlide ? 'w-10 bg-red-600' : 'w-2 bg-white/40 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 6. ABOUT SECTION WITH ANIMATED COUNTERS & SCROLL REVEAL WORDS */}
      <section id="about" className="py-24 bg-white text-black border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Image with Zoom & Hover Scale */}
            <div className="relative group cursor-pointer" onClick={() => openZoom('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop', 'Harare Manufacturing Facility', 'Tilbury Road, Willowvale Extrusion Center', 'ISO Certified Plant')}>
              <div className="absolute -inset-4 bg-red-600/10 rounded-lg transform -rotate-1 group-hover:rotate-0 transition-transform duration-500" />
              <div className="relative overflow-hidden rounded-lg shadow-2xl bg-neutral-900 aspect-[4/3]">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1000&auto=format&fit=crop" 
                  alt="Proplastics Engineers and Quality Control" 
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-8">
                  <div className="text-white flex-1">
                    <span className="text-red-500 font-bold text-xs uppercase tracking-widest block mb-1">
                      ISO 9001:2015 Certified
                    </span>
                    <h3 className="font-bold text-lg sm:text-xl">High-Precision Polymer Extrusion & Laboratory</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-red-600/80 backdrop-blur-sm text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ZoomIn size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content with Words Scroll-Reveal */}
            <div>
              <div className="inline-block text-red-600 font-bold text-xs uppercase tracking-widest mb-3">
                Corporate Heritage & Vision
              </div>
              
              <ScrollRevealHeading 
                text="BUILT TO LAST IN AFRICA."
                highlightWords={['LAST', 'AFRICA']}
                className="font-bold text-3xl sm:text-4xl uppercase tracking-tight text-black mb-6 leading-tight"
              />

              <ScrollRevealParagraph className="text-base text-neutral-700 leading-relaxed mb-8">
                Proplastics provides reliable plastic piping systems for civil infrastructure, mining, commercial irrigation, geotechnical boreholes, and industrial applications across Zimbabwe and the SADC region. With decades of continuous engineering excellence, we manufacture pipe systems that withstand the most demanding African operational environments.
              </ScrollRevealParagraph>

              {/* Statistics Grid with Animated Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-neutral-200">
                <div>
                  <span className="font-black text-3xl sm:text-4xl text-red-600 block mb-1">
                    <CounterReveal end={50} suffix="+" />
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-600">Years of Heritage</span>
                </div>
                <div>
                  <span className="font-black text-3xl sm:text-4xl text-red-600 block mb-1">
                    <CounterReveal end={120} suffix="+" />
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-600">Pipes & Fittings</span>
                </div>
                <div>
                  <span className="font-black text-3xl sm:text-4xl text-red-600 block mb-1">
                    <CounterReveal end={100} suffix="%" />
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-600">SANS Compliant</span>
                </div>
                <div>
                  <span className="font-black text-3xl sm:text-4xl text-red-600 block mb-1">
                    <CounterReveal end={15} suffix="+" />
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-600">SADC Export Reach</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 7. BUSINESS SECTORS WITH ZOOM-IN CARD HOVER */}
      <section id="sectors" className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-red-600 font-bold text-xs uppercase tracking-widest block mb-2">Industries We Serve</span>
              <ScrollRevealHeading 
                text="WHERE WE WORK"
                highlightWords={['WORK']}
                className="font-bold text-3xl sm:text-4xl uppercase tracking-tight text-white"
              />
            </div>
            <p className="text-neutral-400 max-w-md mt-4 md:mt-0 text-sm leading-relaxed">
              Engineering robust thermoplastic solutions tailored to the rigorous demands of civil infrastructure, deep mining operations, agriculture, and geotechnical drilling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "CIVILS & MUNICIPAL",
                desc: "Municipal water reticulation, sewer gravity mains, and heavy stormwater culverts.",
                image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"
              },
              {
                title: "MINING & SLURRY",
                desc: "High-pressure PE100 HDPE slurry lines, acid-resistant fluid transport, and dewatering mains.",
                image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop"
              },
              {
                title: "COMMERCIAL IRRIGATION",
                desc: "High-flow uPVC agricultural pressure pipes, centre-pivot feeds, and micro-drip networks.",
                image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=800&auto=format&fit=crop"
              },
              {
                title: "BOREHOLE CASINGS",
                desc: "Heavy-duty slotted and plain uPVC borehole casings engineered for secure subterranean water access.",
                image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop"
              },
              {
                title: "ELECTRICAL DUCTING",
                desc: "Rigid PVC electrical conduits and telecommunication cable protection duct banks.",
                image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop"
              },
              {
                title: "WATER HARVESTING & TANKS",
                desc: "Food-grade polyethylene water storage tanks and bulk rainwater harvesting reservoirs.",
                image: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?q=80&w=800&auto=format&fit=crop"
              }
            ].map((sector, idx) => (
              <div 
                key={idx}
                className="group relative h-96 overflow-hidden rounded-sm bg-neutral-900 border border-neutral-800 flex flex-col justify-end p-8 transition-all duration-500 hover:border-red-600"
              >
                {/* Background Image with Zoom on Hover */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <ImageWithFallback 
                    src={sector.image} 
                    alt={sector.title}
                    className="w-full h-full object-cover object-center group-hover:scale-115 transition-transform duration-700 opacity-60 group-hover:opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Inspect Button */}
                <button
                  onClick={() => openZoom(sector.image, sector.title, sector.desc, 'Industry Sector')}
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm text-white/80 hover:text-white hover:bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                  title="Inspect Image"
                >
                  <ZoomIn size={16} />
                </button>

                {/* Content */}
                <div className="relative z-10">
                  <div className="w-12 h-1 bg-red-600 mb-4 transform origin-left group-hover:scale-x-150 transition-transform duration-300" />
                  <h3 className="font-bold text-xl text-white mb-2 uppercase tracking-wide">
                    {sector.title}
                  </h3>
                  <p className="text-neutral-300 text-xs mb-6 line-clamp-2 leading-relaxed">
                    {sector.desc}
                  </p>
                  <a 
                    href="#products"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:text-red-500 transition-colors"
                  >
                    <span>View Matching Products</span>
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. PRODUCTS SECTION WITH FULLY RESPONSIVE SEARCH & FILTER HUB */}
      <section id="products" className="py-24 bg-neutral-50 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-red-600 font-bold text-xs uppercase tracking-widest block mb-2">
              Official Store & Price List
            </span>
            <ScrollRevealHeading 
              text="PRODUCTS & TRANSPARENT PRICING"
              highlightWords={['PRODUCTS', 'PRICING']}
              className="font-bold text-3xl sm:text-4xl uppercase tracking-tight text-black mb-4 justify-center"
            />
            <p className="text-neutral-600 text-sm">
              Explore our SANS-compliant piping portfolio with real-time USD pricing. Filter by category, application, or diameter, inspect technical drawings, and order online.
            </p>
          </div>

          {/* RESPONSIVE SEARCH AND FILTER TOOLBAR */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-neutral-200 shadow-sm mb-10 space-y-4">
            
            {/* Top row: Responsive Search Input + Sort Selection */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Responsive Search Input */}
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <input 
                  type="text" 
                  placeholder="Search by name, size (e.g. 110mm), application (irrigation, borehole, sewer)..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-neutral-50 border border-neutral-300 rounded-md text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                />
                {productSearch && (
                  <button 
                    onClick={() => setProductSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-1"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <SlidersHorizontal size={16} className="text-neutral-500 hidden sm:block" />
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider hidden sm:block">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto px-3 py-3 bg-neutral-50 border border-neutral-300 rounded-md text-xs font-semibold text-neutral-800 focus:outline-none focus:border-red-600"
                >
                  <option value="default">Featured / Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

            </div>

            {/* Bottom row: Category Filter Pills (Scrollable on mobile) */}
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 w-full md:w-auto scrollbar-none">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md whitespace-nowrap transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-red-600 text-white shadow-sm' 
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Results Count Badge */}
              <div className="text-xs text-neutral-500 font-medium">
                Showing <strong className="text-black">{displayedProducts.length}</strong> of {filteredProducts.length} piping systems
              </div>
            </div>

          </div>

          {/* Product Cards Grid with Zoom In Inspect & Order CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <div 
                key={product.id}
                className="group bg-white border border-neutral-200 rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-black relative"
              >
                <div>
                  {/* Product Image with Zoom on Hover & Lightbox Click */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    <ImageWithFallback 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                      onClick={() => openZoom(product.image, product.name, product.sizes, product.category)}
                    />
                    
                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm">
                      {product.category}
                    </div>

                    {/* Quick Zoom Trigger Button */}
                    <button
                      onClick={() => openZoom(product.image, product.name, product.sizes, product.category)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-neutral-800 hover:bg-red-600 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md cursor-pointer"
                      title="Inspect Product Drawing / Spec"
                    >
                      <ZoomIn size={15} />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-red-600 font-extrabold text-lg">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-semibold uppercase bg-neutral-100 px-2 py-0.5 rounded">
                        {product.unit}
                      </span>
                    </div>

                    <h3 
                      onClick={() => setSelectedProduct(product)}
                      className="font-bold text-sm text-black mb-2 uppercase group-hover:text-red-600 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {product.name}
                    </h3>

                    <p className="text-neutral-600 text-xs line-clamp-2 leading-relaxed mb-3">
                      {product.description}
                    </p>

                    <div className="text-[11px] text-neutral-500 font-medium mb-3">
                      <span className="font-bold text-neutral-700">Spec:</span> {product.sizes}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-5 pb-5 pt-0 flex gap-2">
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider rounded-sm transition-all text-center cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Eye size={13} />
                    <span>Specs</span>
                  </button>

                  <button 
                    onClick={() => addToCart(product)}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all text-center flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                  >
                    <ShoppingCart size={13} />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View More / Show Less Button */}
          {filteredProducts.length > 8 && (
            <div className="mt-12 text-center">
              <button
                onClick={() => {
                  if (showAllProducts) {
                    setShowAllProducts(false);
                    const el = document.getElementById('products');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setShowAllProducts(true);
                  }
                }}
                className="px-8 py-3.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-md border border-neutral-700 hover:border-neutral-500 transition-all shadow-md inline-flex items-center gap-2 cursor-pointer group"
              >
                <span>
                  {showAllProducts 
                    ? 'Show Less' 
                    : `View More (${filteredProducts.length - 8} more products)`
                  }
                </span>
                {showAllProducts ? (
                  <ChevronUp size={16} className="text-red-500 group-hover:-translate-y-0.5 transition-transform" />
                ) : (
                  <ChevronDown size={16} className="text-red-500 group-hover:translate-y-0.5 transition-transform" />
                )}
              </button>
            </div>
          )}

          {/* Empty Search State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-lg border border-neutral-200 p-8 max-w-lg mx-auto">
              <AlertCircle size={40} className="text-red-600 mx-auto mb-3" />
              <h3 className="font-bold text-base uppercase text-black mb-1">No Matching Products Found</h3>
              <p className="text-neutral-600 text-xs mb-6">
                We manufacture custom diameters and wall thicknesses upon request.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setProductSearch('');
                    setSelectedCategory('ALL');
                  }}
                  className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-black text-xs font-bold uppercase rounded-sm"
                >
                  Reset Filters
                </button>
                <a
                  href="#contact"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-sm"
                >
                  Request Custom Extrusion
                </a>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 9. PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white text-black w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-neutral-100 relative min-h-[300px] md:min-h-full">
                <ImageWithFallback 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-center"
                />
                
                <button
                  onClick={() => openZoom(selectedProduct.image, selectedProduct.name, selectedProduct.sizes, selectedProduct.category)}
                  className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-red-600 transition-colors"
                >
                  <ZoomIn size={14} />
                  <span>Inspect Drawing</span>
                </button>
              </div>

              <div className="p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
                      {selectedProduct.category} PIPING SYSTEM
                    </span>
                    <span className="text-2xl font-black text-black">
                      ${selectedProduct.price.toFixed(2)} <span className="text-xs text-neutral-500 font-normal">({selectedProduct.unit})</span>
                    </span>
                  </div>

                  <h2 className="font-bold text-2xl uppercase tracking-tight mb-4">
                    {selectedProduct.name}
                  </h2>

                  <p className="text-neutral-700 text-sm leading-relaxed mb-6">
                    {selectedProduct.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-2">Key Applications:</h4>
                    <ul className="space-y-1.5">
                      {selectedProduct.applications.map((app, idx) => (
                        <li key={idx} className="text-xs text-neutral-600 flex items-center gap-2">
                          <Check size={14} className="text-red-600 shrink-0" />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">Standard Sizes & Dimensions:</h4>
                    <p className="text-xs text-neutral-800 bg-neutral-100 p-3 rounded-md font-medium">
                      {selectedProduct.sizes}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">Compliance & Technical Standard:</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {selectedProduct.technicalInfo}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-200 flex gap-4">
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3.5 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-red-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart size={16} />
                    <span>Add To Cart & Order (${selectedProduct.price.toFixed(2)})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. PLANT, EXTRUSION & QUALITY LAB GALLERY */}
      <section id="facilities" className="py-24 bg-white text-black border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-red-600 font-bold text-xs uppercase tracking-widest block mb-2">
                Manufacturing Excellence
              </span>
              <ScrollRevealHeading 
                text="PLANT & TESTING FACILITIES"
                highlightWords={['PLANT', 'TESTING']}
                className="font-bold text-3xl sm:text-4xl uppercase tracking-tight text-black"
              />
            </div>
            <p className="text-neutral-600 max-w-md mt-4 md:mt-0 text-sm leading-relaxed">
              Equipped with German-engineered extrusion technologies, continuous ultrasonic wall-gauge monitoring, and an accredited laboratory testing every batch to SANS standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac) => {
              const FacIcon = fac.icon;
              return (
                <div 
                  key={fac.id}
                  onClick={() => openZoom(fac.image, fac.title, fac.description, fac.tag)}
                  className="group relative bg-neutral-900 rounded-lg overflow-hidden border border-neutral-200 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageWithFallback 
                      src={fac.image} 
                      alt={fac.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-sm inline-flex items-center gap-1.5 shadow-sm">
                      <FacIcon size={12} className="shrink-0" />
                      <span>{fac.tag}</span>
                    </div>

                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn size={14} />
                    </div>
                  </div>

                  <div className="p-5 bg-neutral-900 text-white">
                    <h3 className="font-bold text-base uppercase mb-2 group-hover:text-red-500 transition-colors flex items-center gap-2">
                      <FacIcon size={16} className="text-red-500 shrink-0" />
                      <span>{fac.title}</span>
                    </h3>
                    <p className="text-neutral-400 text-xs line-clamp-3 leading-relaxed">
                      {fac.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 11. WHY PROPLASTICS (CORE PILLARS) */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-red-600 font-bold text-xs uppercase tracking-widest block mb-2">Our Core Pillars</span>
            <ScrollRevealHeading 
              text="WHY PROPLASTICS?"
              highlightWords={['PROPLASTICS']}
              className="font-bold text-3xl sm:text-4xl uppercase tracking-tight text-white mb-4 justify-center"
            />
            <p className="text-neutral-400 text-sm">
              The premier choice for civil contractors, mining houses, municipal councils, and commercial farms across Southern Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "QUALITY STANDARDS",
                desc: "Strict compliance with SANS 966, SANS 791, and ISO 9001:2015, validated by continuous laboratory burst testing.",
                icon: ShieldCheck
              },
              {
                title: "UNMATCHED RELIABILITY",
                desc: "Heavy-duty piping systems formulated with virgin polymers to deliver 50+ years of uninterrupted performance.",
                icon: Award
              },
              {
                title: "50+ YEARS EXPERIENCE",
                desc: "Half a century of polymer manufacturing leadership, technical expertise, and local Zimbabwean industrial pride.",
                icon: Factory
              },
              {
                title: "INNOVATION & ECO-DESIGN",
                desc: "Continuous investments in German extrusion lines, precision corrugation, and zero-waste recycling practices.",
                icon: Sparkles
              }
            ].map((pillar, idx) => {
              const IconComponent = pillar.icon;
              return (
                <div 
                  key={idx}
                  className="p-8 bg-neutral-900 border border-neutral-800 rounded-sm hover:border-red-600 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-red-600/10 rounded-sm flex items-center justify-center text-red-600 mb-6 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <IconComponent size={28} />
                  </div>
                  <h3 className="font-bold text-lg uppercase mb-3 text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 12. PROJECTS SECTION */}
      <section id="projects" className="py-24 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-red-600 font-bold text-xs uppercase tracking-widest block mb-2">Track Record</span>
              <ScrollRevealHeading 
                text="OUR PROVEN PROJECTS"
                highlightWords={['PROVEN', 'PROJECTS']}
                className="font-bold text-3xl sm:text-4xl uppercase tracking-tight text-black"
              />
            </div>
            
            {/* Carousel Controls */}
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button 
                onClick={() => setCurrentProjectIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1))}
                className="w-12 h-12 rounded-full border border-neutral-300 hover:bg-black hover:text-white hover:border-black flex items-center justify-center transition-all cursor-pointer"
                aria-label="Previous project"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setCurrentProjectIndex((prev) => (prev + 1) % projects.length)}
                className="w-12 h-12 rounded-full border border-neutral-300 hover:bg-black hover:text-white hover:border-black flex items-center justify-center transition-all cursor-pointer"
                aria-label="Next project"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Active Project Card with Zoom Lightbox Support */}
          <div className="bg-neutral-900 text-white rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-2xl">
            <div 
              className="relative min-h-[350px] lg:min-h-[450px] cursor-pointer group"
              onClick={() => openZoom(projects[currentProjectIndex].image, projects[currentProjectIndex].name, projects[currentProjectIndex].location, projects[currentProjectIndex].industry)}
            >
              <ImageWithFallback 
                src={projects[currentProjectIndex].image} 
                alt={projects[currentProjectIndex].name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-red-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-sm shadow-md">
                {projects[currentProjectIndex].industry}
              </div>

              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 group-hover:bg-red-600 transition-colors">
                <ZoomIn size={14} />
                <span>Zoom Photo</span>
              </div>
            </div>

            <div className="p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-red-500 font-bold block mb-2">
                  {projects[currentProjectIndex].location}
                </span>
                <h3 className="font-bold text-2xl sm:text-3xl uppercase tracking-tight mb-6">
                  {projects[currentProjectIndex].name}
                </h3>
                <p className="text-neutral-300 text-sm leading-relaxed mb-8">
                  {projects[currentProjectIndex].description}
                </p>

                <div className="bg-neutral-800 p-4 rounded-md border-l-4 border-red-600 mb-8">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Products Supplied:</span>
                  <span className="font-semibold text-sm text-white">{projects[currentProjectIndex].products}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-neutral-800">
                <span className="text-xs text-neutral-400 font-medium">
                  Project {currentProjectIndex + 1} of {projects.length}
                </span>
                <a 
                  href="#contact"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:text-white transition-colors"
                >
                  <span>Inquire Similar Project Specifications</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 13. RESOURCES SECTION */}
      <section id="resources" className="py-24 bg-neutral-50 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-red-600 font-bold text-xs uppercase tracking-widest block mb-2">Technical Documentation</span>
            <ScrollRevealHeading 
              text="DOWNLOAD RESOURCES & GUIDES"
              highlightWords={['RESOURCES', 'GUIDES']}
              className="font-bold text-3xl sm:text-4xl uppercase tracking-tight text-black mb-4 justify-center"
            />
            <p className="text-neutral-600 text-sm">
              Download product catalogues, pipe wall thickness charts, installation manuals, and corporate reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div 
                key={res.id}
                className="bg-white border border-neutral-200 p-6 rounded-md flex items-start justify-between gap-4 hover:border-black transition-all group shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-600/10 rounded-sm flex items-center justify-center text-red-600 shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      {res.category} · {res.type} ({res.size})
                    </span>
                    <h3 className="font-bold text-sm text-black group-hover:text-red-600 transition-colors uppercase leading-snug">
                      {res.title}
                    </h3>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Downloading official document: ${res.title}`)}
                  className="p-2.5 bg-neutral-100 hover:bg-red-600 hover:text-white rounded-sm text-neutral-700 transition-colors shrink-0 cursor-pointer"
                  aria-label={`Download ${res.title}`}
                >
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 14. INVESTOR CENTRE */}
      <section id="investors" className="py-24 bg-white text-black border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-red-600 font-bold text-xs uppercase tracking-widest block mb-2">Shareholder Relations</span>
            <ScrollRevealHeading 
              text="INVESTOR CENTRE & GOVERNANCE"
              highlightWords={['INVESTOR', 'GOVERNANCE']}
              className="font-bold text-3xl sm:text-4xl uppercase tracking-tight text-black mb-4 justify-center"
            />
            <p className="text-neutral-600 text-sm">
              Financial reporting, governance frameworks, and ZSE stock exchange disclosures for Proplastics Limited.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Company Information",
                desc: "Board of directors, corporate history, executive leadership, and modern extrusion capacity.",
                tag: "Governance"
              },
              {
                title: "Financial Statements",
                desc: "Audited annual accounts, half-year interim results, and certified statements of financial position.",
                tag: "Financials"
              },
              {
                title: "Annual Reports",
                desc: "Comprehensive yearly operational reports detailing SADC expansion, ESG impact, and dividends.",
                tag: "Reports"
              },
              {
                title: "Shareholder Information",
                desc: "Dividend declaration notices, AGM circulars, and transfer secretarial instructions.",
                tag: "Shareholders"
              },
              {
                title: "Corporate Governance",
                desc: "Board charters, code of ethics, health & safety policies, and sustainability frameworks.",
                tag: "Compliance"
              },
              {
                title: "Zimbabwe Stock Exchange",
                desc: "Real-time market valuation, share trading volume updates, and corporate actions. (ZSE: PROL)",
                tag: "ZSE: PROL"
              }
            ].map((inv, idx) => (
              <div 
                key={idx}
                className="bg-neutral-50 border border-neutral-200 p-8 rounded-md hover:border-black transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-2.5 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-sm mb-4">
                    {inv.tag}
                  </span>
                  <h3 className="font-bold text-lg uppercase mb-3 text-black">
                    {inv.title}
                  </h3>
                  <p className="text-neutral-600 text-xs leading-relaxed mb-6">
                    {inv.desc}
                  </p>
                </div>

                <button 
                  onClick={() => alert(`Accessing documentation for: ${inv.title}`)}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:text-black transition-colors cursor-pointer"
                >
                  <span>View Disclosures</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 15. MEDIA & NEWS */}
      <section id="media" className="py-24 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-red-600 font-bold text-xs uppercase tracking-widest block mb-2">Press Releases</span>
              <ScrollRevealHeading 
                text="NEWS & UPDATES"
                highlightWords={['NEWS']}
                className="font-bold text-3xl sm:text-4xl uppercase tracking-tight text-white"
              />
            </div>
            <a 
              href="#contact"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:text-white transition-colors mt-4 md:mt-0"
            >
              <span>Media Enquiries</span>
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsList.map((news) => (
              <div 
                key={news.id}
                className="bg-black border border-neutral-800 rounded-lg overflow-hidden flex flex-col justify-between group hover:border-red-600 transition-all duration-300"
              >
                <div>
                  <div 
                    className="relative aspect-[16/9] overflow-hidden cursor-pointer"
                    onClick={() => openZoom(news.image, news.title, news.date, news.category)}
                  >
                    <ImageWithFallback 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm">
                      {news.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] text-neutral-400 font-medium block mb-2">
                      {news.date}
                    </span>
                    <h3 className="font-bold text-base text-white mb-3 uppercase group-hover:text-red-500 transition-colors leading-snug">
                      {news.title}
                    </h3>
                    <p className="text-neutral-400 text-xs leading-relaxed mb-6">
                      {news.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <button 
                    onClick={() => alert(`Opening press release: ${news.title}`)}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 16. CONTACT SECTION */}
      <section id="contact" className="py-24 bg-black text-white border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-red-600 font-bold text-xs uppercase tracking-widest block mb-2">Direct Factory Enquiries</span>
            <ScrollRevealHeading 
              text="LET'S BUILD SOMETHING THAT LASTS."
              highlightWords={['LASTS.']}
              className="font-bold text-3xl sm:text-4xl uppercase tracking-tight text-white mb-4 justify-center"
            />
            <p className="text-neutral-400 text-sm">
              Get in touch with our sales engineers, request tenders, or visit our manufacturing plants in Harare and Bulawayo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Details & Regional Branches */}
            <div>
              <h3 className="font-bold text-2xl uppercase mb-6 text-white">Contact Information</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-600/10 rounded-sm flex items-center justify-center text-red-600 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <strong className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Head Office & Plant</strong>
                    <p className="text-sm text-neutral-200">Tilbury Road, Willowvale, Harare, Zimbabwe</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-600/10 rounded-sm flex items-center justify-center text-red-600 shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <strong className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Telephone Hotline</strong>
                    <p className="text-sm text-neutral-200">+263 242 621 661-5 / +263 772 133 000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-600/10 rounded-sm flex items-center justify-center text-red-600 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <strong className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Email Orders & Tenders</strong>
                    <p className="text-sm text-neutral-200">sales@proplastics.co.zw</p>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-xl uppercase mb-4 text-white">Regional Depots</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-md">
                  <strong className="block font-bold text-sm text-white mb-1">Harare Main Depot</strong>
                  <p className="text-xs text-neutral-400">Tilbury Road, Willowvale Industrial Area</p>
                </div>
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-md">
                  <strong className="block font-bold text-sm text-white mb-1">Bulawayo Branch</strong>
                  <p className="text-xs text-neutral-400">Bell Street, Belmont Industrial Area</p>
                </div>
              </div>
            </div>

            {/* Quick Enquiry Form */}
            <div className="bg-neutral-900 p-8 sm:p-10 rounded-lg border border-neutral-800">
              <h3 className="font-bold text-2xl uppercase mb-6 text-white">Send An Enquiry</h3>
              
              {contactSubmitted ? (
                <div className="py-16 text-center">
                  <CheckCircle2 size={56} className="text-red-600 mx-auto mb-4 animate-bounce" />
                  <h4 className="font-bold text-2xl mb-2 text-white">Enquiry Received</h4>
                  <p className="text-xs text-neutral-400">Thank you for reaching out. A Proplastics sales engineer will review your request and get back to you promptly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-red-600"
                        placeholder="John Moyo"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Company / Project</label>
                      <input 
                        type="text" 
                        value={contactForm.company}
                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-red-600"
                        placeholder="Enterprise Ltd"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Email</label>
                      <input 
                        type="email" 
                        required 
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-red-600"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Phone</label>
                      <input 
                        type="tel" 
                        required 
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-red-600"
                        placeholder="+263 77 ..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Subject / Product Required</label>
                    <input 
                      type="text" 
                      required 
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-red-600"
                      placeholder="e.g. Quotation for 110mm PVC Pressure Pipes (500m)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">Message Details</label>
                    <textarea 
                      rows={4} 
                      required 
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-red-600"
                      placeholder="Specify required quantities, delivery location, pipe classes, or project deadlines..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3.5 bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-md hover:bg-red-700 transition-all shadow-md cursor-pointer"
                  >
                    Send Official Enquiry
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 17. CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="bg-white text-black w-full max-w-md h-full flex flex-col justify-between shadow-2xl">
            
            {/* Cart Header */}
            <div className="p-6 bg-black text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart size={22} className="text-red-500" />
                <h3 className="font-bold text-lg uppercase tracking-wider">Online Order Cart</h3>
              </div>
              <button 
                onClick={() => setCartOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingCart size={48} className="text-neutral-300 mx-auto mb-4" />
                  <p className="font-bold text-neutral-700 mb-1">Your cart is empty</p>
                  <p className="text-xs text-neutral-500">Explore our product catalogue and add items to place your order.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between gap-4 p-4 bg-neutral-50 border border-neutral-200 rounded-md">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-sm shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-black uppercase truncate">{item.product.name}</h4>
                      <p className="text-xs text-red-600 font-bold mt-0.5">
                        ${item.product.price.toFixed(2)} <span className="text-[10px] text-neutral-500">({item.product.unit})</span>
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <button 
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 bg-neutral-200 hover:bg-neutral-300 rounded flex items-center justify-center text-black cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 bg-neutral-200 hover:bg-neutral-300 rounded flex items-center justify-center text-black cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-neutral-400 hover:text-red-600 p-2 cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-neutral-100 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold uppercase text-neutral-700">Order Subtotal:</span>
                  <span className="text-xl font-black text-black">${cartTotal.toFixed(2)} USD</span>
                </div>
                <button 
                  onClick={() => {
                    setCartOpen(false);
                    setCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-md transition-all text-center cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 18. CHECKOUT MODAL */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-black w-full max-w-xl p-8 rounded-lg shadow-2xl relative my-8">
            <button 
              onClick={() => setCheckoutOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-black cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="font-bold text-2xl uppercase mb-1">Online Order Checkout</h3>
            <p className="text-xs text-neutral-600 mb-6">Complete your site delivery details to place your order with Proplastics.</p>

            {orderComplete ? (
              <div className="py-12 text-center">
                <CheckCircle2 size={56} className="text-red-600 mx-auto mb-4 animate-bounce" />
                <h4 className="font-bold text-2xl mb-2 text-black">Order Placed Successfully!</h4>
                <p className="text-xs text-neutral-600 mb-4">
                  Your reference is #PR-{Math.floor(100000 + Math.random() * 900000)}. Our Harare dispatch center will contact you promptly to finalize delivery logistics.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:border-red-600"
                      placeholder="John Moyo"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Company / Project Name</label>
                    <input 
                      type="text" 
                      value={checkoutForm.company}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, company: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:border-red-600"
                      placeholder="Enterprise Ltd"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:border-red-600"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:border-red-600"
                      placeholder="+263 77 ..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Delivery Address or Depot Collection</label>
                  <textarea 
                    rows={2} 
                    required 
                    value={checkoutForm.address}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:border-red-600"
                    placeholder="Enter site address or specify Harare / Bulawayo branch collection..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Order Notes (Optional)</label>
                  <input 
                    type="text" 
                    value={checkoutForm.notes}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:border-red-600"
                    placeholder="Any specific delivery timelines, offloading instructions, or pressure classes..."
                  />
                </div>

                {/* Summary box */}
                <div className="bg-neutral-100 p-4 rounded-md border border-neutral-200">
                  <div className="flex items-center justify-between text-xs font-bold uppercase text-neutral-700 mb-1">
                    <span>Items ({totalItemsCount}):</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase text-black pt-2 border-t border-neutral-300">
                    <span>Total Order Amount:</span>
                    <span className="text-red-600 text-base font-black">${cartTotal.toFixed(2)} USD</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      setCheckoutOpen(false);
                      setCartOpen(true);
                    }}
                    className="px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-black text-xs font-bold uppercase rounded-md cursor-pointer"
                  >
                    Back to Cart
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-md transition-all text-center cursor-pointer"
                  >
                    Confirm & Place Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 19. FOOTER */}
      <footer className="bg-black text-neutral-400 border-t border-neutral-900 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Logo className="h-12" variant="dark" />
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6 max-w-sm">
                Zimbabwe's premier manufacturer of high-quality plastic piping systems, water infrastructure solutions, borehole casings, and industrial conduits. Built to last in Africa.
              </p>
              <div className="flex items-center gap-4">
                <a href="#contact" className="w-9 h-9 bg-neutral-900 hover:bg-red-600 text-white rounded-md flex items-center justify-center transition-colors">
                  <Globe size={18} />
                </a>
                <a href="#contact" className="w-9 h-9 bg-neutral-900 hover:bg-red-600 text-white rounded-md flex items-center justify-center transition-colors">
                  <Phone size={18} />
                </a>
                <a href="#contact" className="w-9 h-9 bg-neutral-900 hover:bg-red-600 text-white rounded-md flex items-center justify-center transition-colors">
                  <Mail size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Navigation</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#home" className="hover:text-red-500 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-red-500 transition-colors">About Us</a></li>
                <li><a href="#products" className="hover:text-red-500 transition-colors">Products & Prices</a></li>
                <li><a href="#facilities" className="hover:text-red-500 transition-colors">Testing & Plant</a></li>
                <li><a href="#resources" className="hover:text-red-500 transition-colors">Resources</a></li>
                <li><a href="#investors" className="hover:text-red-500 transition-colors">Investor Centre</a></li>
              </ul>
            </div>

            {/* Products Links */}
            <div>
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Core Products</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#products" className="hover:text-red-500 transition-colors">uPVC Pressure Pipes</a></li>
                <li><a href="#products" className="hover:text-red-500 transition-colors">HDPE PE100 Pipes</a></li>
                <li><a href="#products" className="hover:text-red-500 transition-colors">Borehole Casings</a></li>
                <li><a href="#products" className="hover:text-red-500 transition-colors">Sewer & Drainage</a></li>
                <li><a href="#products" className="hover:text-red-500 transition-colors">Water Storage Tanks</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Support & Branches</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#contact" className="hover:text-red-500 transition-colors">Harare Sales Depot</a></li>
                <li><a href="#contact" className="hover:text-red-500 transition-colors">Bulawayo Depot</a></li>
                <li><a href="#resources" className="hover:text-red-500 transition-colors">Technical Guides</a></li>
                <li><a href="#contact" className="hover:text-red-500 transition-colors">Request Tender Quote</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500">
            <p>© 2026 Proplastics Limited. All Rights Reserved. Zimbabwe Stock Exchange listed.</p>
            <div className="flex items-center gap-6 mt-4 sm:mt-0">
              <span className="text-neutral-400">ISO 9001:2015</span>
              <span className="text-neutral-400">SANS 966 & 791</span>
              <a href="#contact" className="hover:text-white transition-colors">Terms of Trade</a>
            </div>
          </div>

        </div>
      </footer>

      {/* 20. FLOATING CHAT WIDGET */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button 
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-3 px-5 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group cursor-pointer"
            aria-label="Open customer support chat"
          >
            <MessageSquare size={22} className="text-white animate-pulse" />
            <span className="font-bold text-xs uppercase tracking-wider">LIVE CHAT</span>
          </button>
        ) : (
          <div className="bg-white text-black w-80 sm:w-96 rounded-lg shadow-2xl border border-neutral-300 overflow-hidden flex flex-col max-h-[550px] animate-in fade-in duration-200">
            
            {/* Chat Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                <span className="font-bold text-sm uppercase">Proplastics Live Help</span>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-neutral-50">
              
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                  P
                </div>
                <div className="bg-white border border-neutral-200 p-3 rounded-lg text-xs text-neutral-800 shadow-sm max-w-[80%]">
                  <p className="font-bold text-black mb-1">Proplastics Technical Desk</p>
                  <p>Welcome! How can we assist you today with product dimensions, pricing, or ordering?</p>
                </div>
              </div>

              {chatStep === 'menu' && (
                <div className="space-y-2 pl-11">
                  <p className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">Select a Topic:</p>
                  {[
                    'Product Catalog & USD Pricing',
                    'Online Order Assistance',
                    'Pipe Technical Standards (SANS)',
                    'Harare & Bulawayo Branch Inquiries',
                    'Custom Extrusion Quote'
                  ].map((option, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setChatTopic(option);
                        setChatStep('form');
                      }}
                      className="w-full text-left px-3 py-2 bg-white hover:bg-red-600 hover:text-white border border-neutral-200 rounded-md text-xs font-semibold transition-colors shadow-sm flex items-center justify-between group cursor-pointer"
                    >
                      <span>{option}</span>
                      <ArrowRight size={14} className="text-red-600 group-hover:text-white" />
                    </button>
                  ))}
                </div>
              )}

              {chatStep === 'form' && (
                <div className="pl-11 space-y-3">
                  <div className="bg-red-50 border border-red-200 p-2.5 rounded-md text-xs text-red-800">
                    Topic: <strong>{chatTopic}</strong>
                  </div>
                  <form onSubmit={handleChatSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">Name</label>
                      <input 
                        type="text" 
                        required 
                        value={chatForm.name}
                        onChange={(e) => setChatForm({ ...chatForm, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-md text-xs focus:outline-none focus:border-red-600"
                        placeholder="John Moyo"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">Contact (Phone/Email)</label>
                      <input 
                        type="text" 
                        required 
                        value={chatForm.contact}
                        onChange={(e) => setChatForm({ ...chatForm, contact: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-md text-xs focus:outline-none focus:border-red-600"
                        placeholder="+263 77 ... / email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">Message</label>
                      <textarea 
                        rows={2} 
                        required 
                        value={chatForm.message}
                        onChange={(e) => setChatForm({ ...chatForm, message: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-md text-xs focus:outline-none focus:border-red-600"
                        placeholder="Describe your requirement..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setChatStep('menu')}
                        className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-black text-xs font-bold rounded-md cursor-pointer"
                      >
                        Back
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-md shadow-sm cursor-pointer"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {chatStep === 'success' && (
                <div className="pl-11 py-6 text-center">
                  <CheckCircle2 size={36} className="text-red-600 mx-auto mb-2 animate-bounce" />
                  <p className="font-bold text-sm text-black">Message Received!</p>
                  <p className="text-xs text-neutral-600 mt-1">A Proplastics representative will contact you shortly.</p>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* 21. INTERACTIVE IMAGE ZOOM MODAL (LIGHTBOX) */}
      <ImageZoomModal 
        isOpen={zoomModal.isOpen}
        onClose={() => setZoomModal({ ...zoomModal, isOpen: false })}
        imageUrl={zoomModal.imageUrl}
        title={zoomModal.title}
        subtitle={zoomModal.subtitle}
        badge={zoomModal.badge}
      />

    </div>
  );
}
