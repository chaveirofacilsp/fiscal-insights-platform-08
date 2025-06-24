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
  secaoTematica?: string; // Para vincular aos menus temáticos
}

export interface LinkExterno {
  id: string;
  titulo: string;
  url: string;
  categoria: string;
  descricao?: string;
  ativo: boolean;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  plano: 'Básico' | 'Premium' | 'Corporativo';
  status: 'Ativo' | 'Pendente' | 'Bloqueado';
  dataRegistro: string;
  ultimoAcesso: string;
}

export interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  instrutor: string;
  duracao: number; // em horas
  preco: number;
  status: 'ativo' | 'inativo' | 'rascunho';
  dataLancamento: string;
  alunos: number;
  avaliacoes: number;
}

export interface Venda {
  id: string;
  produto: string;
  cliente: string;
  email: string;
  valor: number;
  status: 'concluida' | 'pendente' | 'cancelada';
  dataVenda: string;
  tipoProduto: 'curso' | 'consultoria' | 'software' | 'material';
}

export interface MenuItem {
  id: string;
  titulo: string;
  items: string[];
  ordem: number;
  ativo: boolean;
}

export interface SecaoTematica {
  id: string;
  nome: string;
  titulo: string;
  descricao: string;
  conteudos: Artigo[];
  ativa: boolean;
}

export interface ConfiguracaoSistema {
  id: string;
  chave: string;
  valor: string;
  tipo: 'texto' | 'numero' | 'boolean' | 'email';
  categoria: string;
  descricao: string;
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
  
  // Usuários
  usuarios: Usuario[];
  setUsuarios: (usuarios: Usuario[]) => void;
  adicionarUsuario: (usuario: Omit<Usuario, 'id'>) => void;
  atualizarUsuario: (id: string, dados: Partial<Usuario>) => void;
  removerUsuario: (id: string) => void;
  
  // Cursos
  cursos: Curso[];
  setCursos: (cursos: Curso[]) => void;
  adicionarCurso: (curso: Omit<Curso, 'id'>) => void;
  atualizarCurso: (id: string, dados: Partial<Curso>) => void;
  removerCurso: (id: string) => void;
  
  // Vendas
  vendas: Venda[];
  setVendas: (vendas: Venda[]) => void;
  adicionarVenda: (venda: Omit<Venda, 'id'>) => void;
  atualizarVenda: (id: string, dados: Partial<Venda>) => void;
  
  // Menus
  menus: MenuItem[];
  setMenus: (menus: MenuItem[]) => void;
  adicionarMenu: (menu: Omit<MenuItem, 'id'>) => void;
  atualizarMenu: (id: string, dados: Partial<MenuItem>) => void;
  removerMenu: (id: string) => void;
  
  // Seções Temáticas
  secoesTematicas: SecaoTematica[];
  setSecoesTematicas: (secoes: SecaoTematica[]) => void;
  adicionarSecaoTematica: (secao: Omit<SecaoTematica, 'id'>) => void;
  atualizarSecaoTematica: (id: string, dados: Partial<SecaoTematica>) => void;
  removerSecaoTematica: (id: string) => void;
  
  // Configurações
  configuracoesSistema: ConfiguracaoSistema[];
  setConfiguracoesSistema: (configs: ConfiguracaoSistema[]) => void;
  atualizarConfiguracao: (id: string, valor: string) => void;
  adicionarConfiguracao: (config: Omit<ConfiguracaoSistema, 'id'>) => void;
  
  // Configurações gerais
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
      tags: ['receita-federal', 'instrucao-normativa'],
      secaoTematica: 'IR'
    }
  ]);

  const [linksExternos, setLinksExternos] = useState<LinkExterno[]>([
    { id: '1', titulo: 'Receita Federal', url: 'https://www.gov.br/receitafederal', categoria: 'Órgãos Fiscais', ativo: true },
    { id: '2', titulo: 'Banco Central', url: 'https://www.bcb.gov.br', categoria: 'Órgãos Fiscais', ativo: true }
  ]);

  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: '1', nome: 'João Silva', email: 'joao@email.com', plano: 'Premium', status: 'Ativo', dataRegistro: '2024-01-01', ultimoAcesso: '2024-01-15' },
    { id: '2', nome: 'Maria Santos', email: 'maria@email.com', plano: 'Básico', status: 'Ativo', dataRegistro: '2024-01-02', ultimoAcesso: '2024-01-14' },
    { id: '3', nome: 'Pedro Costa', email: 'pedro@email.com', plano: 'Premium', status: 'Pendente', dataRegistro: '2024-01-03', ultimoAcesso: '2024-01-13' },
    { id: '4', nome: 'Ana Oliveira', email: 'ana@email.com', plano: 'Corporativo', status: 'Ativo', dataRegistro: '2024-01-04', ultimoAcesso: '2024-01-16' }
  ]);

  const [cursos, setCursos] = useState<Curso[]>([
    { id: '1', titulo: 'eSocial Completo 2024', descricao: 'Curso completo sobre eSocial', categoria: 'Trabalho', instrutor: 'Dr. Carlos Silva', duracao: 40, preco: 299.90, status: 'ativo', dataLancamento: '2024-01-01', alunos: 150, avaliacoes: 4.8 },
    { id: '2', titulo: 'SPED Fiscal Avançado', descricao: 'Curso avançado de SPED Fiscal', categoria: 'SPED', instrutor: 'Dra. Ana Costa', duracao: 30, preco: 199.90, status: 'ativo', dataLancamento: '2024-01-05', alunos: 89, avaliacoes: 4.9 }
  ]);

  const [vendas, setVendas] = useState<Venda[]>([
    { id: '1', produto: 'eSocial Completo 2024', cliente: 'João Silva', email: 'joao@email.com', valor: 299.90, status: 'concluida', dataVenda: '2024-01-15', tipoProduto: 'curso' },
    { id: '2', produto: 'Consultoria ICMS', cliente: 'Maria Santos', email: 'maria@email.com', valor: 1500.00, status: 'pendente', dataVenda: '2024-01-14', tipoProduto: 'consultoria' }
  ]);

  const [menus, setMenus] = useState<MenuItem[]>([
    { id: '1', titulo: 'SIMPLES', items: ['Optantes', 'Desenquadramento', 'Sublimites', 'Anexos', 'Cálculo'], ordem: 1, ativo: true },
    { id: '2', titulo: 'IR', items: ['Pessoa Física', 'Pessoa Jurídica', 'Lucro Real', 'Lucro Presumido', 'Declarações'], ordem: 2, ativo: true },
    { id: '3', titulo: 'PIS/COFINS', items: ['Cumulativo', 'Não Cumulativo', 'Substituição Tributária', 'Créditos', 'Retenções'], ordem: 3, ativo: true }
  ]);

  const [secoesTematicas, setSecoesTematicas] = useState<SecaoTematica[]>([
    { id: '1', nome: 'SIMPLES', titulo: 'Simples Nacional', descricao: 'Conteúdos sobre o regime tributário Simples Nacional', conteudos: [], ativa: true },
    { id: '2', nome: 'IR', titulo: 'Imposto de Renda', descricao: 'Conteúdos sobre Imposto de Renda PF e PJ', conteudos: [], ativa: true }
  ]);

  const [configuracoesSistema, setConfiguracoesSistema] = useState<ConfiguracaoSistema[]>([
    { id: '1', chave: 'nome_empresa', valor: 'Conecta Fisco', tipo: 'texto', categoria: 'Empresa', descricao: 'Nome da empresa' },
    { id: '2', chave: 'email_contato', valor: 'contato@conectafisco.com.br', tipo: 'email', categoria: 'Contato', descricao: 'Email de contato principal' },
    { id: '3', chave: 'telefone_contato', valor: '(11) 3000-0000', tipo: 'texto', categoria: 'Contato', descricao: 'Telefone de contato' }
  ]);

  const [configuracoes, setConfiguracoes] = useState({
    autoUpdate: true,
    updateInterval: 24,
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
        if (dados.usuarios) setUsuarios(dados.usuarios);
        if (dados.cursos) setCursos(dados.cursos);
        if (dados.vendas) setVendas(dados.vendas);
        if (dados.menus) setMenus(dados.menus);
        if (dados.secoesTematicas) setSecoesTematicas(dados.secoesTematicas);
        if (dados.configuracoesSistema) setConfiguracoesSistema(dados.configuracoesSistema);
        if (dados.configuracoes) setConfiguracoes(dados.configuracoes);
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    const dados = { 
      indices, artigos, linksExternos, usuarios, cursos, vendas, 
      menus, secoesTematicas, configuracoesSistema, configuracoes 
    };
    localStorage.setItem('conectafisco-admin-data', JSON.stringify(dados));
  }, [indices, artigos, linksExternos, usuarios, cursos, vendas, menus, secoesTematicas, configuracoesSistema, configuracoes]);

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
    setIndices(prev => prev.map(indice => ({
      ...indice,
      ultimaAtualizacao: new Date().toISOString(),
      variacao: (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 0.5).toFixed(2)
    })));
    
    setConfiguracoes(prev => ({
      ...prev,
      lastAutoUpdate: new Date().toISOString()
    }));
  };

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

  // Funções para usuários
  const adicionarUsuario = (usuario: Omit<Usuario, 'id'>) => {
    const novoUsuario: Usuario = {
      ...usuario,
      id: Date.now().toString()
    };
    setUsuarios(prev => [...prev, novoUsuario]);
  };

  const atualizarUsuario = (id: string, dados: Partial<Usuario>) => {
    setUsuarios(prev => prev.map(usuario => 
      usuario.id === id ? { ...usuario, ...dados } : usuario
    ));
  };

  const removerUsuario = (id: string) => {
    setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
  };

  // Funções para cursos
  const adicionarCurso = (curso: Omit<Curso, 'id'>) => {
    const novoCurso: Curso = {
      ...curso,
      id: Date.now().toString()
    };
    setCursos(prev => [...prev, novoCurso]);
  };

  const atualizarCurso = (id: string, dados: Partial<Curso>) => {
    setCursos(prev => prev.map(curso => 
      curso.id === id ? { ...curso, ...dados } : curso
    ));
  };

  const removerCurso = (id: string) => {
    setCursos(prev => prev.filter(curso => curso.id !== id));
  };

  // Funções para vendas
  const adicionarVenda = (venda: Omit<Venda, 'id'>) => {
    const novaVenda: Venda = {
      ...venda,
      id: Date.now().toString()
    };
    setVendas(prev => [...prev, novaVenda]);
  };

  const atualizarVenda = (id: string, dados: Partial<Venda>) => {
    setVendas(prev => prev.map(venda => 
      venda.id === id ? { ...venda, ...dados } : venda
    ));
  };

  // Funções para menus
  const adicionarMenu = (menu: Omit<MenuItem, 'id'>) => {
    const novoMenu: MenuItem = {
      ...menu,
      id: Date.now().toString()
    };
    setMenus(prev => [...prev, novoMenu]);
  };

  const atualizarMenu = (id: string, dados: Partial<MenuItem>) => {
    setMenus(prev => prev.map(menu => 
      menu.id === id ? { ...menu, ...dados } : menu
    ));
  };

  const removerMenu = (id: string) => {
    setMenus(prev => prev.filter(menu => menu.id !== id));
  };

  // Funções para seções temáticas
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

  // Funções para configurações do sistema
  const atualizarConfiguracao = (id: string, valor: string) => {
    setConfiguracoesSistema(prev => prev.map(config => 
      config.id === id ? { ...config, valor } : config
    ));
  };

  const adicionarConfiguracao = (config: Omit<ConfiguracaoSistema, 'id'>) => {
    const novaConfig: ConfiguracaoSistema = {
      ...config,
      id: Date.now().toString()
    };
    setConfiguracoesSistema(prev => [...prev, novaConfig]);
  };

  // Auto-update dos índices
  useEffect(() => {
    if (configuracoes.autoUpdate) {
      const intervalo = setInterval(() => {
        atualizarTodosIndices();
      }, configuracoes.updateInterval * 60 * 60 * 1000);

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
    usuarios,
    setUsuarios,
    adicionarUsuario,
    atualizarUsuario,
    removerUsuario,
    cursos,
    setCursos,
    adicionarCurso,
    atualizarCurso,
    removerCurso,
    vendas,
    setVendas,
    adicionarVenda,
    atualizarVenda,
    menus,
    setMenus,
    adicionarMenu,
    atualizarMenu,
    removerMenu,
    secoesTematicas,
    setSecoesTematicas,
    adicionarSecaoTematica,
    atualizarSecaoTematica,
    removerSecaoTematica,
    configuracoesSistema,
    setConfiguracoesSistema,
    atualizarConfiguracao,
    adicionarConfiguracao,
    configuracoes,
    setConfiguracoes
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
