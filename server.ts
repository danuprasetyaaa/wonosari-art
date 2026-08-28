import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import {
  getDb,
  saveDb,
  getInitialSeedData,
  Product,
  Category,
  Branch,
  GalleryItem,
  SiteSettings,
  PageContent,
} from './server/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nusantara-wayang-secret-token-key-2026';
const PORT = 3000;

// Ensure upload directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'media-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung. Harap upload gambar atau video.'));
    }
  },
});

// Middleware for JWT Verification
interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Sesi login tidak ditemukan. Harap login terlebih dahulu.' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      res.status(403).json({ error: 'Token tidak valid atau telah kedaluwarsa.' });
      return;
    }
    req.user = decodedUser as { id: string; email: string; role: string };
    next();
  });
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Static uploads directory
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Initialize DB
  getDb();

  // -------------------------------------------------------------
  // PUBLIC API ENDPOINTS
  // -------------------------------------------------------------

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', name: 'Nusantara Wayang API' });
  });

  // Get full initial public payload
  app.get('/api/public/bootstrap', (_req, res) => {
    try {
      const db = getDb();
      const publishedProducts = db.products
        .filter((p) => p.status === 'Published')
        .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));

      const activeBranches = db.branches
        .filter((b) => b.isActive)
        .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));

      const publishedGallery = db.gallery
        .filter((g) => g.isPublished)
        .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));

      res.json({
        categories: db.categories.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99)),
        products: publishedProducts,
        branches: activeBranches,
        gallery: publishedGallery,
        pageContent: db.pageContent,
        siteSettings: db.siteSettings,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Gagal memuat data' });
    }
  });

  // Public products listing with query support
  app.get('/api/public/products', (req, res) => {
    const { category, search, featured, sort } = req.query;
    const db = getDb();
    let result = db.products.filter((p) => p.status === 'Published');

    if (category && typeof category === 'string' && category !== 'all') {
      result = result.filter(
        (p) => p.categoryId === category || p.slug.includes(category)
      );
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (featured === 'true') {
      result = result.filter((p) => p.featured);
    }

    // Sorting
    if (sort === 'price-low') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === 'price-high') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
    }

    res.json(result);
  });

  // Public single product detail
  app.get('/api/public/products/:slugOrId', (req, res) => {
    const { slugOrId } = req.params;
    const db = getDb();
    const product = db.products.find(
      (p) => (p.slug === slugOrId || p.id === slugOrId) && p.status === 'Published'
    );

    if (!product) {
      res.status(404).json({ error: 'Produk tidak ditemukan' });
      return;
    }

    res.json(product);
  });

  // Public Categories
  app.get('/api/public/categories', (_req, res) => {
    const db = getDb();
    res.json(db.categories.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99)));
  });

  // Public Branches
  app.get('/api/public/branches', (_req, res) => {
    const db = getDb();
    res.json(
      db.branches
        .filter((b) => b.isActive)
        .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99))
    );
  });

  // Public Gallery
  app.get('/api/public/gallery', (_req, res) => {
    const db = getDb();
    res.json(
      db.gallery
        .filter((g) => g.isPublished)
        .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99))
    );
  });

  // Public Site Settings
  app.get('/api/public/settings', (_req, res) => {
    const db = getDb();
    res.json(db.siteSettings);
  });

  // Public Content
  app.get('/api/public/content', (_req, res) => {
    const db = getDb();
    res.json(db.pageContent);
  });

  // -------------------------------------------------------------
  // AUTHENTICATION ENDPOINTS
  // -------------------------------------------------------------

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email dan password wajib diisi.' });
      return;
    }

    const db = getDb();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      res.status(401).json({ error: 'Email atau password salah.' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Email atau password salah.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });

  app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    const user = db.users.find((u) => u.id === req.user?.id);
    if (!user) {
      res.status(404).json({ error: 'User tidak ditemukan' });
      return;
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  });

  app.put('/api/auth/password', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Password saat ini dan password baru wajib diisi.' });
      return;
    }

    const db = getDb();
    const userIndex = db.users.findIndex((u) => u.id === req.user?.id);
    if (userIndex === -1) {
      res.status(404).json({ error: 'User tidak ditemukan' });
      return;
    }

    const isMatch = bcrypt.compareSync(currentPassword, db.users[userIndex].passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: 'Password saat ini tidak cocok.' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    db.users[userIndex].passwordHash = bcrypt.hashSync(newPassword, salt);
    db.users[userIndex].updatedAt = new Date().toISOString();
    saveDb(db);

    res.json({ message: 'Password berhasil diperbarui.' });
  });

  app.put('/api/auth/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const { name, email } = req.body;
    const db = getDb();
    const userIndex = db.users.findIndex((u) => u.id === req.user?.id);
    if (userIndex === -1) {
      res.status(404).json({ error: 'User tidak ditemukan' });
      return;
    }

    if (name) db.users[userIndex].name = name;
    if (email) db.users[userIndex].email = email;
    db.users[userIndex].updatedAt = new Date().toISOString();
    saveDb(db);

    res.json({
      id: db.users[userIndex].id,
      name: db.users[userIndex].name,
      email: db.users[userIndex].email,
      role: db.users[userIndex].role,
    });
  });

  // -------------------------------------------------------------
  // ADMIN DASHBOARD CRUD ENDPOINTS
  // -------------------------------------------------------------

  // Admin Dashboard Overview Stats
  app.get('/api/admin/stats', authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    res.json({
      totalProducts: db.products.length,
      publishedProducts: db.products.filter((p) => p.status === 'Published').length,
      draftProducts: db.products.filter((p) => p.status === 'Draft').length,
      featuredProducts: db.products.filter((p) => p.featured).length,
      totalCategories: db.categories.length,
      totalBranches: db.branches.length,
      activeBranches: db.branches.filter((b) => b.isActive).length,
      totalGallery: db.gallery.length,
      publishedGallery: db.gallery.filter((g) => g.isPublished).length,
    });
  });

  // Admin Products Listing (All statuses)
  app.get('/api/admin/products', authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    res.json(db.products.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99)));
  });

  // Admin Create Product
  app.post('/api/admin/products', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const body = req.body;
    if (!body.name || !body.categoryId) {
      res.status(400).json({ error: 'Nama produk dan kategori wajib diisi.' });
      return;
    }

    const db = getDb();
    const id = 'prod-' + Date.now();
    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const newProduct: Product = {
      id,
      name: body.name,
      slug,
      sku: body.sku || 'NW-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      categoryId: body.categoryId,
      shortDescription: body.shortDescription || '',
      description: body.description || '',
      price: body.price !== undefined && body.price !== '' ? Number(body.price) : undefined,
      material: body.material || '',
      dimensions: body.dimensions || '',
      videoUrl: body.videoUrl || '',
      videoType: body.videoType || 'youtube',
      status: body.status || 'Published',
      featured: Boolean(body.featured),
      badge: body.badge || undefined,
      sortOrder: Number(body.sortOrder) || db.products.length + 1,
      images: Array.isArray(body.images) ? body.images : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.products.push(newProduct);
    saveDb(db);
    res.status(201).json(newProduct);
  });

  // Admin Update Product
  app.put('/api/admin/products/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const db = getDb();
    const index = db.products.findIndex((p) => p.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Produk tidak ditemukan.' });
      return;
    }

    const body = req.body;
    const current = db.products[index];

    const updatedProduct: Product = {
      ...current,
      name: body.name !== undefined ? body.name : current.name,
      slug: body.slug !== undefined ? body.slug : current.slug,
      sku: body.sku !== undefined ? body.sku : current.sku,
      categoryId: body.categoryId !== undefined ? body.categoryId : current.categoryId,
      shortDescription: body.shortDescription !== undefined ? body.shortDescription : current.shortDescription,
      description: body.description !== undefined ? body.description : current.description,
      price: body.price !== undefined && body.price !== '' ? Number(body.price) : undefined,
      material: body.material !== undefined ? body.material : current.material,
      dimensions: body.dimensions !== undefined ? body.dimensions : current.dimensions,
      videoUrl: body.videoUrl !== undefined ? body.videoUrl : current.videoUrl,
      videoType: body.videoType !== undefined ? body.videoType : current.videoType,
      status: body.status !== undefined ? body.status : current.status,
      featured: body.featured !== undefined ? Boolean(body.featured) : current.featured,
      badge: body.badge !== undefined ? body.badge : current.badge,
      sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : current.sortOrder,
      images: Array.isArray(body.images) ? body.images : current.images,
      updatedAt: new Date().toISOString(),
    };

    db.products[index] = updatedProduct;
    saveDb(db);
    res.json(updatedProduct);
  });

  // Admin Delete Product
  app.delete('/api/admin/products/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const db = getDb();
    const index = db.products.findIndex((p) => p.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Produk tidak ditemukan.' });
      return;
    }

    const removed = db.products.splice(index, 1);
    saveDb(db);
    res.json({ message: 'Produk berhasil dihapus.', product: removed[0] });
  });

  // Admin Category CRUD
  app.get('/api/admin/categories', authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    res.json(db.categories.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99)));
  });

  app.post('/api/admin/categories', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const { name, description, imageUrl, sortOrder } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Nama kategori wajib diisi.' });
      return;
    }

    const db = getDb();
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newCategory: Category = {
      id: 'cat-' + Date.now(),
      name,
      slug,
      description: description || '',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
      sortOrder: Number(sortOrder) || db.categories.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.categories.push(newCategory);
    saveDb(db);
    res.status(201).json(newCategory);
  });

  app.put('/api/admin/categories/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const db = getDb();
    const index = db.categories.findIndex((c) => c.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Kategori tidak ditemukan.' });
      return;
    }

    const body = req.body;
    db.categories[index] = {
      ...db.categories[index],
      name: body.name || db.categories[index].name,
      slug: body.slug || db.categories[index].slug,
      description: body.description !== undefined ? body.description : db.categories[index].description,
      imageUrl: body.imageUrl !== undefined ? body.imageUrl : db.categories[index].imageUrl,
      sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : db.categories[index].sortOrder,
      updatedAt: new Date().toISOString(),
    };

    saveDb(db);
    res.json(db.categories[index]);
  });

  app.delete('/api/admin/categories/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const db = getDb();
    const index = db.categories.findIndex((c) => c.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Kategori tidak ditemukan.' });
      return;
    }

    const removed = db.categories.splice(index, 1);
    saveDb(db);
    res.json({ message: 'Kategori berhasil dihapus.', category: removed[0] });
  });

  // Admin Branch CRUD
  app.get('/api/admin/branches', authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    res.json(db.branches.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99)));
  });

  app.post('/api/admin/branches', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const body = req.body;
    if (!body.name || !body.city) {
      res.status(400).json({ error: 'Nama cabang dan kota wajib diisi.' });
      return;
    }

    const db = getDb();
    const newBranch: Branch = {
      id: 'br-' + Date.now(),
      name: body.name,
      address: body.address || '',
      city: body.city,
      phone: body.phone || '',
      whatsapp: body.whatsapp || '',
      openingHours: body.openingHours || '09.00 - 21.00 WIB',
      googleMapsUrl: body.googleMapsUrl || '',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      sortOrder: Number(body.sortOrder) || db.branches.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.branches.push(newBranch);
    saveDb(db);
    res.status(201).json(newBranch);
  });

  app.put('/api/admin/branches/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const db = getDb();
    const index = db.branches.findIndex((b) => b.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Cabang tidak ditemukan.' });
      return;
    }

    const body = req.body;
    db.branches[index] = {
      ...db.branches[index],
      name: body.name !== undefined ? body.name : db.branches[index].name,
      address: body.address !== undefined ? body.address : db.branches[index].address,
      city: body.city !== undefined ? body.city : db.branches[index].city,
      phone: body.phone !== undefined ? body.phone : db.branches[index].phone,
      whatsapp: body.whatsapp !== undefined ? body.whatsapp : db.branches[index].whatsapp,
      openingHours: body.openingHours !== undefined ? body.openingHours : db.branches[index].openingHours,
      googleMapsUrl: body.googleMapsUrl !== undefined ? body.googleMapsUrl : db.branches[index].googleMapsUrl,
      imageUrl: body.imageUrl !== undefined ? body.imageUrl : db.branches[index].imageUrl,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : db.branches[index].isActive,
      sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : db.branches[index].sortOrder,
      updatedAt: new Date().toISOString(),
    };

    saveDb(db);
    res.json(db.branches[index]);
  });

  app.delete('/api/admin/branches/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const db = getDb();
    const index = db.branches.findIndex((b) => b.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Cabang tidak ditemukan.' });
      return;
    }

    const removed = db.branches.splice(index, 1);
    saveDb(db);
    res.json({ message: 'Cabang berhasil dihapus.', branch: removed[0] });
  });

  // Admin Gallery CRUD
  app.get('/api/admin/gallery', authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    res.json(db.gallery.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99)));
  });

  app.post('/api/admin/gallery', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const body = req.body;
    if (!body.title || !body.imageUrl) {
      res.status(400).json({ error: 'Judul dan URL foto galeri wajib diisi.' });
      return;
    }

    const db = getDb();
    const newGalleryItem: GalleryItem = {
      id: 'gal-' + Date.now(),
      title: body.title,
      description: body.description || '',
      imageUrl: body.imageUrl,
      category: body.category || 'Koleksi Wayang',
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      sortOrder: Number(body.sortOrder) || db.gallery.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.gallery.push(newGalleryItem);
    saveDb(db);
    res.status(201).json(newGalleryItem);
  });

  app.put('/api/admin/gallery/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const db = getDb();
    const index = db.gallery.findIndex((g) => g.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Item galeri tidak ditemukan.' });
      return;
    }

    const body = req.body;
    db.gallery[index] = {
      ...db.gallery[index],
      title: body.title !== undefined ? body.title : db.gallery[index].title,
      description: body.description !== undefined ? body.description : db.gallery[index].description,
      imageUrl: body.imageUrl !== undefined ? body.imageUrl : db.gallery[index].imageUrl,
      category: body.category !== undefined ? body.category : db.gallery[index].category,
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : db.gallery[index].isPublished,
      sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : db.gallery[index].sortOrder,
      updatedAt: new Date().toISOString(),
    };

    saveDb(db);
    res.json(db.gallery[index]);
  });

  app.delete('/api/admin/gallery/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const db = getDb();
    const index = db.gallery.findIndex((g) => g.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Item galeri tidak ditemukan.' });
      return;
    }

    const removed = db.gallery.splice(index, 1);
    saveDb(db);
    res.json({ message: 'Item galeri berhasil dihapus.', gallery: removed[0] });
  });

  // Admin Page Content Update
  app.put('/api/admin/content', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    db.pageContent = {
      ...db.pageContent,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDb(db);
    res.json(db.pageContent);
  });

  // Admin Site Settings Update
  app.put('/api/admin/settings', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const db = getDb();
    db.siteSettings = {
      ...db.siteSettings,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDb(db);
    res.json(db.siteSettings);
  });

  // Admin Media Upload
  app.post('/api/admin/upload', authenticateToken, upload.single('file'), (req: AuthenticatedRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: 'Tidak ada file yang diunggah.' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      url: fileUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  });

  // Admin Reset Seed Endpoint
  app.post('/api/admin/reset-seed', authenticateToken, (_req: AuthenticatedRequest, res: Response) => {
    const seedData = getInitialSeedData();
    saveDb(seedData);
    res.json({ message: 'Database berhasil di-reset ke data seed default.', data: seedData });
  });

  // -------------------------------------------------------------
  // VITE OR STATIC CLIENT SERVING
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Nusantara Wayang Full-Stack Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
