
import { useState } from "react";
import { Settings, Save, Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdmin, ConfiguracaoSistema } from "@/contexts/AdminContext";
import { toast } from "@/hooks/use-toast";

const ConfiguracoesManager = () => {
  const { 
    configuracoesSistema, 
    atualizarConfiguracao, 
    adicionarConfiguracao,
    configuracoes,
    setConfiguracoes 
  } = useAdmin();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    chave: "",
    valor: "",
    tipo: "texto" as "texto" | "numero" | "boolean" | "email",
    categoria: "",
    descricao: ""
  });

  const categorias = Array.from(new Set(configuracoesSistema.map(config => config.categoria)));

  const handleSaveConfig = (id: string, valor: string) => {
    atualizarConfiguracao(id, valor);
    toast({ title: "Configuração salva com sucesso!" });
  };

  const handleAddConfig = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarConfiguracao(formData);
    toast({ title: "Configuração adicionada com sucesso!" });
    setIsDialogOpen(false);
    setFormData({
      chave: "",
      valor: "",
      tipo: "texto",
      categoria: "",
      descricao: ""
    });
  };

  const handleAutoUpdateChange = (enabled: boolean) => {
    setConfiguracoes({
      ...configuracoes,
      autoUpdate: enabled
    });
    toast({ title: `Atualização automática ${enabled ? 'ativada' : 'desativada'}!` });
  };

  const handleIntervalChange = (interval: number) => {
    setConfiguracoes({
      ...configuracoes,
      updateInterval: interval
    });
    toast({ title: "Intervalo de atualização alterado!" });
  };

  const ConfigField = ({ config }: { config: ConfiguracaoSistema }) => {
    const [valor, setValor] = useState(config.valor);

    return (
      <div className="space-y-2 p-4 border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">{config.chave.replace(/_/g, ' ').toUpperCase()}</Label>
            <p className="text-sm text-slate-600">{config.descricao}</p>
          </div>
          <Button
            size="sm"
            onClick={() => handleSaveConfig(config.id, valor)}
            disabled={valor === config.valor}
          >
            <Save className="w-3 h-3 mr-1" />
            Salvar
          </Button>
        </div>
        
        {config.tipo === 'boolean' ? (
          <Switch
            checked={valor === 'true'}
            onCheckedChange={(checked) => setValor(checked.toString())}
          />
        ) : config.tipo === 'email' ? (
          <Input
            type="email"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        ) : config.tipo === 'numero' ? (
          <Input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        ) : (
          <Input
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Configurações do Sistema</span>
        </h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Configuração
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Configuração</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddConfig} className="space-y-4">
              <div>
                <Label htmlFor="chave">Chave</Label>
                <Input
                  id="chave"
                  value={formData.chave}
                  onChange={(e) => setFormData({...formData, chave: e.target.value})}
                  placeholder="ex: email_suporte"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  value={formData.valor}
                  onChange={(e) => setFormData({...formData, valor: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: "texto" | "numero" | "boolean" | "email") => 
                      setFormData({...formData, tipo: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="texto">Texto</SelectItem>
                      <SelectItem value="numero">Número</SelectItem>
                      <SelectItem value="boolean">Sim/Não</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    placeholder="ex: Contato"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  rows={2}
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  Adicionar
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

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="geral">Configurações Gerais</TabsTrigger>
          <TabsTrigger value="indices">Índices Econômicos</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-6">
          {categorias.map((categoria) => (
            <Card key={categoria}>
              <CardHeader>
                <CardTitle className="text-lg">{categoria}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {configuracoesSistema
                  .filter(config => config.categoria === categoria)
                  .map((config) => (
                    <ConfigField key={config.id} config={config} />
                  ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="indices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações dos Índices Econômicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <Label className="font-medium">Atualização Automática</Label>
                  <p className="text-sm text-slate-600">
                    Ativar atualização automática dos índices econômicos
                  </p>
                </div>
                <Switch
                  checked={configuracoes.autoUpdate}
                  onCheckedChange={handleAutoUpdateChange}
                />
              </div>
              
              <div className="space-y-2 p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Intervalo de Atualização</Label>
                    <p className="text-sm text-slate-600">
                      Intervalo em horas para atualização automática
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={configuracoes.updateInterval}
                    onChange={(e) => handleIntervalChange(parseInt(e.target.value) || 24)}
                    className="w-24"
                  />
                  <span className="text-sm text-slate-600">horas</span>
                </div>
              </div>
              
              <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <Label className="font-medium">Última Atualização</Label>
                <p className="text-sm text-slate-600">
                  {new Date(configuracoes.lastAutoUpdate).toLocaleString('pt-BR')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sistema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-lg">
                  <Label className="font-medium">Versão</Label>
                  <p className="text-2xl font-bold text-blue-600">1.0.0</p>
                </div>
                
                <div className="p-4 border border-slate-200 rounded-lg">
                  <Label className="font-medium">Ambiente</Label>
                  <p className="text-2xl font-bold text-green-600">Produção</p>
                </div>
                
                <div className="p-4 border border-slate-200 rounded-lg">
                  <Label className="font-medium">Total de Usuários</Label>
                  <p className="text-2xl font-bold text-purple-600">2,847</p>
                </div>
                
                <div className="p-4 border border-slate-200 rounded-lg">
                  <Label className="font-medium">Uptime</Label>
                  <p className="text-2xl font-bold text-orange-600">99.9%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracoesManager;
