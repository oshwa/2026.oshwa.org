import { root } from "astro:config/server";

const ImportableImages = import.meta.glob<{ default: ImageMetadata }>('/src/**/*.{jpeg,jpg,png,gif,webp,svg}');
// looks like { '/src/people/lee.jpg' : () }


export default async function dynamicImportImage(image: string, base: string | URL): Promise<ImageMetadata> {
    // image is a string like "./image.jpg" or "../other/image.jpg", it can not be absolute.
    // base is a string like "/Users/stargirl/workspace/oshwa/2026.oshwa.org/src/people/lee.md"
    // root is a URL like "file:///Users/stargirl/workspace/oshwa/2026.oshwa.org/"

    if(image.startsWith("/")) {
        throw new Error(`Image path must be relative, but got ${image}`);
    }

    if (!image.startsWith(".")) {
        image = `./${image}`;
    }

    // First, resolve the absolute URL to the image
    const baseUrl = base instanceof URL ? base : URL.parse(`file://${base}`, root)!;
    const imageUrl = URL.parse(image, baseUrl)!;

    if (!imageUrl.pathname.startsWith(root.pathname)) {
        throw new Error(`Image path must be within the project root, but got ${imageUrl.pathname}`);
    }

    const importName = imageUrl.pathname.slice(root.pathname.length - 1);

    if(!importName){
        throw new Error(`Could not resolve image path ${image} from base ${base}`);
    }

    const importModule = ImportableImages[importName];

    if(!importModule) {
        throw new Error(`Image ${importName} not found in importable images`);
    }

    return (await importModule()).default;
}
