
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  type: string;
  size: string;
  color: string;
  sellingPrice: number;
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface SaleItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  platform: string;
  items: SaleItem[];
  total: number;
  date: string;
}

export const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customerId: "",
    platform: "",
    items: [] as SaleItem[],
  });

  const [newItem, setNewItem] = useState({
    productId: "",
    quantity: "1",
  });

  useEffect(() => {
    const savedSales = JSON.parse(localStorage.getItem("sales") || "[]");
    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const savedCustomers = JSON.parse(localStorage.getItem("customers") || "[]");
    const savedPlatforms = JSON.parse(localStorage.getItem("platforms") || '["Physical Store", "Website", "WhatsApp", "Instagram"]');

    setSales(savedSales);
    setProducts(savedProducts);
    setCustomers(savedCustomers);
    setPlatforms(savedPlatforms);
  }, []);

  const saveSales = (newSales: Sale[]) => {
    localStorage.setItem("sales", JSON.stringify(newSales));
    setSales(newSales);
  };

  const saveProducts = (newProducts: Product[]) => {
    localStorage.setItem("products", JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  const addItemToSale = () => {
    const product = products.find(p => p.id === newItem.productId);
    if (!product) return;

    const quantity = parseInt(newItem.quantity);
    if (quantity > product.quantity) {
      toast({ 
        title: "Insufficient stock", 
        description: `Only ${product.quantity} items available`,
        variant: "destructive"
      });
      return;
    }

    const saleItem: SaleItem = {
      productId: product.id,
      productName: `${product.name} (${product.size}, ${product.color})`,
      price: product.sellingPrice,
      quantity: quantity,
    };

    setFormData({
      ...formData,
      items: [...formData.items, saleItem]
    });

    setNewItem({ productId: "", quantity: "1" });
  };

  const removeItemFromSale = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.items.length === 0) {
      toast({ 
        title: "No items", 
        description: "Please add at least one item to the sale",
        variant: "destructive"
      });
      return;
    }

    const customer = customers.find(c => c.id === formData.customerId);
    if (!customer) return;

    const total = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const sale: Sale = {
      id: Date.now().toString(),
      customerId: formData.customerId,
      customerName: customer.name,
      platform: formData.platform,
      items: formData.items,
      total,
      date: new Date().toISOString(),
    };

    // Update product quantities
    const updatedProducts = products.map(product => {
      const saleItem = formData.items.find(item => item.productId === product.id);
      if (saleItem) {
        return {
          ...product,
          quantity: product.quantity - saleItem.quantity
        };
      }
      return product;
    });

    saveProducts(updatedProducts);
    saveSales([...sales, sale]);

    toast({ title: "Sale recorded successfully!" });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      customerId: "",
      platform: "",
      items: [],
    });
    setNewItem({ productId: "", quantity: "1" });
    setShowForm(false);
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sales</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Record Sale
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Record New Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer">Customer</Label>
                  <Select value={formData.customerId} onValueChange={(value) => setFormData({...formData, customerId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={formData.platform} onValueChange={(value) => setFormData({...formData, platform: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map(platform => (
                        <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4">Add Items</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="product">Product</Label>
                    <Select value={newItem.productId} onValueChange={(value) => setNewItem({...newItem, productId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.filter(p => p.quantity > 0).map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.size}, {product.color}) - ${product.sellingPrice} (Stock: {product.quantity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button type="button" onClick={addItemToSale} disabled={!newItem.productId}>
                      Add Item
                    </Button>
                  </div>
                </div>

                {formData.items.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2">Sale Items:</h5>
                    <div className="space-y-2">
                      {formData.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span>{item.productName} x {item.quantity}</span>
                          <div className="flex items-center gap-2">
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => removeItemFromSale(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="text-right font-bold">
                        Total: ${calculateTotal().toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit">Record Sale</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Platform</th>
                  <th className="text-left p-2">Items</th>
                  <th className="text-left p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="p-2">{sale.customerName}</td>
                    <td className="p-2">{sale.platform}</td>
                    <td className="p-2">{sale.items.length} items</td>
                    <td className="p-2">${sale.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
