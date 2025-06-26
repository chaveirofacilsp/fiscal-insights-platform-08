
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Artigo, LinkExterno, SecaoTematica } from '@/types/admin';

interface ConteudoContextType {
  artigos: Artigo[];
  setArtigos: (artigos: Artigo[]) => void;
  adicionarArtigo: (artigo: Omit<Artigo, 'id'>) => void;
  atualizarArtigo: (id: string, dados: Partial<Artigo>) => void;
  removerArtigo: (id: string) => void;
  
  linksExternos: LinkExterno[];
  setLinksExternos: (links: LinkExterno[]) => void;
  adicionarLinkExterno: (link: Omit<LinkExterno, 'id'>) => void;
  atualizarLinkExterno: (id: string, dados: Partial<LinkExterno>) => void;
  removerLinkExterno: (id: string) => void;
  
  secoesTematicas: SecaoTematica[];
  setSecoesTematicas: (secoes: SecaoTematica[]) => void;
  adicionarSecaoTematica: (secao: Omit<SecaoTematica, 'id'>) => void;
  atualizarSecaoTematica: (id: string, dados: Partial<SecaoTematica>) => void;
  removerSecaoTematica: (id: string) => void;
}

const ConteudoContext = createContext<ConteudoContextType | undefined>(undefined);

export const useConteudo = () => {
  const context = useContext(ConteudoContext);
  if (!context) {
    throw new Error('useConteudo deve ser usado dentro de ConteudoProvider');
  }
  return context;
};

export const ConteudoProvider = ({ children }: { children: ReactNode }) => {
  const [artigos, setArtigos] = useState<Artigo[]>([
    {
      id: '1',
      titulo: 'IN RFB nº 2.201/2024',
      resumo: 'Nova instrução normativa da Receita Federal sobre declarações fiscais.',
      conteudo: 'Conteúdo completo da instrução normativa...',
      categoria: 'Federal',
      autor: 'Admin',
      status: 'publicado',
      dataPublicacao: new Date().toISOString(),
      tags: ['receita-federal', 'instrucao-normativa'],
      secaoTematica: 'IR',
      visualizacoes: 0
    }
  ]);

  const [linksExternos, setLinksExternos] = useState<LinkExterno[]>([
    { 
      id: '1', 
      titulo: 'Receita Federal', 
      url: 'https://www.gov.br/receitafederal', 
      categoria: 'Órgãos Fiscais', 
      ativo: true,
      descricao: 'Site oficial da Receita Federal',
      dataAdicao: new Date().toISOString()
    },
    { 
      id: '2', 
      titulo: 'Banco Central', 
      url: 'https://www.bcb.gov.br', 
      categoria: 'Órgãos Fiscais', 
      ativo: true,
      descricao: 'Site oficial do Banco Central',
      dataAdicao: new Date().toISOString()
    }
  ]);

  const [secoesTematicas, setSecoesTematicas] = useState<SecaoTematica[]>([
    { 
      id: '1', 
      nome: 'SIMPLES', 
      titulo: 'Simples Nacional', 
      descricao: 'Conteúdos sobre o regime tributário Simples Nacional', 
      conteudos: [], 
      ativa: true 
    },
    { 
      id: '2', 
      nome: 'IR', 
      titulo: 'Imposto de Renda', 
      descricao: 'Conteúdos sobre Imposto de Renda PF e PJ', 
      conteudos: [], 
      ativa: true 
    }
  ]);

  const adicionarArtigo = (artigo: Omit<Artigo, 'id'>) => {
    const novoArtigo: Artigo = {
      ...artigo,
      id: Date.now().toString()
    };
    setArtigos(prev => [...prev, novoArtigo]);
  };

  const atualizarArtigo = (id: string, dados: Partial<Artigo>) => {
    setArtigos(prev => prev.map(artigo => 
      artigo.id === id ? { ...artigo, ...dados } : artigo
    ));
  };

  const removerArtigo = (id: string) => {
    setArtigos(prev => prev.filter(artigo => artigo.id !== id));
  };

  const adicionarLinkExterno = (link: Omit<LinkExterno, 'id'>) => {
    const novoLink: LinkExterno = {
      ...link,
      id: Date.now().toString()
    };
    setLinksExternos(prev => [...prev, novoLink]);
  };

  const atualizarLinkExterno = (id: string, dados: Partial<LinkExterno>) => {
    setLinksExternos(prev => prev.map(link => 
      link.id === id ? { ...link, ...dados } : link
    ));
  };

  const removerLinkExterno = (id: string) => {
    setLinksExternos(prev => prev.filter(link => link.id !== id));  
  };

  const adicionarSecaoTematica = (secao: Omit<SecaoTematica, 'id'>) => {
    const novaSecao: SecaoTematica = {
      ...secao,
      id: Date.now().toString()
    };
    setSecoesTematicas(prev => [...prev, novaSecao]);
  };

  const atualizarSecaoTematica = (id: string, dados: Partial<SecaoTematica>) => {
    setSecoesTematicas(prev => prev.map(secao => 
      secao.id === id ? { ...secao, ...dados } : secao
    ));
  };

  const removerSecaoTematica = (id: string) => {
    setSecoesTematicas(prev => prev.filter(secao => secao.id !== id));
  };

  const value: ConteudoContextType = {
    artigos,
    setArtigos,
    adicionarArtigo,
    atualizarArtigo,
    removerArtigo,
    linksExternos,
    setLinksExternos,
    adicionarLinkExterno,
    atualizarLinkExterno,
    removerLinkExterno,
    secoesTematicas,
    setSecoesTematicas,
    adicionarSecaoTematica,
    atualizarSecaoTematica,
    removerSecaoTematica
  };

  return (
    <ConteudoContext.Provider value={value}>
      {children}
    </ConteudoContext.Provider>
  );
};
