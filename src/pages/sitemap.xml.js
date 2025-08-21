import axios from "axios";
import { API_BASE_URL } from "../../apiConfig";
import { buildProductSlug, SEO_CONFIG } from "@/lib/seo";

const SECTION_SLUGS = ["kolcza", "kole", "sergi", "braslety"];

function generateUrlXml(loc, lastmod = new Date().toISOString(), priority = "0.8") {
  return `\n<url>\n\t<loc>${loc}</loc>\n\t<lastmod>${lastmod}</lastmod>\n\t<priority>${priority}</priority>\n</url>`;
}

function generateSiteMapXml({ baseUrl, products = [] }) {
  const now = new Date().toISOString();
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n\t\t<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Static pages
  xml += generateUrlXml(`${baseUrl}/`, now, "1.0");
  xml += generateUrlXml(`${baseUrl}/catalog`, now, "1.0");
  SECTION_SLUGS.forEach((slug) => {
    xml += generateUrlXml(`${baseUrl}/catalog/${slug}`, now, "0.9");
  });
  xml += generateUrlXml(`${baseUrl}/delivery`, now, "1.0");
  xml += generateUrlXml(`${baseUrl}/brand`, now, "1.0");
  xml += generateUrlXml(`${baseUrl}/faq`, now, "1.0");
  xml += generateUrlXml(`${baseUrl}/documents/policy`, now, "0.8");
  xml += generateUrlXml(`${baseUrl}/documents/agreement`, now, "0.8");
  xml += generateUrlXml(`${baseUrl}/mobileApp/ios`, now, "0.8");
  xml += generateUrlXml(`${baseUrl}/mobileApp/android`, now, "0.8");
  xml += generateUrlXml(`${baseUrl}/kontakty`, now, "1.0");

  // Product pages
  products.forEach((product) => {
    const slug = buildProductSlug(product);
    if (!slug) return;
    xml += generateUrlXml(`${baseUrl}/product/${slug}`, now, "0.7");
  });

  xml += "\n</urlset>";
  return xml;
}

export async function getServerSideProps({ res }) {
  try {
    const baseUrl = SEO_CONFIG.BASE_URL;

    // Fetch all products for sitemap
    const response = await axios.get(`${API_BASE_URL}getProducts`);
    const products = Array.isArray(response.data) ? response.data : [];

    const xml = generateSiteMapXml({ baseUrl, products });
    res.setHeader("Content-Type", "text/xml");
    res.write(xml);
    res.end();
  } catch (e) {
    const fallback = generateSiteMapXml({ baseUrl: SEO_CONFIG.BASE_URL, products: [] });
    res.setHeader("Content-Type", "text/xml");
    res.write(fallback);
    res.end();
  }

  return { props: {} };
}

export default function SiteMap() {
  return null;
}


