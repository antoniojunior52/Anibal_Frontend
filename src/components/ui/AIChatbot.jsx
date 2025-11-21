import React, { useState, useRef, useEffect } from "react";
import { X, Bot, Send } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner"; // Componente de spinner para indicar carregamento
import apiService from "../../services/apiService"; // Serviço para fazer requisições à API do chatbot

const AIChatbot = ({ onClose }) => {
  // Estado para armazenar as mensagens (do usuário e do bot)
  const [messages, setMessages] = useState([]);
  
  // Estado para armazenar a entrada do usuário
  const [input, setInput] = useState("");
  
  // Estado para indicar se o bot está carregando a resposta
  const [isLoading, setIsLoading] = useState(false);
  
  // Referência para rolar a tela até o final (para exibir as últimas mensagens)
  const messagesEndRef = useRef(null);

  // Função para rolar a tela para o final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Efeito que rola até o final sempre que as mensagens mudam
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Função para enviar uma mensagem
  const handleSend = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão de submit de formulário
    if (!input.trim()) return; // Se o campo estiver vazio, não faz nada

    // Mensagem do usuário sendo adicionada ao estado
    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput(""); // Limpa o campo de entrada
    setIsLoading(true); // Inicia o carregamento

    try {
      // Envia a mensagem do usuário para a API e aguarda a resposta
      const response = await apiService.post("/api/chat", { message: input });
      
      // Mensagem do bot com a resposta da API
      const botMessage = { text: response.reply, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      // Caso ocorra um erro, exibe uma mensagem de erro
      console.error("Erro ao comunicar com a IA:", error);
      const errorMessage = {
        text: "Desculpe, não consegui processar sua solicitação. Tente novamente mais tarde.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 w-full max-w-sm">
      {/* Container do chatbot */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[60vh] border border-gray-200">
        
        {/* Cabeçalho com título e botão de fechar */}
        <div className="flex justify-between items-center p-4 bg-[#4455a3] text-white">
          <div className="flex items-center space-x-2">
            <Bot size={24} /> {/* Ícone do bot */}
            <h3 className="font-semibold text-lg">Assistente Virtual</h3>
          </div>
          {/* Botão de fechar o chatbot */}
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Área de mensagens */}
        <div className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Caso não haja mensagens, exibe uma saudação inicial */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <Bot size={48} className="mb-2" />
              <span>Olá! Como posso ajudar você hoje?</span>
            </div>
          ) : (
            // Exibe as mensagens trocadas
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl ${msg.sender === "user" ? "bg-[#4455a3] text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}
                >
                  {msg.text} {/* Exibe o conteúdo da mensagem */}
                </div>
              </div>
            ))
          )}

          {/* Exibe o spinner de carregamento enquanto aguarda a resposta do bot */}
          {isLoading && (
            <div className="flex justify-start">
              <LoadingSpinner size="sm" />
            </div>
          )}

          {/* Referência para rolar até o final da conversa */}
          <div ref={messagesEndRef} />
        </div>

        {/* Área de input e botão para enviar a mensagem */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex items-center bg-white">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)} // Atualiza o estado com o texto digitado
            placeholder="Digite sua mensagem..."
            className="flex-grow p-3 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4455a3] transition-all"
            disabled={isLoading} // Desabilita o campo enquanto estiver carregando
          />
          <button
            type="submit"
            className="ml-2 p-3 bg-[#4455a3] text-white rounded-full hover:opacity-90 transition-all duration-300"
            disabled={isLoading} // Desabilita o botão enquanto estiver carregando
          >
            <Send size={20} /> {/* Ícone de envio */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatbot;
