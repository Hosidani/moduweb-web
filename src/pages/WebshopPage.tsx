import { useState } from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
}

const WebshopPage = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, title: "Starter Kit", price: 29, stock: 12 },
    { id: 2, title: "Pro Module", price: 79, stock: 3 },
  ]);
  
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);

  const addProduct = () => {
    if (!title) return;
    setProducts([...products, { 
      id: Date.now(), 
      title, 
      price: Number(price), 
      stock: 10 
    }]);
    setTitle("");
    setPrice(0);
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="content-wrapper">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-text-primary">Webshop Manager</h2>
        <div className="text-sm text-text-secondary">
          Orders: <span className="font-medium">12</span> • Revenue: <span className="font-medium text-success">$3,240</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 card p-6">
          <h3 className="font-semibold text-text-primary mb-4">Products</h3>
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-bg rounded-lg border border-border hover:shadow-soft transition-shadow">
                <div>
                  <div className="font-medium text-text-primary">{p.title}</div>
                  <div className="text-xs text-text-secondary">
                    <span className="font-medium text-success">${p.price}</span> • {p.stock} in stock
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary text-sm">
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteProduct(p.id)}
                    className="btn-danger text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <h4 className="font-medium text-text-primary mb-3">Add product</h4>
            <div className="flex gap-3">
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Product title" 
                className="input flex-1"
              />
              <input 
                value={price} 
                onChange={e => setPrice(Number(e.target.value))} 
                placeholder="Price" 
                type="number" 
                className="input w-32"
              />
              <button 
                onClick={addProduct} 
                className="btn-primary"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 card p-6">
          <h3 className="font-semibold text-text-primary">📊 Quick Analytics</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Sales last 7 days:</span>
              <span className="font-semibold text-success">$1,200</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Top product:</span>
              <span className="font-medium text-text-primary">{products[0]?.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Total products:</span>
              <span className="font-medium text-text-primary">{products.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebshopPage;