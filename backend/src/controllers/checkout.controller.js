import { Customer } from "../models/customer.model.js";
import { Order } from "../models/order.model.js";

export async function createOrder(req, res) {
  const { name, email, phone, tickets, total, paymentMethod } = req.body;

  // Create/update a customer record for analytics/history (no auth)
  const customer = await Customer.findOneAndUpdate(
    { email },
    { name, email, phone },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const order = await Order.create({
    customer: customer._id,
    contact: { name, email, phone }, // snapshot for historical accuracy
    tickets,
    total,
    paymentMethod,
    status: "paid"
  });

  // send email using order.contact.email
  // await sendTicketsEmail(order);

  res.status(201).json({ orderId: order._id });
}