import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import PlanSelection from './PlanSelection';
import SolicitacaoOrcamentoForm from './SolicitacaoOrcamentoForm';

interface AssinaturaPremiumFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssinaturaPremiumForm = ({ isOpen, onClose }: AssinaturaPremiumFormProps) => {
  const { signUp } = useAuth();
  const { adicionarUsuario } = useUsuarios();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipoPessoa: 'fisica',
    documento: '',
    empresa: '',
    password: ''
  });
  const [showOrcamentoForm, setShowOrcamentoForm] = useState(false);

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
    
    // Se selecionou consultoria, mostrar formulário de orçamento
    const isConsultoria = planId === 'consultoria-especializada';
    if (isConsultoria) {
      setShowOrcamentoForm(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Se for consultoria, não processar aqui
    if (selectedPlan === 'consultoria-especializada') {
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await signUp(formData.email, formData.password, {
        nome_completo: formData.nome,
        telefone: formData.telefone,
        tipo_pessoa: formData.tipoPessoa,
        documento: formData.documento,
        empresa: formData.empresa
      });

      if (signUpError) throw signUpError;

      // Adicionar usuário ao contexto com status pendente
      await adicionarUsuario({
        nome: formData.nome,
        email: formData.email,
        plano: selectedPlan === 'calendario-fiscal' ? 'basico' : 'gratuito',
        status: 'pendente',
        dataRegistro: new Date().toISOString(),
        ultimoAcesso: new Date().toISOString(),
        documento: formData.documento,
        empresa: formData.empresa,
        telefone: formData.telefone
      });

      toast({
        title: "Solicitação enviada com sucesso!",
        description: "Sua solicitação está sendo analisada. Você receberá um email de confirmação em breve."
      });

      onClose();
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Erro interno do servidor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assinatura Premium</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <PlanSelection 
              selectedPlan={selectedPlan} 
              onPlanChange={handlePlanChange}
            />

            <div>
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label>Tipo de Pessoa</Label>
              <RadioGroup
                defaultValue={formData.tipoPessoa}
                onValueChange={(value: 'fisica' | 'juridica') => setFormData({...formData, tipoPessoa: value})}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fisica" id="r1" />
                  <Label htmlFor="r1">Física</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="juridica" id="r2" />
                  <Label htmlFor="r2">Jurídica</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="documento">
                {formData.tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'}
              </Label>
              <Input
                id="documento"
                value={formData.documento}
                onChange={(e) => setFormData({...formData, documento: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div>
              <Label htmlFor="empresa">Empresa</Label>
              <Input
                id="empresa"
                value={formData.empresa}
                onChange={(e) => setFormData({...formData, empresa: e.target.value})}
              />
            </div>

            <div className="flex space-x-4">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={loading || selectedPlan === 'consultoria-especializada'}
              >
                {loading ? 'Processando...' : 'Solicitar Assinatura'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <SolicitacaoOrcamentoForm
        isOpen={showOrcamentoForm}
        onClose={() => {
          setShowOrcamentoForm(false);
          onClose();
        }}
      />
    </>
  );
};

export default AssinaturaPremiumForm;
