'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Send, User as UserIcon, Loader2 } from 'lucide-react';
import { supabase, getCurrentUser } from '@/lib/supabase/client';

interface Conversation {
  id: string;
  other_user: any;
  last_message: string;
  last_message_time: string;
  unread: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }
      setUser(currentUser);
      await fetchConversations();
      setIsLoading(false);
    };
    init();
  }, []);

  const fetchConversations = async () => {
    // Get messages where user is sender or receiver
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
      .order('created_at', { ascending: false });

    // Group by conversation (unique user pair)
    const convMap = new Map();
    data?.forEach(msg => {
      const otherId = msg.sender_id === user?.id ? msg.receiver_id : msg.sender_id;
      if (!convMap.has(otherId)) {
        convMap.set(otherId, {
          id: otherId,
          last_message: msg.content,
          last_message_time: msg.created_at,
          unread: msg.receiver_id === user?.id && !msg.is_read ? 1 : 0,
        });
      }
    });

    // Fetch other user info
    const conversations = await Promise.all(
      Array.from(convMap.values()).map(async (conv: any) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', conv.id)
          .single();
        return { ...conv, other_user: profile };
      })
    );

    setConversations(conversations);
  };

  const fetchMessages = async (conversationId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${conversationId}),and(sender_id.eq.${conversationId},receiver_id.eq.${user?.id})`)
      .order('created_at', { ascending: true });

    setMessages(data || []);
    
    // Mark as read
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('receiver_id', user?.id)
      .eq('sender_id', conversationId);
  };

  const handleSelectConversation = async (conv: Conversation) => {
    setSelectedConversation(conv);
    await fetchMessages(conv.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: selectedConversation.id,
      content: newMessage,
    });

    if (!error) {
      setNewMessage('');
      await fetchMessages(selectedConversation.id);
      await fetchConversations();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Messages</h1>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-[600px] flex">
          {/* Conversations List */}
          <div className="w-1/3 border-r">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-65px)]">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No conversations yet
                </div>
              ) : (
                conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conv.id ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      {conv.other_user?.avatar_url ? (
                        <img src={conv.other_user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <UserIcon className="w-6 h-6 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{conv.other_user?.full_name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500 truncate">{conv.last_message}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    {selectedConversation.other_user?.avatar_url ? (
                      <img src={selectedConversation.other_user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{selectedConversation.other_user?.full_name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          msg.sender_id === user?.id
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender_id === user?.id ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-yellow-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
