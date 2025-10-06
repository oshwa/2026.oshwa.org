import { root } from "astro:config/server";

const ImportableImages = import.meta.glob<{ default: ImageMetadata }>('/src/**/*.{jpeg,jpg,png,gif,webp}');
// looks like { '/src/people/lee.jpg' : () }


export default async function dynamicImportImage(image: string, base: string): Promise<ImageMetadata> {
    // image eis a string like "./image.jpg" or "../other/image.jpg", it can not be absolute.
    // base is a string like "/Users/stargirl/workspace/oshwa/2026.oshwa.org/src/people/lee.md"
    // root is a string like "file:///Users/stargirl/workspace/oshwa/2026.oshwa.org/"
    // rootPath is a string like "/Users/stargirl/workspace/oshwa/2026.oshwa.org/"

    // First, resolve the absolute URL to the image
    const baseUrl = URL.parse(`file://${base}`)!;
    const imageUrl = URL.parse(image, baseUrl)!;

    // Then remove the common root path
    const rootUrl = URL.parse(root)!;
    const importedImageName = imageUrl.pathname.slice(rootUrl.pathname.length - 1);

    const importableImage = ImportableImages[importedImageName]();

    return (await importableImage).default;
}
