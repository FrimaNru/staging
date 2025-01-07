import styles from "@/styles/Admin/Products/ProductItem.module.css";
import { useState } from "react";

export default function ImagesLine({ data, setData, activeArticleNumber }) {

    const [cover, setCover] = useState(null);
    const [coverURL, setCoverURL] = useState([]);
    const [imageURLs, setImageURLs] = useState([]);
    const [images, setImages] = useState([]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData({ ...data, cover: [...data.cover.slice(0, activeArticleNumber), file, ...data.cover.slice(activeArticleNumber + 1)] })
        setCoverURL([...coverURL.slice(0, activeArticleNumber), URL.createObjectURL(file), ...coverURL.slice(activeArticleNumber + 1)]);
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...images, ...files];
        setImages(newImages);

        const newImageURLs = newImages.map(file => URL.createObjectURL(file));
        setImageURLs(newImageURLs);
    };

    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);

        const updatedImageURLs = updatedImages.map(file => URL.createObjectURL(file));
        setImageURLs(updatedImageURLs);
    };

    return <div className={styles.imagesLine}>
        <div className={styles.imageColumn}>
            <p className={styles.createSubtitle}>Обложка</p>
            <div className={styles.newsImageButtonBox} >
                {coverURL[activeArticleNumber] ? (
                    <div className={styles.coverColumn}>
                        <img src={coverURL[activeArticleNumber]} className={styles.cover} />
                        <label className="input-file">
                            <input type='file' onChange={handleFileChange} />
                            <div className={styles.coverChangeButton}>Заменить</div>
                        </label>
                    </div>
                ) :
                    <label className="input-file">
                        <input type='file' onChange={handleFileChange} />
                        <div className={styles.newsImageButton}>
                            <img src='/plusBanner.svg' className={styles.newsPlus} />
                        </div>
                    </label>}
            </div>
        </div>

        {/* <div className={styles.createLilColumn}>
                <p className={styles.createSubtitle}>Фотографии</p>
                <div className={styles.newsCoverBox}>
                    {imageURLs.map((url, index) => (
                        <div key={index} className={styles.newsCoverBox}>
                            <img src={url} className={styles.newsCoverImage} />
                            <button className={styles.createCountButton} onClick={() => removeImage(index)}>
                                <img src='/trash.svg' />
                            </button>
                        </div>
                    ))}
                </div>
                <div className={styles.newsImageButtonBox}>
                    <label className="input-file">
                        <input type='file' multiple onChange={handleImagesChange} />
                        <div className={styles.newsImageButton}>
                            <img src='/plusIcon.svg' className={styles.newsPlus} />
                        </div>
                    </label>
                </div>
            </div> */}
    </div>
};