import { supabase, STORAGE, isSupabaseConfigured } from './client';

export type UploadProgressCallback = (progress: number) => void;

function guard(): void {
  if (!isSupabaseConfigured()) throw new Error('التخزين غير متوفر في وضع العرض التجريبي');
}

export async function uploadFile(bucket: string, path: string, file: File, onProgress?: UploadProgressCallback): Promise<string> {
  guard();
  
  // Supabase JS SDK doesn't support onUploadProgress in upload options.
  // For now, we simulate progress with a simple approach.
  // In production, consider using the REST API directly for progress tracking.
  if (onProgress) {
    onProgress(0);
  }
  
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  } as any);
  
  if (error) throw new Error('فشل رفع الملف. حاول مرة أخرى.');
  
  if (onProgress) {
    onProgress(100);
  }
  
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}

export async function uploadAvatar(userId: string, file: File, onProgress?: UploadProgressCallback): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  return uploadFile(STORAGE.AVATARS, `${userId}/avatar.${ext}`, file, onProgress);
}

export async function uploadPortfolioImage(barberId: string, file: File, index: number, onProgress?: UploadProgressCallback): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  return uploadFile(STORAGE.PORTFOLIO, `${barberId}/image_${index}.${ext}`, file, onProgress);
}

export async function uploadIdCard(userId: string, file: File, side: 'front' | 'back' | 'selfie'): Promise<string> {
  return uploadFile(STORAGE.ID_CARDS, `${userId}/${side}.jpg`, file);
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  guard();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(error.message);
}

export function getFileUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function validateFile(file: File, options: { maxSizeMB?: number; allowedTypes?: string[] } = {}): { valid: boolean; error?: string } {
  const { maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'نوع الملف غير مدعوم. استخدم JPG, PNG, أو WebP.' };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `حجم الملف يتجاوز ${maxSizeMB}MB.` };
  }
  return { valid: true };
}

export const UPLOAD_LIMITS = {
  AVATAR_MAX_SIZE: 2,
  ID_CARD_MAX_SIZE: 5,
  PORTFOLIO_MAX_SIZE: 5,
  REVIEW_IMAGE_MAX_SIZE: 3,
  PORTFOLIO_MAX_COUNT: 20,
  REVIEW_MAX_IMAGES: 5,
} as const;
