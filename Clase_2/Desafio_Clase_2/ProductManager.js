class ProductManager {

    static productId = 0
    constructor() {
        this.products = [];
    }

    async addProduct(product) {
        try {
            
            const { title, description, price, thumbnail, code, stock, category } = product;

            if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios!");
                return
            }

            if (this.products.find( prod => prod.code === code)) {
                console.log("Ya existe un producto con ese codigo");
                return
            }

            product.id = ProductManager.productId;

            this.products.push(product);

            ProductManager.productId++;

            console.log("Producto agregado correctamente");
            return
            

        } catch (error) {
            console.log(error);
            return
        }
    }

    async getProducts() {
        try {
            
            const products = this.products;
            console.log("La lista de productos es:");
            console.table(products);
            return products

        } catch (error) {
            console.log(error);
            return
        }
    }

    async getProductById(id) {
        try {
            
            const productSearch = this.products.find(prod => prod.id === id);
            if (productSearch) {
                console.log(`El producto con el id ${id} es:`);
                console.table(productSearch);
                return productSearch
            } else {
                console.log(`El producto con id ${id} no fue encontrado`)
                return
            }

        } catch (error) {
            console.log(error);
            return
        }
    }
}

const testing = () => {
    const productManager = new ProductManager();

    const product = {
        title: "producto prueba",
        description: "Este es un producto prueba",
        price: "200",
        thumbnail: 'Sin imagen',
        code: "abc123",
        stock: 25,
        category: "categoria prueba"
    };

    const product1 = {
        title: "producto prueba2",
        description: "Este es un producto prueba2",
        price: "200",
        thumbnail: 'Sin imagen',
        code: "abc456",
        stock: 25,
        category: "categoria prueba"
    };

    productManager.addProduct(product); //Devuelve: Producto agregado correctamente
    productManager.addProduct(product1); //Devuelve: Producto agregado correctamente
    productManager.getProducts(); //Devuelve: La lista de productos
    productManager.getProductById(0); //Devuelve: El producto con el id 0
    productManager.addProduct(product); //Devuelve: Ya existe un producto con ese codigo
}

testing();