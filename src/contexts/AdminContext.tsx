
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface IndiceEconomico {
  id: string;
  nome: string;
  valor: string;
  variacao: string;
  tipo: 'alta' | 'baixa' | 'neutro';
  ultimaAtualizacao: string;
  fonte?: string;
}

export interface Artigo {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  autor: string;
  status: 'publicado' | 'rascunho' | 'revisao';
  dataPublicacao: string;
  tags: string[];
}

export interface LinkExterno {
  id: string;
  titulo: string;
  url: string;
  categoria: string;
  descricao?: string;
  ativo: boolean;
}

interface AdminContextType {
  // Índices Econômicos
  indices: IndiceEconomico[];
  setIndices: (indices: IndiceEconomico[]) => void;
  atualizarIndice: (id: string, dados: Partial<IndiceEconomico>) => void;
  adicionarIndice: (indice: Omit<IndiceEconomico, 'id'>) => void;
  removerIndice: (id: string) => void;
  atualizarTodosIndices: () => Promise<void>;
  
  // Artigos
  artigos: Artigo[];
  setArtigos: (artigos: Artigo[]) => void;
  adicionarArtigo: (artigo: Omit<Artigo, 'id'>) => void;
  atualizarArtigo: (id: string, dados: Partial<Artigo>) => void;
  removerArtigo: (id: string) => void;
  
  // Links Externos
  linksExternos: LinkExterno[];
  setLinksExternos: (links: LinkExterno[]) => void;
  adicionarLinkExterno: (link: Omit<LinkExterno, 'id'>) => void;
  atualizarLinkExterno: (id: string, dados: Partial<LinkExterno>) => void;
  removerLinkExterno: (id: string) => void;
  
  // Configurações
  configuracoes: any;
  setConfiguracoes: (config: any) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin deve ser usado dentro de AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  // Estados iniciais com dados padrão
  const [indices, setIndices] = useState<IndiceEconomico[]>([
    { id: '1', nome: 'SELIC', valor: '10.75%', variacao: '+0.25', tipo: 'alta', ultimaAtualizacao: new Date().toISOString(), fonte: 'Banco Central' },
    { id: '2', nome: 'IPCA', valor: '4.62%', variacao: '-0.15', tipo: 'baixa', ultimaAtualizacao: new Date().toISOString(), fonte: 'IBGE' },
    { id: '3', nome: 'IGP-M', valor: '3.18%', variacao: '+0.08', tipo: 'alta', ultimaAtualizacao: new Date().toISOString(), fonte: 'FGV' },
    { id: '4', nome: 'INPC', valor: '4.77%', variacao: '+0.12', tipo: 'alta', ultimaAtualizacao: new Date().toISOString(), fonte: 'IBGE' },
    { id: '5', nome: 'CDI', valor: '10.65%', variacao: '0.00', tipo: 'neutro', ultimaAtualizacao: new Date().toISOString(), fonte: 'CETIP' }
  ]);

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
      tags: ['receita-federal', 'instrucao-normativa']
    }
  ]);

  const [linksExternos, setLinksExternos] = useState<LinkExterno[]>([
    { id: '1', titulo: 'Receita Federal', url: 'https://www.gov.br/receitafederal', categoria: 'Órgãos Fiscais', ativo: true },
    { id: '2', titulo: 'Banco Central', url: 'https://www.bcb.gov.br', categoria: 'Órgãos Fiscais', ativo: true }
  ]);

  const [configuracoes, setConfiguracoes] = useState({
    autoUpdate: true,
    updateInterval: 24, // horas
    lastAutoUpdate: new Date().toISOString()
  });

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('conectafisco-admin-data');
    if (dadosSalvos) {
      try {
        const dados = JSON.parse(dadosSalvos);
        if (dados.indices) setIndices(dados.indices);
        if (dados.artigos) setArtigos(dados.artigos);
        if (dados.linksExternos) setLinksExternos(dados.linksExternos);
        if (dados.configuracoes) setConfiguracoes(dados.configuracoes);
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    const dados = { indices, artigos, linksExternos, configuracoes };
    localStorage.setItem('conectafisco-admin-data', JSON.stringify(dados));
  }, [indices, artigos, linksExternos, configuracoes]);

  // Funções para gerenciar índices
  const atualizarIndice = (id: string, dados: Partial<IndiceEconomico>) => {
    setIndices(prev => prev.map(indice => 
      indice.id === id 
        ? { ...indice, ...dados, ultimaAtualizacao: new Date().toISOString() }
        : indice
    ));
  };

  const adicionarIndice = (indice: Omit<IndiceEconomico, 'id'>) => {
    const novoIndice: IndiceEconomico = {
      ...indice,
      id: Date.now().toString(),
      ultimaAtualizacao: new Date().toISOString()
    };
    setIndices(prev => [...prev, novoIndice]);
  };

  const removerIndice = (id: string) => {
    setIndices(prev => prev.filter(indice => indice.id !== id));
  };

  const atualizarTodosIndices = async () => {
    console.log('Atualizando todos os índices...');
    // Simulação de atualização automática
    setIndices(prev => prev.map(indice => ({
      ...indice,
      ultimaAtualizacao: new Date().toISOString(),
      // Simulação de variação aleatória
      variacao: (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 0.5).toFixed(2)
    })));
    
    setConfiguracoes(prev => ({
      ...prev,
      lastAutoUpdate: new Date().toISOString()
    }));
  };

  // Funções para gerenciar artigos
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

  // Funções para gerenciar links externos
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

  // Auto-update dos índices
  useEffect(() => {
    if (configuracoes.autoUpdate) {
      const intervalo = setInterval(() => {
        atualizarTodosIndices();
      }, configuracoes.updateInterval * 60 * 60 * 1000); // Converter horas para milissegundos

      return () => clearInterval(intervalo);
    }
  }, [configuracoes.autoUpdate, configuracoes.updateInterval]);

  const value: AdminContextType = {
    indices,
    setIndices,
    atualizarIndice,
    adicionarIndice,
    removerIndice,
    atualizarTodosIndices,
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
    configuracoes,
    setConfiguracoes
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
