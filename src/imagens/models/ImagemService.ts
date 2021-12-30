import { IRetornoSubirImagem } from "../dto/retorno-subir-imagem";

export interface ImagemService {
  subirImagem(
    mimetype: string,
    nomeImagem: string,
    imagemBuffer: Buffer
  ): Promise<IRetornoSubirImagem>;
}

export default ImagemService;