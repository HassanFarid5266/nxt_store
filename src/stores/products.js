import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const categories = ref([])
  const loading = ref(false)

  // Exact NexTash store.nextash.com product data
  const allProducts = [
    {
      name: "nxt-theme",
      featured_image: "/src/assets/images/products/nxt-theme.jpg",
      image: "/src/assets/images/products/nxt-theme.jpg",
      alt: "NXT Theme - Rich UI/UX theme for Frappe applications",
      title: "NXT Theme",
      excerpt: "A rich UI/UX theme for Frappe applications like ERPNext, offering advanced, user-friendly features",
      description: `<div class="product-description">
        <h3>Transform Your Frappe Experience</h3>
        <p>NXT Theme is a premium user interface and user experience enhancement specifically designed for Frappe applications, including ERPNext. This theme revolutionizes how you interact with your business applications by providing a modern, intuitive, and visually appealing interface.</p>
        
        <h4>Key Features:</h4>
        <ul>
          <li>Modern and intuitive user interface design</li>
          <li>Enhanced user experience with improved navigation</li>
          <li>Responsive design that works on all devices</li>
          <li>Custom color schemes and branding options</li>
          <li>Improved dashboard layouts and widgets</li>
          <li>Enhanced form layouts and field styling</li>
          <li>Advanced reporting and analytics views</li>
          <li>Mobile-optimized interface</li>
          <li>Easy installation and configuration</li>
          <li>Regular updates and support</li>
        </ul>
        
        <h4>Compatible With:</h4>
        <ul>
          <li>ERPNext (All recent versions)</li>
          <li>Frappe Framework applications</li>
          <li>Custom Frappe applications</li>
        </ul>
        
        <p>Perfect for businesses looking to enhance their team's productivity and user satisfaction with their ERP system.</p>
      </div>`,
      category: "Themes & UI",
      variations: [
        {
          name: "standard",
          title: "NXT Theme Standard",
          price: "700",
          discount: null,
          excerpt: "Complete UI/UX transformation for your Frappe applications",
          description: `<div class="variation-details">
            <h4>What's Included:</h4>
            <ul>
              <li>Complete theme installation</li>
              <li>Basic customization support</li>
              <li>Installation guide and documentation</li>
              <li>30 days email support</li>
              <li>Updates for 1 year</li>
            </ul>
          </div>`,
          link_title: "Purchase NXT Theme"
        }
      ],
      images: [
        { idx: 0, image: "/src/assets/images/products/nxt-theme-gallery-1.jpg" },
        { idx: 1, image: "/src/assets/images/products/nxt-theme-gallery-2.jpg" },
        { idx: 2, image: "/src/assets/images/products/nxt-theme-gallery-3.jpg" },
        { idx: 3, image: "/src/assets/images/products/nxt-theme-gallery-4.jpg" }
      ],
      email: "support@nextash.com",
      phone: "+92 308 3077 165",
      demo: "https://demo.nextash.com/nxt-theme",
      demo_user: "demo@nextash.com",
      demo_password: "Demo@123",
      video: "https://www.youtube.com/watch?v=nxt-theme-demo",
      rating: 5,
      rating_count: 25
    },
    {
      name: "pos-awesome",
      featured_image: "/src/assets/images/products/pos-awesome.jpg",
      image: "/src/assets/images/products/pos-awesome.jpg",
      alt: "POS Awesome - Upscale POS system with unified order tracking",
      title: "POS Awesome",
      excerpt: "An upscale point-of-sale system with unified order tracking and intuitive UI/UX, designed for ERPNext",
      description: `<div class="product-description">
        <h3>Revolutionary Point of Sale Solution</h3>
        <p>POS Awesome is an advanced point-of-sale system that transforms how you handle retail transactions in ERPNext. With its unified order tracking and intuitive interface, it streamlines your sales process and enhances customer experience.</p>
        
        <h4>Key Features:</h4>
        <ul>
          <li>Intuitive and modern POS interface</li>
          <li>Unified order tracking across all channels</li>
          <li>Real-time inventory management</li>
          <li>Multiple payment method support</li>
          <li>Customer management and loyalty programs</li>
          <li>Advanced reporting and analytics</li>
          <li>Offline mode capability</li>
          <li>Receipt customization</li>
          <li>Barcode scanning support</li>
          <li>Multi-location support</li>
          <li>Tax calculation and compliance</li>
          <li>Return and refund management</li>
        </ul>
        
        <h4>Perfect For:</h4>
        <ul>
          <li>Retail stores and outlets</li>
          <li>Restaurants and cafes</li>
          <li>Service businesses</li>
          <li>Multi-location retailers</li>
        </ul>
        
        <p>Enhance your sales process with this powerful POS solution integrated seamlessly with ERPNext.</p>
      </div>`,
      category: "POS Systems",
      variations: [
        {
          name: "version-15",
          title: "POS Awesome (Version 15)",
          price: "700",
          discount: null,
          excerpt: "Complete POS solution for ERPNext Version 15",
          description: `<div class="variation-details">
            <h4>What's Included:</h4>
            <ul>
              <li>Full POS Awesome installation</li>
              <li>Configuration and setup support</li>
              <li>Training materials and documentation</li>
              <li>90 days technical support</li>
              <li>Free updates for 1 year</li>
              <li>Custom receipt template</li>
            </ul>
          </div>`,
          link_title: "Get POS Awesome"
        }
      ],
      images: [
        { idx: 0, image: "/src/assets/images/products/pos-awesome-gallery-1.jpg" },
        { idx: 1, image: "/src/assets/images/products/pos-awesome-gallery-2.jpg" },
        { idx: 2, image: "/src/assets/images/products/pos-awesome-gallery-3.jpg" },
        { idx: 3, image: "/src/assets/images/products/pos-awesome-gallery-4.jpg" }
      ],
      email: "support@nextash.com",
      phone: "+92 308 3077 165",
      demo: "https://demo.nextash.com/pos-awesome",
      demo_user: "demo@nextash.com",
      demo_password: "Demo@123",
      video: "https://www.youtube.com/watch?v=pos-awesome-demo",
      rating: 5,
      rating_count: 18
    },
    {
      name: "payswitch",
      featured_image: "/src/assets/images/products/payswitch.jpg",
      image: "/src/assets/images/products/payswitch.jpg",
      alt: "Payswitch - Seamless and secure online payment management",
      title: "Payswitch",
      excerpt: "A comprehensive platform providing seamless and secure management of online transactions for businesses",
      description: `<div class="product-description">
        <h3>Secure Payment Processing Made Simple</h3>
        <p>Payswitch is a robust payment management platform that enables businesses to handle online transactions with ease and security. Designed to integrate seamlessly with your existing systems, it provides a comprehensive solution for payment processing needs.</p>
        
        <h4>Key Features:</h4>
        <ul>
          <li>Multiple payment gateway integrations</li>
          <li>Secure transaction processing</li>
          <li>Real-time payment tracking</li>
          <li>Automated payment reconciliation</li>
          <li>Fraud detection and prevention</li>
          <li>Recurring payment support</li>
          <li>Multi-currency support</li>
          <li>Detailed payment analytics</li>
          <li>Mobile-friendly payment forms</li>
          <li>PCI DSS compliance</li>
          <li>API integration support</li>
          <li>Webhook notifications</li>
        </ul>
        
        <h4>Supported Payment Methods:</h4>
        <ul>
          <li>Credit and Debit Cards</li>
          <li>Digital Wallets</li>
          <li>Bank Transfers</li>
          <li>Mobile Money</li>
          <li>Cryptocurrency (selected)</li>
        </ul>
        
        <p>Streamline your payment processes and enhance customer trust with our secure payment solution.</p>
      </div>`,
      category: "Payment Solutions",
      variations: [
        {
          name: "standard",
          title: "Payswitch Standard",
          price: "200",
          discount: null,
          excerpt: "Complete payment management solution",
          description: `<div class="variation-details">
            <h4>What's Included:</h4>
            <ul>
              <li>Payswitch platform access</li>
              <li>Setup and configuration</li>
              <li>Integration support</li>
              <li>Documentation and guides</li>
              <li>60 days support</li>
              <li>Transaction monitoring</li>
            </ul>
          </div>`,
          link_title: "Get Payswitch"
        }
      ],
      images: [
        { idx: 0, image: "/src/assets/images/products/payswitch-gallery-1.jpg" },
        { idx: 1, image: "/src/assets/images/products/payswitch-gallery-2.jpg" },
        { idx: 2, image: "/src/assets/images/products/payswitch-gallery-3.jpg" }
      ],
      email: "support@nextash.com",
      phone: "+92 308 3077 165",
      demo: "https://demo.nextash.com/payswitch",
      demo_user: "demo@nextash.com",
      demo_password: "Demo@123",
      rating: 5,
      rating_count: 12
    },
    {
      name: "crunchbase",
      featured_image: "/src/assets/images/products/crunchbase.jpg",
      image: "/src/assets/images/products/crunchbase.jpg",
      alt: "Crunchbase - Essential business intelligence resource",
      title: "Crunchbase",
      excerpt: "An essential resource for staying informed and connected in the business world with comprehensive company data",
      description: `<div class="product-description">
        <h3>Business Intelligence & Company Data</h3>
        <p>Our Crunchbase integration provides access to comprehensive business intelligence and company data, helping you stay informed about market trends, competitors, and potential business opportunities.</p>
        
        <h4>Key Features:</h4>
        <ul>
          <li>Comprehensive company database access</li>
          <li>Funding and investment tracking</li>
          <li>Market trend analysis</li>
          <li>Competitor intelligence</li>
          <li>Industry insights and reports</li>
          <li>Contact and lead generation</li>
          <li>Company financial data</li>
          <li>News and updates tracking</li>
          <li>Advanced search and filtering</li>
          <li>Export and integration capabilities</li>
          <li>Real-time data updates</li>
          <li>Custom alerts and notifications</li>
        </ul>
        
        <h4>Perfect For:</h4>
        <ul>
          <li>Sales and business development teams</li>
          <li>Investors and VCs</li>
          <li>Market researchers</li>
          <li>Startups and entrepreneurs</li>
          <li>Business analysts</li>
        </ul>
        
        <p>Stay ahead of the competition with comprehensive business intelligence and market insights.</p>
      </div>`,
      category: "Business Intelligence",
      variations: [
        {
          name: "standard",
          title: "Crunchbase Access",
          price: "150",
          discount: null,
          excerpt: "Complete business intelligence solution",
          description: `<div class="variation-details">
            <h4>What's Included:</h4>
            <ul>
              <li>Crunchbase platform access</li>
              <li>Data integration setup</li>
              <li>Training and onboarding</li>
              <li>Custom report templates</li>
              <li>30 days support</li>
              <li>Monthly data updates</li>
            </ul>
          </div>`,
          link_title: "Get Crunchbase Access"
        }
      ],
      images: [
        { idx: 0, image: "/src/assets/images/products/crunchbase-gallery-1.jpg" },
        { idx: 1, image: "/src/assets/images/products/crunchbase-gallery-2.jpg" }
      ],
      email: "support@nextash.com",
      phone: "+92 308 3077 165",
      rating: 5,
      rating_count: 8
    },
    {
      name: "jitsi-meet",
      featured_image: "/src/assets/images/products/jitsi-meet.jpg",
      image: "/src/assets/images/products/jitsi-meet.jpg",
      alt: "Jitsi Meet - Seamless online meetings with secure video",
      title: "Jitsi Meet",
      excerpt: "A comprehensive solution for seamless online meetings with secure video, screen sharing, and chat capabilities",
      description: `<div class="product-description">
        <h3>Secure Video Conferencing Solution</h3>
        <p>Jitsi Meet integration provides a complete video conferencing solution with advanced security features, perfect for businesses that require reliable and secure communication tools.</p>
        
        <h4>Key Features:</h4>
        <ul>
          <li>HD video and audio conferencing</li>
          <li>Screen sharing and presentation tools</li>
          <li>Real-time chat and messaging</li>
          <li>Meeting recording capabilities</li>
          <li>End-to-end encryption</li>
          <li>Multi-participant support</li>
          <li>Mobile app compatibility</li>
          <li>Calendar integration</li>
          <li>Waiting room functionality</li>
          <li>Meeting passwords and locks</li>
          <li>Custom branding options</li>
          <li>API integration support</li>
        </ul>
        
        <h4>Security Features:</h4>
        <ul>
          <li>End-to-end encryption</li>
          <li>Secure meeting rooms</li>
          <li>User authentication</li>
          <li>Admin controls and moderation</li>
          <li>GDPR compliance</li>
        </ul>
        
        <p>Host secure and professional meetings with our enterprise-grade video conferencing solution.</p>
      </div>`,
      category: "Communication Tools",
      variations: [
        {
          name: "enterprise",
          title: "Jitsi Meet Enterprise",
          price: "200",
          discount: null,
          excerpt: "Enterprise video conferencing solution",
          description: `<div class="variation-details">
            <h4>What's Included:</h4>
            <ul>
              <li>Custom Jitsi Meet instance</li>
              <li>Setup and configuration</li>
              <li>Custom branding</li>
              <li>Security hardening</li>
              <li>90 days support</li>
              <li>Training and documentation</li>
            </ul>
          </div>`,
          link_title: "Get Jitsi Meet"
        }
      ],
      images: [
        { idx: 0, image: "/src/assets/images/products/jitsi-meet-gallery-1.jpg" },
        { idx: 1, image: "/src/assets/images/products/jitsi-meet-gallery-2.jpg" },
        { idx: 2, image: "/src/assets/images/products/jitsi-meet-gallery-3.jpg" }
      ],
      email: "support@nextash.com",
      phone: "+92 308 3077 165",
      demo: "https://demo.nextash.com/jitsi-meet",
      demo_user: "demo@nextash.com",
      demo_password: "Demo@123",
      rating: 5,
      rating_count: 15
    },
    {
      name: "hijri-calendar",
      featured_image: "/src/assets/images/products/hijri-calendar.jpg",
      image: "/src/assets/images/products/hijri-calendar.jpg",
      alt: "Hijri Calendar - Hijri date selector for date fields",
      title: "Hijri Calendar",
      excerpt: "An essential application that adds a Hijri date selector to date fields, facilitating ease of use for lunar calendar users",
      description: `<div class="product-description">
        <h3>Islamic Calendar Integration</h3>
        <p>The Hijri Calendar application seamlessly integrates Islamic lunar calendar functionality into your applications, making it easy for users who work with Hijri dates to manage their data effectively.</p>
        
        <h4>Key Features:</h4>
        <ul>
          <li>Hijri date picker integration</li>
          <li>Automatic Gregorian conversion</li>
          <li>Islamic holidays highlighting</li>
          <li>Multiple date format support</li>
          <li>Customizable date displays</li>
          <li>Regional calendar variations</li>
          <li>Easy integration with existing forms</li>
          <li>Multi-language support</li>
          <li>Mobile-friendly interface</li>
          <li>API for custom implementations</li>
        </ul>
        
        <h4>Perfect For:</h4>
        <ul>
          <li>Islamic financial institutions</li>
          <li>Educational institutions</li>
          <li>Government organizations</li>
          <li>Religious organizations</li>
          <li>Any application serving Muslim users</li>
        </ul>
        
        <p>Enhance user experience for Muslim users with proper Hijri calendar support in your applications.</p>
      </div>`,
      category: "Utilities & Tools",
      variations: [
        {
          name: "standard",
          title: "Hijri Calendar Standard",
          price: "50",
          discount: null,
          excerpt: "Complete Hijri calendar integration",
          description: `<div class="variation-details">
            <h4>What's Included:</h4>
            <ul>
              <li>Hijri Calendar app</li>
              <li>Installation guide</li>
              <li>Basic customization</li>
              <li>Documentation</li>
              <li>30 days email support</li>
              <li>Minor updates</li>
            </ul>
          </div>`,
          link_title: "Get Hijri Calendar"
        }
      ],
      images: [
        { idx: 0, image: "/src/assets/images/products/hijri-calendar-gallery-1.jpg" },
        { idx: 1, image: "/src/assets/images/products/hijri-calendar-gallery-2.jpg" }
      ],
      email: "support@nextash.com",
      phone: "+92 308 3077 165",
      rating: 5,
      rating_count: 22
    }
  ]

  const allCategories = [
    { name: "themes", title: "Themes & UI" },
    { name: "pos", title: "POS Systems" },
    { name: "payments", title: "Payment Solutions" },
    { name: "business-intelligence", title: "Business Intelligence" },
    { name: "communication", title: "Communication Tools" },
    { name: "utilities", title: "Utilities & Tools" }
  ]

  // Computed properties
  const getProductByName = computed(() => {
    return (name) => allProducts.find(product => product.name === name)
  })

  const getRelatedProducts = computed(() => {
    return (currentProduct, limit = 3) => {
      if (!currentProduct) return []
      
      return allProducts
        .filter(product => 
          product.name !== currentProduct.name && 
          product.category === currentProduct.category
        )
        .slice(0, limit)
    }
  })

  const getProductsByCategory = computed(() => {
    return (categoryName) => {
      if (!categoryName) return allProducts
      
      return allProducts.filter(product => {
        const category = allCategories.find(cat => cat.name === categoryName)
        return product.category === category?.title
      })
    }
  })

  // Actions
  const loadProducts = async () => {
    loading.value = true
    try {
      products.value = [...allProducts]
      categories.value = [...allCategories]
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      loading.value = false
    }
  }

  const searchProducts = (query) => {
    if (!query) return allProducts
    
    const lowerQuery = query.toLowerCase()
    return allProducts.filter(product =>
      product.title.toLowerCase().includes(lowerQuery) ||
      product.excerpt.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    )
  }

  return {
    products,
    categories,
    loading,
    allProducts,
    allCategories,
    getProductByName,
    getRelatedProducts,
    getProductsByCategory,
    loadProducts,
    searchProducts
  }
})
