
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Plus, Edit2, Trash2, Settings, Save, X } from "lucide-react";
import { useAdmin, IndiceEconomico } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const IndicesEconomicosManager = () => {
  const { indices, atualizarIndice, adicionarIndice, removerIndice, atualizarTodosIndices, configuracoes, setConfiguracoes } = useAdmin();
  const { toast } = useToast();
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novoIndice, setNovoIndice] = useState<Omit<IndiceEconomico, 'id'>>({
    nome: '',
    valor: '',
    variacao: '',
    tipo: 'neutro',
    ultimaAtualizacao: '',
    fonte: ''
  });
  const [mostrandoConfig, setMostrandoConfig] = useState(false);

  const handleAtualizarTodos = async () => {
    try {
      await atualizarTodosIndices();
      toast({
        title: "Índices Atualizados",
        description: "Todos os índices econômicos foram atualizados com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar os índices",
        variant: "destructive"
      });
    }
  };

  const handleSalvarIndice = (indice: IndiceEconomico) => {
    atualizarIndice(indice.id, indice);
    setEditandoId(null);
    toast({
      title: "Sucesso",
      description: "Índice atualizado com sucesso!"
    });
  };

  const handleAdicionarIndice = () => {
    if (!novoIndice.nome || !novoIndice.valor) {
      toast({
        title: "Erro",
        description: "Nome e valor são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    adicionarIndice({
      ...novoIndice,
      ultimaAtualizacao: new Date().toISOString()
    });

    setNovoIndice({
      nome: '',
      valor: '',
      variacao: '',
      tipo: 'neutro',
      ultimaAtualizacao: '',
      fonte: ''
    });

    toast({
      title: "Sucesso",
      description: "Novo índice adicionado com sucesso!"
    });
  };

  const handleRemoverIndice = (id: string) => {
    if (confirm('Tem certeza que deseja remover este índice?')) {
      removerIndice(id);
      toast({
        title: "Sucesso",
        description: "Índice removido com sucesso!"
      });
    }
  };

  const IndiceEditavel = ({ indice }: { indice: IndiceEconomico }) => {
    const [editedIndice, setEditedIndice] = useState(indice);

    return (
      <TableRow>
        <TableCell>
          <Input
            value={editedIndice.nome}
            onChange={(e) => setEditedIndice({...editedIndice, nome: e.target.value})}
          />
        </TableCell>
        <TableCell>
          <Input
            value={editedIndice.valor}
            onChange={(e) => setEditedIndice({...editedIndice, valor: e.target.value})}
          />
        </TableCell>
        <TableCell>
          <Input
            value={editedIndice.variacao}
            onChange={(e) => setEditedIndice({...editedIndice, variacao: e.target.value})}
          />
        </TableCell>
        <TableCell>
          <select
            value={editedIndice.tipo}
            onChange={(e) => setEditedIndice({...editedIndice, tipo: e.target.value as 'alta' | 'baixa' | 'neutro'})}
            className="border rounded px-2 py-1"
          >
            <option value="alta">Alta</option>
            <option value="baixa">Baixa</option>
            <option value="neutro">Neutro</option>
          </select>
        </TableCell>
        <TableCell>
          <Input
            value={editedIndice.fonte || ''}
            onChange={(e) => setEditedIndice({...editedIndice, fonte: e.target.value})}
          />
        </TableCell>
        <TableCell>
          <span className="text-xs text-slate-600">
            {new Date(editedIndice.ultimaAtualizacao).toLocaleString('pt-BR')}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => handleSalvarIndice(editedIndice)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditandoId(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Gestão de Índices Econômicos</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setMostrandoConfig(!mostrandoConfig)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
          <Button onClick={handleAtualizarTodos}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar Todos
          </Button>
        </div>
      </div>

      {/* Configurações */}
      {mostrandoConfig && (
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Atualização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label>
                <input
                  type="checkbox"
                  checked={configuracoes.autoUpdate}
                  onChange={(e) => setConfiguracoes({
                    ...configuracoes,
                    autoUpdate: e.target.checked
                  })}
                  className="mr-2"
                />
                Atualização Automática
              </Label>
            </div>
            <div>
              <Label htmlFor="updateInterval">Intervalo de Atualização (horas)</Label>
              <Input
                id="updateInterval"
                type="number"
                value={configuracoes.updateInterval}
                onChange={(e) => setConfiguracoes({
                  ...configuracoes,
                  updateInterval: parseInt(e.target.value) || 24
                })}
                className="w-32"
              />
            </div>
            <div className="text-sm text-slate-600">
              Última atualização automática: {new Date(configuracoes.lastAutoUpdate).toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário para adicionar novo índice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Novo Índice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={novoIndice.nome}
                onChange={(e) => setNovoIndice({...novoIndice, nome: e.target.value})}
                placeholder="Ex: SELIC"
              />
            </div>
            <div>
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                value={novoIndice.valor}
                onChange={(e) => setNovoIndice({...novoIndice, valor: e.target.value})}
                placeholder="Ex: 10.75%"
              />
            </div>
            <div>
              <Label htmlFor="variacao">Variação</Label>
              <Input
                id="variacao"
                value={novoIndice.variacao}
                onChange={(e) => setNovoIndice({...novoIndice, variacao: e.target.value})}
                placeholder="Ex: +0.25"
              />
            </div>
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <select
                id="tipo"
                value={novoIndice.tipo}
                onChange={(e) => setNovoIndice({...novoIndice, tipo: e.target.value as 'alta' | 'baixa' | 'neutro'})}
                className="w-full border rounded px-3 py-2"
              >
                <option value="alta">Alta</option>
                <option value="baixa">Baixa</option>
                <option value="neutro">Neutro</option>
              </select>
            </div>
            <div>
              <Label htmlFor="fonte">Fonte</Label>
              <Input
                id="fonte"
                value={novoIndice.fonte}
                onChange={(e) => setNovoIndice({...novoIndice, fonte: e.target.value})}
                placeholder="Ex: Banco Central"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAdicionarIndice} className="w-full">
                Adicionar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de índices */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Variação</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {indices.map((indice) => (
                editandoId === indice.id ? (
                  <IndiceEditavel key={indice.id} indice={indice} />
                ) : (
                  <TableRow key={indice.id}>
                    <TableCell className="font-medium">{indice.nome}</TableCell>
                    <TableCell>{indice.valor}</TableCell>
                    <TableCell>
                      <span className={`${
                        indice.tipo === 'alta' ? 'text-red-600' : 
                        indice.tipo === 'baixa' ? 'text-green-600' : 'text-slate-600'
                      }`}>
                        {indice.tipo === 'alta' ? '↗' : indice.tipo === 'baixa' ? '↘' : '→'} {indice.variacao}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={indice.tipo === 'alta' ? 'destructive' : indice.tipo === 'baixa' ? 'default' : 'secondary'}>
                        {indice.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>{indice.fonte}</TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-600">
                        {new Date(indice.ultimaAtualizacao).toLocaleString('pt-BR')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditandoId(indice.id)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoverIndice(indice.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndicesEconomicosManager;
