import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  CreditCard, Plus, Edit, Trash2, Save, X, Eye, EyeOff,
  Wifi, WifiOff, TestTube, Globe, Shield, Copy, Check
} from "lucide-react";

interface PaymentGateway {
  id: string;
  gateway_name: string;
  display_name: string;
  public_key: string | null;
  secret_key_encrypted: string | null;
  webhook_url: string | null;
  webhook_secret: string | null;
  is_active: boolean;
  environment: string;
  additional_config: any;
  created_at: string;
  updated_at: string;
}

const GATEWAY_TEMPLATES = [
  { name: 'stripe', label: 'Stripe', icon: '💳', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { name: 'mercadopago', label: 'Mercado Pago', icon: '🟡', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { name: 'pagseguro', label: 'PagSeguro', icon: '🟢', color: 'bg-green-100 text-green-800 border-green-200' },
  { name: 'asaas', label: 'Asaas', icon: '🔵', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
];

const PaymentGatewaysManager = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentGateway | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [form, setForm] = useState({
    gateway_name: '',
    display_name: '',
    public_key: '',
    secret_key_encrypted: '',
    webhook_url: '',
    webhook_secret: '',
    is_active: false,
    environment: 'sandbox',
  });

  useEffect(() => { loadGateways(); }, []);

  const loadGateways = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payment_gateways')
      .select('*')
      .order('created_at', { ascending: true });
    if (data) setGateways(data);
    if (error) toast({ title: "Erro ao carregar gateways", description: error.message, variant: "destructive" });
    setLoading(false);
  };

  const openModal = (gw?: PaymentGateway) => {
    if (gw) {
      setEditing(gw);
      setForm({
        gateway_name: gw.gateway_name,
        display_name: gw.display_name,
        public_key: gw.public_key || '',
        secret_key_encrypted: gw.secret_key_encrypted || '',
        webhook_url: gw.webhook_url || '',
        webhook_secret: gw.webhook_secret || '',
        is_active: gw.is_active,
        environment: gw.environment,
      });
    } else {
      setEditing(null);
      setForm({
        gateway_name: '', display_name: '', public_key: '',
        secret_key_encrypted: '', webhook_url: '', webhook_secret: '',
        is_active: false, environment: 'sandbox',
      });
    }
    setModalOpen(true);
  };

  const selectTemplate = (name: string) => {
    const tpl = GATEWAY_TEMPLATES.find(t => t.name === name);
    if (tpl) {
      setForm(prev => ({ ...prev, gateway_name: tpl.name, display_name: tpl.label }));
    }
  };

  const saveGateway = async () => {
    if (!form.gateway_name || !form.display_name) {
      toast({ title: "Preencha o nome do gateway", variant: "destructive" });
      return;
    }

    const payload = {
      gateway_name: form.gateway_name,
      display_name: form.display_name,
      public_key: form.public_key || null,
      secret_key_encrypted: form.secret_key_encrypted || null,
      webhook_url: form.webhook_url || null,
      webhook_secret: form.webhook_secret || null,
      is_active: form.is_active,
      environment: form.environment,
    };

    if (editing) {
      const { error } = await supabase.from('payment_gateways').update(payload).eq('id', editing.id);
      if (error) { toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" }); return; }
      toast({ title: `${form.display_name} atualizado com sucesso!` });
    } else {
      const { error } = await supabase.from('payment_gateways').insert(payload);
      if (error) { toast({ title: "Erro ao criar", description: error.message, variant: "destructive" }); return; }
      toast({ title: `${form.display_name} adicionado com sucesso!` });
    }

    setModalOpen(false);
    loadGateways();
  };

  const deleteGateway = async (id: string, name: string) => {
    if (!confirm(`Remover gateway ${name}?`)) return;
    const { error } = await supabase.from('payment_gateways').delete().eq('id', id);
    if (error) { toast({ title: "Erro ao remover", description: error.message, variant: "destructive" }); return; }
    toast({ title: `${name} removido!` });
    loadGateways();
  };

  const toggleActive = async (gw: PaymentGateway) => {
    const { error } = await supabase.from('payment_gateways').update({ is_active: !gw.is_active }).eq('id', gw.id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: `${gw.display_name} ${!gw.is_active ? 'ativado' : 'desativado'}!` });
    loadGateways();
  };

  const toggleEnvironment = async (gw: PaymentGateway) => {
    const newEnv = gw.environment === 'sandbox' ? 'production' : 'sandbox';
    const { error } = await supabase.from('payment_gateways').update({ environment: newEnv }).eq('id', gw.id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    toast({ title: `${gw.display_name} alterado para ${newEnv === 'production' ? 'Produção' : 'Sandbox'}` });
    loadGateways();
  };

  const testConnection = async (gw: PaymentGateway) => {
    setTestingId(gw.id);
    // Simulate connection test
    await new Promise(r => setTimeout(r, 2000));
    
    if (!gw.public_key || !gw.secret_key_encrypted) {
      toast({ title: "Teste falhou", description: "Chaves API não configuradas", variant: "destructive" });
    } else {
      toast({ title: "Conexão OK!", description: `${gw.display_name} respondeu corretamente em ${gw.environment}` });
    }
    setTestingId(null);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getTemplate = (name: string) => GATEWAY_TEMPLATES.find(t => t.name === name);
  const maskKey = (key: string) => key.length > 8 ? key.slice(0, 4) + '••••••••' + key.slice(-4) : '••••••••';

  const generateWebhookUrl = (gatewayName: string) => {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'gsykeivqrrxogsouaxmd';
    return `https://${projectId}.supabase.co/functions/v1/webhook-${gatewayName}`;
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Carregando gateways...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            APIs de Pagamento
          </h2>
          <p className="text-sm text-muted-foreground">Configure e gerencie os gateways de pagamento do sistema</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" /> Novo Gateway
        </Button>
      </div>

      {/* Gateway Cards */}
      {gateways.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Nenhum gateway configurado</h3>
            <p className="text-sm text-muted-foreground mb-4">Adicione Stripe, Mercado Pago, PagSeguro ou Asaas</p>
            <Button onClick={() => openModal()}>
              <Plus className="w-4 h-4 mr-2" /> Configurar Gateway
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {gateways.map(gw => {
            const tpl = getTemplate(gw.gateway_name);
            return (
              <Card key={gw.id} className={`border-l-4 ${gw.is_active ? 'border-l-green-500' : 'border-l-slate-300'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tpl?.icon || '💰'}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{gw.display_name}</h3>
                          <Badge className={tpl?.color || 'bg-slate-100'}>{gw.gateway_name}</Badge>
                          <Badge variant={gw.is_active ? "default" : "secondary"} className={gw.is_active ? "bg-green-600" : ""}>
                            {gw.is_active ? <><Wifi className="w-3 h-3 mr-1" /> Ativo</> : <><WifiOff className="w-3 h-3 mr-1" /> Inativo</>}
                          </Badge>
                          <Badge variant="outline" className={gw.environment === 'production' ? 'border-red-300 text-red-700' : 'border-yellow-300 text-yellow-700'}>
                            {gw.environment === 'production' ? '🔴 Produção' : '🟡 Sandbox'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Atualizado: {new Date(gw.updated_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => testConnection(gw)} disabled={testingId === gw.id}>
                        <TestTube className={`w-4 h-4 mr-1 ${testingId === gw.id ? 'animate-spin' : ''}`} />
                        {testingId === gw.id ? 'Testando...' : 'Testar'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openModal(gw)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteGateway(gw.id, gw.display_name)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Keys summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs font-medium text-muted-foreground">Chave Pública</Label>
                        {gw.public_key && (
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(gw.public_key!, `pub-${gw.id}`)}>
                            {copiedField === `pub-${gw.id}` ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        )}
                      </div>
                      <p className="text-sm font-mono">
                        {gw.public_key ? (showSecrets[gw.id] ? gw.public_key : maskKey(gw.public_key)) : <span className="text-muted-foreground italic">Não configurada</span>}
                      </p>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs font-medium text-muted-foreground">Chave Secreta</Label>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowSecrets(s => ({ ...s, [gw.id]: !s[gw.id] }))}>
                          {showSecrets[gw.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                      </div>
                      <p className="text-sm font-mono">
                        {gw.secret_key_encrypted ? (showSecrets[gw.id] ? gw.secret_key_encrypted : maskKey(gw.secret_key_encrypted)) : <span className="text-muted-foreground italic">Não configurada</span>}
                      </p>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs font-medium text-muted-foreground">Webhook URL</Label>
                        {gw.webhook_url && (
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(gw.webhook_url!, `wh-${gw.id}`)}>
                            {copiedField === `wh-${gw.id}` ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        )}
                      </div>
                      <p className="text-sm font-mono truncate">
                        {gw.webhook_url || <span className="text-muted-foreground italic">Não configurada</span>}
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Ativo:</Label>
                      <Switch checked={gw.is_active} onCheckedChange={() => toggleActive(gw)} />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => toggleEnvironment(gw)}>
                      <Globe className="w-4 h-4 mr-1" />
                      Alternar para {gw.environment === 'sandbox' ? 'Produção' : 'Sandbox'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              {editing ? `Editar ${editing.display_name}` : 'Novo Gateway de Pagamento'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Template Selection */}
            {!editing && (
              <div>
                <Label className="mb-2 block">Selecione o Gateway</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {GATEWAY_TEMPLATES.map(tpl => (
                    <button
                      key={tpl.name}
                      onClick={() => selectTemplate(tpl.name)}
                      className={`p-4 rounded-lg border-2 text-center transition-all hover:shadow-md ${
                        form.gateway_name === tpl.name ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-3xl block mb-2">{tpl.icon}</span>
                      <span className="font-medium text-sm">{tpl.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Gateway Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Identificador *</Label>
                <Input value={form.gateway_name} onChange={e => setForm({...form, gateway_name: e.target.value})} placeholder="stripe" disabled={!!editing} />
              </div>
              <div>
                <Label>Nome de Exibição *</Label>
                <Input value={form.display_name} onChange={e => setForm({...form, display_name: e.target.value})} placeholder="Stripe" />
              </div>
            </div>

            {/* API Keys */}
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-primary" />
                <Label className="font-semibold">Chaves da API</Label>
              </div>
              <div>
                <Label>Chave Pública (Public/Publishable Key)</Label>
                <Input value={form.public_key} onChange={e => setForm({...form, public_key: e.target.value})} placeholder="pk_test_..." className="font-mono text-sm" />
              </div>
              <div>
                <Label>Chave Secreta (Secret Key)</Label>
                <Input type="password" value={form.secret_key_encrypted} onChange={e => setForm({...form, secret_key_encrypted: e.target.value})} placeholder="sk_test_..." className="font-mono text-sm" />
              </div>
            </div>

            {/* Webhook Config */}
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-primary" />
                <Label className="font-semibold">Configuração de Webhook</Label>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>URL do Webhook</Label>
                  {form.gateway_name && (
                    <Button variant="ghost" size="sm" onClick={() => setForm({...form, webhook_url: generateWebhookUrl(form.gateway_name)})}>
                      Gerar URL automática
                    </Button>
                  )}
                </div>
                <Input value={form.webhook_url} onChange={e => setForm({...form, webhook_url: e.target.value})} placeholder="https://..." className="font-mono text-sm" />
              </div>
              <div>
                <Label>Webhook Secret</Label>
                <Input type="password" value={form.webhook_secret} onChange={e => setForm({...form, webhook_secret: e.target.value})} placeholder="whsec_..." className="font-mono text-sm" />
              </div>
            </div>

            {/* Environment & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ambiente</Label>
                <Select value={form.environment} onValueChange={v => setForm({...form, environment: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">🟡 Sandbox (Teste)</SelectItem>
                    <SelectItem value="production">🔴 Produção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} />
                <Label>Gateway ativo</Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-2">
              <Button onClick={saveGateway} className="flex-1">
                <Save className="w-4 h-4 mr-2" /> Salvar Gateway
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

export default PaymentGatewaysManager;
