'use client'

import React from 'react'

// --- PASO 2: DEFINICIÓN DE INTERFACES  ---
// Define la estructura estricta de los datos de la tarjeta
export interface CardData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

// Define los posibles estados de la transacción
export interface PaymentState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

// Interfaces de la UI que ya tenías
interface OrderSummaryItem {
  label: string
  value: string
  isTotal?: boolean
}

export interface CheckoutLayouts1Props {
  title?: string
  subtitle?: string
  paymentSectionTitle?: string
  orderSummary?: OrderSummaryItem[]
  submitButtonText?: string
  securityNote?: string
}

export const CheckoutLayouts1: React.FC<CheckoutLayouts1Props> = ({
  title = 'Suscripción Juxa Pro',
  subtitle = 'Completa tu pago de forma segura',
  paymentSectionTitle = 'Método de Pago',
  orderSummary = [
    { label: 'Suscripción Juxa Pro (Mensual)', value: '$999.00' },
    { label: 'Total', value: '$999.00', isTotal: true },
  ],
  submitButtonText = 'Pagar',
  securityNote = 'Tu información de pago está segura y encriptada',
}) => {
  return (
    <section className="bg-white dark:bg-gray-950 py-16 md:py-24 transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 transition-colors duration-200">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
              {title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">{subtitle}</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            
            {/* --- PASO 1: FORMULARIO LIMPIO SOLO CON DATOS DE TARJETA  --- */}
            <fieldset className="mb-8">
              <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
                {paymentSectionTitle}
              </legend>
              <div className="space-y-4">
                
                {/* Nombre del Titular */}
                <div>
                  <label htmlFor="cardholderName" className="sr-only">Nombre del Titular</label>
                  <input
                    type="text"
                    id="cardholderName"
                    name="cardholderName"
                    placeholder="Nombre del Titular"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>

                {/* Número de Tarjeta */}
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <label htmlFor="cardNumber" className="sr-only">Número de Tarjeta</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="Número de Tarjeta"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>
                
                {/* Fecha de Vencimiento y CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="sr-only">Fecha de Vencimiento (MM/AA)</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM / AA"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="sr-only">CVC</label>
                    <input
                      type="text"
                      id="cvc"
                      name="cvc"
                      placeholder="CVC"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Resumen de la orden */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6 transition-colors duration-200" role="region" aria-label="Order summary">
              <div className="space-y-3">
                {orderSummary.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between ${item.isTotal ? 'border-t border-gray-200 dark:border-gray-700 pt-3' : ''}`}
                  >
                    <span className={`${item.isTotal ? 'font-semibold' : ''} text-gray-${item.isTotal ? '900' : '600'} dark:text-${item.isTotal ? 'white' : 'gray-400'} transition-colors duration-200`}>
                      {item.label}
                    </span>
                    <span className={`${item.isTotal ? 'font-semibold' : ''} text-gray-900 dark:text-white transition-colors duration-200`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {submitButtonText}
            </button>

            <p className="text-center text-gray-500 dark:text-gray-400 mt-4 text-sm transition-colors duration-200">
              {securityNote}
            </p>
          </form>
        </article>
      </div>
    </section>
  )
}