import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Créer dossiers uploads s'ils n'existent pas
const uploadsDir = path.join(__dirname, '../../uploads');
const facturesDir = path.join(uploadsDir, 'factures');
const paiementsDir = path.join(uploadsDir, 'paiements');
const documentsDir = path.join(uploadsDir, 'documents');

[uploadsDir, facturesDir, paiementsDir, documentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuration stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadsDir;

    // Déterminer dossier selon type de fichier
    if (req.path.includes('/factures/')) {
      uploadPath = facturesDir;
    } else if (req.path.includes('/paiements/')) {
      uploadPath = paiementsDir;
    } else {
      uploadPath = documentsDir;
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Générer nom unique : timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
    
    cb(null, `${sanitizedBaseName}-${uniqueSuffix}${ext}`);
  }
});

// Filtre fichiers
const fileFilter = (req: any, file: any, cb: any) => {
  // Types acceptés
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.xls', '.xlsx', '.doc', '.docx'];

  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = allowedMimes.includes(file.mimetype);
  const extOk = allowedExtensions.includes(ext);

  if (mimeOk && extOk) {
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non autorisé. Extensions acceptées: ${allowedExtensions.join(', ')}`));
  }
};

// Configuration multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
    files: 5 // Maximum 5 fichiers simultanés
  }
});

/**
 * Middleware upload fichier unique
 */
export const uploadSingleFile = (fieldName: string = 'file') => {
  return upload.single(fieldName);
};

/**
 * Middleware upload fichiers multiples
 */
export const uploadMultipleFiles = (fieldName: string = 'files', maxCount: number = 5) => {
  return upload.array(fieldName, maxCount);
};

/**
 * Middleware upload PDF uniquement
 */
export const uploadPDF = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' && path.extname(file.originalname).toLowerCase() === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont acceptés'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
}).single('file');

/**
 * Middleware upload image uniquement
 */
export const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

    if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images JPG/PNG sont acceptées'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
}).single('image');

/**
 * Supprimer fichier
 */
export const deleteFile = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // Fichier n'existe pas, considérer comme supprimé
          resolve();
        } else {
          reject(err);
        }
      } else {
        resolve();
      }
    });
  });
};

/**
 * Vérifier si fichier existe
 */
export const fileExists = (filePath: string): Promise<boolean> => {
  return new Promise((resolve) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  });
};

/**
 * Obtenir info fichier
 */
export const getFileInfo = (filePath: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          isFile: stats.isFile(),
          isDirectory: stats.isDirectory()
        });
      }
    });
  });
};
