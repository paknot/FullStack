const { createApp } = Vue;

createApp({
    data() {
        return {
            lessons: [
                { subject: 'Mathematics', location: 'London', price: 25, spaces: 5, icon: 'fas fa-calculator' },
                { subject: 'Science', location: 'Oxford', price: 30, spaces: 5, icon: 'fas fa-flask' },
                { subject: 'English', location: 'Cambridge', price: 20, spaces: 5, icon: 'fas fa-book' },
                { subject: 'History', location: 'Oxford', price: 22, spaces: 5, icon: 'fas fa-landmark' },
                { subject: 'Physics', location: 'Cambridge', price: 28, spaces: 5, icon: 'fas fa-atom' },
                { subject: 'Chemistry', location: 'Brighton', price: 30, spaces: 5, icon: 'fas fa-vial' },
                { subject: 'Biology', location: 'Online', price: 25, spaces: 5, icon: 'fas fa-leaf' },
                { subject: 'Business', location: 'Brighton', price: 35, spaces: 5, icon: 'fas fa-business-time' },
                { subject: 'Music', location: 'London', price: 24, spaces: 5, icon: 'fas fa-music' },
                { subject: 'Chess', location: 'Online', price: 15, spaces: 5, icon: 'fas fa-chess' }
            ],
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
                    valueA = valueA.toLowerCase();
                    valueB = valueB.toLowerCase();
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
        addToCart(lesson) {
            if (lesson.spaces > 0) {
                lesson.spaces -= 1;
                const cartItem = this.cart.find(item => item.subject === lesson.subject);
                if (cartItem) {
                    cartItem.spaces += 1;
                } else {
                    this.cart.push({
                        subject: lesson.subject,
                        location: lesson.location,
                        price: lesson.price,
                        icon: lesson.icon,
                        spaces: 1
                    });
                }
            }
        },
        removeFromCart(subject) {
            const cartItemIndex = this.cart.findIndex(item => item.subject === subject);
            if (cartItemIndex !== -1) {
                const cartItem = this.cart[cartItemIndex];
                const lesson = this.lessons.find(l => l.subject === subject);
                if (lesson) {
                    lesson.spaces += cartItem.spaces;
                }
                this.cart.splice(cartItemIndex, 1);
            }
        },
        toggleCartPage() {
            this.showCartPage = !this.showCartPage;
        },
        submitOrder() {
            if (this.isCheckoutValid) {
                this.showConfirmationPopup = true; 
                this.orderConfirmation = `Thank you, ${this.customerName}! Your order has been placed successfully.`;

                // time to hide the confirmation
                setTimeout(() => {
                    this.cart = [];
                    this.customerName = '';
                    this.customerPhone = '';
                    this.showConfirmationPopup = false;
                    this.showCartPage = false; 
                }, 3000);
            } else {
                alert('Please enter a valid name and 10-digit phone number before checking out.');
            }
        }
    }
}).mount('#app');