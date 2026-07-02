export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  isBestseller: boolean;
  categoryName: string;
  spiceLevel: string;
  stock: number;
  description?: string;
  tags?: string[];
  isNew?: boolean;
  createdAt?: string;
}

export interface ProductDetail extends Product {
  description: string;
  story: string;
  healthBenefits: string;
  usageSuggestions: string;
  ingredients: string;
  galleryUrls: string[];
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  productCount: number;
  svgIcon?: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImageUrl: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  loyaltyPoints: number;
  referralCode: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  referralCode: string;
  loyaltyPoints: number;
  hasClaimedSample: boolean;
}

export interface ReferralDashboard {
  referralCode: string;
  totalEarnings: number;
  totalReferrals: number;
  pendingReferrals: number;
  rewardPerReferral: number;
  shareMessage: string;
  shareUrl: string;
}

export interface AnalyticsDashboard {
  sales: {
    totalRevenue: number;
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
    averageOrderValue: number;
    totalOrders: number;
    todayOrders: number;
  };
  customers: {
    repeatCustomerPercent: number;
    newCustomers: number;
    returningCustomers: number;
    totalCustomers: number;
  };
  products: {
    topSelling: { productId: string; name: string; unitsSold: number; revenue: number; viewCount: number }[];
    lowPerforming: { productId: string; name: string; unitsSold: number; revenue: number; viewCount: number }[];
    categoryPerformance: { category: string; revenue: number; orderCount: number }[];
  };
  referrals: {
    conversionRate: number;
    totalReferrals: number;
    convertedReferrals: number;
    topReferrers: { userId: string; name: string; referralCode: string; referralCount: number; earnings: number }[];
  };
  funnel: {
    visits: number;
    productViews: number;
    addToCarts: number;
    checkoutStarts: number;
    purchases: number;
    viewRate: number;
    cartRate: number;
    checkoutRate: number;
    purchaseRate: number;
  };
}


export interface InvestorCrmOverview {
  totalInvestors: number;
  totalDeals: number;
  totalCommittedCapital: number;
  registeredLandArea: number;
  openComplianceCases: number;
  whiteFunds: number;
  blackFunds: number;
}

export interface RevenueReport {
  totalEarnings: number;
  investorPayouts: number;
  netRevenue: number;
  dealCount: number;
  totalLandArea: number;
  whiteFunds: number;
  blackFunds: number;
}

export interface LandDealSummary {
  id: string;
  dealCode: string;
  title: string;
  location: string;
  areaInAcres: number;
  acquisitionCost: number;
  expectedRevenue: number;
  registrationCompleted: boolean;
}

export interface PricingPlan {
  id: string;
  code: string;
  name: string;
  monthlyPrice: number;
  includesBasicCrm: boolean;
  includesAdvancedTracking: boolean;
  includesComplianceDashboard: boolean;
}

export interface ComplianceCase {
  id: string;
  investorAccountId?: string;
  landDealId?: string;
  alertType: string;
  severity: string;
  status: string;
  dueDate?: string;
  createdAt: string;
}
