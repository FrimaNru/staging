import styles from "@/styles/Admin/Products/ProductItem.module.css";
import { useState } from "react";

export default function ImagesLine({ data, setData }) {

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        setData({ ...data, cover: file });
    };


    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);

        setData(prevData => ({
            ...prevData,
            images: [...(prevData.images || []), ...files]
        }));

        e.target.value = '';
    };

    const removeImage = (index) => {
        setData(prevData => ({
            ...prevData,
            images: prevData.images?.filter((_, i) => i !== index) || []
        }));
    };

    const moveImageLeft = (index) => {
        if (index > 0) {
            setData(prevData => {
                const updatedImages = [...prevData.images];
                [updatedImages[index - 1], updatedImages[index]] =
                    [updatedImages[index], updatedImages[index - 1]];
                return { ...prevData, images: updatedImages };
            });
        }
    };

    const moveImageRight = (index) => {
        setData(prevData => {
            const updatedImages = [...prevData.images];
            if (index < updatedImages.length - 1) {
                [updatedImages[index], updatedImages[index + 1]] =
                    [updatedImages[index + 1], updatedImages[index]];
                return { ...prevData, images: updatedImages };
            }
            return prevData;
        });
    };

    return <div className={styles.imagesLine}>
        <div className={styles.imageColumn}>
            <p className={styles.subtitle}>Обложка</p>
            <div className={styles.imageButtonBox}>
                {data.cover ? (
                    <div className={styles.coverColumn}>
                        <img src={URL.createObjectURL(data.cover)} className={styles.cover} />
                        <label className="input-file">
                            <input type='file' onChange={handleFileChange} accept="image/*" />
                            <div className={styles.coverChangeButton}>Заменить</div>
                        </label>
                    </div>
                ) :
                    <label className="input-file">
                        <input type='file' onChange={handleFileChange} accept="image/*" />
                        <div className={styles.newsImageButton}>
                            <img src='/plusBanner.svg' className={styles.newsPlus} />
                        </div>
                    </label>}
            </div>
        </div>

        <div className={styles.imageColumnBig}>
            <p className={styles.subtitle}>Добавить фото</p>
            <div className={styles.anotherImagesLineBox}>
                <div className={styles.anotherImagesLine}>
                    {data.images?.length > 0 && <div className={styles.anotherImagesLine}>
                        {data.images.map((url, index) => (
                            <div key={index} className={styles.coverColumn}>
                                <img src={URL.createObjectURL(url)} className={styles.cover} />
                                <div className={styles.imageLilRow}>
                                    <button className={styles.imageButton} onClick={() => moveImageLeft(index)}>
                                        <img src='/bannerArrow.svg' className={styles.imageButtonLeft} />
                                    </button>
                                    <button className={styles.createCountButton} onClick={() => removeImage(index)}>
                                        <div className={styles.coverChangeButton}>Удалить</div>
                                    </button>
                                    <button className={styles.imageButton} onClick={() => moveImageRight(index)}>
                                        <img src='/bannerArrow.svg' className={styles.imageButtonRight} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>}
                    <div className={styles.newsImageButtonBox}>
                        <label className="input-file">
                            <input type='file' multiple onChange={handleImagesChange} accept="image/*" />
                            <div className={styles.newsImageButton}>
                                <img src='/plusBanner.svg' className={styles.newsPlus} />
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
};