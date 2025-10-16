const { createApp } = Vue;

createApp({
  data() {
    return {
      lessons: [],            // loaded from backend
      searchQuery: '',
      sortAttribute: 'subject',
      sortOrder: 'asc',
      cart: [],
      showCartPage: false,
      customerName: '',
      customerPhone: '',
      showConfirmationPopup: false,
      orderConfirmation: ''
    };
  },
  computed: {
    filteredLessons() {
      let filtered = this.lessons.filter(lesson =>
        lesson.subject.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      return filtered.sort((a, b) => {
        let valueA = a[this.sortAttribute];
        let valueB = b[this.sortAttribute];
        if (this.sortAttribute === 'price' || this.sortAttribute === 'spaces') {
          valueA = Number(valueA);
          valueB = Number(valueB);
        } else {
          valueA = String(valueA).toLowerCase();
          valueB = String(valueB).toLowerCase();
        }
        const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        return this.sortOrder === 'asc' ? comparison : -comparison;
      });
    },
    totalCartItems() {
      return this.cart.reduce((total, item) => total + item.spaces, 0);
    },
    isCheckoutValid() {
      const nameRegex = /^[A-Za-z\s]+$/;
      const phoneRegex = /^[0-9]{10}$/;
      return (
        this.cart.length > 0 &&
        nameRegex.test(this.customerName.trim()) &&
        phoneRegex.test(this.customerPhone.trim())
      );
    },
    totalCartPrice() {
      return this.cart.reduce((sum, item) => sum + item.price * item.spaces, 0);
    }
  },
  methods: {
    async loadLessons() {
      try {
        const res = await fetch('http://localhost:5000/api/lessons');
        if (!res.ok) throw new Error('Failed to fetch lessons');
        const data = await res.json();
        // map backend fields to UI fields. Add a default icon if none.
        this.lessons = data.map(l => ({
          _id: l._id,
          subject: l.topic || 'Untitled',
          location: l.location || '',
          price: l.price || 0,
          spaces: l.space != null ? l.space : 0,
          icon: this.iconForSubject(l.topic)
        }));
      } catch (err) {
        console.error('Error loading lessons:', err);
      }
    },
    iconForSubject(topic) {
      if (!topic) return 'fas fa-book';
      const t = topic.toLowerCase();
      if (t.includes('math')) return 'fas fa-calculator';
      if (t.includes('science') || t.includes('chem')) return 'fas fa-flask';
      if (t.includes('music')) return 'fas fa-music';
      if (t.includes('chess')) return 'fas fa-chess';
      if (t.includes('business')) return 'fas fa-briefcase';
      return 'fas fa-book';
    },
    addToCart(lesson) {
      if (lesson.spaces > 0) {
        lesson.spaces -= 1;
        const cartItem = this.cart.find(item => item._id === lesson._id);
        if (cartItem) {
          cartItem.spaces += 1;
        } else {
          this.cart.push({
            _id: lesson._id,
            subject: lesson.subject,
            location: lesson.location,
            price: lesson.price,
            icon: lesson.icon,
            spaces: 1
          });
        }
      }
    },
    removeFromCart(_id) {
      const idx = this.cart.findIndex(i => i._id === _id);
      if (idx !== -1) {
        const cartItem = this.cart[idx];
        const lesson = this.lessons.find(l => l._id === _id);
        if (lesson) lesson.spaces += cartItem.spaces;
        this.cart.splice(idx, 1);
      }
    },
    toggleCartPage() {
      this.showCartPage = !this.showCartPage;
    },
    async submitOrder() {
  if (this.isCheckoutValid) {
    // Build array of items
    const items = this.cart.map(item => ({
      lessonID: item._id,       
      quantity: item.spaces     
    }));

    const payload = {
      name: this.customerName.trim(),
      phoneNumber: this.customerPhone.trim(),
      items
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Order failed');

      // Success popup
      this.showConfirmationPopup = true;
      this.orderConfirmation = `Thank you, ${this.customerName}! Your order has been placed successfully.`;

      // Reset
      setTimeout(() => {
        this.cart = [];
        this.customerName = '';
        this.customerPhone = '';
        this.showConfirmationPopup = false;
        this.showCartPage = false;
      }, 3000);
    } catch (error) {
      alert(error.message);
      console.error('Checkout error:', error);
    }
  } else {
    alert('Please enter a valid name and 10-digit phone number before checking out.');
  }
}
  },
  mounted() {
    this.loadLessons();
  }
}).mount('#app');
