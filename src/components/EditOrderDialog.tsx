import { useState } from 'react';
import { Order } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Plus, Trash2, Building2 } from 'lucide-react';

interface EditOrderDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<Order>) => void;
}

export function EditOrderDialog({
  order,
  open,
  onOpenChange,
  onSave,
}: EditOrderDialogProps) {
  const [quantity, setQuantity] = useState(order.quantity.toString());
  const [estimatedValue, setEstimatedValue] = useState(order.estimatedValue.toString());
  const [category, setCategory] = useState(order.category || '');
  const [suppliers, setSuppliers] = useState<string[]>(
    order.suppliers || (order.supplier ? [order.supplier] : [])
  );
  const [newSupplier, setNewSupplier] = useState('');

  const handleSave = () => {
    onSave({
      quantity: parseInt(quantity) || order.quantity,
      estimatedValue: parseFloat(estimatedValue) || order.estimatedValue,
      category: category.trim() || undefined,
      suppliers: suppliers.length > 0 ? suppliers : undefined,
    });
    onOpenChange(false);
  };

  const handleAddSupplier = () => {
    if (newSupplier.trim() && !suppliers.includes(newSupplier.trim())) {
      setSuppliers([...suppliers, newSupplier.trim()]);
      setNewSupplier('');
    }
  };

  const handleRemoveSupplier = (supplierToRemove: string) => {
    setSuppliers(suppliers.filter(s => s !== supplierToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Pedido</DialogTitle>
          <DialogDescription>
            Atualize as informações do pedido {order.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Item Info (read-only) */}
          <div className="space-y-2">
            <Label className="text-gray-500">Item</Label>
            <p className="text-sm p-2 bg-gray-50 rounded">{order.item}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-500">SKU</Label>
            <p className="text-sm p-2 bg-gray-50 rounded font-mono">{order.sku}</p>
          </div>

          <Separator />

          {/* Editable Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedValue">Valor Unitário</Label>
              <Input
                id="estimatedValue"
                type="number"
                step="0.01"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Digite a categoria do produto"
            />
          </div>

          <Separator />

          {/* Suppliers Section */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Fornecedores
            </Label>

            {/* Existing suppliers */}
            {suppliers.length > 0 && (
              <div className="space-y-2">
                {suppliers.map((supplier, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{supplier}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveSupplier(supplier)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new supplier */}
            <div className="flex gap-2">
              <Input
                value={newSupplier}
                onChange={(e) => setNewSupplier(e.target.value)}
                placeholder="Nome do fornecedor"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSupplier()}
              />
              <Button onClick={handleAddSupplier} type="button">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          <Separator />

          {/* Summary */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <p className="text-sm text-gray-600">Resumo da Edição</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500">Valor Total</p>
                <p className="text-lg">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format((parseInt(quantity) || 0) * (parseFloat(estimatedValue) || 0))}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Fornecedores</p>
                <p className="text-lg">{suppliers.length}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} style={{ backgroundColor: '#465EFF' }}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
