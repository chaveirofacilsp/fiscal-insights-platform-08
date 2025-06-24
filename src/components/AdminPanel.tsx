
import { Users, FileText, Settings, BarChart3, Calendar, Book, ShoppingCart, MessageSquare, ArrowLeft, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import IndicesEconomicosManager from "./admin/IndicesEconomicosManager";
import UsuariosManager from "./admin/UsuariosManager";
import ConteudoManager from "./admin/ConteudoManager";
import CursosManager from "./admin/CursosManager";
import VendasManager from "./admin/VendasManager";
import ConfiguracoesManager from "./admin/ConfiguracoesManager";

const AdminPanelContent = () => {
  const { artigos, indices, linksExternos, usuarios, cursos, vendas } = useAdmin();

  const stats = [
    { label: "Usuários Ativos", value: usuarios.length.toString(), change: "+12%", icon: Users, color: "text-blue-600" },
    { label: "Artigos Publicados", value: artigos.length.toString(), change: "+8%", icon: FileText, color: "text-emerald-600" },
    { label: "Índices Monitorados", value: indices.length.toString(), change: "+3%", icon: TrendingUp, color: "text-purple-600" },
    { label: "Cursos Ativos", value: cursos.filter(c => c.status === 'ativo').length.toString(), change: "+18%", icon: Book, color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar ao Site</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CF</span>
                </div>
                <span className="text-lg font-semibold text-slate-800">Conecta Fisco</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Painel Administrativo</h1>
            <p className="text-slate-600 mt-1">Gerencie sua plataforma fiscal</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                      <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} vs mês anterior
                      </p>
                    </div>
                    <IconComponent className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="usuarios" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="usuarios" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="conteudo" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Conteúdo</span>
            </TabsTrigger>
            <TabsTrigger value="indices" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Índices</span>
            </TabsTrigger>
            <TabsTrigger value="cursos" className="flex items-center space-x-2">
              <Book className="w-4 h-4" />
              <span>Cursos</span>
            </TabsTrigger>
            <TabsTrigger value="vendas" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Vendas</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Config</span>
            </TabsTrigger>
          </TabsList>

          {/* Gestão de Usuários */}
          <TabsContent value="usuarios">
            <UsuariosManager />
          </TabsContent>

          {/* Gestão de Conteúdo */}
          <TabsContent value="conteudo">
            <ConteudoManager />
          </TabsContent>

          {/* Gestão de Índices Econômicos */}
          <TabsContent value="indices">
            <IndicesEconomicosManager />
          </TabsContent>

          {/* Gestão de Cursos */}
          <TabsContent value="cursos">
            <CursosManager />
          </TabsContent>

          {/* Relatórios de Vendas */}
          <TabsContent value="vendas">
            <VendasManager />
          </TabsContent>

          {/* Analytics - Mantendo placeholder por enquanto */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Avançado</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Dashboard de métricas e análises em desenvolvimento...</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-medium mb-2">Pageviews</h4>
                    <p className="text-2xl font-bold text-blue-600">45,231</p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-medium mb-2">Sessões</h4>
                    <p className="text-2xl font-bold text-green-600">12,847</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações do Sistema */}
          <TabsContent value="configuracoes">
            <ConfiguracoesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  return (
    <AdminProvider>
      <AdminPanelContent />
    </AdminProvider>
  );
};

export default AdminPanel;
