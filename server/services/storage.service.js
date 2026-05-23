// backend/services/storage.service.js
import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';

// Détection de l'environnement
const isVercel = process.env.VERCEL === '1';

export const saveFile = async (file, folder) => {
  if (isVercel) {
    // 🇻🇪 Sur Vercel : utilise Blob
    const blob = await put(`${folder}/${Date.now()}-${file.originalname}`, file.buffer, {
      access: 'public',
      addRandomSuffix: true,
    });
    return blob.url;
  } else {
    // 💻 En local : utilise le disque
    const uploadDir = path.join(process.cwd(), 'uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, file.buffer);
    
    return `/uploads/${folder}/${filename}`;
  }
};

export const saveMultipleFiles = async (files, folder) => {
  const urls = [];
  for (const file of files) {
    const url = await saveFile(file, folder);
    urls.push(url);
  }
  return urls;
};