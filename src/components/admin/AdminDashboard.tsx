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
  Search, RefreshCw, Eye, BarChart3, CreditCard, ClipboardList,
  GraduationCap, FileSpreadsheet, UserCheck, UserX, Check
} from "lucide-react";

interface Conteudo {
  id: string; titulo: string; tipo: string; categoria: string;
  orgao_emissor: string | null; numero_norma: string | null;
  data_publicacao: string; resumo_executivo: string | null;
  comentario_tecnico: string | null; texto_oficial: string | null;
  tags: string[] | null; nivel_acesso: string; status: string;
  destaque: boolean | null; visualizacoes: number | null;
  fonte_url: string | null; created_at: string | null;
}

interface Prazo {
  id: string; titulo: string; descricao: string | null;
  data_vencimento: string; recorrencia: string | null;
  categoria: string; orgao_responsavel: string | null;
  nivel_acesso: string; created_at: string | null;
}

interface Profile {
  id: string; nome_completo: string | null; email: string | null;
  plano: string | null; status: string | null; habilitado: boolean | null;
  telefone: string | null; empresa: string | null; documento: string | null;
  created_at: string | null;
}

interface Plano {
  id: string; nome: string; descricao: string | null; preco: number | null;
  tipo: string; ativo: boolean | null; recursos: any; created_at: string | null;
}

interface Solicitacao {
  id: string; nome: string; email: string; telefone: string | null;
  empresa: string | null; descricao_necessidade: string;
  status: string | null; user_id: string | null; created_at: string | null;
}

interface Matricula {
  id: string; nome_curso: string; tipo_curso: string; valor: number | null;
  status: string | null; user_id: string | null; dados_matricula: any;
  created_at: string | null;
}

interface Planilha {
  id: string; mes: number; ano: number; arquivo_url: string;
  descricao: string | null; created_at: string | null;
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
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [planilhas, setPlanilhas] = useState<Planilha[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");

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

  // Plano modal
  const [planoModalOpen, setPlanoModalOpen] = useState(false);
  const [editingPlano, setEditingPlano] = useState<Plano | null>(null);
  const [planoForm, setPlanoForm] = useState({
    nome: '', descricao: '', preco: '', tipo: 'fixo', ativo: true
  });

  // Planilha modal
  const [planilhaModalOpen, setPlanilhaModalOpen] = useState(false);
  const [editingPlanilha, setEditingPlanilha] = useState<Planilha | null>(null);
  const [planilhaForm, setPlanilhaForm] = useState({
    mes: '', ano: '', arquivo_url: '', descricao: ''
  });

  useEffect(() => { loadAllData(); }, []);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadConteudos(), loadPrazos(), loadProfiles(),
      loadPlanos(), loadSolicitacoes(), loadMatriculas(), loadPlanilhas()
    ]);
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
  const loadPlanos = async () => {
    const { data } = await supabase.from('planos_assinatura').select('*').order('created_at', { ascending: false });
    if (data) setPlanos(data);
  };
  const loadSolicitacoes = async () => {
    const { data } = await supabase.from('solicitacoes_orcamento').select('*').order('created_at', { ascending: false });
    if (data) setSolicitacoes(data);
  };
  const loadMatriculas = async () => {
    const { data } = await supabase.from('matriculas').select('*').order('created_at', { ascending: false });
    if (data) setMatriculas(data);
  };
  const loadPlanilhas = async () => {
    const { data } = await supabase.from('planilhas_mensais').select('*').order('ano', { ascending: false });
    if (data) setPlanilhas(data);
  };

  // ===== CONTEUDO CRUD =====
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
        titulo: '', tipo: 'legislacao', categoria: 'Fiscal', orgao_emissor: '', numero_norma: '',
        resumo_executivo: '', comentario_tecnico: '', texto_oficial: '', tags: '',
        nivel_acesso: 'gratuito', status: 'publicado', destaque: false,
        fonte_url: '', data_publicacao: new Date().toISOString().split('T')[0]
      });
    }
    setConteudoModalOpen(true);
  };

  const saveConteudo = async () => {
    const payload = {
      titulo: conteudoForm.titulo, tipo: conteudoForm.tipo, categoria: conteudoForm.categoria,
      orgao_emissor: conteudoForm.orgao_emissor || null, numero_norma: conteudoForm.numero_norma || null,
      resumo_executivo: conteudoForm.resumo_executivo || null, comentario_tecnico: conteudoForm.comentario_tecnico || null,
      texto_oficial: conteudoForm.texto_oficial || null,
      tags: conteudoForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      nivel_acesso: conteudoForm.nivel_acesso, status: conteudoForm.status,
      destaque: conteudoForm.destaque, fonte_url: conteudoForm.fonte_url || null,
      data_publicacao: conteudoForm.data_publicacao, autor_id: user?.id || null
    };
    let error;
    if (editingConteudo) {
      ({ error } = await supabase.from('conteudos').update(payload).eq('id', editingConteudo.id));
    } else {
      ({ error } = await supabase.from('conteudos').insert(payload));
    }
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); }
    else { toast({ title: editingConteudo ? "Conteúdo atualizado!" : "Conteúdo criado!" }); setConteudoModalOpen(false); loadConteudos(); }
  };

  const deleteConteudo = async (id: string) => {
    if (!confirm("Excluir este conteúdo?")) return;
    const { error } = await supabase.from('conteudos').delete().eq('id', id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Excluído!" }); loadConteudos(); }
  };

  // ===== PRAZO CRUD =====
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
      setPrazoForm({ titulo: '', descricao: '', data_vencimento: '', recorrencia: 'mensal', categoria: 'Fiscal', orgao_responsavel: '', nivel_acesso: 'gratuito' });
    }
    setPrazoModalOpen(true);
  };

  const savePrazo = async () => {
    const payload = {
      titulo: prazoForm.titulo, descricao: prazoForm.descricao || null,
      data_vencimento: prazoForm.data_vencimento, recorrencia: prazoForm.recorrencia || null,
      categoria: prazoForm.categoria, orgao_responsavel: prazoForm.orgao_responsavel || null,
      nivel_acesso: prazoForm.nivel_acesso
    };
    let error;
    if (editingPrazo) { ({ error } = await supabase.from('prazos_obrigacoes').update(payload).eq('id', editingPrazo.id)); }
    else { ({ error } = await supabase.from('prazos_obrigacoes').insert(payload)); }
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: editingPrazo ? "Prazo atualizado!" : "Prazo criado!" }); setPrazoModalOpen(false); loadPrazos(); }
  };

  const deletePrazo = async (id: string) => {
    if (!confirm("Excluir este prazo?")) return;
    const { error } = await supabase.from('prazos_obrigacoes').delete().eq('id', id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Excluído!" }); loadPrazos(); }
  };

  // ===== PROFILE ACTIONS =====
  const updateProfile = async (id: string, updates: Partial<Profile>) => {
    const { error } = await supabase.from('profiles').update(updates).eq('id', id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Usuário atualizado!" }); loadProfiles(); }
  };

  // ===== PLANO CRUD =====
  const openPlanoModal = (plano?: Plano) => {
    if (plano) {
      setEditingPlano(plano);
      setPlanoForm({ nome: plano.nome, descricao: plano.descricao || '', preco: plano.preco?.toString() || '', tipo: plano.tipo, ativo: plano.ativo !== false });
    } else {
      setEditingPlano(null);
      setPlanoForm({ nome: '', descricao: '', preco: '', tipo: 'fixo', ativo: true });
    }
    setPlanoModalOpen(true);
  };

  const savePlano = async () => {
    const payload = {
      nome: planoForm.nome, descricao: planoForm.descricao || null,
      preco: planoForm.preco ? parseFloat(planoForm.preco) : null,
      tipo: planoForm.tipo, ativo: planoForm.ativo
    };
    let error;
    if (editingPlano) { ({ error } = await supabase.from('planos_assinatura').update(payload).eq('id', editingPlano.id)); }
    else { ({ error } = await supabase.from('planos_assinatura').insert(payload)); }
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: editingPlano ? "Plano atualizado!" : "Plano criado!" }); setPlanoModalOpen(false); loadPlanos(); }
  };

  const deletePlano = async (id: string) => {
    if (!confirm("Excluir este plano?")) return;
    const { error } = await supabase.from('planos_assinatura').delete().eq('id', id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Excluído!" }); loadPlanos(); }
  };

  // ===== SOLICITACAO UPDATE =====
  const updateSolicitacaoStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('solicitacoes_orcamento').update({ status }).eq('id', id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Status atualizado!" }); loadSolicitacoes(); }
  };

  // ===== MATRICULA UPDATE =====
  const updateMatriculaStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('matriculas').update({ status }).eq('id', id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Status atualizado!" }); loadMatriculas(); }
  };

  // ===== PLANILHA CRUD =====
  const openPlanilhaModal = (planilha?: Planilha) => {
    if (planilha) {
      setEditingPlanilha(planilha);
      setPlanilhaForm({ mes: planilha.mes.toString(), ano: planilha.ano.toString(), arquivo_url: planilha.arquivo_url, descricao: planilha.descricao || '' });
    } else {
      setEditingPlanilha(null);
      setPlanilhaForm({ mes: '', ano: new Date().getFullYear().toString(), arquivo_url: '', descricao: '' });
    }
    setPlanilhaModalOpen(true);
  };

  const savePlanilha = async () => {
    const payload = {
      mes: parseInt(planilhaForm.mes), ano: parseInt(planilhaForm.ano),
      arquivo_url: planilhaForm.arquivo_url, descricao: planilhaForm.descricao || null
    };
    let error;
    if (editingPlanilha) { ({ error } = await supabase.from('planilhas_mensais').update(payload).eq('id', editingPlanilha.id)); }
    else { ({ error } = await supabase.from('planilhas_mensais').insert(payload)); }
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: editingPlanilha ? "Planilha atualizada!" : "Planilha criada!" }); setPlanilhaModalOpen(false); loadPlanilhas(); }
  };

  const deletePlanilha = async (id: string) => {
    if (!confirm("Excluir esta planilha?")) return;
    const { error } = await supabase.from('planilhas_mensais').delete().eq('id', id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Excluída!" }); loadPlanilhas(); }
  };

  const triggerContentUpdate = async () => {
    toast({ title: "Atualizando conteúdos..." });
    try {
      const { error } = await supabase.functions.invoke('update-content');
      if (error) throw error;
      toast({ title: "Conteúdos atualizados!" }); loadAllData();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  const filteredConteudos = conteudos.filter(c =>
    c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProfiles = profiles.filter(p =>
    (p.nome_completo || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const stats = [
    { label: "Conteúdos", value: conteudos.length, icon: FileText, color: "text-blue-600" },
    { label: "Usuários", value: profiles.length, icon: Users, color: "text-orange-600" },
    { label: "Solicitações", value: solicitacoes.filter(s => s.status === 'pendente').length, icon: ClipboardList, color: "text-yellow-600" },
    { label: "Matrículas", value: matriculas.length, icon: GraduationCap, color: "text-purple-600" },
  ];

  if (loading) {
    return <div className="p-6 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Painel Administrativo Master</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadAllData}><RefreshCw className="w-4 h-4 mr-2" /> Recarregar</Button>
          <Button variant="outline" onClick={triggerContentUpdate}><BarChart3 className="w-4 h-4 mr-2" /> Atualizar Automáticos</Button>
        </div>
      </div>

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
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="conteudos"><FileText className="w-4 h-4 mr-1" /><span className="hidden sm:inline">Conteúdos</span></TabsTrigger>
          <TabsTrigger value="prazos"><Calendar className="w-4 h-4 mr-1" /><span className="hidden sm:inline">Prazos</span></TabsTrigger>
          <TabsTrigger value="usuarios"><Users className="w-4 h-4 mr-1" /><span className="hidden sm:inline">Usuários</span></TabsTrigger>
          <TabsTrigger value="planos"><CreditCard className="w-4 h-4 mr-1" /><span className="hidden sm:inline">Planos</span></TabsTrigger>
          <TabsTrigger value="solicitacoes"><ClipboardList className="w-4 h-4 mr-1" /><span className="hidden sm:inline">Solicitações</span></TabsTrigger>
          <TabsTrigger value="matriculas"><GraduationCap className="w-4 h-4 mr-1" /><span className="hidden sm:inline">Matrículas</span></TabsTrigger>
          <TabsTrigger value="planilhas"><FileSpreadsheet className="w-4 h-4 mr-1" /><span className="hidden sm:inline">Planilhas</span></TabsTrigger>
          <TabsTrigger value="configuracoes"><Settings className="w-4 h-4 mr-1" /><span className="hidden sm:inline">Config</span></TabsTrigger>
        </TabsList>

        {/* CONTEÚDOS TAB */}
        <TabsContent value="conteudos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gestão de Conteúdos ({conteudos.length})</CardTitle>
              <Button onClick={() => openConteudoModal()}><Plus className="w-4 h-4 mr-2" /> Novo</Button>
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
                          <Badge className={c.status === 'publicado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{c.status}</Badge>
                        </TableCell>
                        <TableCell><Badge variant="outline">{c.nivel_acesso}</Badge></TableCell>
                        <TableCell>{new Date(c.data_publicacao).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm" onClick={() => openConteudoModal(c)}><Edit className="w-3 h-3" /></Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteConteudo(c.id)}><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredConteudos.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum conteúdo</TableCell></TableRow>}
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
              <Button onClick={() => openPrazoModal()}><Plus className="w-4 h-4 mr-2" /> Novo</Button>
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
                          <Button variant="outline" size="sm" onClick={() => openPrazoModal(p)}><Edit className="w-3 h-3" /></Button>
                          <Button variant="destructive" size="sm" onClick={() => deletePrazo(p.id)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {prazos.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum prazo</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* USUÁRIOS TAB - with edit capabilities */}
        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Usuários ({profiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Buscar por nome ou email..." value={userSearchTerm} onChange={e => setUserSearchTerm(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Habilitado</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfiles.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.nome_completo || '-'}</TableCell>
                        <TableCell>{p.email || '-'}</TableCell>
                        <TableCell>
                          <Select value={p.plano || 'gratuito'} onValueChange={v => updateProfile(p.id, { plano: v })}>
                            <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gratuito">Gratuito</SelectItem>
                              <SelectItem value="basico">Básico</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="corporativo">Corporativo</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select value={p.status || 'pendente'} onValueChange={v => updateProfile(p.id, { status: v })}>
                            <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ativo">Ativo</SelectItem>
                              <SelectItem value="pendente">Pendente</SelectItem>
                              <SelectItem value="bloqueado">Bloqueado</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline" size="sm"
                            className={p.habilitado !== false ? 'text-green-600' : 'text-red-600'}
                            onClick={() => updateProfile(p.id, { habilitado: p.habilitado === false })}
                          >
                            {p.habilitado !== false ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                          </Button>
                        </TableCell>
                        <TableCell>{p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR') : '-'}</TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground">
                            {p.telefone && <div>📞 {p.telefone}</div>}
                            {p.empresa && <div>🏢 {p.empresa}</div>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProfiles.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum usuário</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PLANOS TAB */}
        <TabsContent value="planos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Planos de Assinatura ({planos.length})</CardTitle>
              <Button onClick={() => openPlanoModal()}><Plus className="w-4 h-4 mr-2" /> Novo Plano</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ativo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planos.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.nome}</TableCell>
                      <TableCell className="max-w-xs truncate">{p.descricao || '-'}</TableCell>
                      <TableCell>{p.preco ? `R$ ${p.preco.toFixed(2)}` : 'Sob consulta'}</TableCell>
                      <TableCell><Badge variant="outline">{p.tipo}</Badge></TableCell>
                      <TableCell>
                        <Badge className={p.ativo !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {p.ativo !== false ? 'Sim' : 'Não'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm" onClick={() => openPlanoModal(p)}><Edit className="w-3 h-3" /></Button>
                          <Button variant="destructive" size="sm" onClick={() => deletePlano(p.id)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {planos.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum plano</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SOLICITAÇÕES TAB */}
        <TabsContent value="solicitacoes">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Orçamento ({solicitacoes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Necessidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {solicitacoes.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.nome}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>{s.empresa || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate">{s.descricao_necessidade}</TableCell>
                      <TableCell>
                        <Select value={s.status || 'pendente'} onValueChange={v => updateSolicitacaoStatus(s.id, v)}>
                          <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="analisando">Analisando</SelectItem>
                            <SelectItem value="respondido">Respondido</SelectItem>
                            <SelectItem value="fechado">Fechado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{s.created_at ? new Date(s.created_at).toLocaleDateString('pt-BR') : '-'}</TableCell>
                      <TableCell>
                        {s.telefone && <span className="text-xs text-muted-foreground">📞 {s.telefone}</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                  {solicitacoes.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhuma solicitação</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MATRÍCULAS TAB */}
        <TabsContent value="matriculas">
          <Card>
            <CardHeader>
              <CardTitle>Matrículas ({matriculas.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matriculas.map(m => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.nome_curso}</TableCell>
                      <TableCell><Badge variant="outline">{m.tipo_curso}</Badge></TableCell>
                      <TableCell>{m.valor ? `R$ ${m.valor.toFixed(2)}` : '-'}</TableCell>
                      <TableCell>
                        <Select value={m.status || 'pendente'} onValueChange={v => updateMatriculaStatus(m.id, v)}>
                          <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="aprovada">Aprovada</SelectItem>
                            <SelectItem value="cancelada">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{m.created_at ? new Date(m.created_at).toLocaleDateString('pt-BR') : '-'}</TableCell>
                    </TableRow>
                  ))}
                  {matriculas.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhuma matrícula</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PLANILHAS TAB */}
        <TabsContent value="planilhas">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Planilhas Mensais ({planilhas.length})</CardTitle>
              <Button onClick={() => openPlanilhaModal()}><Plus className="w-4 h-4 mr-2" /> Nova</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês/Ano</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planilhas.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{String(p.mes).padStart(2, '0')}/{p.ano}</TableCell>
                      <TableCell>{p.descricao || '-'}</TableCell>
                      <TableCell><a href={p.arquivo_url} target="_blank" className="text-blue-600 underline truncate block max-w-xs">{p.arquivo_url}</a></TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm" onClick={() => openPlanilhaModal(p)}><Edit className="w-3 h-3" /></Button>
                          <Button variant="destructive" size="sm" onClick={() => deletePlanilha(p.id)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {planilhas.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Nenhuma planilha</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONFIGURAÇÕES TAB */}
        <TabsContent value="configuracoes">
          <Card>
            <CardHeader><CardTitle>Configurações do Sistema</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Atualização Automática de Conteúdos</h3>
                <p className="text-sm text-muted-foreground mb-4">Buscar e atualizar conteúdos de legislação automaticamente.</p>
                <Button onClick={triggerContentUpdate}><RefreshCw className="w-4 h-4 mr-2" /> Executar Agora</Button>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Informações do Admin</h3>
                <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CONTEÚDO MODAL */}
      <Dialog open={conteudoModalOpen} onOpenChange={setConteudoModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingConteudo ? 'Editar Conteúdo' : 'Novo Conteúdo'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Título *</Label><Input value={conteudoForm.titulo} onChange={e => setConteudoForm({...conteudoForm, titulo: e.target.value})} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Tipo</Label>
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
              <div><Label>Categoria</Label>
                <Select value={conteudoForm.categoria} onValueChange={v => setConteudoForm({...conteudoForm, categoria: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Data</Label><Input type="date" value={conteudoForm.data_publicacao} onChange={e => setConteudoForm({...conteudoForm, data_publicacao: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Órgão Emissor</Label><Input value={conteudoForm.orgao_emissor} onChange={e => setConteudoForm({...conteudoForm, orgao_emissor: e.target.value})} /></div>
              <div><Label>Número da Norma</Label><Input value={conteudoForm.numero_norma} onChange={e => setConteudoForm({...conteudoForm, numero_norma: e.target.value})} /></div>
            </div>
            <div><Label>Resumo Executivo</Label><Textarea value={conteudoForm.resumo_executivo} onChange={e => setConteudoForm({...conteudoForm, resumo_executivo: e.target.value})} rows={3} /></div>
            <div><Label>Texto Oficial</Label><Textarea value={conteudoForm.texto_oficial} onChange={e => setConteudoForm({...conteudoForm, texto_oficial: e.target.value})} rows={5} /></div>
            <div><Label>Comentário Técnico</Label><Textarea value={conteudoForm.comentario_tecnico} onChange={e => setConteudoForm({...conteudoForm, comentario_tecnico: e.target.value})} rows={3} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Acesso</Label>
                <Select value={conteudoForm.nivel_acesso} onValueChange={v => setConteudoForm({...conteudoForm, nivel_acesso: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gratuito">Gratuito</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="corporativo">Corporativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Status</Label>
                <Select value={conteudoForm.status} onValueChange={v => setConteudoForm({...conteudoForm, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="publicado">Publicado</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Fonte URL</Label><Input value={conteudoForm.fonte_url} onChange={e => setConteudoForm({...conteudoForm, fonte_url: e.target.value})} placeholder="https://..." /></div>
            </div>
            <div><Label>Tags (vírgula)</Label><Input value={conteudoForm.tags} onChange={e => setConteudoForm({...conteudoForm, tags: e.target.value})} /></div>
            <div className="flex space-x-2">
              <Button onClick={saveConteudo} className="flex-1"><Save className="w-4 h-4 mr-2" /> Salvar</Button>
              <Button variant="outline" onClick={() => setConteudoModalOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PRAZO MODAL */}
      <Dialog open={prazoModalOpen} onOpenChange={setPrazoModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingPrazo ? 'Editar Prazo' : 'Novo Prazo'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Título *</Label><Input value={prazoForm.titulo} onChange={e => setPrazoForm({...prazoForm, titulo: e.target.value})} /></div>
            <div><Label>Descrição</Label><Textarea value={prazoForm.descricao} onChange={e => setPrazoForm({...prazoForm, descricao: e.target.value})} rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Vencimento *</Label><Input type="date" value={prazoForm.data_vencimento} onChange={e => setPrazoForm({...prazoForm, data_vencimento: e.target.value})} /></div>
              <div><Label>Recorrência</Label>
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
              <div><Label>Categoria</Label>
                <Select value={prazoForm.categoria} onValueChange={v => setPrazoForm({...prazoForm, categoria: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Órgão</Label><Input value={prazoForm.orgao_responsavel} onChange={e => setPrazoForm({...prazoForm, orgao_responsavel: e.target.value})} /></div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={savePrazo} className="flex-1"><Save className="w-4 h-4 mr-2" /> Salvar</Button>
              <Button variant="outline" onClick={() => setPrazoModalOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PLANO MODAL */}
      <Dialog open={planoModalOpen} onOpenChange={setPlanoModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingPlano ? 'Editar Plano' : 'Novo Plano'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome *</Label><Input value={planoForm.nome} onChange={e => setPlanoForm({...planoForm, nome: e.target.value})} /></div>
            <div><Label>Descrição</Label><Textarea value={planoForm.descricao} onChange={e => setPlanoForm({...planoForm, descricao: e.target.value})} rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Preço (R$)</Label><Input type="number" step="0.01" value={planoForm.preco} onChange={e => setPlanoForm({...planoForm, preco: e.target.value})} placeholder="0.00" /></div>
              <div><Label>Tipo</Label>
                <Select value={planoForm.tipo} onValueChange={v => setPlanoForm({...planoForm, tipo: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixo">Fixo</SelectItem>
                    <SelectItem value="orcamento">Orçamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={savePlano} className="flex-1"><Save className="w-4 h-4 mr-2" /> Salvar</Button>
              <Button variant="outline" onClick={() => setPlanoModalOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PLANILHA MODAL */}
      <Dialog open={planilhaModalOpen} onOpenChange={setPlanilhaModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingPlanilha ? 'Editar Planilha' : 'Nova Planilha'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Mês *</Label>
                <Select value={planilhaForm.mes} onValueChange={v => setPlanilhaForm({...planilhaForm, mes: v})}>
                  <SelectTrigger><SelectValue placeholder="Mês" /></SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 12}, (_, i) => (
                      <SelectItem key={i+1} value={String(i+1)}>{String(i+1).padStart(2,'0')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Ano *</Label><Input type="number" value={planilhaForm.ano} onChange={e => setPlanilhaForm({...planilhaForm, ano: e.target.value})} /></div>
            </div>
            <div><Label>URL do Arquivo *</Label><Input value={planilhaForm.arquivo_url} onChange={e => setPlanilhaForm({...planilhaForm, arquivo_url: e.target.value})} placeholder="https://..." /></div>
            <div><Label>Descrição</Label><Input value={planilhaForm.descricao} onChange={e => setPlanilhaForm({...planilhaForm, descricao: e.target.value})} /></div>
            <div className="flex space-x-2">
              <Button onClick={savePlanilha} className="flex-1"><Save className="w-4 h-4 mr-2" /> Salvar</Button>
              <Button variant="outline" onClick={() => setPlanilhaModalOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
