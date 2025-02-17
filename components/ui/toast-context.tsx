"use client"

import React, { createContext, useContext, useState } from 'react'
import { Toast, ToastProps } from './toast'

type ToastContextType = {
  addToast: (props: ToastProps) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (props: ToastProps) => {
    setToasts((prevToasts) => [...prevToasts, props])
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toasts.map((toast, index) => (
        <Toast key={index} {...toast} />
      ))}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

