import styles from "../styles.module.css";
import Link from "next/link";

export default function SubcategoryCards({ productType }) {
    // Show subcategory cards for earrings and rings
    if (productType !== 'Серьги' && productType !== 'Кольца') {
        return null;
    }

    const earringsSubcategories = [
        {
            title: 'Длинные',
            url: '/catalog/sergi/dlinnye',
            image: '/assets/images/dlinnie.webp',
            description: 'Висячие серьги для особых случаев'
        },
        {
            title: 'Крупные',
            url: '/catalog/sergi/krupnye',
            image: '/assets/images/big.webp',
            description: 'Объемные серьги для яркого образа'
        },
        {
            title: 'Под золото',
            url: '/catalog/sergi/pod-zoloto',
            image: '/assets/images/gold.webp',
            description: 'Золотистые серьги для элегантности'
        },
        {
            title: 'Под серебро',
            url: '/catalog/sergi/pod-serebro',
            image: '/assets/images/silver.webp',
            description: 'Серебристые серьги для стиля'
        }
    ];

    const ringsSubcategories = [
        {
            title: 'Крупные',
            url: '/catalog/kolcza/krupnye',
            image: '/assets/images/bigRing.webp',
            description: 'Большие кольца для яркого образа'
        },
        {
            title: 'Под золото',
            url: '/catalog/kolcza/pod-zoloto',
            image: '/assets/images/goldRing.webp',
            description: 'Золотистые кольца для элегантности'
        },
        {
            title: 'Под серебро',
            url: '/catalog/kolcza/pod-serebro',
            image: '/assets/images/silverRing.webp',
            description: 'Серебристые кольца для стиля'
        }
    ];

    const subcategories = productType === 'Серьги' ? earringsSubcategories : ringsSubcategories;

    return (
        <div className={styles.subcategoryCards}>
            <div className={styles.subcategoryGrid}>
                {subcategories.map((subcategory, index) => (
                    <Link 
                        key={index} 
                        href={subcategory.url}
                        className={styles.subcategoryCard}
                    >
                        <div className={styles.subcategoryImageContainer}>
                            <img 
                                src={subcategory.image} 
                                alt={subcategory.title}
                                className={styles.subcategoryImage}
                                onError={(e) => {
                                    // Fallback to placeholder if image doesn't exist
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div 
                                className={styles.subcategoryImagePlaceholder}
                                style={{ display: 'none' }}
                            >
                                <span>Изображение</span>
                            </div>
                            <div className={styles.subcategoryImageOverlay}>
                                <span className={styles.subcategoryImageText}>{subcategory.title}</span>
                            </div>
                        </div>
                        <div className={styles.subcategoryContent}>
                            <p className={styles.subcategoryDescription}>{subcategory.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
