
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IndiceEconomico } from '@/types/admin';

interface IndicesContextType {
  indices: IndiceEconomico[];
  setIndices: (indices: IndiceEconomico[]) => void;
  atualizarIndice: (id: string, dados: Partial<IndiceEconomico>) => void;
  adicionarIndice: (indice: Omit<IndiceEconomico, 'id'>) => void;
  removerIndice: (id: string) => void;
  atualizarTodosIndices: () => Promise<void>;
  configuracoes: any;
  setConfiguracoes: (config: any) => void;
}

const IndicesContext = createContext<IndicesContextType | undefined>(undefined);

export const useIndices = () => {
  const context = useContext(IndicesContext);
  if (!context) {
    throw new Error('useIndices deve ser usado dentro de IndicesProvider');
  }
  return context;
};

export const IndicesProvider = ({ children }: { children: ReactNode }) => {
  const [indices, setIndices] = useState<IndiceEconomico[]>([
    { 
      id: '1', 
      nome: 'SELIC', 
      valor: '10.75%', 
      variacao: '+0.25', 
      tipo: 'alta', 
      dataAtualizacao: new Date().toISOString(), 
      fonte: 'Banco Central',
      categoria: 'Taxa de Juros',
      unidade: '%'
    },
    { 
      id: '2', 
      nome: 'IPCA', 
      valor: '4.62%', 
      variacao: '-0.15', 
      tipo: 'baixa', 
      dataAtualizacao: new Date().toISOString(), 
      fonte: 'IBGE',
      categoria: 'Inflação',
      unidade: '%'
    },
    { 
      id: '3', 
      nome: 'IGP-M', 
      valor: '3.18%', 
      variacao: '+0.08', 
      tipo: 'alta', 
      dataAtualizacao: new Date().toISOString(), 
      fonte: 'FGV',
      categoria: 'Inflação',
      unidade: '%'
    },
    { 
      id: '4', 
      nome: 'INPC', 
      valor: '4.77%', 
      variacao: '+0.12', 
      tipo: 'alta', 
      dataAtualizacao: new Date().toISOString(), 
      fonte: 'IBGE',
      categoria: 'Inflação',
      unidade: '%'
    },
    { 
      id: '5', 
      nome: 'CDI', 
      valor: '10.65%', 
      variacao: '0.00', 
      tipo: 'neutro', 
      dataAtualizacao: new Date().toISOString(), 
      fonte: 'CETIP',
      categoria: 'Taxa de Juros',
      unidade: '%'
    }
  ]);

  const [configuracoes, setConfiguracoes] = useState({
    autoUpdate: true,
    updateInterval: 24,
    lastAutoUpdate: new Date().toISOString()
  });

  const atualizarIndice = (id: string, dados: Partial<IndiceEconomico>) => {
    setIndices(prev => prev.map(indice => 
      indice.id === id 
        ? { ...indice, ...dados, dataAtualizacao: new Date().toISOString() }
        : indice
    ));
  };

  const adicionarIndice = (indice: Omit<IndiceEconomico, 'id'>) => {
    const novoIndice: IndiceEconomico = {
      ...indice,
      id: Date.now().toString(),
      dataAtualizacao: new Date().toISOString()
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
      dataAtualizacao: new Date().toISOString(),
      variacao: (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 0.5).toFixed(2),
      tipo: Math.random() > 0.6 ? 'alta' : Math.random() > 0.3 ? 'baixa' : 'neutro' as 'alta' | 'baixa' | 'neutro'
    })));
    
    setConfiguracoes(prev => ({
      ...prev,
      lastAutoUpdate: new Date().toISOString()
    }));
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

  const value: IndicesContextType = {
    indices,
    setIndices,
    atualizarIndice,
    adicionarIndice,
    removerIndice,
    atualizarTodosIndices,
    configuracoes,
    setConfiguracoes
  };

  return (
    <IndicesContext.Provider value={value}>
      {children}
    </IndicesContext.Provider>
  );
};
