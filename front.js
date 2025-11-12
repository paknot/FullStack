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
    // Filter Lessons
    filteredLessons() {
      return this.lessons.sort((a, b) => {
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
    // Number of items in cart
    totalCartItems() {
      return this.cart.reduce((total, item) => total + item.spaces, 0);
    },
    // Validate checkout 
    isCheckoutValid() {
      const nameRegex = /^[A-Za-z\s]+$/;
      const phoneRegex = /^[0-9]{10}$/;
      return (
        this.cart.length > 0 &&
        nameRegex.test(this.customerName.trim()) &&
        phoneRegex.test(this.customerPhone.trim())
      );
    },
    // Total price of cart
    totalCartPrice() {
      return this.cart.reduce((sum, item) => sum + item.price * item.spaces, 0);
    }
  },
  methods: {
    // Load lessons from backend
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
          imageUrl: `http://localhost:5000${l.imageUrl}` // include full path
        }));

      } catch (err) {
        console.error('Error loading lessons:', err);
      }
    },
    // Search lessons
    async searchLessons() {
      try {
        const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(this.searchQuery)}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        this.lessons = data.map(l => ({
          _id: l._id,
          subject: l.topic || 'Untitled',
          location: l.location || '',
          price: l.price || 0,
          spaces: l.space != null ? l.space : 0,
          imageUrl: `http://localhost:5000${l.imageUrl}`
        }));
      } catch (err) {
        console.error('Error performing search:', err);
      }
    },
    // Add lesson to cart
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
    // Remove lesson from cart
    removeFromCart(_id) {
      const idx = this.cart.findIndex(i => i._id === _id);
      if (idx !== -1) {
        const cartItem = this.cart[idx];
        const lesson = this.lessons.find(l => l._id === _id);
        if (lesson) lesson.spaces += cartItem.spaces;
        this.cart.splice(idx, 1);
      }
    },
    // Open cart page
    toggleCartPage() {
      this.showCartPage = !this.showCartPage;
    },
    async submitOrder() {
      if (this.isCheckoutValid) {
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

          // Update space with PUT
          for (const item of items) {
            const lesson = this.lessons.find(l => l._id === item.lessonID);
            if (lesson) {
              const newSpace = lesson.spaces;
              await this.updateLessonSpace(item.lessonID, newSpace);
            }
          }

          // Confirmation popup
          this.showConfirmationPopup = true;
          this.orderConfirmation = `Thank you, ${this.customerName}! Your order has been placed successfully.`;

          // Reset input
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
    },
    // Update Lesson with PUT
    async updateLessonSpace(lessonId, newSpace) {
      try {
        const response = await fetch(`http://localhost:5000/api/lessons/${lessonId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ space: newSpace })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to update lesson');
        console.log(` Lesson ${lessonId} space updated to ${newSpace}`);
      } catch (error) {
        console.error('Error updating lesson space:', error);
      }
    },
  },
  mounted() {
    this.loadLessons();
  }
}).mount('#app');
