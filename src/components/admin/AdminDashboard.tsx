import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users, FileText, Calendar, Settings, Plus, Edit, Trash2, Save, X,
  Search, RefreshCw, Eye, BarChart3, Clock
} from "lucide-react";

interface Conteudo {
  id: string;
  titulo: string;
  tipo: string;
  categoria: string;
  orgao_emissor: string | null;
  numero_norma: string | null;
  data_publicacao: string;
  resumo_executivo: string | null;
  comentario_tecnico: string | null;
  texto_oficial: string | null;
  tags: string[] | null;
  nivel_acesso: string;
  status: string;
  destaque: boolean | null;
  visualizacoes: number | null;
  fonte_url: string | null;
  created_at: string | null;
}

interface Prazo {
  id: string;
  titulo: string;
  descricao: string | null;
  data_vencimento: string;
  recorrencia: string | null;
  categoria: string;
  orgao_responsavel: string | null;
  nivel_acesso: string;
  created_at: string | null;
}

interface Profile {
  id: string;
  nome_completo: string | null;
  email: string | null;
  plano: string | null;
  status: string | null;
  habilitado: boolean | null;
  telefone: string | null;
  empresa: string | null;
  documento: string | null;
  created_at: string | null;
}

const categorias = [
  'Trabalhista', 'Previdenciaria', 'Contabil', 'Fiscal',
  'ICMS', 'ISS', 'IPI', 'PIS', 'COFINS', 'IR', 'INSS',
  'FGTS', 'eSocial', 'SPED', 'Simples Nacional'
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  const [prazos, setPrazos] = useState<Prazo[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Conteudo modal
  const [conteudoModalOpen, setConteudoModalOpen] = useState(false);
  const [editingConteudo, setEditingConteudo] = useState<Conteudo | null>(null);
  const [conteudoForm, setConteudoForm] = useState({
    titulo: '', tipo: 'legislacao', categoria: 'Fiscal',
    orgao_emissor: '', numero_norma: '', resumo_executivo: '',
    comentario_tecnico: '', texto_oficial: '', tags: '',
    nivel_acesso: 'gratuito', status: 'publicado', destaque: false,
    fonte_url: '', data_publicacao: new Date().toISOString().split('T')[0]
  });

  // Prazo modal
  const [prazoModalOpen, setPrazoModalOpen] = useState(false);
  const [editingPrazo, setEditingPrazo] = useState<Prazo | null>(null);
  const [prazoForm, setPrazoForm] = useState({
    titulo: '', descricao: '', data_vencimento: '',
    recorrencia: 'mensal', categoria: 'Fiscal',
    orgao_responsavel: '', nivel_acesso: 'gratuito'
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([loadConteudos(), loadPrazos(), loadProfiles()]);
    setLoading(false);
  };

  const loadConteudos = async () => {
    const { data } = await supabase.from('conteudos').select('*').order('created_at', { ascending: false });
    if (data) setConteudos(data);
  };

  const loadPrazos = async () => {
    const { data } = await supabase.from('prazos_obrigacoes').select('*').order('data_vencimento', { ascending: true });
    if (data) setPrazos(data);
  };

  const loadProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setProfiles(data);
  };

  // CONTEUDO CRUD
  const openConteudoModal = (conteudo?: Conteudo) => {
    if (conteudo) {
      setEditingConteudo(conteudo);
      setConteudoForm({
        titulo: conteudo.titulo, tipo: conteudo.tipo, categoria: conteudo.categoria,
        orgao_emissor: conteudo.orgao_emissor || '', numero_norma: conteudo.numero_norma || '',
        resumo_executivo: conteudo.resumo_executivo || '', comentario_tecnico: conteudo.comentario_tecnico || '',
        texto_oficial: conteudo.texto_oficial || '', tags: (conteudo.tags || []).join(', '),
        nivel_acesso: conteudo.nivel_acesso, status: conteudo.status,
        destaque: conteudo.destaque || false, fonte_url: conteudo.fonte_url || '',
        data_publicacao: conteudo.data_publicacao
      });
    } else {
      setEditingConteudo(null);
      setConteudoForm({
        titulo: '', tipo: 'legislacao', categoria: 'Fiscal',
        orgao_emissor: '', numero_norma: '', resumo_executivo: '',
        comentario_tecnico: '', texto_oficial: '', tags: '',
        nivel_acesso: 'gratuito', status: 'publicado', destaque: false,
        fonte_url: '', data_publicacao: new Date().toISOString().split('T')[0]
      });
    }
    setConteudoModalOpen(true);
  };

  const saveConteudo = async () => {
    const payload = {
      titulo: conteudoForm.titulo,
      tipo: conteudoForm.tipo,
      categoria: conteudoForm.categoria,
      orgao_emissor: conteudoForm.orgao_emissor || null,
      numero_norma: conteudoForm.numero_norma || null,
      resumo_executivo: conteudoForm.resumo_executivo || null,
      comentario_tecnico: conteudoForm.comentario_tecnico || null,
      texto_oficial: conteudoForm.texto_oficial || null,
      tags: conteudoForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      nivel_acesso: conteudoForm.nivel_acesso,
      status: conteudoForm.status,
      destaque: conteudoForm.destaque,
      fonte_url: conteudoForm.fonte_url || null,
      data_publicacao: conteudoForm.data_publicacao,
      autor_id: user?.id || null
    };

    let error;
    if (editingConteudo) {
      ({ error } = await supabase.from('conteudos').update(payload).eq('id', editingConteudo.id));
    } else {
      ({ error } = await supabase.from('conteudos').insert(payload));
    }

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingConteudo ? "Conteúdo atualizado!" : "Conteúdo criado!" });
      setConteudoModalOpen(false);
      loadConteudos();
    }
  };

  const deleteConteudo = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este conteúdo?")) return;
    const { error } = await supabase.from('conteudos').delete().eq('id', id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Conteúdo excluído!" });
      loadConteudos();
    }
  };

  // PRAZO CRUD
  const openPrazoModal = (prazo?: Prazo) => {
    if (prazo) {
      setEditingPrazo(prazo);
      setPrazoForm({
        titulo: prazo.titulo, descricao: prazo.descricao || '',
        data_vencimento: prazo.data_vencimento, recorrencia: prazo.recorrencia || 'mensal',
        categoria: prazo.categoria, orgao_responsavel: prazo.orgao_responsavel || '',
        nivel_acesso: prazo.nivel_acesso
      });
    } else {
      setEditingPrazo(null);
      setPrazoForm({
        titulo: '', descricao: '', data_vencimento: '',
        recorrencia: 'mensal', categoria: 'Fiscal',
        orgao_responsavel: '', nivel_acesso: 'gratuito'
      });
    }
    setPrazoModalOpen(true);
  };

  const savePrazo = async () => {
    const payload = {
      titulo: prazoForm.titulo,
      descricao: prazoForm.descricao || null,
      data_vencimento: prazoForm.data_vencimento,
      recorrencia: prazoForm.recorrencia || null,
      categoria: prazoForm.categoria,
      orgao_responsavel: prazoForm.orgao_responsavel || null,
      nivel_acesso: prazoForm.nivel_acesso
    };

    let error;
    if (editingPrazo) {
      ({ error } = await supabase.from('prazos_obrigacoes').update(payload).eq('id', editingPrazo.id));
    } else {
      ({ error } = await supabase.from('prazos_obrigacoes').insert(payload));
    }

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingPrazo ? "Prazo atualizado!" : "Prazo criado!" });
      setPrazoModalOpen(false);
      loadPrazos();
    }
  };

  const deletePrazo = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este prazo?")) return;
    const { error } = await supabase.from('prazos_obrigacoes').delete().eq('id', id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Prazo excluído!" });
      loadPrazos();
    }
  };

  // Trigger update-content edge function
  const triggerContentUpdate = async () => {
    toast({ title: "Atualizando conteúdos...", description: "Buscando dados mais recentes." });
    try {
      const { data, error } = await supabase.functions.invoke('update-content');
      if (error) throw error;
      toast({ title: "Conteúdos atualizados!", description: "Dados atualizados com sucesso." });
      loadAllData();
    } catch (err: any) {
      toast({ title: "Erro na atualização", description: err.message, variant: "destructive" });
    }
  };

  const filteredConteudos = conteudos.filter(c =>
    c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: "Conteúdos", value: conteudos.length, icon: FileText, color: "text-blue-600" },
    { label: "Publicados", value: conteudos.filter(c => c.status === 'publicado').length, icon: Eye, color: "text-emerald-600" },
    { label: "Prazos", value: prazos.length, icon: Calendar, color: "text-purple-600" },
    { label: "Usuários", value: profiles.length, icon: Users, color: "text-orange-600" },
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Painel Administrativo Master</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadAllData}>
            <RefreshCw className="w-4 h-4 mr-2" /> Recarregar
          </Button>
          <Button variant="outline" onClick={triggerContentUpdate}>
            <BarChart3 className="w-4 h-4 mr-2" /> Atualizar Conteúdos Automáticos
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center space-x-4">
              <s.icon className={`w-8 h-8 ${s.color}`} />
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="conteudos" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conteudos"><FileText className="w-4 h-4 mr-2" />Conteúdos</TabsTrigger>
          <TabsTrigger value="prazos"><Calendar className="w-4 h-4 mr-2" />Prazos</TabsTrigger>
          <TabsTrigger value="usuarios"><Users className="w-4 h-4 mr-2" />Usuários</TabsTrigger>
          <TabsTrigger value="configuracoes"><Settings className="w-4 h-4 mr-2" />Configurações</TabsTrigger>
        </TabsList>

        {/* CONTEÚDOS TAB */}
        <TabsContent value="conteudos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gestão de Conteúdos ({conteudos.length})</CardTitle>
              <Button onClick={() => openConteudoModal()}>
                <Plus className="w-4 h-4 mr-2" /> Novo Conteúdo
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Acesso</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConteudos.map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium max-w-xs truncate">{c.titulo}</TableCell>
                        <TableCell><Badge variant="outline">{c.tipo}</Badge></TableCell>
                        <TableCell><Badge variant="secondary">{c.categoria}</Badge></TableCell>
                        <TableCell>
                          <Badge className={c.status === 'publicado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell><Badge variant="outline">{c.nivel_acesso}</Badge></TableCell>
                        <TableCell>{new Date(c.data_publicacao).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm" onClick={() => openConteudoModal(c)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteConteudo(c.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredConteudos.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum conteúdo encontrado</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRAZOS TAB */}
        <TabsContent value="prazos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Prazos e Obrigações ({prazos.length})</CardTitle>
              <Button onClick={() => openPrazoModal()}>
                <Plus className="w-4 h-4 mr-2" /> Novo Prazo
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Recorrência</TableHead>
                    <TableHead>Órgão</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prazos.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.titulo}</TableCell>
                      <TableCell><Badge variant="secondary">{p.categoria}</Badge></TableCell>
                      <TableCell>{new Date(p.data_vencimento).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{p.recorrencia || '-'}</TableCell>
                      <TableCell>{p.orgao_responsavel || '-'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm" onClick={() => openPrazoModal(p)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deletePrazo(p.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {prazos.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum prazo encontrado</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* USUÁRIOS TAB */}
        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <CardTitle>Usuários Cadastrados ({profiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Habilitado</TableHead>
                    <TableHead>Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.nome_completo || '-'}</TableCell>
                      <TableCell>{p.email || '-'}</TableCell>
                      <TableCell><Badge variant="outline">{p.plano || 'gratuito'}</Badge></TableCell>
                      <TableCell>
                        <Badge className={p.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {p.status || 'pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={p.habilitado !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {p.habilitado !== false ? 'Sim' : 'Não'}
                        </Badge>
                      </TableCell>
                      <TableCell>{p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR') : '-'}</TableCell>
                    </TableRow>
                  ))}
                  {profiles.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum usuário encontrado</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONFIGURAÇÕES TAB */}
        <TabsContent value="configuracoes">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Atualização Automática de Conteúdos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use o botão abaixo para buscar e atualizar os conteúdos de legislação automaticamente.
                </p>
                <Button onClick={triggerContentUpdate}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Executar Atualização Agora
                </Button>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Informações do Admin</h3>
                <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
                <p className="text-sm text-muted-foreground">ID: {user?.id}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CONTEÚDO MODAL */}
      <Dialog open={conteudoModalOpen} onOpenChange={setConteudoModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingConteudo ? 'Editar Conteúdo' : 'Novo Conteúdo'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input value={conteudoForm.titulo} onChange={e => setConteudoForm({...conteudoForm, titulo: e.target.value})} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Tipo</Label>
                <Select value={conteudoForm.tipo} onValueChange={v => setConteudoForm({...conteudoForm, tipo: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="legislacao">Legislação</SelectItem>
                    <SelectItem value="noticia">Notícia</SelectItem>
                    <SelectItem value="artigo">Artigo</SelectItem>
                    <SelectItem value="comentario">Comentário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Categoria</Label>
                <Select value={conteudoForm.categoria} onValueChange={v => setConteudoForm({...conteudoForm, categoria: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Data Publicação</Label>
                <Input type="date" value={conteudoForm.data_publicacao} onChange={e => setConteudoForm({...conteudoForm, data_publicacao: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Órgão Emissor</Label>
                <Input value={conteudoForm.orgao_emissor} onChange={e => setConteudoForm({...conteudoForm, orgao_emissor: e.target.value})} />
              </div>
              <div>
                <Label>Número da Norma</Label>
                <Input value={conteudoForm.numero_norma} onChange={e => setConteudoForm({...conteudoForm, numero_norma: e.target.value})} />
              </div>
            </div>
            <div>
              <Label>Resumo Executivo</Label>
              <Textarea value={conteudoForm.resumo_executivo} onChange={e => setConteudoForm({...conteudoForm, resumo_executivo: e.target.value})} rows={3} />
            </div>
            <div>
              <Label>Texto Oficial</Label>
              <Textarea value={conteudoForm.texto_oficial} onChange={e => setConteudoForm({...conteudoForm, texto_oficial: e.target.value})} rows={5} />
            </div>
            <div>
              <Label>Comentário Técnico</Label>
              <Textarea value={conteudoForm.comentario_tecnico} onChange={e => setConteudoForm({...conteudoForm, comentario_tecnico: e.target.value})} rows={3} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Nível de Acesso</Label>
                <Select value={conteudoForm.nivel_acesso} onValueChange={v => setConteudoForm({...conteudoForm, nivel_acesso: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gratuito">Gratuito</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="corporativo">Corporativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={conteudoForm.status} onValueChange={v => setConteudoForm({...conteudoForm, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="publicado">Publicado</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Fonte URL</Label>
                <Input value={conteudoForm.fonte_url} onChange={e => setConteudoForm({...conteudoForm, fonte_url: e.target.value})} placeholder="https://..." />
              </div>
            </div>
            <div>
              <Label>Tags (separadas por vírgula)</Label>
              <Input value={conteudoForm.tags} onChange={e => setConteudoForm({...conteudoForm, tags: e.target.value})} placeholder="tag1, tag2, tag3" />
            </div>
            <div className="flex space-x-2">
              <Button onClick={saveConteudo} className="flex-1">
                <Save className="w-4 h-4 mr-2" /> Salvar
              </Button>
              <Button variant="outline" onClick={() => setConteudoModalOpen(false)}>
                <X className="w-4 h-4 mr-2" /> Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PRAZO MODAL */}
      <Dialog open={prazoModalOpen} onOpenChange={setPrazoModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPrazo ? 'Editar Prazo' : 'Novo Prazo'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input value={prazoForm.titulo} onChange={e => setPrazoForm({...prazoForm, titulo: e.target.value})} />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={prazoForm.descricao} onChange={e => setPrazoForm({...prazoForm, descricao: e.target.value})} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data de Vencimento *</Label>
                <Input type="date" value={prazoForm.data_vencimento} onChange={e => setPrazoForm({...prazoForm, data_vencimento: e.target.value})} />
              </div>
              <div>
                <Label>Recorrência</Label>
                <Select value={prazoForm.recorrencia} onValueChange={v => setPrazoForm({...prazoForm, recorrencia: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                    <SelectItem value="unica">Única</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categoria</Label>
                <Select value={prazoForm.categoria} onValueChange={v => setPrazoForm({...prazoForm, categoria: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Órgão Responsável</Label>
                <Input value={prazoForm.orgao_responsavel} onChange={e => setPrazoForm({...prazoForm, orgao_responsavel: e.target.value})} />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={savePrazo} className="flex-1">
                <Save className="w-4 h-4 mr-2" /> Salvar
              </Button>
              <Button variant="outline" onClick={() => setPrazoModalOpen(false)}>
                <X className="w-4 h-4 mr-2" /> Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
