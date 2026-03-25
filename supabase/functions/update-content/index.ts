const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log('Generating content via AI...');

    // Generate conteudos
    const conteudosResponse = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: 'Você gera JSON válido sobre legislação brasileira. Responda APENAS com JSON puro, sem markdown.'
          },
          {
            role: 'user',
            content: `Gere um array JSON com 8 conteúdos de legislação brasileira (2 por categoria: Trabalhista, Previdenciaria, Contabil, Fiscal). Cada item:
{"titulo":"string","tipo":"legislacao ou artigo","categoria":"Trabalhista/Previdenciaria/Contabil/Fiscal","orgao_emissor":"string","numero_norma":"string ou null","data_publicacao":"2026-03-XX","resumo_executivo":"2 frases curtas","comentario_tecnico":"1 frase","exemplo_pratico":"1 frase ou null","tags":["tag1","tag2"],"nivel_acesso":"gratuito","destaque":false,"status":"publicado"}
Marque 3 como destaque=true. Use normas reais do Brasil 2025/2026 (eSocial, SPED, ICMS, CLT, INSS, reforma tributária). Retorne apenas o array JSON.`
          }
        ],
        temperature: 0.5,
        max_tokens: 3000,
      }),
    });

    if (!conteudosResponse.ok) {
      const errText = await conteudosResponse.text();
      throw new Error(`AI error [${conteudosResponse.status}]: ${errText}`);
    }

    const conteudosData = await conteudosResponse.json();
    let rawConteudos = conteudosData.choices?.[0]?.message?.content?.trim() || '[]';
    if (rawConteudos.startsWith('```')) {
      rawConteudos = rawConteudos.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    console.log('Parsing conteudos...');
    const conteudos = JSON.parse(rawConteudos);

    // Generate prazos
    const prazosResponse = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: 'Você gera JSON válido sobre obrigações fiscais brasileiras. Responda APENAS com JSON puro.'
          },
          {
            role: 'user',
            content: `Gere um array JSON com 8 prazos de obrigações fiscais/trabalhistas para abril e maio de 2026. Cada item:
{"titulo":"string","descricao":"1 frase","data_vencimento":"2026-04-XX ou 2026-05-XX","recorrencia":"Mensal ou Anual","categoria":"Trabalhista/Previdenciaria/Contabil/Fiscal","orgao_responsavel":"string","nivel_acesso":"gratuito"}
Use obrigações reais: DCTF, GFIP, eSocial, EFD, DAS, DIRPF, ECD, GPS, FGTS. Retorne apenas o array JSON.`
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      }),
    });

    if (!prazosResponse.ok) {
      const errText = await prazosResponse.text();
      throw new Error(`AI prazos error [${prazosResponse.status}]: ${errText}`);
    }

    const prazosData = await prazosResponse.json();
    let rawPrazos = prazosData.choices?.[0]?.message?.content?.trim() || '[]';
    if (rawPrazos.startsWith('```')) {
      rawPrazos = rawPrazos.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    console.log('Parsing prazos...');
    const prazos = JSON.parse(rawPrazos);

    console.log(`Got ${conteudos.length} conteudos and ${prazos.length} prazos`);

    // Clear and insert conteudos
    await supabase.from('conteudos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    const { error: insertConteudosError } = await supabase
      .from('conteudos')
      .insert(conteudos.map((c: Record<string, unknown>) => ({
        titulo: c.titulo,
        tipo: c.tipo || 'artigo',
        categoria: c.categoria,
        orgao_emissor: c.orgao_emissor,
        numero_norma: c.numero_norma,
        data_publicacao: c.data_publicacao,
        resumo_executivo: c.resumo_executivo,
        comentario_tecnico: c.comentario_tecnico,
        exemplo_pratico: c.exemplo_pratico,
        tags: c.tags || [],
        nivel_acesso: c.nivel_acesso || 'gratuito',
        destaque: c.destaque || false,
        visualizacoes: Math.floor(Math.random() * 3000) + 100,
        status: 'publicado',
      })));

    if (insertConteudosError) {
      throw new Error(`Insert conteudos error: ${insertConteudosError.message}`);
    }

    // Clear and insert prazos
    await supabase.from('prazos_obrigacoes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const { error: insertPrazosError } = await supabase
      .from('prazos_obrigacoes')
      .insert(prazos.map((p: Record<string, unknown>) => ({
        titulo: p.titulo,
        descricao: p.descricao,
        data_vencimento: p.data_vencimento,
        recorrencia: p.recorrencia || 'Mensal',
        categoria: p.categoria,
        orgao_responsavel: p.orgao_responsavel,
        nivel_acesso: p.nivel_acesso || 'gratuito',
      })));

    if (insertPrazosError) {
      throw new Error(`Insert prazos error: ${insertPrazosError.message}`);
    }

    console.log('Content updated successfully!');

    return new Response(
      JSON.stringify({ success: true, message: `Updated ${conteudos.length} conteudos and ${prazos.length} prazos` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
