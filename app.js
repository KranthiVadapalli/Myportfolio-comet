// Portfolio JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link and handle smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
            
            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active link immediately
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Handle hero button clicks
    const heroCTABtns = document.querySelectorAll('.hero-buttons .btn');
    heroCTABtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                    if (navLink.getAttribute('href') === targetId) {
                        navLink.classList.add('active');
                    }
                });
            }
        });
    });

    // Smooth scrolling and active link highlighting on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(19, 52, 59, 0.98)';
            } else {
                navbar.style.background = 'rgba(19, 52, 59, 0.95)';
            }
        }
        updateActiveNavLink();
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Send email using EmailJS
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // EmailJS Dual Email Flow
            // Template 1: Email to Kranthi (you receive this)
            const emailToKranthi = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_name: 'Kranthi'
            };

            console.log('EmailJS initialized:', typeof emailjs !== 'undefined');
            console.log('Sending email to Kranthi with data:', emailToKranthi);
            
            // Send email to Kranthi
            emailjs.send('service_p5iz8dd', 'template_7hy3gsh', emailToKranthi)
                .then(function(response) {
                    console.log('Email to Kranthi sent successfully:', response);
                    
                    // Show success message with contact information
                    const successMessage = `✅ Message Sent Successfully!

Hi ${name}, thank you for reaching out to me! I have received your message and will get back to you as soon as possible.
I look forward to connecting with you!`;
                    
                    alert(successMessage);
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                })
                .catch(function(error) {
                    console.error('EmailJS Error:', error);
                    console.error('Error details:', {
                        status: error.status,
                        text: error.text,
                        message: error.message
                    });
                    
                    // Show user-friendly error message
                    alert('Sorry, there was an error sending your message. Please try again or contact me directly at vadapallikranthi12@gmail.com');
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                });
        });
    }

    // Chatbot functionality
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const chatbotNotification = document.getElementById('chatbot-notification');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    let isChatbotOpen = false;
    let hasInteracted = false;

    // Chatbot responses based on the provided data
    const chatbotResponses = {
        greeting: "Hi! I'm Kranthi's AI assistant. I can tell you about my DevOps experience, technical skills, projects, and career journey. What would you like to know?",
        
        experience: "I have 2+ years of DevOps experience, currently working at Edvenswa Tech Inc in the CTO office. I've worked extensively with Kubernetes, Docker, AWS, and have built AI agent automation platforms. Previously at InferScience, I led test automation pipelines with Laravel Dusk and containerized environments.",
        
        skills: "My core skills include:\n\n🐳 **Containerization**: Docker, Kubernetes, AWS ECS\n☁️ **Cloud**: AWS (EC2, S3, IAM, Lambda), Azure, GCP\n🔧 **IaC**: Terraform, Ansible, CloudFormation\n🔄 **CI/CD**: Jenkins, GitHub Actions, GitLab CI, ArgoCD\n📊 **Monitoring**: Prometheus, Grafana, ELK Stack, CloudWatch\n💻 **Scripting**: Bash, Python, Go\n🤖 **AI Tools**: n8n workflows, LLM deployments",
        
        projects: "Here are some of my key projects:\n\n🤖 **AI Agent Automation Platform**: Built and deployed AI Agents using n8n workflows, LLMs, and MCP servers on AWS\n\n📊 **Open-Source Status Page**: Developed monitoring solution using Cachet with email/Slack alerts\n\n📈 **Go Metrics Dashboard**: Created dashboards for server metrics visualization from ELK Stack API\n\n🧪 **Laravel Test Automation**: Automated test pipelines with Docker containerization and parallel execution",
        
        certifications: "I hold three Cribl certifications:\n• Cribl Certified User (Level 1)\n• Cribl Certified Admin - Stream (Level 2)\n• Cribl Certified Admin - Edge (Level 2)\n\nThese certifications demonstrate my expertise in data observability and log management.",
        
        education: "I have a Bachelor of Technology (BTech) in Electrical, Electronics, and Communications Engineering from Anurag Engineering College (2019-2023) with a 7.4 grade.",
        
        contact: "You can reach me through:\n\n📧 **Email**: vadapallikranthi12@gmail.com\n📱 **Phone**: +91 8688883833\n💼 **LinkedIn**: linkedin.com/in/kranthi-vadapalli\n📍 **Location**: Hyderabad, Telangana, India\n\nI'm always open to discussing new opportunities and interesting projects!",
        
        current_role: "I'm currently working as a Dev-Ops Engineer at Edvenswa Tech Inc in the CTO office since May 2024. I focus on building AI Agent automation platforms, managing cloud infrastructure on AWS/GCP, and implementing monitoring solutions with ELK Stack and Prometheus.",
        
        aws: "I have extensive experience with AWS services including EC2, S3, IAM, Lambda, VPC, ECS, and CloudWatch. I've designed and deployed infrastructure using AWS ECS for containerized workloads and implemented auto-deployment pipelines with S3 versioning.",
        
        kubernetes: "I'm proficient in Kubernetes-based deployments and container orchestration. I've worked with GitOps-style deployment workflows and have hands-on experience managing containerized workloads in production environments.",
        
        terraform: "I use Terraform extensively for Infrastructure as Code (IaC). I've implemented infrastructure automation on both AWS and GCP using Terraform, combined with Ansible for configuration management.",
        
        monitoring: "I have strong experience with observability solutions including Prometheus for metrics collection, Grafana for visualization, ELK Stack for log management, and CloudWatch for AWS monitoring. I've built centralized monitoring systems and created Go-based dashboards for metrics visualization.",
        
        default: "I can help you learn more about my DevOps experience, technical skills, projects, or how to contact me. Try asking about my experience with AWS, Kubernetes, monitoring tools, or my current projects!"
    };

    // Function to get appropriate response
    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('experience') || message.includes('work') || message.includes('job')) {
            return chatbotResponses.experience;
        } else if (message.includes('skill') || message.includes('technology') || message.includes('tech')) {
            return chatbotResponses.skills;
        } else if (message.includes('project') || message.includes('work on') || message.includes('built')) {
            return chatbotResponses.projects;
        } else if (message.includes('contact') || message.includes('reach') || message.includes('email')) {
            return chatbotResponses.contact;
        } else if (message.includes('certification') || message.includes('certified')) {
            return chatbotResponses.certifications;
        } else if (message.includes('education') || message.includes('degree') || message.includes('study')) {
            return chatbotResponses.education;
        } else if (message.includes('current') || message.includes('now') || message.includes('present')) {
            return chatbotResponses.current_role;
        } else if (message.includes('aws') || message.includes('amazon')) {
            return chatbotResponses.aws;
        } else if (message.includes('kubernetes') || message.includes('k8s')) {
            return chatbotResponses.kubernetes;
        } else if (message.includes('terraform') || message.includes('infrastructure')) {
            return chatbotResponses.terraform;
        } else if (message.includes('monitoring') || message.includes('prometheus') || message.includes('grafana')) {
            return chatbotResponses.monitoring;
        } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return chatbotResponses.greeting;
        }
        
        return chatbotResponses.default;
    }

    // Function to add message to chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        
        if (chatbotMessages) {
            chatbotMessages.appendChild(messageDiv);
            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        typingDiv.id = 'typing-indicator';
        
        if (chatbotMessages) {
            chatbotMessages.appendChild(typingDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    }

    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Function to send message
    function sendMessage(message) {
        if (!message.trim()) return;
        
        // Add user message
        addMessage(message, true);
        
        // Clear input
        if (chatbotInput) {
            chatbotInput.value = '';
        }
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate bot thinking time
        setTimeout(() => {
            removeTypingIndicator();
            const response = getBotResponse(message);
            addMessage(response);
        }, Math.random() * 1000 + 1000); // 1-2 seconds delay
        
        // Hide suggestions after first interaction
        if (!hasInteracted) {
            hasInteracted = true;
            const suggestions = document.getElementById('chatbot-suggestions');
            if (suggestions) {
                suggestions.style.display = 'none';
            }
        }
    }

    // Chatbot toggle functionality
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            isChatbotOpen = !isChatbotOpen;
            
            if (chatbotWindow) {
                if (isChatbotOpen) {
                    chatbotWindow.classList.add('active');
                } else {
                    chatbotWindow.classList.remove('active');
                }
            }
            
            // Hide notification when opened
            if (isChatbotOpen && chatbotNotification) {
                chatbotNotification.style.display = 'none';
            }
        });
    }

    // Close chatbot
    if (chatbotClose) {
        chatbotClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            isChatbotOpen = false;
            if (chatbotWindow) {
                chatbotWindow.classList.remove('active');
            }
        });
    }

    // Send message on enter key
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage(chatbotInput.value);
            }
        });
    }

    // Send message on button click
    if (chatbotSendBtn) {
        chatbotSendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (chatbotInput) {
                sendMessage(chatbotInput.value);
            }
        });
    }

    // Suggestion buttons
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const question = this.getAttribute('data-question');
            if (question) {
                sendMessage(question);
            }
        });
    });

    // Close chatbot when clicking outside
    document.addEventListener('click', function(e) {
        if (chatbotContainer && !chatbotContainer.contains(e.target) && isChatbotOpen) {
            isChatbotOpen = false;
            if (chatbotWindow) {
                chatbotWindow.classList.remove('active');
            }
        }
    });

    // Animate skill cards on scroll
    function animateOnScroll() {
        const skillCards = document.querySelectorAll('.skill-category');
        const projectCards = document.querySelectorAll('.project-card');
        const experienceItems = document.querySelectorAll('.experience-item');

        function checkVisibility(elements) {
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;

                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        }

        // Initialize elements as hidden
        [...skillCards, ...projectCards, ...experienceItems].forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease-out';
        });

        checkVisibility(skillCards);
        checkVisibility(projectCards);
        checkVisibility(experienceItems);
    }

    // Initial animation check
    animateOnScroll();

    // Animation on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Show notification periodically to encourage chatbot interaction
    let notificationShown = false;
    setTimeout(() => {
        if (!notificationShown && !hasInteracted && chatbotNotification) {
            chatbotNotification.style.display = 'flex';
            notificationShown = true;
            
            // Auto-hide notification after 10 seconds
            setTimeout(() => {
                if (!hasInteracted && chatbotNotification) {
                    chatbotNotification.style.display = 'none';
                }
            }, 10000);
        }
    }, 5000);

    // Initialize active nav link
    updateActiveNavLink();
});