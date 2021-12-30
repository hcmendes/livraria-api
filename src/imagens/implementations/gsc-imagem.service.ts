import { Injectable } from '@nestjs/common';
import { Bucket, Storage } from '@google-cloud/storage';
import { ImagemService } from '../models/ImagemService';
import { IRetornoSubirImagem } from '../dto/retorno-subir-imagem';

@Injectable()
export class GCSImagemService implements ImagemService {

  private storage: Storage;
  private bucket: Bucket;
  private CLOUD_BUCKET: string;

  constructor() {
    const CLOUD_BUCKET = process.env.CLOUD_BUCKET;
    if (!CLOUD_BUCKET) throw new Error('CLOUD_BUCKET está vazio');
    this.CLOUD_BUCKET = CLOUD_BUCKET;
    this.storage = new Storage();
    this.bucket = this.storage.bucket(CLOUD_BUCKET);
  }

  getPublicUrl(filename) {
    return `https://storage.googleapis.com/${this.CLOUD_BUCKET}/${filename}`;
  }

  subirImagem(
    mimetype: string,
    nomeImagem: string,
    imagemBuffer: Buffer
  ): Promise<IRetornoSubirImagem> {
    return new Promise((resolve, reject) => {
    
      const gcsname = nomeImagem;
      const file = this.bucket.file(gcsname);
    
      const stream = file.createWriteStream({
        metadata: {
          contentType: mimetype,
        },
        resumable: false,
      });
    
      stream.on('error', (err) => {
        reject(err);
      });
    
      stream.on('finish', () => {
        resolve({
          publicUrl: this.getPublicUrl(gcsname)
        });
      });
    
      stream.end(imagemBuffer);
    });
  }
  
}
