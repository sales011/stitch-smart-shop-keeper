
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Settings = () => {
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [newType, setNewType] = useState("");
  const [newSupplier, setNewSupplier] = useState("");
  const [newPlatform, setNewPlatform] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedTypes = JSON.parse(localStorage.getItem("productTypes") || '["T-Shirt", "Jeans", "Dress", "Jacket"]');
    const savedSuppliers = JSON.parse(localStorage.getItem("suppliers") || '["Supplier A", "Supplier B", "Supplier C"]');
    const savedPlatforms = JSON.parse(localStorage.getItem("platforms") || '["Physical Store", "Website", "WhatsApp", "Instagram"]');

    setProductTypes(savedTypes);
    setSuppliers(savedSuppliers);
    setPlatforms(savedPlatforms);
  }, []);

  const addProductType = () => {
    if (newType.trim() && !productTypes.includes(newType.trim())) {
      const updatedTypes = [...productTypes, newType.trim()];
      localStorage.setItem("productTypes", JSON.stringify(updatedTypes));
      setProductTypes(updatedTypes);
      setNewType("");
      toast({ title: "Product type added successfully!" });
    }
  };

  const removeProductType = (type: string) => {
    const updatedTypes = productTypes.filter(t => t !== type);
    localStorage.setItem("productTypes", JSON.stringify(updatedTypes));
    setProductTypes(updatedTypes);
    toast({ title: "Product type removed successfully!" });
  };

  const addSupplier = () => {
    if (newSupplier.trim() && !suppliers.includes(newSupplier.trim())) {
      const updatedSuppliers = [...suppliers, newSupplier.trim()];
      localStorage.setItem("suppliers", JSON.stringify(updatedSuppliers));
      setSuppliers(updatedSuppliers);
      setNewSupplier("");
      toast({ title: "Supplier added successfully!" });
    }
  };

  const removeSupplier = (supplier: string) => {
    const updatedSuppliers = suppliers.filter(s => s !== supplier);
    localStorage.setItem("suppliers", JSON.stringify(updatedSuppliers));
    setSuppliers(updatedSuppliers);
    toast({ title: "Supplier removed successfully!" });
  };

  const addPlatform = () => {
    if (newPlatform.trim() && !platforms.includes(newPlatform.trim())) {
      const updatedPlatforms = [...platforms, newPlatform.trim()];
      localStorage.setItem("platforms", JSON.stringify(updatedPlatforms));
      setPlatforms(updatedPlatforms);
      setNewPlatform("");
      toast({ title: "Platform added successfully!" });
    }
  };

  const removePlatform = (platform: string) => {
    const updatedPlatforms = platforms.filter(p => p !== platform);
    localStorage.setItem("platforms", JSON.stringify(updatedPlatforms));
    setPlatforms(updatedPlatforms);
    toast({ title: "Platform removed successfully!" });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="New product type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addProductType()}
                />
                <Button onClick={addProductType} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {productTypes.map((type) => (
                  <div key={type} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span>{type}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeProductType(type)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="New supplier"
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSupplier()}
                />
                <Button onClick={addSupplier} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {suppliers.map((supplier) => (
                  <div key={supplier} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span>{supplier}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeSupplier(supplier)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="New platform"
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPlatform()}
                />
                <Button onClick={addPlatform} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {platforms.map((platform) => (
                  <div key={platform} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span>{platform}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removePlatform(platform)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              All data is stored locally in your browser's localStorage. This means your data persists between sessions but is only available on this device.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  const data = {
                    products: localStorage.getItem("products"),
                    customers: localStorage.getItem("customers"),
                    sales: localStorage.getItem("sales"),
                    productTypes: localStorage.getItem("productTypes"),
                    suppliers: localStorage.getItem("suppliers"),
                    platforms: localStorage.getItem("platforms"),
                  };
                  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "erp-backup.json";
                  a.click();
                  toast({ title: "Data exported successfully!" });
                }}
              >
                Export Data
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                Clear All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
