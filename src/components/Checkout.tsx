import React, { useState } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { CartItem, PaymentMethod, ServiceType } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalPrice, onBack }) => {
  const { paymentMethods } = usePaymentMethods();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('dine-in');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pickupTime, setPickupTime] = useState('5-10');
  const [customTime, setCustomTime] = useState('');
  // Dine-in specific state
  const [partySize, setPartySize] = useState(1);
  const [dineInTime, setDineInTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Set default payment method when payment methods are loaded
  React.useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].id as PaymentMethod);
    }
  }, [paymentMethods, paymentMethod]);

  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod);

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const timeInfo = serviceType === 'pickup' 
      ? (pickupTime === 'custom' ? customTime : `${pickupTime} minutes`)
      : '';
    
    const dineInInfo = serviceType === 'dine-in' 
      ? `👥 Party Size: ${partySize} person${partySize !== 1 ? 's' : ''}\n🕐 Preferred Time: ${new Date(dineInTime).toLocaleString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`
      : '';
    
    const orderDetails = `
🛒 Primos' Pares ORDER

👤 Customer: ${customerName}
📞 Contact: ${contactNumber}
📍 Service: ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
${serviceType === 'delivery' ? `🏠 Address: ${address}${landmark ? `\n🗺️ Landmark: ${landmark}` : ''}` : ''}
${serviceType === 'pickup' ? `⏰ Pickup Time: ${timeInfo}` : ''}
${serviceType === 'dine-in' ? dineInInfo : ''}


📋 ORDER DETAILS:
${cartItems.map(item => {
  let itemDetails = `• ${item.name}`;
  if (item.selectedVariation) {
    itemDetails += ` (${item.selectedVariation.name})`;
  }
  if (item.selectedAddOns && item.selectedAddOns.length > 0) {
    itemDetails += ` + ${item.selectedAddOns.map(addOn => 
      addOn.quantity && addOn.quantity > 1 
        ? `${addOn.name} x${addOn.quantity}`
        : addOn.name
    ).join(', ')}`;
  }
  itemDetails += ` x${item.quantity} - ₱${item.totalPrice * item.quantity}`;
  return itemDetails;
}).join('\n')}

💰 TOTAL: ₱${totalPrice}
${serviceType === 'delivery' ? `🛵 DELIVERY FEE:` : ''}

💳 Payment: ${selectedPaymentMethod?.name || paymentMethod}
📸 Payment Screenshot: Please attach your payment receipt screenshot

${notes ? `📝 Notes: ${notes}` : ''}

Please confirm this order to proceed. Thank you for choosing Primos' Pares ! 🥟
    `.trim();

    const encodedMessage = encodeURIComponent(orderDetails);
    const messengerUrl = `https://m.me/PrimosPares.Leg?text=${encodedMessage}`;
    
    window.open(messengerUrl, '_blank');
    
  };

  const isDetailsValid = customerName && contactNumber && 
    (serviceType !== 'delivery' || address) && 
    (serviceType !== 'pickup' || (pickupTime !== 'custom' || customTime)) &&
    (serviceType !== 'dine-in' || (partySize > 0 && dineInTime));

  if (step === 'details') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 bg-primos-black min-h-screen">
        <div className="flex items-center mb-10">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-primos-white hover:text-primos-red transition-colors duration-200 font-bold"
          >
            <ArrowLeft className="h-6 w-6" />
            <span>BACK TO CART</span>
          </button>
          <h1 className="text-4xl font-display font-bold text-primos-red ml-8">ORDER DETAILS</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-primos-gray-50 rounded-xl shadow-xl shadow-primos-red/10 border-2 border-primos-gray-300 p-8">
            <h2 className="text-3xl font-display font-bold text-primos-white mb-6 pb-4 border-b-4 border-primos-red">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b-2 border-primos-gray-300">
                  <div>
                    <h4 className="font-bold text-primos-white text-lg">{item.name}</h4>
                    {item.selectedVariation && (
                      <p className="text-sm font-semibold text-primos-gray-600">Size: {item.selectedVariation.name}</p>
                    )}
                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <p className="text-sm font-semibold text-primos-gray-600">
                        Add-ons: {item.selectedAddOns.map(addOn => addOn.name).join(', ')}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-primos-gray-600">₱{item.totalPrice} x {item.quantity}</p>
                  </div>
                  <span className="font-black text-primos-red text-xl">₱{item.totalPrice * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t-4 border-primos-red pt-6">
              <div className="flex items-center justify-between text-3xl font-black">
                <span className="text-primos-white">TOTAL:</span>
                <span className="text-primos-red">₱{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="bg-primos-gray-50 rounded-xl shadow-xl shadow-primos-red/10 border-2 border-primos-gray-300 p-8">
            <h2 className="text-3xl font-display font-bold text-primos-white mb-6 pb-4 border-b-4 border-primos-red">Customer Information</h2>
            
            <form className="space-y-6">
              {/* Customer Information */}
              <div>
                <label className="block text-sm font-bold text-primos-white mb-2 uppercase">Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-primos-gray-200 border-2 border-primos-gray-400 rounded-lg focus:ring-2 focus:ring-primos-red focus:border-primos-red transition-all duration-200 font-medium text-primos-white placeholder-primos-gray-600"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primos-white mb-2 uppercase">Contact Number *</label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-primos-gray-200 border-2 border-primos-gray-400 rounded-lg focus:ring-2 focus:ring-primos-red focus:border-primos-red transition-all duration-200 font-medium text-primos-white placeholder-primos-gray-600"
                  placeholder="09XX XXX XXXX"
                  required
                />
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-bold text-primos-white mb-3 uppercase">Service Type *</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'dine-in', label: 'Dine In', icon: '🪑' },
                    { value: 'pickup', label: 'Pickup', icon: '🚶' },
                    { value: 'delivery', label: 'Delivery', icon: '🛵' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setServiceType(option.value as ServiceType)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        serviceType === option.value
                          ? 'border-primos-red bg-primos-red text-white shadow-lg shadow-primos-red/50'
                          : 'border-primos-gray-400 bg-primos-gray-200 text-primos-white hover:border-primos-red'
                      }`}
                    >
                      <div className="text-3xl mb-1">{option.icon}</div>
                      <div className="text-sm font-bold">{option.label}</div>
                    </button>
                  ))}
                </div>
                
                {/* Delivery Reminder */}
                {serviceType === 'delivery' && (
                  <div className="mt-4 bg-yellow-900/30 border-2 border-yellow-600 rounded-lg p-4">
                    <p className="text-sm font-bold text-yellow-400">
                      ⚠️ Pa-remind lang, Primo!
                    </p>
                    <p className="text-xs font-medium text-yellow-300 mt-2 leading-relaxed">
                      Yung delivery charge ay hiwalay pa sa total bill, at magbabago depende sa location mo. I-confirm namin 'to sayo bago i-deliver ang order mo.
                    </p>
                  </div>
                )}
              </div>

              {/* Dine-in Details */}
              {serviceType === 'dine-in' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-primos-white mb-2 uppercase">Party Size *</label>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => setPartySize(Math.max(1, partySize - 1))}
                        className="w-10 h-10 rounded-lg border-2 border-primos-gray-400 bg-primos-gray-200 flex items-center justify-center text-primos-red hover:border-primos-red hover:bg-primos-gray-100 transition-all duration-200 font-bold text-xl"
                      >
                        -
                      </button>
                      <span className="text-2xl font-black text-primos-white min-w-[3rem] text-center">{partySize}</span>
                      <button
                        type="button"
                        onClick={() => setPartySize(Math.min(20, partySize + 1))}
                        className="w-10 h-10 rounded-lg border-2 border-primos-gray-400 bg-primos-gray-200 flex items-center justify-center text-primos-red hover:border-primos-red hover:bg-primos-gray-100 transition-all duration-200 font-bold text-xl"
                      >
                        +
                      </button>
                      <span className="text-sm font-semibold text-primos-gray-600 ml-2">person{partySize !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primos-white mb-2 uppercase">Preferred Time *</label>
                    <input
                      type="datetime-local"
                      value={dineInTime}
                      onChange={(e) => setDineInTime(e.target.value)}
                      className="w-full px-4 py-3 bg-primos-gray-200 border-2 border-primos-gray-400 rounded-lg focus:ring-2 focus:ring-primos-red focus:border-primos-red transition-all duration-200 font-medium text-primos-white"
                      required
                    />
                    <p className="text-xs font-medium text-primos-gray-600 mt-1">Please select your preferred dining time</p>
                  </div>
                </>
              )}

              {/* Pickup Time Selection */}
              {serviceType === 'pickup' && (
                <div>
                  <label className="block text-sm font-bold text-primos-white mb-3 uppercase">Pickup Time *</label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: '5-10', label: '5-10 minutes' },
                        { value: '15-20', label: '15-20 minutes' },
                        { value: '25-30', label: '25-30 minutes' },
                        { value: 'custom', label: 'Custom Time' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setPickupTime(option.value)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm ${
                            pickupTime === option.value
                              ? 'border-primos-red bg-primos-red text-white shadow-lg shadow-primos-red/50'
                              : 'border-primos-gray-400 bg-primos-gray-200 text-primos-white hover:border-primos-red'
                          }`}
                        >
                          <Clock className="h-4 w-4 mx-auto mb-1" />
                          <span className="font-bold">{option.label}</span>
                        </button>
                      ))}
                    </div>
                    
                    {pickupTime === 'custom' && (
                      <input
                        type="text"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="w-full px-4 py-3 bg-primos-gray-200 border-2 border-primos-gray-400 rounded-lg focus:ring-2 focus:ring-primos-red focus:border-primos-red transition-all duration-200 font-medium text-primos-white placeholder-primos-gray-600"
                        placeholder="e.g., 45 minutes, 1 hour, 2:30 PM"
                        required
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              {serviceType === 'delivery' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-primos-white mb-2 uppercase">Delivery Address *</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-primos-gray-200 border-2 border-primos-gray-400 rounded-lg focus:ring-2 focus:ring-primos-red focus:border-primos-red transition-all duration-200 font-medium text-primos-white placeholder-primos-gray-600"
                      placeholder="Enter your complete delivery address"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-primos-white mb-2 uppercase">Landmark</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-4 py-3 bg-primos-gray-200 border-2 border-primos-gray-400 rounded-lg focus:ring-2 focus:ring-primos-red focus:border-primos-red transition-all duration-200 font-medium text-primos-white placeholder-primos-gray-600"
                      placeholder="e.g., Near McDonald's, Beside 7-Eleven, In front of school"
                    />
                  </div>
                </>
              )}

              {/* Special Notes */}
              <div>
                <label className="block text-sm font-bold text-primos-white mb-2 uppercase">Special Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-primos-gray-200 border-2 border-primos-gray-400 rounded-lg focus:ring-2 focus:ring-primos-red focus:border-primos-red transition-all duration-200 font-medium text-primos-white placeholder-primos-gray-600"
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={!isDetailsValid}
                className={`w-full py-5 rounded-lg font-bold text-xl transition-all duration-200 transform shadow-xl ${
                  isDetailsValid
                    ? 'bg-primos-red text-white hover:bg-primos-darkRed hover:scale-[1.02] shadow-primos-red/50'
                    : 'bg-primos-gray-300 text-primos-gray-600 cursor-not-allowed'
                }`}
              >
                PROCEED TO PAYMENT
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Payment Step
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-primos-black min-h-screen">
      <div className="flex items-center mb-10">
        <button
          onClick={() => setStep('details')}
          className="flex items-center space-x-2 text-primos-white hover:text-primos-red transition-colors duration-200 font-bold"
        >
          <ArrowLeft className="h-6 w-6" />
          <span>BACK TO DETAILS</span>
        </button>
        <h1 className="text-4xl font-display font-bold text-primos-red ml-8">PAYMENT</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Method Selection */}
        <div className="bg-primos-gray-50 rounded-xl shadow-xl shadow-primos-red/10 border-2 border-primos-gray-300 p-8">
          <h2 className="text-3xl font-display font-bold text-primos-white mb-6 pb-4 border-b-4 border-primos-red">Choose Payment Method</h2>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                className={`p-5 rounded-lg border-2 transition-all duration-200 flex items-center space-x-4 shadow-lg ${
                  paymentMethod === method.id
                    ? 'border-primos-red bg-primos-red text-white shadow-primos-red/50'
                    : 'border-primos-gray-400 bg-primos-gray-200 text-primos-white hover:border-primos-red'
                }`}
              >
                <span className="text-3xl">💳</span>
                <span className="font-bold text-lg">{method.name}</span>
              </button>
            ))}
          </div>

          {/* Payment Details with QR Code */}
          {selectedPaymentMethod && (
            <div className="bg-primos-gray-200 border-2 border-primos-red rounded-lg p-6 mb-6">
              <h3 className="font-bold text-primos-white mb-4 text-lg">Payment Details</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primos-gray-600 mb-1">{selectedPaymentMethod.name}</p>
                  <p className="font-mono text-primos-white font-black text-lg">{selectedPaymentMethod.account_number}</p>
                  <p className="text-sm font-semibold text-primos-gray-600 mb-3">Account Name: {selectedPaymentMethod.account_name}</p>
                  <p className="text-2xl font-black text-primos-red">Amount: ₱{totalPrice}</p>
                </div>
                <div className="flex-shrink-0">
                  <img 
                    src={selectedPaymentMethod.qr_code_url} 
                    alt={`${selectedPaymentMethod.name} QR Code`}
                    className="w-40 h-40 rounded-lg border-4 border-primos-red shadow-xl shadow-primos-red/50"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
                    }}
                  />
                  <p className="text-xs font-bold text-primos-gray-700 text-center mt-2">SCAN TO PAY</p>
                </div>
              </div>
            </div>
          )}

          {/* Reference Number */}
          <div className="bg-yellow-900/30 border-2 border-yellow-600 rounded-lg p-5">
            <h4 className="font-bold text-yellow-400 mb-2 text-lg">📸 Payment Proof Required</h4>
            <p className="text-sm font-medium text-primos-gray-700">
              After making your payment, please take a screenshot of your payment receipt and attach it when you send your order via Messenger. This helps us verify and process your order quickly.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-primos-gray-50 rounded-xl shadow-xl shadow-primos-red/10 border-2 border-primos-gray-300 p-8">
          <h2 className="text-3xl font-display font-bold text-primos-white mb-6 pb-4 border-b-4 border-primos-red">Final Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="bg-primos-gray-200 border-2 border-primos-red rounded-lg p-5">
              <h4 className="font-bold text-primos-white mb-3 text-lg">Customer Details</h4>
              <p className="text-sm font-semibold text-primos-gray-700">Name: {customerName}</p>
              <p className="text-sm font-semibold text-primos-gray-700">Contact: {contactNumber}</p>
              <p className="text-sm font-semibold text-primos-gray-700">Service: {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}</p>
              {serviceType === 'delivery' && (
                <>
                  <p className="text-sm font-semibold text-primos-gray-700">Address: {address}</p>
                  {landmark && <p className="text-sm font-semibold text-primos-gray-700">Landmark: {landmark}</p>}
                </>
              )}
              {serviceType === 'pickup' && (
                <p className="text-sm font-semibold text-primos-gray-700">
                  Pickup Time: {pickupTime === 'custom' ? customTime : `${pickupTime} minutes`}
                </p>
              )}
              {serviceType === 'dine-in' && (
                <>
                  <p className="text-sm font-semibold text-primos-gray-700">
                    Party Size: {partySize} person{partySize !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm font-semibold text-primos-gray-700">
                    Preferred Time: {dineInTime ? new Date(dineInTime).toLocaleString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 'Not selected'}
                  </p>
                </>
              )}
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b-2 border-primos-gray-300">
                <div>
                  <h4 className="font-bold text-primos-white text-lg">{item.name}</h4>
                  {item.selectedVariation && (
                    <p className="text-sm font-semibold text-primos-gray-600">Size: {item.selectedVariation.name}</p>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <p className="text-sm font-semibold text-primos-gray-600">
                      Add-ons: {item.selectedAddOns.map(addOn => 
                        addOn.quantity && addOn.quantity > 1 
                          ? `${addOn.name} x${addOn.quantity}`
                          : addOn.name
                      ).join(', ')}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-primos-gray-600">₱{item.totalPrice} x {item.quantity}</p>
                </div>
                <span className="font-black text-primos-red text-xl">₱{item.totalPrice * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t-4 border-primos-red pt-6 mb-8">
            <div className="flex items-center justify-between text-3xl font-black">
              <span className="text-primos-white">TOTAL:</span>
              <span className="text-primos-red">₱{totalPrice}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full py-5 rounded-lg font-bold text-xl transition-all duration-200 transform bg-primos-red text-white hover:bg-primos-darkRed hover:scale-[1.02] shadow-2xl shadow-primos-red/50"
          >
            PLACE ORDER VIA MESSENGER
          </button>
          
          <p className="text-xs font-semibold text-primos-gray-700 text-center mt-4">
            You'll be redirected to Facebook Messenger to confirm your order. Don't forget to attach your payment screenshot!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;