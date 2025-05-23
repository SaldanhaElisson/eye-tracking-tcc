import React, { useState } from 'react';

// Defina uma interface para o objeto de imagem, incluindo URL e nome do arquivo
interface UploadedImage {
    url: string;
    name: string; // Adicionamos o nome do arquivo aqui
}

interface ImageUploaderProps {
    onImagesUploaded: (images: UploadedImage[]) => void; // A prop agora espera um array de UploadedImage
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUploaded }) => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);// Isso mantém os objetos File
    const [previewImages, setPreviewImages] = useState<UploadedImage[]>([]); // Armazena URL e nome

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            setImageFiles(filesArray);

            const uploadedImages: UploadedImage[] = filesArray.map(file => ({
                url: URL.createObjectURL(file),
                name: file.name // Captura o nome do arquivo original
            }));
            setPreviewImages(uploadedImages);
        }
    };

    const handleUploadClick = () => {
        // Passa o array de objetos UploadedImage
        onImagesUploaded(previewImages);
    };

    return (
        <div className="image-uploader-container">
            <h3>Upload de Imagens para o Experimento</h3>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
            />
            {previewImages.length > 0 && (
                <div className="image-previews">
                    <h4>Imagens Selecionadas:</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {previewImages.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={`preview-${image.name}`} // Use o nome do arquivo para o alt
                                style={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid #ccc' }}
                            />
                        ))}
                    </div>
                </div>
            )}
            <button onClick={handleUploadClick} disabled={imageFiles.length === 0}>
                Iniciar Experimento com Imagens
            </button>
        </div>
    );
};

export default ImageUploader;