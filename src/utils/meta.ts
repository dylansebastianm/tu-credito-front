/**
 * Metadata/SEO Utilities - Tu Crédito Frontend
 * Helper manual para establecer metadatos del documento sin librerías externas
 */

export interface DocumentMeta {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

const DEFAULT_TITLE = 'Tu Crédito - Sistema de Gestión';
const DEFAULT_DESCRIPTION = 'Sistema de gestión de clientes, créditos y bancos';

/**
 * Establece los metadatos del documento
 */
export function setDocumentMeta(meta: DocumentMeta): void {
  const { title, description, ogTitle, ogDescription, ogImage, ogUrl } = meta;

  // Title
  if (title) {
    document.title = `${title} | ${DEFAULT_TITLE}`;
  } else {
    document.title = DEFAULT_TITLE;
  }

  // Description
  setMetaTag('description', description || DEFAULT_DESCRIPTION);

  // Open Graph
  if (ogTitle || title) {
    setMetaTag('og:title', ogTitle || title || DEFAULT_TITLE, 'property');
  }
  if (ogDescription || description) {
    setMetaTag('og:description', ogDescription || description || DEFAULT_DESCRIPTION, 'property');
  }
  if (ogImage) {
    setMetaTag('og:image', ogImage, 'property');
  }
  if (ogUrl) {
    setMetaTag('og:url', ogUrl, 'property');
  }
  setMetaTag('og:type', 'website', 'property');
}

/**
 * Helper para establecer o actualizar un meta tag
 */
function setMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

/**
 * Restablece los metadatos al estado por defecto
 */
export function resetDocumentMeta(): void {
  setDocumentMeta({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  });
}
