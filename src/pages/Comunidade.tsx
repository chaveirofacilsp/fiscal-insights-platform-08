import Header from "@/components/Header";
import SubHeader from "@/components/SubHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Award, TrendingUp } from "lucide-react";

const Comunidade = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Header />
      <SubHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Comunidade Conecta Fisco</h1>
          <p className="text-lg text-gray-600">
            Conecte-se com outros profissionais, tire dúvidas, compartilhe experiências e aprenda em comunidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Membros Ativos</CardTitle>
              <CardDescription>Profissionais contribuindo diariamente</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">2.500+</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Discussões</CardTitle>
              <CardDescription>Tópicos criados este mês</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">450+</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Especialistas</CardTitle>
              <CardDescription>Membros com badge de expert</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">120+</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Respostas</CardTitle>
              <CardDescription>Soluções compartilhadas este mês</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">1.200+</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Em Breve: Fórum de Discussões</CardTitle>
            <CardDescription>
              Estamos desenvolvendo um espaço completo para você interagir com outros profissionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Discussões por Categoria</h3>
                  <p className="text-sm text-gray-600">
                    Organize suas dúvidas por área: Trabalhista, Previdenciária, Contábil e Fiscal
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Sistema de Reputação</h3>
                  <p className="text-sm text-gray-600">
                    Ganhe badges e reconhecimento ajudando outros profissionais
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Tópicos em Alta</h3>
                  <p className="text-sm text-gray-600">
                    Acompanhe as discussões mais relevantes e atuais da comunidade
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button size="lg" className="w-full md:w-auto">
                  Cadastre-se para receber atualizações
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enquanto isso, conecte-se nas redes sociais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Siga-nos em nossas redes sociais para não perder nenhuma atualização e participar das discussões.
            </p>
            <div className="flex gap-4">
              <Button variant="outline">LinkedIn</Button>
              <Button variant="outline">Instagram</Button>
              <Button variant="outline">YouTube</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Comunidade;
