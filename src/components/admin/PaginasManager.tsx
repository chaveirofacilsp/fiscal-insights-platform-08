import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus, Edit, Trash2, Save, X, Search,
  Layout, Globe, ChevronDown, ChevronRight
} from "lucide-react";

interface PaginaConteudo {
  id: string;
  pagina: string;
  secao: string;
  titulo: string | null;
  subtitulo: string | null;
  conteudo: string | null;
  imagem_url: string | null;
  metadata: any;
  ordem: number | null;
  ativo: boolean | null;
  created_at: string;
  updated_at: string;
}

const PAGINAS_LABELS: Record<string, string> = {
  'home': '🏠 Página Inicial',
  'quem-somos': '👥 Quem Somos',
  'contato': '📞 Contato',
  'cursos': '🎓 Cursos',
  'ferramentas': '🔧 Ferramentas',
  'planos': '💳 Planos',
  'suporte': '🆘 Suporte',
  'newsletter': '📧 Newsletter',
  'consultoria': '💼 Consultoria',
  'softwares': '💻 Softwares',
  'publicacoes': '📚 Publicações',
  'calendario-fiscal': '📅 Calendário Fiscal',
  'desenquadramento': '📋 Desenquadramento',
  'optantes': '✅ Optantes',
  'sublimites': '📊 Sublimites',
  'anexos': '📎 Anexos',
  'calculo': '🧮 Cálculo',
  'ir': '💰 Imposto de Renda',
  'pis-cofins': '📝 PIS/COFINS',
  'icms-iss-ipi': '🏛️ ICMS/ISS/IPI',
  'trabalho-previdencia': '👷 Trabalho e Previdência',
  'comercial': '🏢 Comercial',
  'sped': '💾 SPED',
  'declaracoes': '📄 Declarações',
  'busca-avancada': '🔍 Busca Avançada',
  'ferramentas-uteis': '🛠️ Ferramentas Úteis',
  'reforma-previdencia': '⚖️ Reforma Previdência',
  'contabilidade': '📒 Contabilidade',
  'comunidade': '🤝 Comunidade',
  'ead': '🖥️ EAD',
  'presencial': '🏫 Presencial',
  'in-company': '🏭 In Company',
};

const PaginasManager = () => {
  const [conteudos, setConteudos] = useState<PaginaConteudo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPagina, setFilterPagina] = useState("todas");
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PaginaConteudo | null>(null);
  const [customPagina, setCustomPagina] = useState(false);
  const [form, setForm] = useState({
    pagina: '', secao: '', titulo: '', subtitulo: '',
    conteudo: '', imagem_url: '', ordem: 0, ativo: true
  });

  useEffect(() => { loadConteudos(); }, []);

  const loadConteudos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('paginas_conteudo')
      .select('*')
      .order('pagina')
      .order('ordem', { ascending: true });
    if (data) setConteudos(data);
    if (error) toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
    setLoading(false);
  };

  const openModal = (item?: PaginaConteudo) => {
    setCustomPagina(false);
    if (item) {
      setEditing(item);
      setForm({
        pagina: item.pagina, secao: item.secao,
        titulo: item.titulo || '', subtitulo: item.subtitulo || '',
        conteudo: item.conteudo || '', imagem_url: item.imagem_url || '',
        ordem: item.ordem || 0, ativo: item.ativo !== false
      });
    } else {
      setEditing(null);
      setForm({ pagina: '', secao: '', titulo: '', subtitulo: '', conteudo: '', imagem_url: '', ordem: 0, ativo: true });
    }
    setModalOpen(true);
  };

  const saveConteudo = async () => {
    if (!form.pagina || !form.secao) {
      toast({ title: "Preencha página e seção", variant: "destructive" });
      return;
    }
    const payload = {
      pagina: form.pagina, secao: form.secao,
      titulo: form.titulo || null, subtitulo: form.subtitulo || null,
      conteudo: form.conteudo || null, imagem_url: form.imagem_url || null,
      ordem: form.ordem, ativo: form.ativo,
      updated_at: new Date().toISOString()
    };
    let error;
    if (editing) {
      ({ error } = await supabase.from('paginas_conteudo').update(payload).eq('id', editing.id));
    } else {
      ({ error } = await supabase.from('paginas_conteudo').insert(payload));
    }
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Conteúdo atualizado!" : "Conteúdo criado!" }); setModalOpen(false); loadConteudos(); }
  };

  const deleteConteudo = async (id: string) => {
    if (!confirm("Excluir este conteúdo de página?")) return;
    const { error } = await supabase.from('paginas_conteudo').delete().eq('id', id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Excluído!" }); loadConteudos(); }
  };

  const toggleAtivo = async (item: PaginaConteudo) => {
    const { error } = await supabase.from('paginas_conteudo')
      .update({ ativo: !item.ativo, updated_at: new Date().toISOString() })
      .eq('id', item.id);
    if (!error) loadConteudos();
  };

  const togglePage = (pagina: string) => {
    const next = new Set(expandedPages);
    if (next.has(pagina)) next.delete(pagina); else next.add(pagina);
    setExpandedPages(next);
  };

  const paginas = [...new Set(conteudos.map(c => c.pagina))].sort();
  const displayPaginas = filterPagina === 'todas' ? paginas : paginas.filter(p => p === filterPagina);

  const filtered = conteudos.filter(c =>
    (c.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.pagina.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.secao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Layout className="w-5 h-5" />
          Gestão de Páginas ({conteudos.length} seções)
        </h2>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" /> Nova Seção
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Buscar por título, página ou seção..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Select value={filterPagina} onValueChange={setFilterPagina}>
          <SelectTrigger className="w-56">
            <Globe className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Todas as páginas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as Páginas</SelectItem>
            {paginas.map(p => (
              <SelectItem key={p} value={p}>{PAGINAS_LABELS[p] || p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {displayPaginas.map(pagina => {
        const sections = filtered.filter(c => c.pagina === pagina);
        if (sections.length === 0) return null;
        const isExpanded = expandedPages.has(pagina);

        return (
          <Card key={pagina}>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => togglePage(pagina)}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  {PAGINAS_LABELS[pagina] || pagina}
                  <Badge variant="secondary">{sections.length} seções</Badge>
                </CardTitle>
                <Badge variant="outline" className="text-xs">/{pagina === 'home' ? '' : pagina}</Badge>
              </div>
            </CardHeader>
            {isExpanded && (
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Seção</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Subtítulo</TableHead>
                      <TableHead>Ativo</TableHead>
                      <TableHead>Ordem</TableHead>
                      <TableHead>Atualizado</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sections.map(s => (
                      <TableRow key={s.id}>
                        <TableCell><Badge variant="outline">{s.secao}</Badge></TableCell>
                        <TableCell className="font-medium max-w-xs truncate">{s.titulo || '—'}</TableCell>
                        <TableCell className="max-w-xs truncate text-muted-foreground">{s.subtitulo || '—'}</TableCell>
                        <TableCell>
                          <Switch checked={s.ativo !== false} onCheckedChange={() => toggleAtivo(s)} />
                        </TableCell>
                        <TableCell>{s.ordem}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(s.updated_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" onClick={() => openModal(s)}><Edit className="w-3 h-3" /></Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteConteudo(s.id)}><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            )}
          </Card>
        );
      })}

      {displayPaginas.length === 0 && (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhuma página encontrada</CardContent></Card>
      )}

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Seção de Página' : 'Nova Seção de Página'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Página *</Label>
                {customPagina ? (
                  <div className="flex gap-2">
                    <Input placeholder="nome-da-pagina" value={form.pagina} onChange={e => setForm({ ...form, pagina: e.target.value })} />
                    <Button variant="outline" size="sm" onClick={() => setCustomPagina(false)}>Lista</Button>
                  </div>
                ) : (
                  <Select value={form.pagina} onValueChange={v => {
                    if (v === '__custom__') { setCustomPagina(true); setForm({ ...form, pagina: '' }); }
                    else setForm({ ...form, pagina: v });
                  }}>
                    <SelectTrigger><SelectValue placeholder="Selecione a página" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(PAGINAS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                      <SelectItem value="__custom__">+ Outra página</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div>
                <Label>Seção *</Label>
                <Input value={form.secao} onChange={e => setForm({ ...form, secao: e.target.value })} placeholder="ex: hero, missao, info" />
              </div>
            </div>
            <div>
              <Label>Título</Label>
              <Input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Input value={form.subtitulo} onChange={e => setForm({ ...form, subtitulo: e.target.value })} />
            </div>
            <div>
              <Label>Conteúdo</Label>
              <Textarea value={form.conteudo} onChange={e => setForm({ ...form, conteudo: e.target.value })} rows={6} placeholder="Texto principal da seção..." />
            </div>
            <div>
              <Label>URL da Imagem</Label>
              <Input value={form.imagem_url} onChange={e => setForm({ ...form, imagem_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ordem de exibição</Label>
                <Input type="number" value={form.ordem} onChange={e => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.ativo} onCheckedChange={v => setForm({ ...form, ativo: v })} />
                <Label>Seção ativa</Label>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={saveConteudo} className="flex-1">
                <Save className="w-4 h-4 mr-2" /> {editing ? 'Atualizar' : 'Criar'}
              </Button>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                <X className="w-4 h-4 mr-2" /> Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaginasManager;
