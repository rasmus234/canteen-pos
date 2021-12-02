export class MenuItem {
    public itemId?: number;
    public name?: string;
    public price?: number;
    public category?: string;
    public image?: string;

    constructor(itemId: number, name: string, price: number, category: string, image: string) {
        this.itemId = itemId;
        this.name = name;
        this.price = price;
        this.category = category;
        this.image = image;
    }
}