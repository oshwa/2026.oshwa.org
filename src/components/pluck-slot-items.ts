import {
    parse,
    walkSync,
    ELEMENT_NODE,
    DOCUMENT_NODE,
    renderSync,
} from "ultrahtml";

export default function pluckSlotItems(rendered: string): string[] {
    if(!rendered) {
        return [];
    }
    const root = parse(rendered);
    const items: any[] = [];
    walkSync(root, (n, parent, index): void => {
        if (n && n.type !== ELEMENT_NODE) return;
        if (parent?.type != DOCUMENT_NODE) return;
        items.push(renderSync(n));
    });
    return items;
}
