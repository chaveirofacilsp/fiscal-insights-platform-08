import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Usuario } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';

interface UsuariosContextType {
  usuarios: Usuario[];
  setUsuarios: (usuarios: Usuario[]) => void;
  adicionarUsuario: (usuario: Omit<Usuario, 'id'>) => void;
  atualizarUsuario: (id: string, dados: Partial<Usuario>) => void;
  removerUsuario: (id: string) => void;
  bloquearUsuario: (id: string) => void;
  desbloquearUsuario: (id: string) => void;
  alterarPlano: (id: string, novoPlano: Usuario['plano']) => void;
  carregarUsuarios: () => Promise<void>;
  pendingCount: number;
}

const UsuariosContext = createContext<UsuariosContextType | undefined>(undefined);

export const useUsuarios = () => {
  const context = useContext(UsuariosContext);
  if (!context) {
    throw new Error('useUsuarios deve ser usado dentro de UsuariosProvider');
  }
  return context;
};

export const UsuariosProvider = ({ children }: { children: ReactNode }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  const carregarUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      const usuariosFormatados = data.map(profile => ({
        id: profile.id,
        nome: profile.nome_completo || profile.email || 'Usuário sem nome',
        email: profile.email || 'Email não informado',
        plano: (profile.plano || 'gratuito') as Usuario['plano'],
        status: (profile.status || 'ativo') as Usuario['status'],
        dataRegistro: profile.created_at || new Date().toISOString(),
        ultimoAcesso: profile.updated_at || new Date().toISOString(),
        documento: profile.documento || undefined,
        empresa: profile.empresa || undefined,
        telefone: profile.telefone || undefined
      }));
      
      setUsuarios(usuariosFormatados);
      setPendingCount(usuariosFormatados.filter(u => u.status === 'pendente').length);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const enviarNotificacao = async (tipo: string, dadosUsuario: Usuario, isNewUser = false) => {
    try {
      if (isNewUser) {
        // Notificar admin sobre nova solicitação
        await supabase.functions.invoke('send-notification-email', {
          body: {
            tipo: 'nova-solicitacao',
            dadosUsuario: {
              nome: dadosUsuario.nome,
              email: dadosUsuario.email,
              plano: dadosUsuario.plano,
              documento: dadosUsuario.documento || 'Não informado',
              empresa: dadosUsuario.empresa || 'Não informado',
              telefone: dadosUsuario.telefone || 'Não informado'
            }
          }
        });
      } else {
        // Notificar usuário sobre aprovação/rejeição
        await supabase.functions.invoke('send-notification-email', {
          body: {
            tipo,
            dadosUsuario: {
              nome: dadosUsuario.nome,
              email: dadosUsuario.email,
              plano: dadosUsuario.plano
            }
          }
        });
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  };

  const adicionarUsuario = async (usuario: Omit<Usuario, 'id'>) => {
    const novoUsuario: Usuario = {
      ...usuario,
      id: Date.now().toString()
    };
    setUsuarios(prev => [...prev, novoUsuario]);
    
    // Enviar notificação para admin sobre nova solicitação
    if (usuario.status === 'pendente') {
      await enviarNotificacao('nova-solicitacao', novoUsuario, true);
      setPendingCount(prev => prev + 1);
    }
  };

  const atualizarUsuario = async (id: string, dados: Partial<Usuario>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome_completo: dados.nome,
          status: dados.status,
          plano: dados.plano,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      const usuarioAtual = usuarios.find(u => u.id === id);
      const statusAnterior = usuarioAtual?.status;
      
      setUsuarios(prev => prev.map(usuario => 
        usuario.id === id ? { ...usuario, ...dados } : usuario
      ));

      // Enviar notificação se o status mudou de pendente para aprovado/rejeitado
      if (statusAnterior === 'pendente' && dados.status && dados.status !== 'pendente') {
        const usuarioAtualizado = usuarios.find(u => u.id === id);
        if (usuarioAtualizado) {
          const tipoNotificacao = dados.status === 'ativo' ? 'aprovacao' : 'rejeicao';
          await enviarNotificacao(tipoNotificacao, { ...usuarioAtualizado, ...dados });
        }
        
        // Atualizar contador de pendentes
        if (dados.status === 'ativo' || dados.status === 'rejeitado') {
          setPendingCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const removerUsuario = (id: string) => {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario?.status === 'pendente') {
      setPendingCount(prev => Math.max(0, prev - 1));
    }
    setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
  };

  const bloquearUsuario = (id: string) => {
    atualizarUsuario(id, { status: 'bloqueado' });
  };

  const desbloquearUsuario = (id: string) => {
    atualizarUsuario(id, { status: 'ativo' });
  };

  const alterarPlano = (id: string, novoPlano: Usuario['plano']) => {
    atualizarUsuario(id, { plano: novoPlano });
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const value: UsuariosContextType = {
    usuarios,
    setUsuarios,
    adicionarUsuario,
    atualizarUsuario,
    removerUsuario,
    bloquearUsuario,
    desbloquearUsuario,
    alterarPlano,
    carregarUsuarios,
    pendingCount
  };

  return (
    <UsuariosContext.Provider value={value}>
      {children}
    </UsuariosContext.Provider>
  );
};
