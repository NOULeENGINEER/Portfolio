// Main JavaScript file for GitHub Copilot Agent Demo

// Code examples to display
const codeExamples = [
    {
        language: 'JavaScript',
        code: `// Function to fetch user data
async function getUserData(userId) {
    try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}`
    },
    {
        language: 'Python',
        code: `# Function to process data
def process_data(data_list):
    """Process and transform data."""
    return [item.strip().lower() 
            for item in data_list 
            if item and len(item) > 0]`
    },
    {
        language: 'TypeScript',
        code: `// Interface for User object
interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

// Function with type safety
function greetUser(user: User): string {
    return \`Hello, \${user.name}!\`;
}`
    },
    {
        language: 'React',
        code: `// React component with hooks
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        fetchUser(userId).then(setUser);
    }, [userId]);
    
    return user ? <div>{user.name}</div> : <div>Loading...</div>;
}`
    }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('GitHub Copilot Agent Demo loaded!');
    
    // Set up demo button
    const demoButton = document.getElementById('demoButton');
    const codeOutput = document.getElementById('codeOutput');
    
    if (demoButton && codeOutput) {
        let currentIndex = 0;
        
        demoButton.addEventListener('click', function() {
            // Get next code example
            const example = codeExamples[currentIndex];
            
            // Update output
            codeOutput.textContent = `// ${example.language} Example\n\n${example.code}`;
            codeOutput.classList.add('visible');
            
            // Update button text
            demoButton.textContent = 'Generate Another Example';
            
            // Move to next example (loop back to start)
            currentIndex = (currentIndex + 1) % codeExamples.length;
            
            // Add animation effect
            codeOutput.style.animation = 'none';
            setTimeout(() => {
                codeOutput.style.animation = 'fadeIn 0.3s';
            }, 10);
        });
    }
    
    // Add smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add interactive effects to capability cards
    const cards = document.querySelectorAll('.capability-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = 'var(--primary-color)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderColor = 'var(--border-color)';
        });
    });
    
    // Log capabilities for debugging
    console.log('Demo features initialized:');
    console.log('- Code example generator');
    console.log('- Interactive capability cards');
    console.log('- Smooth scrolling');
    console.log('- Responsive design');
});

// Utility function for analytics (placeholder)
function trackInteraction(action, label) {
    console.log(`Analytics: ${action} - ${label}`);
    // In a real app, this would send data to an analytics service
}

// Export functions for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        codeExamples,
        trackInteraction
    };
}
