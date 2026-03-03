import React, { useState, useEffect } from 'react'

// 1. Interfaces 
export interface CardData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

interface OrderSummaryItem {
  label: string
  value: string
  isTotal?: boolean
}

// 2. Componente principal (Renombrado a App para que Vite lo encuentre)
export default function App() {
  const title = 'Suscripción Juxa Pro';
  const subtitle = 'Completa tu pago de forma segura';
  const paymentSectionTitle = 'Método de Pago';
  const orderSummary: OrderSummaryItem[] = [
    { label: 'Suscripción Juxa Pro (Mensual)', value: '$999.00' },
    { label: 'Total', value: '$999.00', isTotal: true },
  ];
  const submitButtonText = 'Pagar';
  const securityNote = 'Tu información de pago está segura y encriptada';

  const [cardData, setCardData] = useState<CardData>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const [errors, setErrors] = useState<Partial<CardData>>({});
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex' | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');


  
  //  Recuperar el nombre guardado al cargar la página por primera vez
  useEffect(() => {
    const savedName = localStorage.getItem('juxa_cardholder_name');
    if (savedName) {
      setCardData(prevData => ({ ...prevData, cardholderName: savedName }));
    }
  }, []); 

  //  Guardar el nombre automáticamente cada vez que el usuario lo modifique
  useEffect(() => {
    // Solo guardamos si hay texto (evita guardar strings vacíos si borran el input)
    if (cardData.cardholderName.trim() !== '') {
      localStorage.setItem('juxa_cardholder_name', cardData.cardholderName);
    }
  }, [cardData.cardholderName]); 


  // --- FUNCIONES DE FORMATEO ---
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.startsWith('4')) setCardType('visa');
    else if (value.startsWith('5')) setCardType('mastercard');
    else if (value.startsWith('3')) setCardType('amex');
    else setCardType(null);

    if (value.length > 16) value = value.slice(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardData({ ...cardData, cardNumber: formattedValue });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    setCardData({ ...cardData, expiryDate: value });
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setCardData({ ...cardData, cvc: value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

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

// --- Simulacion de pago ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue

    //  Iniciamos el estado de carga
    setIsSubmitting(true);
    setPaymentStatus('idle');
    setPaymentMessage('');

    //  Simulamos la espera de 2 segundos exactos
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generamos un éxito o error aleatorio (50/50 de probabilidad)
    const isSuccess = Math.random() > 0.5;

    //  Terminamos la carga y mostramos el resultado
    setIsSubmitting(false);
    
    if (isSuccess) {
      setPaymentStatus('success');
      setPaymentMessage('¡Pago procesado con éxito! Bienvenido a Juxa Pro.');
    } else {
      setPaymentStatus('error');
      setPaymentMessage('Fondos insuficientes o tarjeta declinada. Intenta de nuevo.');
    }
  };


  return (
    <section className="bg-white dark:bg-gray-950 py-16 md:py-24 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
          </div>

          <form onSubmit={handleSubmit}>
              <fieldset className="mb-8">
              <legend className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{paymentSectionTitle}</legend>
              <div className="space-y-4">
                <input
                  type="text"
                  name="cardholderName"
                  placeholder="Nombre del Titular"
                  value={cardData.cardholderName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <div className="relative">
                  {renderCardLogo()}
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardData.cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM / AA"
                    value={cardData.expiryDate}
                    onChange={handleExpiryChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    value={cardData.cvc}
                    onChange={handleCvcChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </fieldset>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
              {orderSummary.map((item, index) => (
                <div key={index} className={`flex justify-between ${item.isTotal ? 'border-t border-gray-200 pt-3 mt-3' : ''}`}>
                  <span className={item.isTotal ? 'font-bold' : ''}>{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>

{/* BOTÓN CON ESTADO DE CARGA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-lg flex items-center justify-center gap-2 font-medium text-white transition-all duration-200 ${
                isSubmitting 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando el pago...
                </>
              ) : (
                submitButtonText
              )}
            </button>

            {/* MENSAJE DE ÉXITO O ERROR */}
            {paymentStatus !== 'idle' && (
              <div className={`mt-4 p-4 rounded-lg text-center font-medium ${
                paymentStatus === 'success' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {paymentMessage}
              </div>
            )}
          </form>
        </article>
      </div>
    </section>
  );
}