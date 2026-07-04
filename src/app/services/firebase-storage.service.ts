import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import type { FirebaseStorage } from 'firebase/storage';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  private readonly maxFileSize = 50 * 1024 * 1024;
  private readonly isBrowser: boolean;
  private storagePromise?: Promise<FirebaseStorage>;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /** Valida el formato y el peso antes de enviar el archivo a Firebase. */
  validateGlb(file: File): string | null {
    if (!file.name.toLowerCase().endsWith('.glb')) {
      return 'Selecciona un archivo con extensión .glb.';
    }
    if (file.size > this.maxFileSize) {
      return 'El archivo no puede superar los 50 MB.';
    }
    return null;
  }

  /** Sube el GLB a models3d/ y devuelve la URL publica que se guarda en PostgreSQL. */
  async uploadGlb(file: File): Promise<string> {
    const storage = await this.getStorageInstance();
    const { getDownloadURL, ref, uploadBytes } = await import('firebase/storage');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const modelRef = ref(storage, `models3d/${Date.now()}-${safeName}`);

    await uploadBytes(modelRef, file, {
      contentType: 'model/gltf-binary',
    });
    return getDownloadURL(modelRef);
  }

  /** Elimina de Firebase el archivo asociado a una URL de descarga. */
  async deleteByUrl(fileUrl: string): Promise<void> {
    if (!fileUrl || !this.isFirebaseUrl(fileUrl)) {
      return;
    }

    try {
      const storage = await this.getStorageInstance();
      const { deleteObject, ref } = await import('firebase/storage');
      await deleteObject(ref(storage, fileUrl));
    } catch (error: any) {
      if (error?.code !== 'storage/object-not-found') {
        throw error;
      }
    }
  }

  /** Evita intentar borrar desde Firebase URLs externas o datos vacios. */
  private isFirebaseUrl(fileUrl: string): boolean {
    return fileUrl.includes('firebasestorage.googleapis.com') || fileUrl.startsWith('gs://');
  }

  /** Inicializa Firebase una sola vez y reutiliza la misma instancia de Storage. */
  private getStorageInstance(): Promise<FirebaseStorage> {
    if (!this.isBrowser) {
      throw new Error('Firebase Storage solo está disponible en el navegador.');
    }

    if (!this.storagePromise) {
      this.storagePromise = Promise.all([import('firebase/app'), import('firebase/storage')]).then(
        ([appSdk, storageSdk]) => {
          const app = appSdk.getApps().length
            ? appSdk.getApp()
            : appSdk.initializeApp(environment.firebase);
          return storageSdk.getStorage(app);
        },
      );
    }

    return this.storagePromise;
  }
}
