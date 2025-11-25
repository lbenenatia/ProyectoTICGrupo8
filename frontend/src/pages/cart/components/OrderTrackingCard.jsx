import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const OrderTrackingCard = ({ order, onCancelOrder, onContactDriver }) => {
  if (!order) return null;

  const cleanStatus = (value) => {
    if (!value) return "";
    return value
      .toString()
      .replace("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const status = order.status;

  const trackingSteps = [
    {
      id: "queue",
      title: "Order in Queue",
      description: "Your order is waiting to be processed",
      completed: status !== "QUEUE",
    },
    {
      id: "preparing",
      title: "Preparing Order",
      description: "Our chefs are working on your creation",
      completed: status !== "QUEUE" && status !== "PREPARING",
    },
    {
      id: "delivering",
      title: "Out for Delivery",
      description: "Your order is on the way",
      completed:
        status === "RECEIVED" || status === "DELIVERING",
    },
    {
      id: "received",
      title: "Order Delivered",
      description: "Enjoy your meal!",
      completed: status === "RECEIVED",
    },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-warm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Order #{order.id}
          </h3>

          <p className="text-sm text-text-secondary">
            Placed on{" "}
            {order.creationDate
              ? new Date(order.creationDate).toLocaleDateString()
              : "Unknown Date"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-text-primary">
            {cleanStatus(order.status)}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-6">
        {trackingSteps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              {/* Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-text-secondary"
                }`}
              >
                {step.completed ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <span className="text-sm font-medium">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Divider */}
              {index < trackingSteps.length - 1 && (
                <div
                  className={`w-0.5 h-8 mt-2 ${
                    step.completed ? "bg-success" : "bg-border"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <h4
                className={`font-medium ${
                  step.completed
                    ? "text-text-primary"
                    : "text-text-secondary"
                }`}
              >
                {step.title}
              </h4>
              <p className="text-sm text-text-secondary mt-1">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {order.status === "QUEUE" && (
          <Button
            variant="outline"
            size="sm"
            iconName="X"
            onClick={() => onCancelOrder(order.id)}
          >
            Cancel Order
          </Button>
        )}

        <Button variant="ghost" size="sm" iconName="MessageCircle">
          Contact Support
        </Button>

        <Button variant="ghost" size="sm" iconName="Receipt">
          View Receipt
        </Button>
      </div>
    </div>
  );
};

export default OrderTrackingCard;
