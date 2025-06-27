
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Search, Filter, Download } from "lucide-react";

interface ContratacaoSoftware {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  tipo_pessoa: 'fisica' | 'juridica';
  documento: string;
  software_nome: string;
  software_preco: string;
  tipo_solicitacao: 'contratacao' | 'teste';
  observacoes: string | null;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  created_at: string;
}

const ContratacoesSoftwareManager = () => {
  const [contratacoes, setContratacoes] = useState<ContratacaoSoftware[]>([]);
  const [filteredContratacoes, setFilteredContratacoes] = useState<ContratacaoSoftware[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContratacao, setSelectedContratacao] = useState<ContratacaoSoftware | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [tipoFilter, setTipoFilter] = useState<string>("todos");

  const fetchContratacoes = async () => {
    try {
      // Como não temos a tabela ainda, vamos criar dados de exemplo
      // Em um cenário real, você faria: const { data, error } = await supabase.from('contratacoes_software').select('*')
      const mockData: ContratacaoSoftware[] = [
        {
          id: '1',
          nome: 'João Silva',
          email: 'joao@empresa.com',
          telefone: '(11) 99999-9999',
          empresa: 'Empresa ABC Ltda.',
          tipo_pessoa: 'juridica',
          documento: '12.345.678/0001-90',
          software_nome: 'ConectaFisco ERP',
          software_preco: 'R$ 299,90/mês',
          tipo_solicitacao: 'contratacao',
          observacoes: 'Preciso implementar urgentemente',
          status: 'pendente',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          nome: 'Maria Santos',
          email: 'maria@teste.com',
          telefone: '(11) 88888-8888',
          empresa: 'Teste Comercial',
          tipo_pessoa: 'juridica',
          documento: '11.222.333/0001-44',
          software_nome: 'Calculadora Tributária Pro',
          software_preco: 'R$ 89,90/mês',
          tipo_solicitacao: 'teste',
          observacoes: null,
          status: 'aprovado',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      setContratacoes(mockData);
      setFilteredContratacoes(mockData);
    } catch (error) {
      console.error('Erro ao carregar contratações:', error);
      toast({
        title: "Erro ao carregar contratações",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContratacoes();
  }, []);

  useEffect(() => {
    let filtered = contratacoes;

    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.software_nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "todos") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (tipoFilter !== "todos") {
      filtered = filtered.filter(c => c.tipo_solicitacao === tipoFilter);
    }

    setFilteredContratacoes(filtered);
  }, [searchTerm, statusFilter, tipoFilter, contratacoes]);

  const updateStatus = async (id: string, newStatus: string) => {
    // Em um cenário real, você atualizaria no Supabase
    setContratacoes(prev => 
      prev.map(c => c.id === id ? { ...c, status: newStatus as any } : c)
    );

    toast({
      title: "Status atualizado",
      description: "O status da contratação foi atualizado com sucesso."
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    return tipo === 'contratacao' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
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
    return <div className="p-6">Carregando contratações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contratações de Software</h2>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {filteredContratacoes.length} solicitações
        </Badge>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Pesquisar por nome, email, empresa ou software..."
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
            <SelectItem value="aprovado">Aprovado</SelectItem>
            <SelectItem value="rejeitado">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="contratacao">Contratação</SelectItem>
            <SelectItem value="teste">Teste Grátis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Contratações */}
      <div className="grid gap-4">
        {filteredContratacoes.map((contratacao) => (
          <Card key={contratacao.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{contratacao.nome}</h3>
                    <Badge className={getStatusColor(contratacao.status)}>
                      {contratacao.status}
                    </Badge>
                    <Badge className={getTipoColor(contratacao.tipo_solicitacao)}>
                      {contratacao.tipo_solicitacao === 'contratacao' ? 'Contratação' : 'Teste Grátis'}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                    <p><strong>Email:</strong> {contratacao.email}</p>
                    <p><strong>Empresa:</strong> {contratacao.empresa}</p>
                    <p><strong>Data:</strong> {formatDate(contratacao.created_at)}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg mb-2">
                    <p className="font-medium text-blue-800">{contratacao.software_nome}</p>
                    <p className="text-blue-600 text-sm">{contratacao.software_preco}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedContratacao(contratacao);
                      setDetailsOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Detalhes
                  </Button>
                  <Select 
                    value={contratacao.status} 
                    onValueChange={(value) => updateStatus(contratacao.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="rejeitado">Rejeitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContratacoes.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Nenhuma contratação encontrada.</p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Detalhes */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Contratação</DialogTitle>
          </DialogHeader>
          {selectedContratacao && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-1">{selectedContratacao.software_nome}</h4>
                <p className="text-blue-600">{selectedContratacao.software_preco}</p>
                <Badge className={getTipoColor(selectedContratacao.tipo_solicitacao)} variant="outline">
                  {selectedContratacao.tipo_solicitacao === 'contratacao' ? 'Contratação' : 'Teste Grátis'}
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1">Nome Completo</h4>
                  <p className="text-gray-700">{selectedContratacao.nome}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-gray-700">{selectedContratacao.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Telefone</h4>
                  <p className="text-gray-700">{selectedContratacao.telefone}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Empresa</h4>
                  <p className="text-gray-700">{selectedContratacao.empresa}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Tipo de Pessoa</h4>
                  <p className="text-gray-700">{selectedContratacao.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{selectedContratacao.tipo_pessoa === 'fisica' ? 'CPF' : 'CNPJ'}</h4>
                  <p className="text-gray-700">{selectedContratacao.documento}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Status</h4>
                  <Badge className={getStatusColor(selectedContratacao.status)}>
                    {selectedContratacao.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Data da Solicitação</h4>
                  <p className="text-gray-700">{formatDate(selectedContratacao.created_at)}</p>
                </div>
              </div>
              
              {selectedContratacao.observacoes && (
                <div>
                  <h4 className="font-semibold mb-2">Observações</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedContratacao.observacoes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContratacoesSoftwareManager;
