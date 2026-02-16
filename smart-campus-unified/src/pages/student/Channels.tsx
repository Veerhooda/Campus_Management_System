import React, { useState, useEffect, useRef } from 'react';
import { channelService, ChannelMessage, Channel } from '../../services';

const Channels: React.FC = () => {
  const [channels, setChannels] = useState<{ channel: Channel }[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = JSON.parse(localStorage.getItem('ait_user') || '{}')?.id;

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    if (selectedChannelId) {
      fetchMessages(selectedChannelId);
      const interval = setInterval(() => fetchMessages(selectedChannelId), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedChannelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const data = await channelService.getMyChannels();
      setChannels(data || []);
    } catch (err) {
      console.error('Failed to load channels:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (channelId: string) => {
    try {
      const result = await channelService.getMessages(channelId);
      setMessages(result?.data || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChannelId) return;

    try {
      setSending(true);
      const msg = await channelService.sendMessage(selectedChannelId, newMessage.trim());
      setMessages((prev) => [...prev, msg]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const selectedChannel = channels.find(c => c.channel.id === selectedChannelId)?.channel;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">💬 Channels</h1>

      {channels.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <div className="text-6xl mb-4">📢</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Channels Yet</h3>
          <p className="text-gray-500 mt-2">You haven't been added to any club channels yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
          {/* Channel List */}
          <div className="col-span-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-y-auto">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="font-semibold text-gray-700 dark:text-gray-200">Your Channels</h2>
            </div>
            {channels.map(({ channel }) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannelId(channel.id)}
                className={`w-full text-left p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  selectedChannelId === channel.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: channel.club?.themeColor || '#6366f1' }}
                  >
                    {channel.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{channel.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{channel.club?.name}</p>
                  </div>
                </div>
                {channel._count && (
                  <p className="text-xs text-gray-400 mt-1 ml-13">
                    {channel._count.members} members · {channel._count.messages} messages
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="col-span-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex flex-col">
            {selectedChannel ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b dark:border-gray-700 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: selectedChannel.club?.themeColor || '#6366f1' }}
                  >
                    {selectedChannel.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{selectedChannel.name}</h3>
                    <p className="text-xs text-gray-500">{selectedChannel.club?.name}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                      <div className="text-4xl mb-2">🗨️</div>
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderId === currentUserId;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] ${isMe ? 'order-2' : ''}`}>
                            {!isMe && (
                              <p className="text-xs text-gray-500 mb-1 font-medium">
                                {msg.sender.firstName} {msg.sender.lastName}
                              </p>
                            )}
                            <div
                              className={`px-4 py-2.5 rounded-2xl ${
                                isMe
                                  ? 'bg-indigo-600 text-white rounded-br-md'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                            </div>
                            <p className={`text-xs text-gray-400 mt-1 ${isMe ? 'text-right' : ''}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSend} className="p-4 border-t dark:border-gray-700 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-0 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {sending ? '...' : 'Send'}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="font-medium">Select a channel to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Channels;
