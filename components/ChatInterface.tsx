'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Send, ChevronLeft, Loader2, Bot, User } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  invoked_agent?: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAndPlayTTS = async (text: string) => {
    try {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: text,
      });

      // Convert the MP3 into a blob
      const buffer = Buffer.from(await mp3.arrayBuffer());
      const blob = new Blob([buffer], { type: "audio/mpeg" });

      // Create a URL for the audio file and play it
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error generating TTS:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, newUserMessage])
    setInputMessage('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://127.0.0.1:5000/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputMessage, chat_source: "WEBCHAT" }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      const newBotMessage: Message = {
        id: Date.now().toString() + '-bot',
        text: data.response,
        isUser: false,
        timestamp: new Date(),
        invoked_agent: data.invoked_agent
      }

      setMessages(prev => [...prev, newBotMessage])
          // Convert bot message to MP3 using TTS
      // await generateAndPlayTTS(newBotMessage.text);

    } catch (error) {
      setError('Failed to send message. Please try again.')
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Chat Interface</h2>
            <p className="text-slate-500">
              Interact with the CoRDial bot through chat
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-100">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        <Separator className="bg-slate-200" />

        <Card className="flex flex-col h-[calc(100vh-12rem)] border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900">Conversation</CardTitle>
            <CardDescription className="text-slate-500">Your chat history will appear here</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-4">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      
                      <Avatar className={`${message.isUser ? 'bg-slate-700' : 'bg-slate-600'} h-8 w-8`}>
                        <AvatarFallback className='bg-slate-900'>
                          {message.isUser ? (
                            <User className="h-4 w-4 text-slate-50" />
                          ) : (
                            <Bot className="h-4 w-4 text-slate-50" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-lg px-4 py-2 ${
                          message.isUser 
                            ? 'bg-slate-700 text-slate-50' 
                            : 'bg-slate-100 text-slate-900'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>
                        {!message.isUser && message.invoked_agent && (
                          <Badge variant="secondary" className="mt-1 bg-slate-200 text-slate-600 hover:bg-slate-300">
                            {message.invoked_agent}
                          </Badge>
                        )}
                        <span className="text-xs text-slate-500 mt-1">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="bg-slate-600 h-8 w-8">
                        <AvatarFallback className='bg-slate-900'>
                          <Bot className="h-4 w-4 text-slate-50" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-slate-100 rounded-lg px-4 py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <div className="border-t border-slate-100 p-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 border-slate-200 focus:ring-slate-400 bg-slate-50"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !inputMessage.trim()}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                <Send className="h-4 w-4" /> Send
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}

