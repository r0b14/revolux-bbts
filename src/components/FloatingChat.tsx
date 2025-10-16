import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  MessageCircle, 
  X, 
  Send, 
  Maximize2, 
  Bot, 
  User as UserIcon,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Package,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { Order } from '../types';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  data?: any;
}

interface FloatingChatProps {
  orders: Order[];
  userName: string;
}

export function FloatingChat({ orders, userName }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Suggestions for starting the conversation
  const startSuggestions = [
    "Qual o status geral dos pedidos?",
    "Quais pedidos precisam de atenção urgente?",
    "Mostre um resumo dos valores por centro de custo",
    "Quantos pedidos estão pendentes?"
  ];

  // Generate AI response based on user query
  const generateAIResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase();
    
    // Status geral
    if (lowerQuery.includes('status') || lowerQuery.includes('resumo') || lowerQuery.includes('geral')) {
      const pending = orders.filter(o => o.status === 'pending').length;
      const approved = orders.filter(o => o.status === 'approved').length;
      const deferred = orders.filter(o => o.status === 'deferred').length;
      const total = orders.length;

      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `📊 **Status Geral dos Pedidos:**\n\n• Total de pedidos: **${total}**\n• Pendentes: **${pending}** (${((pending/total)*100).toFixed(1)}%)\n• Aprovados: **${approved}** (${((approved/total)*100).toFixed(1)}%)\n• Adiados: **${deferred}** (${((deferred/total)*100).toFixed(1)}%)\n\n${pending > 0 ? `⚠️ Você tem ${pending} pedido(s) aguardando análise.` : '✅ Nenhum pedido pendente no momento!'}`,
        timestamp: new Date(),
        suggestions: ["Quais pedidos precisam de atenção urgente?", "Mostre os valores por centro de custo"]
      };
    }

    // Pedidos urgentes
    if (lowerQuery.includes('urgente') || lowerQuery.includes('atenção') || lowerQuery.includes('prioridade')) {
      const urgentOrders = orders.filter(o => {
        if (o.status !== 'pending') return false;
        if (!o.deadline) return false;
        const deadline = new Date(o.deadline);
        const today = new Date();
        const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil <= 7;
      });

      if (urgentOrders.length === 0) {
        return {
          id: Date.now().toString(),
          type: 'assistant',
          content: `✅ **Ótimas notícias!**\n\nNão há pedidos com prazo urgente (próximos 7 dias) no momento.\n\nTodos os pedidos pendentes podem ser processados dentro do fluxo normal.`,
          timestamp: new Date(),
          suggestions: ["Mostre os valores por centro de custo", "Qual o ticket médio dos pedidos?"]
        };
      }

      const urgentList = urgentOrders.slice(0, 5).map(o => {
        const deadline = new Date(o.deadline!);
        const daysUntil = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return `• **${o.item}** - ${daysUntil} dia(s) restantes\n  Valor: R$ ${(o.quantity * o.estimatedValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      }).join('\n\n');

      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `⚠️ **Pedidos Urgentes (${urgentOrders.length}):**\n\nPedidos com prazo nos próximos 7 dias:\n\n${urgentList}\n\n${urgentOrders.length > 5 ? `\n...e mais ${urgentOrders.length - 5} pedido(s).` : ''}`,
        timestamp: new Date(),
        suggestions: ["Aprovar pedidos urgentes", "Mostrar detalhes de um pedido"]
      };
    }

    // Valores por centro de custo
    if (lowerQuery.includes('centro de custo') || lowerQuery.includes('custo') || lowerQuery.includes('valores')) {
      const costCenterData = orders.reduce((acc, order) => {
        const center = order.costCenter;
        const value = order.quantity * order.estimatedValue;
        
        if (!acc[center]) {
          acc[center] = { total: 0, count: 0 };
        }
        acc[center].total += value;
        acc[center].count += 1;
        return acc;
      }, {} as Record<string, { total: number; count: number }>);

      const sortedCenters = Object.entries(costCenterData)
        .sort(([, a], [, b]) => b.total - a.total)
        .slice(0, 5);

      const centersList = sortedCenters.map(([center, data]) => 
        `• **${center}**\n  Total: R$ ${data.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n  Pedidos: ${data.count}`
      ).join('\n\n');

      const totalValue = Object.values(costCenterData).reduce((sum, data) => sum + data.total, 0);

      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `💰 **Valores por Centro de Custo:**\n\nTop 5 centros de custo:\n\n${centersList}\n\n**Valor Total:** R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        timestamp: new Date(),
        suggestions: ["Qual o ticket médio?", "Mostrar fornecedores mais frequentes"]
      };
    }

    // Contagem de pendentes
    if (lowerQuery.includes('pendente') || lowerQuery.includes('aguardando')) {
      const pending = orders.filter(o => o.status === 'pending');
      const totalValue = pending.reduce((sum, o) => sum + (o.quantity * o.estimatedValue), 0);

      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `📋 **Pedidos Pendentes:**\n\n• Total: **${pending.length}** pedido(s)\n• Valor Total: **R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}**\n• Valor Médio: **R$ ${(totalValue / pending.length || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}**\n\n${pending.length > 0 ? '💡 Recomendo priorizar os pedidos com prazo mais próximo.' : ''}`,
        timestamp: new Date(),
        suggestions: ["Quais são os mais antigos?", "Mostrar por centro de custo"]
      };
    }

    // Ticket médio
    if (lowerQuery.includes('ticket') || lowerQuery.includes('médio') || lowerQuery.includes('média')) {
      const totalValue = orders.reduce((sum, o) => sum + (o.quantity * o.estimatedValue), 0);
      const avgTicket = totalValue / orders.length;
      const maxOrder = orders.reduce((max, o) => {
        const value = o.quantity * o.estimatedValue;
        return value > (max.quantity * max.estimatedValue) ? o : max;
      }, orders[0]);
      const minOrder = orders.reduce((min, o) => {
        const value = o.quantity * o.estimatedValue;
        return value < (min.quantity * min.estimatedValue) ? o : min;
      }, orders[0]);

      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `📊 **Análise de Valores:**\n\n• Ticket Médio: **R$ ${avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}**\n• Maior Pedido: **R$ ${(maxOrder.quantity * maxOrder.estimatedValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}**\n  ${maxOrder.item}\n• Menor Pedido: **R$ ${(minOrder.quantity * minOrder.estimatedValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}**\n  ${minOrder.item}`,
        timestamp: new Date(),
        suggestions: ["Mostrar tendências", "Análise por período"]
      };
    }

    // Fornecedores
    if (lowerQuery.includes('fornecedor') || lowerQuery.includes('supplier')) {
      const supplierCount = orders.reduce((acc, order) => {
        const suppliers = order.suppliers || (order.supplier ? [order.supplier] : []);
        suppliers.forEach(s => {
          if (s) acc[s] = (acc[s] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const topSuppliers = Object.entries(supplierCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      if (topSuppliers.length === 0) {
        return {
          id: Date.now().toString(),
          type: 'assistant',
          content: `📦 **Fornecedores:**\n\nAinda não há fornecedores cadastrados nos pedidos.\n\n💡 Você pode adicionar fornecedores ao editar os pedidos.`,
          timestamp: new Date(),
          suggestions: ["Ver status dos pedidos", "Análise de valores"]
        };
      }

      const supplierList = topSuppliers.map(([name, count]) => 
        `• **${name}** - ${count} pedido(s)`
      ).join('\n');

      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `📦 **Fornecedores Mais Frequentes:**\n\n${supplierList}`,
        timestamp: new Date(),
        suggestions: ["Análise de valores", "Status dos pedidos"]
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: `Entendi sua pergunta: "${query}"\n\n📊 Posso ajudá-lo com:\n• Status e resumo dos pedidos\n• Análise de valores e custos\n• Pedidos urgentes\n• Fornecedores e categorias\n• Tendências e insights\n\nTente reformular sua pergunta ou escolha uma das sugestões abaixo.`,
      timestamp: new Date(),
      suggestions: ["Qual o status geral?", "Pedidos urgentes", "Valores por centro de custo"]
    };
  };

  const handleStartChat = () => {
    setIsStarted(true);
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `Olá, ${userName.split('@')[0]}! 👋\n\nSou o assistente de análise de dados do Revolux. Estou aqui para ajudá-lo a tomar decisões baseadas nos dados do sistema.\n\n💡 **Como posso ajudar?**\nPergunte sobre pedidos, valores, status, fornecedores e muito mais!`,
      timestamp: new Date(),
      suggestions: startSuggestions
    };
    setMessages([welcomeMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleExpandToNewTab = () => {
    // Create a simple HTML page with the chat history
    const chatHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Revolux - Consulta de Dados</title>
          <style>
            body {
              font-family: Calibri, sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
              background: #f9fafb;
            }
            .header {
              background: #465EFF;
              color: white;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .message {
              margin: 15px 0;
              padding: 15px;
              border-radius: 8px;
              background: white;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .user {
              background: #e0e7ff;
              margin-left: 40px;
            }
            .assistant {
              background: white;
              margin-right: 40px;
            }
            .timestamp {
              font-size: 12px;
              color: #6b7280;
              margin-top: 8px;
            }
            pre {
              white-space: pre-wrap;
              font-family: Calibri, sans-serif;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 Consulta de Dados - Revolux</h1>
            <p>Gerado em ${new Date().toLocaleString('pt-BR')}</p>
          </div>
          ${messages.map(msg => `
            <div class="message ${msg.type}">
              <strong>${msg.type === 'user' ? '👤 Você' : '🤖 Assistente'}</strong>
              <pre>${msg.content}</pre>
              <div class="timestamp">${msg.timestamp.toLocaleString('pt-BR')}</div>
            </div>
          `).join('')}
        </body>
      </html>
    `;
    
    const blob = new Blob([chatHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleEndChat = () => {
    setIsStarted(false);
    setMessages([]);
    setInputValue('');
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all z-50"
          style={{ backgroundColor: '#465EFF' }}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between" style={{ backgroundColor: '#465EFF' }}>
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm">Consulta de Dados</h3>
                <p className="text-xs opacity-90">Assistente Revolux</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isStarted && messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleExpandToNewTab}
                  className="text-white hover:bg-white/20 h-8 w-8"
                  title="Expandir em nova aba"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {!isStarted ? (
              /* Welcome Screen */
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#C2D6FF' }}>
                  <BarChart3 className="w-8 h-8" style={{ color: '#465EFF' }} />
                </div>
                <h3 className="text-lg mb-2">Consulta Inteligente de Dados</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Analise seus pedidos e obtenha insights para tomar melhores decisões
                </p>
                <Button 
                  onClick={handleStartChat}
                  style={{ backgroundColor: '#465EFF' }}
                  className="mb-4"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Iniciar Consulta
                </Button>
                <div className="w-full mt-4 text-left">
                  <p className="text-xs text-gray-500 mb-2">Exemplos de perguntas:</p>
                  <div className="space-y-2">
                    {startSuggestions.slice(0, 3).map((suggestion, index) => (
                      <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Chat Interface */
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className="flex items-start gap-2 mb-1">
                          {message.type === 'assistant' && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#C2D6FF' }}>
                              <Bot className="w-4 h-4" style={{ color: '#465EFF' }} />
                            </div>
                          )}
                          <div className={`rounded-lg p-3 ${
                            message.type === 'user' 
                              ? 'bg-[#465EFF] text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          {message.type === 'user' && (
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                              <UserIcon className="w-4 h-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                        
                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="ml-8 mt-2 space-y-1">
                            <p className="text-xs text-gray-500 mb-1">Sugestões:</p>
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left text-xs bg-white hover:bg-gray-50 border border-gray-200 rounded px-2 py-1.5 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C2D6FF' }}>
                          <Bot className="w-4 h-4" style={{ color: '#465EFF' }} />
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <Separator />

                {/* Input */}
                <div className="p-4">
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Digite sua pergunta..."
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      style={{ backgroundColor: '#465EFF' }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEndChat}
                    className="w-full text-xs"
                  >
                    Encerrar Consulta
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      )}
    </>
  );
}
