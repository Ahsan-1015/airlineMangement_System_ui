import {
  ArrowLeft,
  Clock,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plane,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "./AdminContext";
import { useAuth } from "./AuthProvider";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

const contactMethods = [
  {
    icon: Phone,
    title: "Phone",
    detail: "+1 (555) 123-4567",
    description: "24/7 Customer Support",
    color: "from-teal-500 to-emerald-500",
  },
  {
    icon: Mail,
    title: "Email",
    detail: "support@skywings.com",
    description: "Response within 24 hours",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: MapPin,
    title: "Office",
    detail: "123 Aviation Blvd, NY 10001",
    description: "Visit our headquarters",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Globe,
    title: "Live Chat",
    detail: "Available Now",
    description: "Instant support online",
    color: "from-orange-500 to-red-500",
  },
];

const faqs = [
  {
    question: "How can I change my flight booking?",
    answer:
      'You can change your booking through the "My Bookings" section or contact our support team.',
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Free cancellation up to 24 hours before departure. Terms vary by ticket type.",
  },
  {
    question: "How early should I arrive at the airport?",
    answer:
      "We recommend arriving 2 hours before domestic flights and 3 hours before international flights.",
  },
];

export function ContactPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-teal-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <span className="text-teal-900">SkyWings</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/flights")}
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                Flights
              </button>
              <button
                onClick={() => navigate("/bookings")}
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                Bookings
              </button>
              <button className="text-teal-600">Contact</button>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <Button
                  onClick={() => {
                    const isAdmin = user.email
                      ? users.some(
                          (u) => u.email === user.email && u.role === "Admin"
                        )
                      : false;
                    navigate(isAdmin ? "/admin-dashboard" : "/user-dashboard");
                  }}
                  className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-600 text-white rounded-full px-6 shadow-lg"
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-600 text-white rounded-full px-6 shadow-lg"
                >
                  Login
                </Button>
              )}

              <button
                onClick={() => setMobileMenuOpen((s) => !s)}
                className="md:hidden p-2 rounded-lg bg-white/80 shadow-inner"
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 right-4 z-50 bg-white rounded-xl shadow-lg p-4 w-48">
          <button
            className="w-full text-left py-2"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/");
            }}
          >
            Home
          </button>
          <button
            className="w-full text-left py-2"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/flights");
            }}
          >
            Flights
          </button>
          <button
            className="w-full text-left py-2"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/bookings");
            }}
          >
            Bookings
          </button>
          <button
            className="w-full text-left py-2"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/contact");
            }}
          >
            Contact
          </button>
          {user ? (
            <button
              className="w-full text-left py-2"
              onClick={() => {
                setMobileMenuOpen(false);
                const role = user.role
                  ? user.role
                  : user.email
                  ? users.some(
                      (u) => u.email === user.email && u.role === "Admin"
                    )
                    ? "Admin"
                    : "User"
                  : undefined;
                navigate(
                  role === "Admin" ? "/admin-dashboard" : "/user-dashboard"
                );
              }}
            >
              Dashboard
            </button>
          ) : (
            <button
              className="w-full text-left py-2"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/login");
              }}
            >
              Login
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 py-16">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-white text-5xl mb-4">Get in Touch</h1>
            <p className="text-teal-100 text-xl">
              We're here to help with any questions or concerns
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-2xl transition-all duration-300 rounded-3xl border-0 bg-white/90 backdrop-blur-xl group cursor-pointer">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <method.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-900 mb-1">{method.detail}</p>
                <p className="text-gray-600">{method.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-900">Send us a Message</h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="h-12 rounded-xl border-gray-200 focus:border-teal-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-teal-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1 (555) 000-0000"
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-teal-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Subject
                  </label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) =>
                      setFormData({ ...formData, subject: value })
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-gray-200">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booking">Booking Inquiry</SelectItem>
                      <SelectItem value="cancellation">Cancellation</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us how we can help you..."
                    className="min-h-32 rounded-xl border-gray-200 focus:border-teal-400 resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-600 text-white rounded-xl shadow-lg"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* FAQs and Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Office Hours */}
            <Card className="p-8 rounded-3xl border-0 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 text-white shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="mb-4">Office Hours</h3>
                  <div className="space-y-2 text-teal-100">
                    <p>
                      <span className="text-white">Monday - Friday:</span> 8:00
                      AM - 8:00 PM
                    </p>
                    <p>
                      <span className="text-white">Saturday:</span> 9:00 AM -
                      6:00 PM
                    </p>
                    <p>
                      <span className="text-white">Sunday:</span> 10:00 AM -
                      4:00 PM
                    </p>
                  </div>
                  <p className="mt-4 text-white">
                    Customer support is available 24/7 for urgent matters
                  </p>
                </div>
              </div>
            </Card>

            {/* FAQs */}
            <Card className="p-8 rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <h3 className="text-gray-900 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <h4 className="text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card className="p-8 rounded-3xl border-0 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="mb-2">Emergency Contact</h3>
                  <p className="text-orange-100 mb-4">
                    For urgent flight-related emergencies, call our 24/7 hotline
                  </p>
                  <div className="text-white">+1 (555) 911-HELP</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
