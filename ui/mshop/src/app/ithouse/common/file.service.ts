import { Injectable, inject } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { v4 as uuidv4 } from 'uuid';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private cs = inject(CommonService);
  constructor(private imageCompress: NgxImageCompressService) { }

  generateUuid(): string {
    return uuidv4();
  }

  loadImageAndCompress(file: any, allowFileType: string[], maxSizeKb: number = 1024, maxWidth: number = 0, maxHeight: number = 0): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('File is null or undefined.'));
        return;
      }
      const reader = new FileReader();
      const fileType: string[] = file.name.split('.');

      if (!fileType || fileType.length < 2 || !allowFileType.includes(`.${fileType[fileType.length - 1]}`.toLowerCase())) {
        reject(new Error(`${fileType[fileType.length - 1]} file is not allowed.`));
        return;
      }

      reader.onload = (e: any) => {
        this.imageCompress.compressFile(e.target.result, -1, 50, 50, maxWidth, maxHeight)
          .then(compressedImage => {
            resolve(compressedImage);
          })
          .catch(error => {
            reject(new Error('Error occurred while compressing the image.'));
          });
      };

      reader.onerror = () => {
        reject(new Error('Error occurred while reading the file.'));
      };
      reader.readAsDataURL(file);
    });
  }

  async saveFile(file: File[] | string[], fileType: FileType) {
    let formData: FormData = new FormData();
    if (typeof file[0] == 'string') {
      file.forEach(f => {
        const ft = f.split(';');
        const contentType = ft[0]?.split(':')[1];
        const fileName = `${this.generateUuid().replace(/-/g, '')}.${contentType.substring(contentType.indexOf('/') + 1)}`;
        debugger
        formData.append('file', this.base64ToFile(ft[1]?.substring(ft[1].indexOf(',') + 1), fileName, contentType));
      })
    } else {
      file.forEach(f => formData.append('file', f));
    }
    // formData.append('fileType', fileType);
    // formData.append('action', '')

    return this.cs.filePostBySecure('file/handle', formData, fileType, 'SAVE');

  }


  public base64ToFile(base64: string, fileName: string, contentType: string): File {
    // Remove the data URL scheme if present
    const cleanedBase64 = this.cleanBase64(base64);
    console.log('converting bs', cleanedBase64);
    
    const blob = this.base64ToBlob(cleanedBase64, contentType);
    return new File([blob], fileName, { type: contentType });
  }
  
  public base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
  
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
  
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }
  
  private cleanBase64(base64: string): string {
    const base64Pattern = /(?:data:[^;]+;base64,|base64,)?(.*)$/;
    const match = base64.match(base64Pattern);
    if (match) {
      return match[1]; 
    }
    return base64; 
  }
}

export type FileAction = 'SAVE' | 'DOWNLOAD' | 'OTHERS';

export type FileType = 'PROFILE' | 'DOCUMENT' | 'PRODUCT' | 'PROFILE_BANNER';
