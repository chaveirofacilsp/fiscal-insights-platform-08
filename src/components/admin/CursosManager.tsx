
import { useState } from "react";
import { BookOpen, Plus, Pencil, Trash2, Search, Filter, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdmin, Curso } from "@/contexts/AdminContext";
import { toast } from "@/hooks/use-toast";

const CursosManager = () => {
  const { cursos, adicionarCurso, atualizarCurso, removerCurso } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("todas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    instrutor: "",
    duracao: 0,
    preco: 0,
    status: "rascunho" as "ativo" | "inativo" | "rascunho"
  });

  const cursosFiltrados = cursos.filter(curso => {
    const matchesSearch = curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         curso.instrutor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategoria === "todas" || curso.categoria === filterCategoria;
    return matchesSearch && matchesFilter;
  });

  const categorias = Array.from(new Set(cursos.map(curso => curso.categoria)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCurso) {
      atualizarCurso(editingCurso.id, formData);
      toast({ title: "Curso atualizado com sucesso!" });
    } else {
      adicionarCurso({
        ...formData,
        dataLancamento: new Date().toISOString(),
        alunos: 0,
        avaliacoes: 0
      });
      toast({ title: "Curso criado com sucesso!" });
    }
    
    setIsDialogOpen(false);
    setEditingCurso(null);
    resetForm();
  };

  const handleEdit = (curso: Curso) => {
    setEditingCurso(curso);
    setFormData({
      titulo: curso.titulo,
      descricao: curso.descricao,
      categoria: curso.categoria,
      instrutor: curso.instrutor,
      duracao: curso.duracao,
      preco: curso.preco,
      status: curso.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este curso?")) {
      removerCurso(id);
      toast({ title: "Curso removido com sucesso!" });
    }
  };

  const resetForm = () => {
    setEditingCurso(null);
    setFormData({
      titulo: "",
      descricao: "",
      categoria: "",
      instrutor: "",
      duracao: 0,
      preco: 0,
      status: "rascunho"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span>Gestão de Cursos</span>
        </h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCurso ? "Editar Curso" : "Novo Curso"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título do Curso</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    placeholder="Ex: Trabalho, SPED, IR"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="instrutor">Instrutor</Label>
                  <Input
                    id="instrutor"
                    value={formData.instrutor}
                    onChange={(e) => setFormData({...formData, instrutor: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duracao">Duração (horas)</Label>
                  <Input
                    id="duracao"
                    type="number"
                    value={formData.duracao}
                    onChange={(e) => setFormData({...formData, duracao: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData({...formData, preco: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "ativo" | "inativo" | "rascunho") => 
                      setFormData({...formData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rascunho">Rascunho</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  {editingCurso ? "Atualizar" : "Criar"}
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Buscar por título ou instrutor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategoria} onValueChange={setFilterCategoria}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as Categorias</SelectItem>
            {categorias.map((categoria) => (
              <SelectItem key={categoria} value={categoria}>
                {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de Cursos */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Instrutor</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead>Avaliação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cursosFiltrados.map((curso) => (
                <TableRow key={curso.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {curso.titulo}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{curso.categoria}</Badge>
                  </TableCell>
                  <TableCell>{curso.instrutor}</TableCell>
                  <TableCell>{curso.duracao}h</TableCell>
                  <TableCell>R$ {curso.preco.toFixed(2)}</TableCell>
                  <TableCell>{curso.alunos}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-sm">{curso.avaliacoes}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={curso.status === "ativo" ? "default" : "secondary"}>
                      {curso.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(curso)}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(curso.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
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

export default CursosManager;
