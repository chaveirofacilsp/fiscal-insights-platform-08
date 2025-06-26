
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Clock, Award, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import MatriculaForm from "@/components/forms/MatriculaForm";

const Presencial = () => {
  const [matriculaOpen, setMatriculaOpen] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState('');

  const handleMatricula = (nomeCurso: string) => {
    setCursoSelecionado(nomeCurso);
    setMatriculaOpen(true);
  };

  const cursosPresenciais = [
    {
      id: 1,
      titulo: "Workshop eSocial Intensivo",
      descricao: "Workshop prático de 2 dias com cases reais e simulações ao vivo.",
      duracao: "16 horas",
      data: "15-16 de Março",
      local: "São Paulo - SP",
      vagas: "25 vagas",
      preco: "R$ 899,90",
      categoria: "Trabalho e Previdência",
      nivel: "Intermediário",
      inclui: ["Material didático", "Coffee break", "Certificado", "Acesso ao conteúdo online"]
    },
    {
      id: 2,
      titulo: "Masterclass SPED Fiscal",
      descricao: "Curso intensivo de 3 dias com foco em casos complexos do SPED Fiscal.",
      duracao: "24 horas",
      data: "22-24 de Março",
      local: "Campinas - SP",
      vagas: "20 vagas",
      preco: "R$ 1.299,90",
      categoria: "SPED",
      nivel: "Avançado",
      inclui: ["Material didático", "Almoço", "Coffee break", "Certificado", "Consultoria pós-curso"]
    },
    {
      id: 3,
      titulo: "Simples Nacional na Prática",
      descricao: "Curso presencial de 1 dia com exercícios práticos e simulações.",
      duracao: "8 horas",
      data: "05 de Abril",
      local: "Sorocaba - SP",
      vagas: "30 vagas",
      preco: "R$ 399,90",
      categoria: "Tributário",
      nivel: "Básico",
      inclui: ["Material didático", "Coffee break", "Certificado", "Planilhas de apoio"]
    },
    {
      id: 4,
      titulo: "Contabilidade Fiscal Avançada",
      descricao: "Curso completo de 5 dias sobre contabilidade fiscal e tributária.",
      duracao: "40 horas",
      data: "12-16 de Abril",
      local: "São Paulo - SP",
      vagas: "15 vagas",
      preco: "R$ 1.899,90",
      categoria: "Contabilidade",
      nivel: "Avançado",
      inclui: ["Material didático", "Almoço", "Coffee break", "Certificado", "Consultoria individual"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />
            <span>Cursos Presenciais</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Cursos Presenciais
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Aprenda na prática com nossos especialistas. Networking, interação direta e aprendizado intensivo.
          </p>
        </div>

        {/* Vantagens Presencial */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Interação Direta</h3>
            <p className="text-slate-600 text-sm">Tire dúvidas na hora</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Prática Intensiva</h3>
            <p className="text-slate-600 text-sm">Exercícios práticos e cases reais</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Networking</h3>
            <p className="text-slate-600 text-sm">Conecte-se com outros profissionais</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Material Completo</h3>
            <p className="text-slate-600 text-sm">Apostilas e recursos inclusos</p>
          </div>
        </div>

        {/* Lista de Cursos */}
        <div className="grid md:grid-cols-2 gap-8">
          {cursosPresenciais.map((curso) => (
            <Card key={curso.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {curso.categoria}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {curso.nivel}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{curso.titulo}</CardTitle>
                <p className="text-slate-600 text-sm">{curso.descricao}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{curso.data}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{curso.duracao}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{curso.local}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{curso.vagas}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-slate-800 mb-2">Inclui:</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {curso.inclui.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-2xl font-bold text-slate-800">
                      {curso.preco}
                    </div>
                    <Button 
                      onClick={() => handleMatricula(curso.titulo)}
                      className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                    >
                      Matricular-se
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informações Adicionais */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Informações Importantes
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">O que levar:</h3>
              <ul className="text-slate-600 space-y-2">
                <li>• Notebook ou tablet (recomendado)</li>
                <li>• Bloco de anotações</li>
                <li>• Documento de identidade</li>
                <li>• Comprovante de inscrição</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Política de cancelamento:</h3>
              <ul className="text-slate-600 space-y-2">
                <li>• Até 7 dias antes: 100% de reembolso</li>
                <li>• 3-7 dias antes: 50% de reembolso</li>
                <li>• Menos de 3 dias: Sem reembolso</li>
                <li>• Reagendamento gratuito (sujeito à disponibilidade)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <MatriculaForm 
        isOpen={matriculaOpen}
        onClose={() => setMatriculaOpen(false)}
        tipoCurso="presencial"
        nomeCurso={cursoSelecionado}
      />
    </div>
  );
};

export default Presencial;
