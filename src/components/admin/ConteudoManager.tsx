
import { useState } from "react";
import { FileText, Plus, Pencil, Trash2, Search, Filter, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdmin, Artigo } from "@/contexts/AdminContext";
import { toast } from "@/hooks/use-toast";

const ConteudoManager = () => {
  const { artigos, adicionarArtigo, atualizarArtigo, removerArtigo, secoesTematicas } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("todas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArtigo, setEditingArtigo] = useState<Artigo | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    resumo: "",
    conteudo: "",
    categoria: "Federal",
    autor: "",
    status: "rascunho" as "publicado" | "rascunho" | "revisao",
    tags: "",
    secaoTematica: ""
  });

  const artigosFiltrados = artigos.filter(artigo => {
    const matchesSearch = artigo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artigo.resumo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategoria === "todas" || artigo.categoria === filterCategoria;
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const artigoData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      dataPublicacao: editingArtigo?.dataPublicacao || new Date().toISOString()
    };
    
    if (editingArtigo) {
      atualizarArtigo(editingArtigo.id, artigoData);
      toast({ title: "Artigo atualizado com sucesso!" });
    } else {
      adicionarArtigo(artigoData);
      toast({ title: "Artigo criado com sucesso!" });
    }
    
    setIsDialogOpen(false);
    setEditingArtigo(null);
    resetForm();
  };

  const handleEdit = (artigo: Artigo) => {
    setEditingArtigo(artigo);
    setFormData({
      titulo: artigo.titulo,
      resumo: artigo.resumo,
      conteudo: artigo.conteudo,
      categoria: artigo.categoria,
      autor: artigo.autor,
      status: artigo.status,
      tags: artigo.tags.join(', '),
      secaoTematica: artigo.secaoTematica || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este artigo?")) {
      removerArtigo(id);
      toast({ title: "Artigo removido com sucesso!" });
    }
  };

  const resetForm = () => {
    setEditingArtigo(null);
    setFormData({
      titulo: "",
      resumo: "",
      conteudo: "",
      categoria: "Federal",
      autor: "",
      status: "rascunho",
      tags: "",
      secaoTematica: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Gestão de Conteúdo</span>
        </h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Artigo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArtigo ? "Editar Artigo" : "Novo Artigo"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({...formData, categoria: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Federal">Federal</SelectItem>
                      <SelectItem value="Estadual">Estadual</SelectItem>
                      <SelectItem value="Municipal">Municipal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="secaoTematica">Seção Temática</Label>
                  <Select
                    value={formData.secaoTematica}
                    onValueChange={(value) => setFormData({...formData, secaoTematica: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma seção" />
                    </SelectTrigger>
                    <SelectContent>
                      {secoesTematicas.map((secao) => (
                        <SelectItem key={secao.id} value={secao.nome}>
                          {secao.titulo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="autor">Autor</Label>
                  <Input
                    id="autor"
                    value={formData.autor}
                    onChange={(e) => setFormData({...formData, autor: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "publicado" | "rascunho" | "revisao") => 
                      setFormData({...formData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rascunho">Rascunho</SelectItem>
                      <SelectItem value="revisao">Em Revisão</SelectItem>
                      <SelectItem value="publicado">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="resumo">Resumo</Label>
                <Textarea
                  id="resumo"
                  value={formData.resumo}
                  onChange={(e) => setFormData({...formData, resumo: e.target.value})}
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="conteudo">Conteúdo</Label>
                <Textarea
                  id="conteudo"
                  value={formData.conteudo}
                  onChange={(e) => setFormData({...formData, conteudo: e.target.value})}
                  rows={8}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  {editingArtigo ? "Atualizar" : "Criar"}
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
            placeholder="Buscar por título ou resumo..."
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
            <SelectItem value="Federal">Federal</SelectItem>
            <SelectItem value="Estadual">Estadual</SelectItem>
            <SelectItem value="Municipal">Municipal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de Artigos */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Seção</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artigosFiltrados.map((artigo) => (
                <TableRow key={artigo.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {artigo.titulo}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{artigo.categoria}</Badge>
                  </TableCell>
                  <TableCell>
                    {artigo.secaoTematica && (
                      <Badge variant="secondary">{artigo.secaoTematica}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{artigo.autor}</TableCell>
                  <TableCell>
                    <Badge variant={artigo.status === "publicado" ? "default" : "secondary"}>
                      {artigo.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(artigo.dataPublicacao).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(artigo)}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(artigo.id)}
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

export default ConteudoManager;
