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
                        { subject: 'Buisness', location: 'Brighton', price: 35, spaces: 5, icon: 'fas fa-business-time' },
                        { subject: 'Music', location: 'London', price: 24, spaces: 5, icon: 'fas fa-music' },
                        { subject: 'Chess', location: 'Online', price: 15, spaces: 5, icon: 'fas fa-chess' }
                    ]
                };
            }
        }).mount('#app');