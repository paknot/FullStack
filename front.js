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
                { subject: 'Business', location: 'Brighton', price: 35, spaces: 5, icon: 'fas fa-business-time' }, // Fixed typo
                { subject: 'Music', location: 'London', price: 24, spaces: 5, icon: 'fas fa-music' },
                { subject: 'Chess', location: 'Online', price: 15, spaces: 5, icon: 'fas fa-chess' }
            ],
            searchQuery: '',
            sortAttribute: 'subject',
            sortOrder: 'asc'
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

                // Handle numeric sorting for price and spaces
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
        }
    }
}).mount('#app');