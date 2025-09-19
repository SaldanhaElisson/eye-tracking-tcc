
import React, { useState } from 'react';
import { UploadedImage, UploadPayload } from '../types';

interface ImageUploaderProps {
    onImagesUploaded: (payload: UploadPayload) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUploaded }) => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<UploadedImage[]>([]);

    const [width, setWidth] = useState<string>("700");
    const [height, setHeight] = useState<string>("900");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            setImageFiles(filesArray);

            const uploadedImages: UploadedImage[] = filesArray.map(file => ({
                url: URL.createObjectURL(file),
                name: file.name
            }));
            setPreviewImages(uploadedImages);
        }
    };

    const handleUploadClick = () => {
        const parsedWidth = width ? parseInt(width, 10) : null;
        const parsedHeight = height ? parseInt(height, 10) : null;


        onImagesUploaded({
            images: previewImages,
            width: parsedWidth,
            height: parsedHeight,
        });
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

            <div className="dimension-inputs">
                <h4>Definir Tamanho da Imagem (Opcional)</h4>
                <div className='size-input-container'>
                    <label className='size-input-label'>
                        Largura (px):
                        <input
                            className='size-input'
                            type="number"
                            value={width}
                            min="0"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || parseInt(value) >= 0) {
                                    setWidth(value);
                                }
                            }
                            }
                        />
                    </label>

                    <label className='size-input-label'>
                        Altura (px):
                        <input
                            className='size-input height-input'
                            type="number"
                            value={height}
                            min="0"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || parseInt(value) >= 0) {
                                    setHeight(value);
                                }
                            }
                            }
                        />
                    </label>
                </div>
            </div>

            {previewImages.length > 0 && (
                <div className="image-previews">
                    <h4>Imagens Selecionadas:</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {previewImages.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={`preview-${image.name}`}
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