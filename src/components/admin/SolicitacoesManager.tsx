
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, MessageSquare, Search, Filter } from "lucide-react";

interface SolicitacaoOrcamento {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  empresa: string | null;
  descricao_necessidade: string;
  status: 'pendente' | 'analisando' | 'respondido' | 'fechado';
  created_at: string;
}

const SolicitacoesManager = () => {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoOrcamento[]>([]);
  const [filteredSolicitacoes, setFilteredSolicitacoes] = useState<SolicitacaoOrcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<SolicitacaoOrcamento | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  const fetchSolicitacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('solicitacoes_orcamento')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSolicitacoes(data || []);
      setFilteredSolicitacoes(data || []);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      toast({
        title: "Erro ao carregar solicitações",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  useEffect(() => {
    let filtered = solicitacoes;

    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.empresa?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "todos") {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    setFilteredSolicitacoes(filtered);
  }, [searchTerm, statusFilter, solicitacoes]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('solicitacoes_orcamento')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setSolicitacoes(prev => 
        prev.map(s => s.id === id ? { ...s, status: newStatus as any } : s)
      );

      toast({
        title: "Status atualizado",
        description: "O status da solicitação foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'analisando': return 'bg-blue-100 text-blue-800';
      case 'respondido': return 'bg-green-100 text-green-800';
      case 'fechado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="p-6">Carregando solicitações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Solicitações de Orçamento</h2>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {filteredSolicitacoes.length} solicitações
        </Badge>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Pesquisar por nome, email ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="analisando">Analisando</SelectItem>
            <SelectItem value="respondido">Respondido</SelectItem>
            <SelectItem value="fechado">Fechado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Solicitações */}
      <div className="grid gap-4">
        {filteredSolicitacoes.map((solicitacao) => (
          <Card key={solicitacao.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{solicitacao.nome}</h3>
                    <Badge className={getStatusColor(solicitacao.status)}>
                      {solicitacao.status}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                    <p><strong>Email:</strong> {solicitacao.email}</p>
                    <p><strong>Telefone:</strong> {solicitacao.telefone || 'Não informado'}</p>
                    <p><strong>Empresa:</strong> {solicitacao.empresa || 'Não informada'}</p>
                    <p><strong>Data:</strong> {formatDate(solicitacao.created_at)}</p>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    <strong>Necessidade:</strong> {solicitacao.descricao_necessidade}
                  </p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSolicitacao(solicitacao);
                      setDetailsOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Detalhes
                  </Button>
                  <Select 
                    value={solicitacao.status} 
                    onValueChange={(value) => updateStatus(solicitacao.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="analisando">Analisando</SelectItem>
                      <SelectItem value="respondido">Respondido</SelectItem>
                      <SelectItem value="fechado">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSolicitacoes.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Nenhuma solicitação encontrada.</p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Detalhes */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
          </DialogHeader>
          {selectedSolicitacao && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1">Nome Completo</h4>
                  <p className="text-gray-700">{selectedSolicitacao.nome}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-gray-700">{selectedSolicitacao.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Telefone</h4>
                  <p className="text-gray-700">{selectedSolicitacao.telefone || 'Não informado'}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Empresa</h4>
                  <p className="text-gray-700">{selectedSolicitacao.empresa || 'Não informada'}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Status</h4>
                  <Badge className={getStatusColor(selectedSolicitacao.status)}>
                    {selectedSolicitacao.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Data da Solicitação</h4>
                  <p className="text-gray-700">{formatDate(selectedSolicitacao.created_at)}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Descrição da Necessidade</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedSolicitacao.descricao_necessidade}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SolicitacoesManager;
