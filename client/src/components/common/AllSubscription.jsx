import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { createOrder, initiatePayment } from '../../services/operations/subscription';

const AllSubscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await axios.get("https://meetix.mahitechnocrafts.in/api/v1/subscription/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPlans(data.subscriptions);
      } catch (err) {
        console.error(err);
        toast.error("Could not load plans.");
      }
    };

    const fetchUserPlans = async () => {
      try {
        const response = await axios.post(
          "https://meetix.mahitechnocrafts.in/api/v1/subscription/my-subscriptions",
          { token },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const active = response.data.subscriptions?.find(sub => sub.isActive);
        if (active) {
          setUserSubscription({
            id: active._id,
            rate: active.service?.rate,
            serviceId: active.service?._id,
            type: active.service?.type
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not load your subscription.");
      }
    };

    if (token) {
      fetchPlans();
      fetchUserPlans();
    }
  }, [token]);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) return resolve(true);
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (plan) => {
    try {
      const sdkLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!sdkLoaded) {
        toast.error("Failed to load Razorpay SDK.");
        return;
      }

      const orderId = await createOrder(plan.type, plan.rate, token);
      const ver = await initiatePayment(plan.type, plan.rate, orderId, plan._id, token);
      console.log("Payment success:", ver);
    } catch (err) {
      console.error("Subscription flow error:", err);
      toast.error("Subscription failed.");
    }
  };

  const getButtonText = (plan) => {
    if (!userSubscription) return "Subscribe";
    if (plan._id === userSubscription.serviceId) return "Subscribed";
    if (plan.rate > userSubscription.rate) return "Upgrade";
    if (plan.rate < userSubscription.rate) return "Downgrade";
    return "Change Plan";
  };

  const buttonClasses = (type) => {
    const map = {
      free: "bg-blue-600 hover:bg-blue-700",
      pro: "bg-green-600 hover:bg-green-700",
      business: "bg-orange-600 hover:bg-orange-700",
    };
    return map[type.toLowerCase()] || "bg-gray-600 hover:bg-gray-700";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {plans.map((plan, i) => (
        <div
          key={plan._id}
          className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col ${
            i % 3 === 0
              ? "slide-in-left"
              : i % 3 === 1
              ? "slide-in-bottom"
              : "slide-in-right"
          }`}
        >
          <h4 className="text-2xl font-semibold text-gray-900 mb-4">{plan.type}</h4>
          <p className="text-lg font-bold text-blue-600 mb-4">₹{plan.rate}/month</p>
          <ul className="text-gray-600 mb-6 space-y-2 flex-grow">
            {plan.description.split(",").map((pt, idx) => (
              <li key={idx}>• {pt.trim()}</li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe(plan)}
            className={`w-full ${buttonClasses(plan.type)} text-white py-2 px-4 rounded-md transition duration-300 mt-auto`}
            disabled={userSubscription?.serviceId === plan._id}
          >
            {getButtonText(plan)}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AllSubscriptions;
