import { Mail, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    tributario: false,
    contabil: false,
    trabalhista: false,
    noticias: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inscrição realizada!",
      description: "Você receberá nossa newsletter em breve.",
    });
    setFormData({ nome: '', email: '', tributario: false, contabil: false, trabalhista: false, noticias: false });
  };

  const vantagens = [
    "Atualizações sobre mudanças na legislação",
    "Dicas práticas para profissionais da área",
    "Convites para eventos exclusivos",
    "Acesso antecipado a novos cursos",
    "Materiais gratuitos mensais"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Newsletter Conecta Fisco
            </h1>
            <p className="text-xl text-slate-600">
              Receba as principais novidades do universo fiscal diretamente no seu e-mail
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Mail className="w-6 h-6 mr-3 text-blue-600" />
                  Cadastre-se na Newsletter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Áreas de Interesse:</Label>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tributario"
                        checked={formData.tributario}
                        onCheckedChange={(checked) => handleInputChange('tributario', checked)}
                      />
                      <Label htmlFor="tributario">Tributário</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="contabil"
                        checked={formData.contabil}
                        onCheckedChange={(checked) => handleInputChange('contabil', checked)}
                      />
                      <Label htmlFor="contabil">Contábil</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="trabalhista"
                        checked={formData.trabalhista}
                        onCheckedChange={(checked) => handleInputChange('trabalhista', checked)}
                      />
                      <Label htmlFor="trabalhista">Trabalhista</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="noticias"
                        checked={formData.noticias}
                        onCheckedChange={(checked) => handleInputChange('noticias', checked)}
                      />
                      <Label htmlFor="noticias">Notícias Gerais</Label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                  >
                    Inscrever-se na Newsletter
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-slate-800">
                  Por que assinar nossa newsletter?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {vantagens.map((vantagem, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-3 text-green-500 mt-0.5" />
                      <span className="text-slate-600">{vantagem}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 p-4 bg-white rounded-lg">
                  <h3 className="font-semibold text-slate-800 mb-2">Frequência de Envios</h3>
                  <p className="text-sm text-slate-600">
                    • Newsletter semanal: Terças-feiras<br />
                    • Alertas urgentes: Conforme necessário<br />
                    • Convites para eventos: Mensalmente
                  </p>
                </div>

                <div className="mt-4 p-4 bg-white rounded-lg">
                  <h3 className="font-semibold text-slate-800 mb-2">Sua Privacidade</h3>
                  <p className="text-sm text-slate-600">
                    Respeitamos sua privacidade. Seus dados não serão compartilhados 
                    com terceiros e você pode cancelar a inscrição a qualquer momento.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
