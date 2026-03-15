import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { X, Sparkles, ChevronDown, MessageCircle, Send, CalendarPlus, HeartPulse } from "lucide-react";
import { useData } from "../context/DataContext";

type Message = {
  id: string;
  sender: "ai" | "user";
  text: string;
  isTyping?: boolean;
};

const getMessageForPath = (path: string) => {
  if (path === "/") return "Chào cậu! Đây là Bảng điều khiển. Nơi cậu có thể nhìn toàn cảnh mục tiêu và nhiệm vụ hôm nay.";
  if (path === "/goals") return "Những cột mốc lớn nên được chia nhỏ! Cậu cần mình giúp tạo kế hoạch từng bước không?";
  if (path === "/habits") return "Kỷ luật là chìa khóa. Nếu cậu muốn thêm thói quen mới, cứ nhắn mình một câu nhé!";
  if (path === "/timetable") return "Lịch tuần này trống rỗng hay bận rộn đây? Thay vì tự thêm sự kiện, cậu chỉ cần nhắn tin cho mình thôi!";
  if (path === "/calendar") return "Xem lịch tháng ở đây nhé. Việc gì quan trọng thì cứ nhắn mình sắp xếp vào ngày giúp cậu.";
  if (path === "/tasks") return "Trợ lý Nova đây! Cậu có task nào mới thì cứ gõ thẳng vào đây, mình sẽ tự thêm vào danh sách cho cậu!";
  return "Mình là trợ lý ảo AI Planner của cậu đây! Trò chuyện trực tiếp với mình để thêm sự kiện hoặc công việc nhé!";
};

export function Chatbot() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addEvent, tasks } = useData();
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isTherapist = location.pathname === "/";

  // Parse custom date to evaluate delayed/abandoned
  const parseViDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes("Th")) return new Date();
    const parts = dateStr.split(" Th");
    return new Date(2026, parseInt(parts[1]) - 1, parseInt(parts[0]));
  };

  const getWelcomeText = () => {
    if (isTherapist) {
      const today = new Date(2026, 2, 12);
      const delayed = tasks.filter((t) => !t.completed && parseViDate(t.dueDate) < today).length;
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      const abandoned = tasks.filter((t) => !t.completed && parseViDate(t.dueDate) < sevenDaysAgo).length;

      if (delayed === 0 && abandoned === 0) {
        return "Chào cậu! Mọi thứ đang tiến triển rất tốt. Cậu đang làm rất tuyệt, hãy giữ vững phong độ nhé! ❤️";
      }

      return `Chào cậu! Mình thấy đang có ${delayed} việc chạy trễ và ${abandoned} mục tiêu có nguy cơ bị bỏ dở. Đừng tự trách mình nhé, đôi khi chúng ta chỉ cần đi chậm lại một chút. Cậu đang gặp khó khăn ở đâu, nói mình nghe được không?`;
    }
    return getMessageForPath(location.pathname);
  };

  // Initialize with welcome message based on path
  useEffect(() => {
    if (!isOpen) return;
    
    // Check if we already have the welcome message for this path at the bottom
    const welcomeText = getWelcomeText();
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.text === welcomeText) return;

    const newMsgId = Date.now().toString() + "_welcome";
    setMessages(prev => [...prev, { id: newMsgId, sender: "ai", text: "", isTyping: true }]);
    
    const timer = setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, text: welcomeText, isTyping: false } : m));
    }, 600);
    
    return () => clearTimeout(timer);
  }, [location.pathname, isOpen, tasks]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue("");
    
    setMessages(prev => [...prev, { id: Date.now().toString() + "_user", sender: "user", text: userText }]);

    // AI Processing Simulation
    const aiMsgId = Date.now().toString() + "_ai";
    setTimeout(() => {
      setMessages(prev => [...prev, { id: aiMsgId, sender: "ai", text: "", isTyping: true }]);
      
      setTimeout(() => {
        let aiResponse = "Xin lỗi, mình chưa hiểu ý cậu lắm. Cậu có thể nói rõ hơn không?";
        
        const lowerText = userText.toLowerCase();
        
        if (isTherapist) {
           // Therapist AI logic
           if (lowerText.includes("mệt") || lowerText.includes("nhiều việc") || lowerText.includes("áp lực") || lowerText.includes("chán")) {
             aiResponse = "Mình ôm cậu một cái nhé! 🤗 Khối lượng công việc lớn thế này ai cũng sẽ thấy ngợp thôi. \n\n**Giải pháp:** Hãy tạm gác lại những việc 'Thấp' hoặc 'Không quan trọng'. Chọn ra đúng 1 việc dễ nhất để làm trong 15 phút tới thôi. Cậu có muốn mình xóa bớt những checklist quá hạn lâu để giảm bớt gánh nặng tâm lý không?";
           } else if (lowerText.includes("lười") || lowerText.includes("không muốn làm") || lowerText.includes("trì hoãn")) {
             aiResponse = "Cậu không lười đâu, có thể não bộ cậu đang cần nghỉ ngơi hoặc cậu đang sợ kết quả không hoàn hảo đấy. 🍀\n\n**Lời khuyên:** Hãy thử quy tắc 2 phút. Bắt đầu làm một việc nhỏ xíu xiu trong 2 phút thôi (như mở file báo cáo ra hoặc rửa 1 cái bát). Ngay lúc này, hít một hơi thật sâu nhé!";
           } else {
             aiResponse = "Mình hiểu rồi. Bất cứ khi nào thấy mọi thứ vượt ngoài tầm kiểm soát, cậu nhớ quay lại đây nhé. Việc gì không quan trọng, cứ dẹp qua một bên. Sức khỏe tinh thần của cậu mới là ưu tiên số một. 💖";
           }
        } else {
           // NLP Assist logic
           if (lowerText.includes("họp") || lowerText.includes("mai") || lowerText.includes("9h")) {
             addEvent({
               title: "Họp nhóm (Automated by AI)",
               day: "Fri",
               startHour: 9,
               startMin: 0,
               duration: 60,
               color: "blue",
               location: "Quán cafe",
               notes: "Nhắc nhở tự động: Đi sớm 15p",
               categoryId: 2 
             });
             
             aiResponse = "Tuyệt vời! 🌟 Mình đã bóc tách thông tin và tự động điền vào lịch cho cậu rồi đó:\n\n📌 **Sự kiện:** Họp nhóm\n🕒 **Thời gian:** 09:00 Sáng mai\n📍 **Địa điểm:** Quán cafe\n⏰ **Ghi chú:** Đã cài nhắc nhở trước 15 phút.\n\nCậu có thể vào [Lịch tuần] để xem chi tiết nhé!";
             
             if (location.pathname !== "/timetable") {
               setTimeout(() => {
                  navigate("/timetable");
               }, 3000);
             }
           } 
           else if (lowerText.includes("cảm ơn") || lowerText.includes("thank")) {
              aiResponse = "Không có chi! Nhiệm vụ của mình là giúp cậu rảnh tay mà. Cần gì cứ réo mình nhé! ❤️";
           }
           else {
             aiResponse = "Mình đã đọc và sẵn sàng ghi chép. Cậu muốn mình tạo việc cần làm ngay bây giờ chứ?";
           }
        }

        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: aiResponse, isTyping: false } : m));
      }, 1500);
      
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Bot Icon button (when closed) */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group relative ${
            isTherapist 
              ? "bg-gradient-to-tr from-rose-400 via-pink-500 to-red-500 shadow-rose-200 animate-bounce" 
              : "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-purple-200 animate-bounce"
          }`}
        >
          <div className="relative">
            {isTherapist ? (
              <HeartPulse size={26} className="group-hover:scale-110 transition-transform" />
            ) : (
              <MessageCircle size={26} className="group-hover:rotate-12 transition-transform" />
            )}
            <div className={`absolute -top-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${isTherapist ? "bg-white" : "bg-rose-500"}`}></div>
          </div>
          <span className="absolute -top-8 right-0 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium tracking-wide">
            {isTherapist ? "AI Therapist" : "AI Assist"}
          </span>
        </button>
      )}

      {/* Chat window */}
      <div 
        className={`bg-white rounded-2xl shadow-[0_10px_40px_-5px_rgba(0,0,0,0.2)] border border-indigo-50 relative transition-all duration-300 origin-bottom-right flex flex-col overflow-hidden w-[340px] sm:w-[380px] ${isOpen ? 'scale-100 opacity-100 translate-y-0 h-[480px]' : 'scale-75 opacity-0 translate-y-4 pointer-events-none h-0'}`}
      >
        {/* Header */}
        <div className={`p-4 flex items-center justify-between shrink-0 shadow-sm relative overflow-hidden ${
          isTherapist 
            ? "bg-gradient-to-r from-rose-500 to-pink-600" 
            : "bg-gradient-to-r from-indigo-600 to-purple-600"
        }`}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm border border-white/30 shadow-inner">
              {isTherapist ? <HeartPulse size={16} className="text-white" /> : <Sparkles size={16} className="text-yellow-300" />}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm leading-tight flex items-center gap-1.5">
                {isTherapist ? "Therapist AI" : "Nova AI"} 
                <span className="bg-white/20 text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-white/20">Beta</span>
              </h3>
              <p className="text-indigo-100 text-[11px] flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-pulse"></span>
                Đang trực tuyến
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors relative z-10"
          >
            <ChevronDown size={18} />
          </button>
        </div>
        
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {/* Smart suggestion bubble */}
          {messages.length < 2 && (
            <div className={`mx-auto border rounded-xl p-3 text-xs shadow-sm flex items-start gap-2 max-w-[90%] ${
              isTherapist ? "bg-rose-50 border-rose-100 text-rose-700" : "bg-indigo-50 border-indigo-100 text-indigo-700"
            }`}>
              <CalendarPlus size={20} className={`shrink-0 mt-0.5 ${isTherapist ? "text-rose-500" : "text-indigo-500"}`} />
              <p>Thử nhắn: <strong>{isTherapist ? "Mình thấy dạo này làm việc hơi áp lực, mệt mỏi quá..." : "\"Mai mình có buổi họp nhóm lúc 9h sáng ở quán cafe, nhắc mình đi sớm 15p nhé\""}</strong></p>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "ai" && (
                <div className={`w-7 h-7 rounded-full flex-shrink-0 mt-1 mr-2.5 flex items-center justify-center text-white shadow-sm ${
                  isTherapist ? "bg-gradient-to-tr from-rose-500 to-pink-500" : "bg-gradient-to-tr from-indigo-500 to-pink-500"
                }`}>
                  {isTherapist ? <HeartPulse size={12} /> : <Sparkles size={12} />}
                </div>
              )}
              <div className={`max-w-[80%] px-3.5 py-2.5 text-[13px] shadow ${
                msg.sender === "user" 
                  ? `${isTherapist ? "bg-rose-600" : "bg-indigo-600"} text-white rounded-2xl rounded-tr-sm` 
                  : "bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-sm shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]"
              }`}>
                {msg.isTyping ? (
                  <div className="flex gap-1.5 items-center h-5 px-1">
                    <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s] ${isTherapist ? "bg-rose-300" : "bg-indigo-300"}`}></div>
                    <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s] ${isTherapist ? "bg-rose-300" : "bg-indigo-300"}`}></div>
                    <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isTherapist ? "bg-rose-300" : "bg-indigo-300"}`}></div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                    {msg.text.split('\n').map((line, i) => {
                      if (line.includes('**')) {
                        const parts = line.split('**');
                        return (
                          <p key={i}>
                            {parts.map((p, j) => (j % 2 === 1 ? <strong key={j} className="text-indigo-700 font-bold">{p}</strong> : p))}
                          </p>
                        )
                      }
                      return <p key={i}>{line}</p>;
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-100 shrink-0">
          <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
            <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all px-3 py-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Nhắn tự nhiên: 'Mai họp 9h...'"
                className="flex-1 bg-transparent border-none focus:outline-none resize-none min-h-[40px] max-h-[100px] text-sm py-1 placeholder:text-gray-400"
                rows={1}
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className={`w-8 h-8 flex items-center justify-center shrink-0 mb-0.5 text-white rounded-full disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-colors shadow-md ${
                  isTherapist ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                }`}
              >
                <Send size={14} className={inputValue.trim() ? "ml-0.5" : ""} />
              </button>
            </div>
            <div className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1">
              <Sparkles size={10} className="text-yellow-400" />
              AI có thể hiểu ngôn ngữ tự nhiên
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
