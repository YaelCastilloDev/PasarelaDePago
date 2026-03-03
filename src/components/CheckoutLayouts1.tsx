'use client'

// AÑADIMOS useState (para la memoria del componente) y useEffect
import React, { useState } from 'react'

export interface CardData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

export interface PaymentState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

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

  // --- 1. ESTADOS (LA MEMORIA DE REACT) ---
  // Guardamos lo que el usuario escribe
  const [cardData, setCardData] = useState<CardData>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  // Guardamos los mensajes de error
  const [errors, setErrors] = useState<Partial<CardData>>({});
  
  // Guardamos el tipo de tarjeta para mostrar el logo
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex' | null>(null);

  // --- 2. FUNCIONES DE FORMATEO EN TIEMPO REAL ---

  // Formatear número de tarjeta y detectar tipo
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Quita todo lo que no sea número
    
    // Detectar tipo (Ejemplo básico)
    if (value.startsWith('4')) setCardType('visa');
    else if (value.startsWith('5')) setCardType('mastercard');
    else if (value.startsWith('3')) setCardType('amex');
    else setCardType(null);

    // Limitar a 16 dígitos máximo
    if (value.length > 16) value = value.slice(0, 16);

    // Agregar un espacio cada 4 dígitos
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    setCardData({ ...cardData, cardNumber: formattedValue });
    // Limpiamos el error cuando el usuario empieza a escribir de nuevo
    if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' }); 
  };

  // Formatear Fecha (MM/AA)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`; // Agrega la diagonal
    }
    setCardData({ ...cardData, expiryDate: value });
    if (errors.expiryDate) setErrors({ ...errors, expiryDate: '' });
  };

  // Formatear CVC (solo números, max 4)
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setCardData({ ...cardData, cvc: value });
    if (errors.cvc) setErrors({ ...errors, cvc: '' });
  };

  // Manejar cambios normales (Nombre)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
    if (errors[name as keyof CardData]) setErrors({ ...errors, [name]: '' });
  };

  // Pequeña función auxiliar para renderizar el logo de la tarjeta
  const renderCardLogo = () => {
    if (cardType === 'visa') return <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-blue-600">VISA</span>;
    if (cardType === 'mastercard') return <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-orange-500">MC</span>;
    if (cardType === 'amex') return <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-blue-400">AMEX</span>;
    return (
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    );
  };

  return (
    <section className="bg-white dark:bg-gray-950 py-16 md:py-24 transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 transition-colors duration-200">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <fieldset className="mb-8">
              <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
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
                    value={cardData.cardholderName} // <--- Conectado al estado
                    onChange={handleChange}         // <--- Conectado a la función
                    className={`w-full px-4 py-3 border ${errors.cardholderName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
                </div>

                {/* Número de Tarjeta */}
                <div>
                  <div className="relative">
                    {renderCardLogo()} {/* <--- Mostramos el logo dinámicamente */}
                    <label htmlFor="cardNumber" className="sr-only">Número de Tarjeta</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      value={cardData.cardNumber} // <--- Conectado al estado
                      onChange={handleCardNumberChange} // <--- Función de formato
                      className={`w-full pl-16 pr-4 py-3 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>
                  {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
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
                      value={cardData.expiryDate}
                      onChange={handleExpiryChange}
                      className={`w-full px-4 py-3 border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <label htmlFor="cvc" className="sr-only">CVC</label>
                    <input
                      type="text"
                      id="cvc"
                      name="cvc"
                      placeholder="CVC"
                      value={cardData.cvc}
                      onChange={handleCvcChange}
                      className={`w-full px-4 py-3 border ${errors.cvc ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    {errors.cvc && <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>}
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Resumen de la orden se queda igual... */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
              <div className="space-y-3">
                {orderSummary.map((item, index) => (
                  <div key={index} className={`flex justify-between ${item.isTotal ? 'border-t border-gray-200 dark:border-gray-700 pt-3' : ''}`}>
                    <span className={`${item.isTotal ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {item.label}
                    </span>
                    <span className={`text-gray-900 dark:text-white ${item.isTotal ? 'font-semibold' : ''}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 font-medium"
            >
              {submitButtonText}
            </button>

            <p className="text-center text-gray-500 dark:text-gray-400 mt-4 text-sm">
              {securityNote}
            </p>
          </form>
        </article>
      </div>
    </section>
  )
}