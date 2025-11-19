import { Heart, Phone, MessageCircle, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ApoioEmocional() {
  const recursos = [
    {
      nome: 'CVV - Centro de Valorização da Vida',
      descricao: 'Apoio emocional e prevenção do suicídio. Atendimento 24 horas por telefone, chat e e-mail.',
      telefone: '188',
      site: 'https://www.cvv.org.br',
      icon: Phone,
      cor: 'bg-blue-500'
    },
    {
      nome: 'Disque 100 - Direitos Humanos',
      descricao: 'Canal para denúncias de violações de direitos humanos. Atendimento 24 horas.',
      telefone: '100',
      site: 'https://www.gov.br/mdh/pt-br/disque100',
      icon: Phone,
      cor: 'bg-green-500'
    },
    {
      nome: 'Polícia Militar',
      descricao: 'Em caso de emergência ou perigo imediato.',
      telefone: '190',
      icon: Phone,
      cor: 'bg-red-500'
    },
    {
      nome: 'SAMU - Serviço de Atendimento Móvel de Urgência',
      descricao: 'Atendimento médico de emergência.',
      telefone: '192',
      icon: Phone,
      cor: 'bg-red-600'
    },
    {
      nome: 'Disque Denúncia',
      descricao: 'Canal anônimo para denúncias de crimes.',
      telefone: '181',
      icon: Phone,
      cor: 'bg-purple-500'
    }
  ];

  const dicas = [
    {
      titulo: 'Fale com alguém de confiança',
      descricao: 'Compartilhar seus sentimentos com um amigo, familiar ou professor pode ajudar muito.',
      icon: Users
    },
    {
      titulo: 'Não tenha vergonha de pedir ajuda',
      descricao: 'Buscar apoio é um sinal de coragem e força, não de fraqueza.',
      icon: Heart
    },
    {
      titulo: 'Você não está sozinho',
      descricao: 'Muitas pessoas passam por dificuldades semelhantes. Há sempre alguém disposto a ajudar.',
      icon: MessageCircle
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="bg-white p-3 rounded-full">
            <Heart className="w-10 h-10 text-red-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-3">Apoio Emocional</h1>
            <p className="text-lg text-pink-50">
              Se você está passando por um momento difícil, não está sozinho. 
              Há pessoas e serviços prontos para ajudar você a qualquer momento.
            </p>
          </div>
        </div>
      </div>

      {/* Alerta de emergência */}
      <div className="bg-red-50 border-2 border-red-500 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-red-800 mb-3 flex items-center gap-2">
          <Phone className="w-6 h-6" />
          Em caso de emergência
        </h2>
        <p className="text-red-700 mb-4">
          Se você ou alguém que você conhece está em perigo imediato, ligue agora:
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border-2 border-red-500">
            <p className="text-sm text-gray-600 mb-1">Polícia</p>
            <p className="text-3xl font-bold text-red-600">190</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-red-500">
            <p className="text-sm text-gray-600 mb-1">CVV</p>
            <p className="text-3xl font-bold text-red-600">188</p>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-red-500">
            <p className="text-sm text-gray-600 mb-1">SAMU</p>
            <p className="text-3xl font-bold text-red-600">192</p>
          </div>
        </div>
      </div>

      {/* Recursos de apoio */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Recursos de Apoio</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {recursos.map((recurso, index) => {
            const Icon = recurso.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start gap-4">
                  <div className={`${recurso.cor} p-3 rounded-full text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{recurso.nome}</h3>
                    <p className="text-gray-600 mb-3">{recurso.descricao}</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="bg-gray-100 px-4 py-2 rounded-lg">
                        <p className="text-sm text-gray-600">Telefone</p>
                        <p className="text-2xl font-bold text-gray-800">{recurso.telefone}</p>
                      </div>
                      {recurso.site && (
                        <a href={recurso.site} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            Acessar site
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dicas */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dicas Importantes</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {dicas.map((dica, index) => {
            const Icon = dica.icon;
            return (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg p-6">
                <div className="bg-white p-3 rounded-full w-fit mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{dica.titulo}</h3>
                <p className="text-gray-600">{dica.descricao}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mensagem final */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg p-8 text-center">
        <Heart className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-3">Você é importante</h2>
        <p className="text-lg text-purple-50 mb-4">
          Sua vida tem valor e suas emoções são válidas. Não hesite em buscar ajuda quando precisar. 
          Há sempre alguém disposto a ouvir e apoiar você.
        </p>
        <p className="text-purple-100 italic">
          "Pedir ajuda não é sinal de fraqueza, mas de coragem."
        </p>
      </div>
    </div>
  );
}

export default ApoioEmocional;

