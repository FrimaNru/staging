import styles from "../styles.module.css";
import Link from "next/link";

export default function SubcategoryCards({ productType, isSubcategoryPage = false }) {
    // Show subcategory cards for earrings, rings, bracelets, and necklaces only on main category pages
    if (productType !== 'Серьги' && productType !== 'Кольца' && productType !== 'Браслеты' && productType !== 'Колье') {
        return null;
    }
    
    // Don't show subcategory cards on subcategory pages
    if (isSubcategoryPage) {
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

    const braceletsSubcategories = [
        {
            title: 'Широкие',
            url: '/catalog/braslety/shirokie',
            image: '/assets/images/braslshir.webp',
            description: 'Широкие браслеты для яркого образа'
        },
        {
            title: 'Жесткие',
            url: '/catalog/braslety/zhestkie',
            image: '/assets/images/braslzhest.webp',
            description: 'Жесткие браслеты премиум-класса'
        },
        {
            title: 'Под золото',
            url: '/catalog/braslety/pod-zoloto',
            image: '/assets/images/braslzoloto.webp',
            description: 'Золотистые браслеты для элегантности'
        },
        {
            title: 'Под серебро',
            url: '/catalog/braslety/pod-serebro',
            image: '/assets/images/braslserebro.webp',
            description: 'Серебристые браслеты для стиля'
        }
    ];

    const necklacesSubcategories = [
        {
            title: 'Многослойные',
            url: '/catalog/kole/mnogoslojnye',
            image: '/assets/images/kole-mnogoslojnye.webp',
            description: 'Многослойные колье из цепочек'
        },
        {
            title: 'Крупные',
            url: '/catalog/kole/krupnye',
            image: '/assets/images/kole-krupnye.webp',
            description: 'Большие колье на шею'
        },
        {
            title: 'Длинные',
            url: '/catalog/kole/dlinnye',
            image: '/assets/images/kole-dlinnye.webp',
            description: 'Длинные колье на шею'
        },
        {
            title: 'Под золото',
            url: '/catalog/kole/pod-zoloto',
            image: '/assets/images/kole-pod-zoloto.webp',
            description: 'Колье под золото'
        },
        {
            title: 'Под серебро',
            url: '/catalog/kole/pod-serebro',
            image: '/assets/images/kole-pod-serebro.webp',
            description: 'Колье под серебро'
        }
    ];

    const subcategories = 
        productType === 'Серьги' ? earringsSubcategories : 
        productType === 'Кольца' ? ringsSubcategories :
        productType === 'Браслеты' ? braceletsSubcategories :
        necklacesSubcategories;

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
