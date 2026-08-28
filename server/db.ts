import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  alt: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  price?: number;
  material: string;
  dimensions: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'vimeo' | 'mp4';
  status: 'Published' | 'Draft' | 'Archived';
  featured: boolean;
  badge?: 'Unggulan' | 'Terlaris' | 'Baru' | 'Edisi Terbatas';
  sortOrder: number;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  openingHours: string;
  googleMapsUrl: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  whatsapp: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  workingHours: string;
  updatedAt: string;
}

export interface PageContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroBadgeText: string;
  heroImageUrl: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutDescription: string;
  aboutVision: string;
  aboutMission: string;
  aboutValues: string[];
  aboutFoundedYear: string;
  aboutImageUrl: string;
  aboutStoryImageUrl: string;
  philosophyTitle: string;
  philosophyDescription: string;
  whyChooseUs: {
    title: string;
    description: string;
    icon: string;
  }[];
  updatedAt: string;
}

export interface DatabaseSchema {
  users: AdminUser[];
  categories: Category[];
  products: Product[];
  branches: Branch[];
  gallery: GalleryItem[];
  siteSettings: SiteSettings;
  pageContent: PageContent;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

function ensureDbExists(): void {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

export function getDb(): DatabaseSchema {
  ensureDbExists();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as DatabaseSchema;
  } catch (error) {
    console.error('Error reading DB, re-initializing seed data:', error);
    const initialData = getInitialSeedData();
    saveDb(initialData);
    return initialData;
  }
}

export function saveDb(data: DatabaseSchema): void {
  ensureDbExists();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getInitialSeedData(): DatabaseSchema {
  // Demo password: ChangeMe123!
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('ChangeMe123!', salt);

  const categories: Category[] = [
    {
      id: 'cat-1',
      name: 'Gantungan Kunci',
      slug: 'gantungan-kunci',
      description: 'Aksesoris gantungan kunci wayang tatah sungging halus & kuningan premium.',
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
      sortOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cat-2',
      name: 'Pajangan Meja',
      slug: 'pajangan-meja',
      description: 'Miniatur wayang dengan tatakan kayu jati berukir untuk meja kerja & ruang tamu.',
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
      sortOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cat-3',
      name: 'Pajangan Dinding',
      slug: 'pajangan-dinding',
      description: 'Hiasan dinding motif wayang dan gunungan dalam bingkai kaca premium.',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      sortOrder: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cat-4',
      name: 'Miniatur Wayang',
      slug: 'miniatur-wayang',
      description: 'Wayang kulit asli dan akrilik ukuran portabel dengan detail tatah presisi.',
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      sortOrder: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cat-5',
      name: 'Souvenir & Cendera Mata',
      slug: 'souvenir',
      description: 'Paket souvenir pernikahan, gathering kantor, dan acara formal bernuansa Jawa.',
      imageUrl: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=600&q=80',
      sortOrder: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cat-6',
      name: 'Dekorasi & Kerajinan',
      slug: 'dekorasi',
      description: 'Dekorasi rumah, hiasan kayu motif batik, dan pernak-pernik interior khas Nusantara.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      sortOrder: 6,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const products: Product[] = [
    {
      id: 'prod-1',
      name: 'Gantungan Kunci Wayang Arjuna',
      slug: 'gantungan-kunci-wayang-arjuna',
      sku: 'NW-GK-ARJ-01',
      categoryId: 'cat-1',
      shortDescription: 'Gantungan kunci logam kuningan lapis emas antik dengan figur Arjuna ksatria Pandawa.',
      description: 'Gantungan kunci eksklusif berbentuk tokoh pewayangan Arjuna yang melambangkan kelembutan hati, ketampanan budi pekerti, dan ketangkasan ksatria. Dibuat dari paduan kuningan tebal dengan teknik finishing antik emas doff yang tahan karat dan nyaman digenggam.',
      price: 45000,
      material: 'Kuningan Antik & Gantungan Ring Baja Tahan Karat',
      dimensions: '8.5 cm x 3.2 cm (Tebal 2.5 mm)',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoType: 'youtube',
      status: 'Published',
      featured: true,
      badge: 'Terlaris',
      sortOrder: 1,
      images: [
        {
          id: 'img-1-1',
          imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
          alt: 'Gantungan Kunci Wayang Arjuna Tampak Depan',
          sortOrder: 1,
        },
        {
          id: 'img-1-2',
          imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
          alt: 'Detail Ukiran Logam Kuningan Wayang Arjuna',
          sortOrder: 2,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-2',
      name: 'Gantungan Kunci Wayang Gatotkaca',
      slug: 'gantungan-kunci-wayang-gatotkaca',
      sku: 'NW-GK-GTK-02',
      categoryId: 'cat-1',
      shortDescription: 'Gantungan kunci figur Gatotkaca Ksatria Pringgandani dengan ornamen sayap khas.',
      description: 'Simbol kekuatan, loyalitas, dan keberanian "Otot Kawat Tulang Besi". Dibuat secara presisi dengan tatahan ornamen sayap dan mahkota Gatotkaca. Dilengkapi ring gantungan kuat berputar 360 derajat.',
      price: 45000,
      material: 'Kuningan Lapis Krom Perunggu & Ring Putar',
      dimensions: '9.0 cm x 3.5 cm (Tebal 2.5 mm)',
      status: 'Published',
      featured: true,
      badge: 'Unggulan',
      sortOrder: 2,
      images: [
        {
          id: 'img-2-1',
          imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
          alt: 'Gantungan Kunci Wayang Gatotkaca',
          sortOrder: 1,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-3',
      name: 'Gantungan Kunci Wayang Semar',
      slug: 'gantungan-kunci-wayang-semar',
      sku: 'NW-GK-SMR-03',
      categoryId: 'cat-1',
      shortDescription: 'Gantungan kunci tokoh Semar Badranaya perlambang kearifan, kerendahan hati, dan ketenteraman.',
      description: 'Karakter punakawan yang paling dihormati dalam kebudayaan Jawa. Menghadirkan energi positif, ketenteraman batin, dan kehangatan persaudaraan. Sangat cocok sebagai cinderamata bagi kolega terkasih.',
      price: 45000,
      material: 'Kulit Sapi Asli & Logam Pewter',
      dimensions: '8.0 cm x 4.0 cm',
      status: 'Published',
      featured: false,
      badge: 'Baru',
      sortOrder: 3,
      images: [
        {
          id: 'img-3-1',
          imageUrl: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=800&q=80',
          alt: 'Gantungan Kunci Wayang Semar',
          sortOrder: 1,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-4',
      name: 'Pajangan Meja Wayang Rama & Shinta',
      slug: 'pajangan-meja-wayang-rama-shinta',
      sku: 'NW-PM-RMS-04',
      categoryId: 'cat-2',
      shortDescription: 'Sepasang figur Rama dan Shinta berbahan kuningan tempa di atas dudukan kayu jati perhutani.',
      description: 'Pajangan meja artistik berpasangan Rama dan Shinta yang melambangkan kesetiaan, keharmonisan, dan cinta sejati. Dilapisi cat anti-kusam dengan finishing satin gold. Berdiri kokoh di atas balok kayu jati solid dengan grafir laser motif parang.',
      price: 285000,
      material: 'Kuningan Solid Finishing Satin Gold + Dudukan Kayu Jati Perhutani',
      dimensions: '22 cm x 18 cm x 6 cm (Tinggi 24 cm)',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoType: 'youtube',
      status: 'Published',
      featured: true,
      badge: 'Unggulan',
      sortOrder: 4,
      images: [
        {
          id: 'img-4-1',
          imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
          alt: 'Pajangan Meja Rama dan Shinta',
          sortOrder: 1,
        },
        {
          id: 'img-4-2',
          imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
          alt: 'Detail Dudukan Kayu Jati Motif Parang',
          sortOrder: 2,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-5',
      name: 'Pajangan Meja Wayang Arjuna Premium',
      slug: 'pajangan-meja-wayang-arjuna-premium',
      sku: 'NW-PM-ARJ-05',
      categoryId: 'cat-2',
      shortDescription: 'Pajangan meja mewah figur Arjuna berbusana ageng dengan detail tatah wayang klasik.',
      description: 'Karya seni meja yang dirancang untuk mempercantik meja direksi, ruang resepsionis, atau credenza rumah. Dikerjakan oleh pengrajin ahli dari Kotagede dengan ketelitian tinggi pada mahkota dan busana ksatria.',
      price: 195000,
      material: 'Campuran Tembaga & Kuningan + Alas Kayu Sonokeling',
      dimensions: '18 cm x 12 cm x 5 cm (Tinggi 20 cm)',
      status: 'Published',
      featured: false,
      badge: 'Edisi Terbatas',
      sortOrder: 5,
      images: [
        {
          id: 'img-5-1',
          imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80',
          alt: 'Pajangan Meja Arjuna Toko Nusantara Wayang',
          sortOrder: 1,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-6',
      name: 'Pajangan Dinding Wayang Gatotkaca Bingkai Kayu',
      slug: 'pajangan-dinding-wayang-gatotkaca',
      sku: 'NW-PD-GTK-06',
      categoryId: 'cat-3',
      shortDescription: 'Karya wayang kulit tatah sungging Gatotkaca dalam bingkai kayu natural dengan pelindung kaca.',
      description: 'Pajangan dinding berukuran sedang yang memadukan wayang kulit asli bertatah halus warna prada emas dengan pigura kayu mahoni natural. Sangat pas untuk menghiasi dinding koridor, ruang tamu, atau foyer kantor.',
      price: 380000,
      material: 'Kulit Kerbau Asli, Sungging Prada Emas, Pigura Mahoni & Kaca Anti-Silau',
      dimensions: '45 cm x 35 cm x 3 cm',
      status: 'Published',
      featured: true,
      badge: 'Terlaris',
      sortOrder: 6,
      images: [
        {
          id: 'img-6-1',
          imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
          alt: 'Pajangan Dinding Gatotkaca Frame Kayu',
          sortOrder: 1,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-7',
      name: 'Pajangan Dinding Motif Gunungan Kayu Jati',
      slug: 'pajangan-dinding-motif-gunungan',
      sku: 'NW-PD-GNN-07',
      categoryId: 'cat-3',
      shortDescription: 'Plakat dinding ukir Gunungan Kayon Jawa yang melambangkan alam semesta dan kehidupan.',
      description: 'Gunungan atau Kayon adalah simbol permulaan dan penutup dalam pagelaran wayang, melambangkan pohon hayat (Kalpataru) dan keharmonisan jagad cilik dan jagad gede. Dibuat dengan teknik ukir tembus (kerawang) pada kayu jati pilihan.',
      price: 490000,
      material: 'Kayu Jati Solid dengan Finishing Natural Teak Oil',
      dimensions: '50 cm x 32 cm x 2.5 cm',
      status: 'Published',
      featured: true,
      badge: 'Unggulan',
      sortOrder: 7,
      images: [
        {
          id: 'img-7-1',
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          alt: 'Pajangan Dinding Gunungan Kayu Jati',
          sortOrder: 1,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-8',
      name: 'Miniatur Wayang Kulit Koleksi Pandawa Lima',
      slug: 'miniatur-wayang-kulit-pandawa-lima',
      sku: 'NW-MW-PDW-08',
      categoryId: 'cat-4',
      shortDescription: 'Satu set 5 miniatur wayang kulit Pandawa (Yudhistira, Bima, Arjuna, Nakula, Sadewa).',
      description: 'Set lengkap miniatur wayang kulit mini tokoh Pandawa Lima berukuran 15 cm. Disertai gapit bambu petung halus dan wadah kotak kayu motif batik eksklusif. Pilihan utama untuk cinderamata kenegaraan atau koleksi pribadi berharga.',
      price: 650000,
      material: 'Kulit Sapi Tatah Sungging Asli + Gapit Bambu + Box Kayu Batik',
      dimensions: 'Tinggi wayang 15-18 cm (Box: 30 cm x 20 cm x 6 cm)',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoType: 'youtube',
      status: 'Published',
      featured: true,
      badge: 'Unggulan',
      sortOrder: 8,
      images: [
        {
          id: 'img-8-1',
          imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
          alt: 'Set Miniatur Wayang Kulit Pandawa Lima',
          sortOrder: 1,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-9',
      name: 'Miniatur Gunungan Jawa Berdiri Akrilik Emas',
      slug: 'miniatur-gunungan-jawa-akrilik-emas',
      sku: 'NW-MW-GNN-09',
      categoryId: 'cat-4',
      shortDescription: 'Plakat miniatur Gunungan Jawa dengan pelapisan foil emas dalam bingkai akrilik bening.',
      description: 'Sentuhan modern pada simbol tradisional Jawa. Kombinasi akrilik bening tebal 8mm dengan teknik printing foil emas timbul berpresisi tinggi. Menampilkan detail ukiran gapura, pohon hayat, dan hewan-hewan rimba secara elok.',
      price: 165000,
      material: 'Akrilik Bening Kristal & Hot Stamping Gold Foil',
      dimensions: '16 cm x 10 cm x 3 cm',
      status: 'Published',
      featured: false,
      badge: 'Baru',
      sortOrder: 9,
      images: [
        {
          id: 'img-9-1',
          imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
          alt: 'Miniatur Gunungan Akrilik Emas',
          sortOrder: 1,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-10',
      name: 'Hiasan Kayu Motif Batik Kawung & Wayang',
      slug: 'hiasan-kayu-motif-batik-kawung',
      sku: 'NW-DK-KWG-10',
      categoryId: 'cat-6',
      shortDescription: 'Dekorasi kayu estetik dengan perpaduan motif batik Kawung dan siluet wayang Jawa.',
      description: 'Hiasan berdiri multifungsi yang cocok diletakkan di rak buku, meja konsol, atau nakas kamar tidur. Motif Kawung melambangkan kesucian dan ketulusan, berpadu apik dengan garis siluet wayang kontemporer.',
      price: 135000,
      material: 'Kayu Mindi Pilihan & Sablon Bakar Tradisional',
      dimensions: '20 cm x 15 cm x 4 cm',
      status: 'Published',
      featured: false,
      badge: 'Baru',
      sortOrder: 10,
      images: [
        {
          id: 'img-10-1',
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          alt: 'Hiasan Kayu Batik Kawung dan Wayang',
          sortOrder: 1,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-11',
      name: 'Paket Souvenir Wayang Jawa Tradisional',
      slug: 'paket-souvenir-wayang-jawa',
      sku: 'NW-SV-PKT-11',
      categoryId: 'cat-5',
      shortDescription: 'Paket souvenir gift set berisi pembatas buku kuningan wayang, gantungan kunci, dan pouch lurik.',
      description: 'Solusi bingkisan istimewa untuk cinderamata seminar internasional, hadiah pernikahan adat Jawa, dan apresiasi tamu VIP. Dikemas dalam besek bambu halus dan pita kain lurik khas Yogyakarta.',
      price: 85000,
      material: 'Kuningan, Kulit Sapi Tatah, Kain Lurik Tradisional & Kemasan Besek Halus',
      dimensions: 'Kemasan Box Besek: 18 cm x 12 cm x 5 cm',
      status: 'Published',
      featured: true,
      badge: 'Terlaris',
      sortOrder: 11,
      images: [
        {
          id: 'img-11-1',
          imageUrl: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=800&q=80',
          alt: 'Paket Souvenir Wayang Tradisional Besek',
          sortOrder: 1,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-12',
      name: 'Dekorasi Dinding Nusantara Siluet Gunungan Logam',
      slug: 'dekorasi-dinding-nusantara-siluet-gunungan',
      sku: 'NW-DK-SLU-12',
      categoryId: 'cat-6',
      shortDescription: 'Hiasan dinding logam tempa siluet Gunungan Wayang bergaya arsitektural modern.',
      description: 'Hiasan dinding statement piece yang membawa nuansa megah dan ketenangan filosofis budaya Jawa ke dalam interior minimalis modern. Diberi jarak gantung 2 cm dari dinding untuk menciptakan bayangan estetik yang dramatis saat terkena pencahayaan lampu.',
      price: 520000,
      material: 'Plat Baja Ringan Laser-Cut & Powder Coating Matte Black / Terracotta Gold',
      dimensions: '60 cm x 40 cm x 2 cm',
      status: 'Published',
      featured: true,
      badge: 'Unggulan',
      sortOrder: 12,
      images: [
        {
          id: 'img-12-1',
          imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
          alt: 'Dekorasi Dinding Siluet Gunungan Logam',
          sortOrder: 1,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const branches: Branch[] = [
    {
      id: 'br-1',
      name: 'Nusantara Wayang — Galeri Malioboro Yogyakarta',
      address: 'Jl. Malioboro No. 100, Sosromenduran, Gedong Tengen',
      city: 'Yogyakarta',
      phone: '+62 274 589 1234',
      whatsapp: '6281234567890',
      openingHours: 'Senin - Minggu: 09.00 - 21.30 WIB',
      googleMapsUrl: 'https://maps.google.com/?q=Jl.+Malioboro+No.+100+Yogyakarta',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      sortOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'br-2',
      name: 'Nusantara Wayang — Galeri Slamet Riyadi Solo',
      address: 'Jl. Slamet Riyadi No. 88, Timuran, Banjarsari',
      city: 'Surakarta (Solo)',
      phone: '+62 271 632 5678',
      whatsapp: '6281234567891',
      openingHours: 'Senin - Minggu: 09.00 - 21.00 WIB',
      googleMapsUrl: 'https://maps.google.com/?q=Jl.+Slamet+Riyadi+No.+88+Surakarta',
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      sortOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'br-3',
      name: 'Nusantara Wayang — Showroom Jakarta',
      address: 'Jl. Nusantara Raya No. 25, Kebayoran Baru',
      city: 'Jakarta Selatan',
      phone: '+62 21 720 9876',
      whatsapp: '6281234567892',
      openingHours: 'Selasa - Minggu: 10.00 - 20.00 WIB (Senin Tutup)',
      googleMapsUrl: 'https://maps.google.com/?q=Jl.+Nusantara+No.+25+Jakarta+Selatan',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      sortOrder: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const gallery: GalleryItem[] = [
    {
      id: 'gal-1',
      title: 'Koleksi Wayang Tatah Sungging Halus',
      description: 'Detail ketelitian seniman wayang saat menggoreskan motif ornamen pada lembaran kulit kerbau.',
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      category: 'Koleksi Wayang',
      isPublished: true,
      sortOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'gal-2',
      title: 'Proses Pembuatan Kuningan Tempa',
      description: 'Tahap pembentukan logam kuningan dengan ketukan manual untuk menghasilkan karakter wayang yang tegas.',
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      category: 'Proses Pembuatan',
      isPublished: true,
      sortOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'gal-3',
      title: 'Workshop Kerajinan Kayu Jati',
      description: 'Pemotongan dan pengamplasan balok kayu jati perhutani untuk tatakan dan pigura wayang.',
      imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80',
      category: 'Workshop Kerajinan',
      isPublished: true,
      sortOrder: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'gal-4',
      title: 'Display Pajangan Meja Wayang di Ruang Tamu',
      description: 'Contoh aplikasi pajangan wayang Rama & Shinta sebagai aksen elegan interior rumah modern.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      category: 'Interior Toko',
      isPublished: true,
      sortOrder: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'gal-5',
      title: 'Koleksi Gantungan Kunci & Aksesoris Saku',
      description: 'Varian lengkap gantungan kunci tokoh pewayangan dengan gantungan ring kuningan premium.',
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      category: 'Koleksi Souvenir',
      isPublished: true,
      sortOrder: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'gal-6',
      title: 'Suasana Galeri Nusantara Wayang Malioboro',
      description: 'Pengunjung dapat melihat langsung koleksi karya dan berkonsultasi mengenai pemesanan souvenir khusus.',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      category: 'Interior Toko',
      isPublished: true,
      sortOrder: 6,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'gal-7',
      title: 'Pewarnaan Prada Emas Tradisional',
      description: 'Sentuhan warna prada emas menggunakan pigmen khusus agar kilau aksesoris bertahan bertahun-tahun.',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      category: 'Proses Pembuatan',
      isPublished: true,
      sortOrder: 7,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'gal-8',
      title: 'Pelestarian Budaya Jawa dalam Karya Modern',
      description: 'Menjembatani keagungan filosofi leluhur dengan estetika fungsional masa kini.',
      imageUrl: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=800&q=80',
      category: 'Budaya Jawa',
      isPublished: true,
      sortOrder: 8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const siteSettings: SiteSettings = {
    id: 'settings-1',
    siteName: 'Nusantara Wayang',
    tagline: 'Warisan Budaya dalam Setiap Karya',
    logo: '',
    favicon: '',
    whatsapp: '6281234567890',
    email: 'info@nusantarawayang.id',
    phone: '+62 274 589 1234',
    address: 'Jl. Malioboro No. 100, Sosromenduran, Gedong Tengen',
    city: 'Yogyakarta',
    province: 'D.I. Yogyakarta',
    postalCode: '55271',
    instagram: 'https://instagram.com/nusantara.wayang',
    facebook: 'https://facebook.com/nusantarawayang.official',
    youtube: 'https://youtube.com/@nusantarawayang',
    tiktok: 'https://tiktok.com/@nusantarawayang',
    workingHours: 'Setiap Hari: 09.00 - 21.00 WIB',
    updatedAt: new Date().toISOString(),
  };

  const pageContent: PageContent = {
    id: 'content-1',
    heroTitle: 'Warisan Jawa, Hadir dalam Setiap Karya',
    heroSubtitle: 'Temukan berbagai aksesoris dan kerajinan bernuansa wayang yang dibuat untuk menghadirkan keindahan budaya Jawa ke dalam keseharian Anda.',
    heroCtaText: 'Jelajahi Produk',
    heroBadgeText: 'Modern Javanese Heritage Store',
    heroImageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    aboutTitle: 'Mengenal Nusantara Wayang',
    aboutSubtitle: 'Apresiasi Nyata bagi Keluhuran Tradisi Pewayangan',
    aboutDescription: 'Nusantara Wayang menghadirkan berbagai aksesoris, dekorasi, dan kerajinan bernuansa wayang serta budaya Jawa. Setiap karya dirancang untuk membawa keindahan warisan budaya Nusantara ke dalam kehidupan modern dengan sentuhan estetik yang bersih, elegan, dan bermakna.',
    aboutVision: 'Menjadi wadah pelestarian budaya Jawa terkemuka di tingkat nasional dan internasional melalui karya kerajinan kontemporer yang relevan bagi generasi masa kini.',
    aboutMission: 'Memberdayakan perajin lokal Nusantara, menjaga standar tatah & tempa tradisional, dan menghadirkan produk berkualitas tinggi yang membanggakan sebagai hadiah maupun dekorasi pribadi.',
    aboutValues: [
      'Orisinalitas & Ketelitian Tatah Tradisional',
      'Harmoni Desain Modern dan Nilai Luhur Budaya',
      'Pemberdayaan Pengrajin Lokal Jawa Tengah & Yogyakarta',
      'Pelayanan Ramah, Tanggap, dan Terpercaya via Konsultasi WhatsApp',
    ],
    aboutFoundedYear: '2016',
    aboutImageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    aboutStoryImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    philosophyTitle: 'Filosofi di Balik Tokoh Pewayangan',
    philosophyDescription: 'Wayang bukan sekadar seni pertunjukan, melainkan cerminan watak, tuntunan kebijaksanaan hidup, dan falsafah tata krama Jawa yang abadi.',
    whyChooseUs: [
      {
        title: 'Warisan Budaya',
        description: 'Setiap karya mengangkat nilai budaya Jawa otentik dengan riset karakter wayang yang mendalam.',
        icon: 'Sparkles',
      },
      {
        title: 'Karya Berkualitas',
        description: 'Menggunakan material pilihan seperti kuningan murni, kulit tatah sungging, dan kayu jati perhutani.',
        icon: 'Award',
      },
      {
        title: 'Cocok untuk Hadiah',
        description: 'Kemasan eksklusif yang siap dijadikan souvenir perusahaan, kenang-kenangan tamu VIP, dan kado spesial.',
        icon: 'Gift',
      },
      {
        title: 'Konsultasi Cepat via WhatsApp',
        description: 'Tanyakan ketersediaan stok, custom nama/grafir, dan diskon kuantiti secara langsung kepada tim kami.',
        icon: 'MessageCircle',
      },
    ],
    updatedAt: new Date().toISOString(),
  };

  const users: AdminUser[] = [
    {
      id: 'usr-1',
      name: 'Administrator Nusantara Wayang',
      email: 'admin@example.local',
      passwordHash,
      role: 'superadmin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return {
    users,
    categories,
    products,
    branches,
    gallery,
    siteSettings,
    pageContent,
  };
}
