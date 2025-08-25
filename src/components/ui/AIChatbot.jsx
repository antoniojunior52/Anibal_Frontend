import React, { useState, useRef, useEffect } from "react";
import { X, Bot, Send } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import apiService from "../../apiService";

const AIChatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await apiService.post("/api/chat", { message: input });
      const botMessage = { text: response.reply, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Erro ao comunicar com a IA:", error);
      const errorMessage = {
        text: "Desculpe, não consegui processar sua solicitação. Tente novamente mais tarde.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 w-full max-w-sm">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[60vh] border border-gray-200">
        <div className="flex justify-between items-center p-4 bg-[#4455a3] text-white">
          <div className="flex items-center space-x-2">
            <Bot size={24} />
            <h3 className="font-semibold text-lg">Assistente Virtual</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <Bot size={48} className="mb-2" />
              <span>Olá! Como posso ajudar você hoje?</span>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl ${
                    msg.sender === "user"
                      ? "bg-[#4455a3] text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <LoadingSpinner size="sm" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex items-center bg-white">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-grow p-3 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4455a3] transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="ml-2 p-3 bg-[#4455a3] text-white rounded-full hover:opacity-90 transition-all duration-300"
            disabled={isLoading}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatbot;