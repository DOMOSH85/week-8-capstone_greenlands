import React, { useState, useEffect } from 'react';
import { messageAPI } from '../utils/api';

const Messaging = ({ userType }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedThread, setSelectedThread] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({
    recipientId: '',
    subject: '',
    content: '',
    channelType: 'general'
  });
  // Separate reply state
  const [replyContent, setReplyContent] = useState('');
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [activeChannel, setActiveChannel] = useState('all');

  useEffect(() => {
    fetchMessages();
    fetchRecipients();
  }, [activeChannel]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const channelType = activeChannel === 'all' ? undefined : activeChannel;
      const data = await messageAPI.getMessages(channelType);
      setMessages(data);
    } catch (err) {
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipients = async () => {
    try {
      const data = await messageAPI.getMessagingUsers();
      setRecipients(data);
    } catch (err) {
      setError('Failed to fetch recipients');
    }
  };

  const fetchThreadMessages = async (threadId) => {
    try {
      const data = await messageAPI.getThreadMessages(threadId);
      setThreadMessages(data);
      setSelectedThread(threadId);
    } catch (err) {
      setError('Failed to fetch thread messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await messageAPI.sendMessage(newMessage);
      setNewMessage({
        recipientId: '',
        subject: '',
        content: '',
        channelType: 'general'
      });
      setShowNewMessageForm(false);
      fetchMessages(); // Refresh messages
    } catch (err) {
      setError('Failed to send message');
    }
  };

  // Handle reply send
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!threadMessages[0]) return;
    // Determine recipient: if current user is sender, reply to recipient, else reply to sender
    const currentUserId = threadMessages[0].recipient._id === threadMessages[0].sender._id ? threadMessages[0].recipient._id : threadMessages[0].sender._id;
    const replyPayload = {
      recipientId: currentUserId,
      subject: `Re: ${threadMessages[0].subject}`,
      content: replyContent,
      channelType: threadMessages[0].channelType,
      threadId: threadMessages[0].threadId
    };
    try {
      await messageAPI.sendMessage(replyPayload);
      setReplyContent('');
      fetchThreadMessages(threadMessages[0].threadId);
      fetchMessages();
    } catch (err) {
      setError('Failed to send reply');
    }
  };

  const handleInputChange = (e) => {
    setNewMessage({
      ...newMessage,
      [e.target.name]: e.target.value
    });
  };

  const getUniqueThreads = () => {
    const threads = {};
    messages.forEach(message => {
      if (!threads[message.threadId]) {
        threads[message.threadId] = {
          threadId: message.threadId,
          subject: message.subject,
          sender: message.sender,
          recipient: message.recipient,
          lastMessage: message,
          unread: false,
          channelType: message.channelType
        };
      }
      // Check if any message in thread is unread
      if (!message.read && message.recipient._id === message.recipient._id) {
        threads[message.threadId].unread = true;
      }
    });
    return Object.values(threads);
  };

  const threads = getUniqueThreads();

  // Filter threads based on active channel
  const filteredThreads = activeChannel === 'all' 
    ? threads 
    : threads.filter(thread => thread.channelType === activeChannel);

  // Get available channels based on user type
  const getAvailableChannels = () => {
    if (userType === 'government') {
      return [
        { id: 'all', name: 'All Messages' },
        { id: 'government-government', name: 'Government ↔ Government' },
        { id: 'government-farmer', name: 'Government ↔ Farmer' },
        { id: 'general', name: 'General' }
      ];
    } else {
      return [
        { id: 'all', name: 'All Messages' },
        { id: 'government-farmer', name: 'Government ↔ Farmer' },
        { id: 'farmer-farmer', name: 'Farmer ↔ Farmer' },
        { id: 'general', name: 'General' }
      ];
    }
  };

  const channels = getAvailableChannels();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-color">Messaging</h2>
        <button
          onClick={() => setShowNewMessageForm(!showNewMessageForm)}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
        >
          {showNewMessageForm ? 'Cancel' : 'New Message'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Channel Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {channels.map(channel => (
          <button
            key={channel.id}
            onClick={() => setActiveChannel(channel.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
              activeChannel === channel.id
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {channel.name}
          </button>
        ))}
      </div>

      {showNewMessageForm && (
        <div className="mb-8 bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-text-color mb-4">Send New Message</h3>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <label htmlFor="recipientId" className="block text-text-color font-medium mb-2">
                Recipient
              </label>
              <select
                id="recipientId"
                name="recipientId"
                value={newMessage.recipientId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-text-color"
              >
                <option value="">Select a recipient</option>
                {recipients.map(recipient => (
                  <option key={recipient._id} value={recipient._id}>
                    {recipient.name} ({recipient.email}) - {recipient.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="channelType" className="block text-text-color font-medium mb-2">
                Channel Type
              </label>
              <select
                id="channelType"
                name="channelType"
                value={newMessage.channelType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-text-color"
              >
                {channels.filter(c => c.id !== 'all').map(channel => (
                  <option key={channel.id} value={channel.id}>
                    {channel.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-text-color font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={newMessage.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-text-color"
                placeholder="Enter message subject"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-text-color font-medium mb-2">
                Message
              </label>
              <textarea
                id="content"
                name="content"
                value={newMessage.content}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-text-color"
                placeholder="Enter your message"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewMessageForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thread List */}
        <div className="lg:col-span-1 border-r border-gray-200 pr-6">
          <h3 className="text-lg font-bold text-text-color mb-4">Conversations</h3>
          <div className="space-y-2">
            {filteredThreads.map(thread => (
              <div
                key={thread.threadId}
                className={`p-4 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedThread === thread.threadId ? 'bg-green-50 border-l-4 border-green-500' : 'bg-gray-50'
                }`}
                onClick={() => fetchThreadMessages(thread.threadId)}
              >
                <div className="flex justify-between">
                  <h4 className="font-bold text-text-color">{thread.subject}</h4>
                  {thread.unread && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      1
                    </span>
                  )}
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-sm text-text-color">
                    {thread.lastMessage.sender.name} → {thread.lastMessage.recipient.name}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(thread.lastMessage.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2 truncate">
                  {thread.lastMessage.content.substring(0, 50)}...
                </p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {thread.channelType.replace(/-/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className="lg:col-span-2">
          {selectedThread ? (
            <div>
              <h3 className="text-lg font-bold text-text-color mb-4">
                {threadMessages[0]?.subject || 'Conversation'}
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {threadMessages.map(message => (
                  <div
                    key={message._id}
                    className={`p-4 rounded-lg ${
                      message.sender.role === userType ? 'bg-green-50 ml-8' : 'bg-gray-50 mr-8'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-bold text-text-color">
                        {message.sender.name} ({message.sender.role})
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2 text-text-color">{message.content}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {message.channelType.replace(/-/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Reply Form */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-text-color mb-3">Reply</h4>
                <form onSubmit={handleSendReply} className="space-y-3">
                  <textarea
                    name="replyContent"
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-text-color"
                    placeholder="Type your reply here..."
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg"
                    >
                      Send Reply
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-text-color">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;