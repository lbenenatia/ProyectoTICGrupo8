import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const OrderTrackingCard = ({ order, onCancelOrder, onContactDriver }) => {
  const STATUS_LABELS = {
    QUEUE: 'En cola',
    PREPARING: 'En preparación', 
    DELIVERING: 'En camino',
    CANCELLED: 'Cancelado'
  };

  const STATUS_DESCRIPTIONS = {
    QUEUE: 'Pedido recibido y en cola para ser procesado',
    PREPARING: 'Pedido en preparación',
    DELIVERING: 'Pedido en camino al destino',
    CANCELLED: 'Pedido cancelado'
  };

  const trackingSteps = [
    {
      id: "QUEUE",
      title: STATUS_LABELS.QUEUE,
      description: STATUS_DESCRIPTIONS.QUEUE,
      time: order?.creationDate,
      completed: ["QUEUE", "PREPARING", "DELIVERING"].includes(order?.status),
      active: order?.status === "QUEUE"
    },
    {
      id: "PREPARING",
      title: STATUS_LABELS.PREPARING,
      description: STATUS_DESCRIPTIONS.PREPARING,
      time: order?.paidAt,
      completed: ["PREPARING", "DELIVERING"].includes(order?.status),
      active: order?.status === "PREPARING"
    },
    {
      id: "DELIVERING",
      title: STATUS_LABELS.DELIVERING,
      description: STATUS_DESCRIPTIONS.DELIVERING,
      time: order?.deliveredAt,
      completed: order?.status === "DELIVERING",
      active: order?.status === "DELIVERING"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "QUEUE":
        return 'text-blue-500';
      case "PREPARING":
        return 'text-green-500';
      case "DELIVERING":
        return 'text-gray-500';
      case "CANCELLED":
        return 'text-red-500';
      default:
        return 'text-text-secondary';
    }
  };

  const getStepColor = (step) => {
    if (step.completed) return 'bg-green-500 text-white';
    if (step.active) return 'bg-blue-500 text-white';
    return 'bg-gray-300 text-gray-500';
  };

  if (order?.status === "CANCELLED") {
    return (
      <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Pedido #{order?.id}</h3>
            <p className="text-sm text-text-secondary">Realizado el {new Date(order.creationDate)?.toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-red-500">
              {STATUS_LABELS.CANCELLED}
            </p>
          </div>
        </div>
        
        <div className="text-center py-8">
          <Icon name="XCircle" size={48} className="text-red-500 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-text-primary mb-2">Pedido Cancelado</h4>
          <p className="text-text-secondary">Este pedido ha sido cancelado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Pedido #{order?.id}</h3>
          <p className="text-sm text-text-secondary">Realizado el {new Date(order.creationDate)?.toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-medium ${getStatusColor(order?.status)}`}>
            {STATUS_LABELS[order?.status] || order?.status}
          </p>
          <p className="text-sm text-text-secondary">
            {order?.deliveryType === 'delivery' ? 'Delivery' : 'Retiro en local'}
          </p>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="space-y-4 mb-6">
        {trackingSteps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepColor(step)}`}>
                {step.completed ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              {index < trackingSteps.length - 1 && (
                <div className={`w-0.5 h-8 mt-2 ${
                  step.completed ? 'bg-green-500' : 'bg-border'
                }`} />
              )}
            </div>
            <div className="flex-1 pb-4">
              <h4 className={`font-medium ${
                step.completed || step.active ? 'text-text-primary' : 'text-text-secondary'
              }`}>
                {step.title}
              </h4>
              <p className="text-sm text-text-secondary mt-1">{step.description}</p>
              {step.time && (
                <p className="text-xs text-text-secondary mt-1">
                  {new Date(step.time).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {order?.status === "QUEUE" && onCancelOrder && (
          <Button
            variant="outline"
            size="sm"
            iconName="X"
            onClick={() => onCancelOrder(order?.id)}
          >
            Cancelar Pedido
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          iconName="MessageCircle"
        >
          Contactar Soporte
        </Button>
      </div>
    </div>
  );
};

export default OrderTrackingCard;