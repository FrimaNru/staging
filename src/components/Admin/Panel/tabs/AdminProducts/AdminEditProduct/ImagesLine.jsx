import styles from "@/styles/Admin/Products/ProductItem.module.css";
import { useState } from "react";

export default function ImagesLine({ data, setData, activeArticleNumber }) {

    const [coverURL, setCoverURL] = useState([]);
    const [imageURLs, setImageURLs] = useState([]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData({ ...data, cover: [...data.cover.slice(0, activeArticleNumber), file, ...data.cover.slice(activeArticleNumber + 1)] })
        setCoverURL([...coverURL.slice(0, activeArticleNumber), URL.createObjectURL(file), ...coverURL.slice(activeArticleNumber + 1)]);
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);

        const updatedImages = [...data.images];
        updatedImages[activeArticleNumber] = [
            ...(updatedImages[activeArticleNumber] || []),
            ...files
        ];
        setData({ ...data, images: updatedImages });

        const updatedImageURLs = [...imageURLs];
        updatedImageURLs[activeArticleNumber] = [
            ...(updatedImageURLs[activeArticleNumber] || []),
            ...files.map(file => URL.createObjectURL(file))
        ];
        setImageURLs(updatedImageURLs);
    };

    const removeImage = (index) => {
        const updatedImages = [...data.images];
        const updatedImageURLs = [...imageURLs];

        if (updatedImages[activeArticleNumber]) {
            updatedImages[activeArticleNumber] = updatedImages[activeArticleNumber].filter((_, i) => i !== index);
        }
        if (updatedImageURLs[activeArticleNumber]) {
            updatedImageURLs[activeArticleNumber] = updatedImageURLs[activeArticleNumber].filter((_, i) => i !== index);
        }

        setData({ ...data, images: updatedImages });
        setImageURLs(updatedImageURLs);
    };

    const moveImageLeft = (index) => {
        const updatedImages = [...data.images];
        const updatedImageURLs = [...imageURLs];

        if (updatedImages[activeArticleNumber] && index > 0) {
            [updatedImages[activeArticleNumber][index - 1], updatedImages[activeArticleNumber][index]] =
                [updatedImages[activeArticleNumber][index], updatedImages[activeArticleNumber][index - 1]];

            [updatedImageURLs[activeArticleNumber][index - 1], updatedImageURLs[activeArticleNumber][index]] =
                [updatedImageURLs[activeArticleNumber][index], updatedImageURLs[activeArticleNumber][index - 1]];
        }

        setData({ ...data, images: updatedImages });
        setImageURLs(updatedImageURLs);
    };

    const moveImageRight = (index) => {
        const updatedImages = [...data.images];
        const updatedImageURLs = [...imageURLs];

        if (
            updatedImages[activeArticleNumber] &&
            index < updatedImages[activeArticleNumber].length - 1
        ) {
            [updatedImages[activeArticleNumber][index], updatedImages[activeArticleNumber][index + 1]] =
                [updatedImages[activeArticleNumber][index + 1], updatedImages[activeArticleNumber][index]];

            [updatedImageURLs[activeArticleNumber][index], updatedImageURLs[activeArticleNumber][index + 1]] =
                [updatedImageURLs[activeArticleNumber][index + 1], updatedImageURLs[activeArticleNumber][index]];
        }

        setData({ ...data, images: updatedImages });
        setImageURLs(updatedImageURLs);
    };

    return <div className={styles.imagesLine}>
        <div className={styles.imageColumn}>
            <p className={styles.createSubtitle}>Обложка</p>
            <div className={styles.newsImageButtonBox} >
                {(coverURL[activeArticleNumber] || data.cover[activeArticleNumber]) ? (
                    <div className={styles.coverColumn}>
                        <img src={(data.cover[activeArticleNumber] && !coverURL[activeArticleNumber]) ? `https://api.mi-alegria.shop/uploads/${data.cover[activeArticleNumber]}` : coverURL[activeArticleNumber]} className={styles.cover} />
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

        <div className={styles.imageColumn}>
            <p className={styles.createSubtitle}>Добавить фото</p>
            <div className={styles.anotherImagesLine}>
                {data.images[activeArticleNumber]?.length > 0 && <div className={styles.anotherImagesLine}>
                    {data.images[activeArticleNumber].map((url, index) => (
                        <div key={index} className={styles.coverColumn}>
                            <img src={url instanceof File ? URL.createObjectURL(url) : `https://api.mi-alegria.shop/uploads/${url}`} className={styles.cover} />
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
};