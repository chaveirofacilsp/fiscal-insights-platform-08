import { BookOpen, Users, Clock, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useState } from "react";
import { Link } from "react-router-dom";

const Cursos = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const categorias = [
    {
      titulo: "Cursos EAD",
      descricao: "Aprenda no seu ritmo, onde e quando quiser",
      icone: BookOpen,
      link: "/cursos/ead",
      cor: "from-blue-500 to-blue-600"
    },
    {
      titulo: "Cursos Presenciais",
      descricao: "Interação direta com instrutores especialistas",
      icone: Users,
      link: "/cursos/presencial",
      cor: "from-emerald-500 to-emerald-600"
    },
    {
      titulo: "Treinamentos In Company",
      descricao: "Capacitação personalizada para sua equipe",
      icone: Award,
      link: "/cursos/incompany",
      cor: "from-purple-500 to-purple-600"
    }
  ];

  const cursosDestaque = [
    {
      titulo: "SPED Fiscal Completo",
      modalidade: "EAD",
      duracao: "40h",
      nivel: "Intermediário",
      preco: "R$ 297,00"
    },
    {
      titulo: "Simples Nacional na Prática",
      modalidade: "Presencial",
      duracao: "16h",
      nivel: "Básico",
      preco: "R$ 450,00"
    },
    {
      titulo: "Planejamento Tributário",
      modalidade: "EAD",
      duracao: "60h",
      nivel: "Avançado",
      preco: "R$ 497,00"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Cursos e Treinamentos
            </h1>
            <p className="text-xl text-slate-600">
              Capacitação profissional em área fiscal e tributária
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {categorias.map((categoria, index) => {
              const IconComponent = categoria.icone;
              return (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${categoria.cor} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-slate-800">{categoria.titulo}</CardTitle>
                    <p className="text-slate-600">{categoria.descricao}</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      asChild
                      className={`w-full bg-gradient-to-r ${categoria.cor} hover:opacity-90`}
                    >
                      <Link to={categoria.link}>
                        Ver Cursos
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Cursos em Destaque</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {cursosDestaque.map((curso, index) => (
                <Card key={index} className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-800">{curso.titulo}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{curso.modalidade}</Badge>
                      <Badge variant="outline">{curso.nivel}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {curso.duracao}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">{curso.preco}</span>
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-emerald-600">
                        Inscrever-se
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-center text-slate-800">
                Por que escolher nossos cursos?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">12+</div>
                  <p className="text-sm text-slate-600">Anos de experiência</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-2">5.000+</div>
                  <p className="text-sm text-slate-600">Alunos capacitados</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                  <p className="text-sm text-slate-600">Cursos disponíveis</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">4.9/5</div>
                  <p className="text-sm text-slate-600">Avaliação média</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cursos;
