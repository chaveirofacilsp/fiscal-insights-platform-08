
import { useState } from "react";
import { ShoppingCart, Plus, Eye, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdmin, Venda } from "@/contexts/AdminContext";
import { toast } from "@/hooks/use-toast";

const VendasManager = () => {
  const { vendas, adicionarVenda, atualizarVenda } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    produto: "",
    cliente: "",
    email: "",
    valor: 0,
    status: "pendente" as "concluida" | "pendente" | "cancelada",
    tipoProduto: "curso" as "curso" | "consultoria" | "software" | "material"
  });

  const vendasFiltradas = vendas.filter(venda => {
    const matchesSearch = venda.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venda.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "todas" || venda.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Estatísticas
  const totalVendas = vendas.reduce((sum, venda) => 
    venda.status === 'concluida' ? sum + venda.valor : sum, 0
  );
  const vendasPendentes = vendas.filter(v => v.status === 'pendente').length;
  const vendasConcluidas = vendas.filter(v => v.status === 'concluida').length;
  const vendasMes = vendas.filter(v => {
    const dataVenda = new Date(v.dataVenda);
    const agora = new Date();
    return dataVenda.getMonth() === agora.getMonth() && 
           dataVenda.getFullYear() === agora.getFullYear();
  }).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    adicionarVenda({
      ...formData,
      dataVenda: new Date().toISOString()
    });
    
    toast({ title: "Venda adicionada com sucesso!" });
    setIsDialogOpen(false);
    resetForm();
  };

  const handleStatusChange = (id: string, novoStatus: "concluida" | "pendente" | "cancelada") => {
    atualizarVenda(id, { status: novoStatus });
    toast({ title: "Status da venda atualizado!" });
  };

  const resetForm = () => {
    setFormData({
      produto: "",
      cliente: "",
      email: "",
      valor: 0,
      status: "pendente",
      tipoProduto: "curso"
    });
  };

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total de Vendas</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Vendas Concluídas</p>
                <p className="text-2xl font-bold text-blue-600">{vendasConcluidas}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Vendas Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{vendasPendentes}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Vendas neste Mês</p>
                <p className="text-2xl font-bold text-purple-600">{vendasMes}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5" />
          <span>Relatórios de Vendas</span>
        </h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Venda
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Venda</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="produto">Produto/Serviço</Label>
                <Input
                  id="produto"
                  value={formData.produto}
                  onChange={(e) => setFormData({...formData, produto: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input
                    id="cliente"
                    value={formData.cliente}
                    onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="tipoProduto">Tipo</Label>
                  <Select
                    value={formData.tipoProduto}
                    onValueChange={(value: "curso" | "consultoria" | "software" | "material") => 
                      setFormData({...formData, tipoProduto: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="curso">Curso</SelectItem>
                      <SelectItem value="consultoria">Consultoria</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "concluida" | "pendente" | "cancelada") => 
                      setFormData({...formData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  Criar Venda
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por produto ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todos os Status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="concluida">Concluída</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de Vendas */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendasFiltradas.map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell className="font-medium">{venda.produto}</TableCell>
                  <TableCell>{venda.cliente}</TableCell>
                  <TableCell>{venda.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{venda.tipoProduto}</Badge>
                  </TableCell>
                  <TableCell>R$ {venda.valor.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={venda.status}
                      onValueChange={(value: "concluida" | "pendente" | "cancelada") => 
                        handleStatusChange(venda.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="concluida">Concluída</SelectItem>
                        <SelectItem value="cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(venda.dataVenda).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendasManager;
