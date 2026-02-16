// Configuration - Easily changeable phone number
const CONTACT_NUMBER = "916305017247";
const WHATSAPP_MESSAGE = "i am interested";

document.addEventListener('DOMContentLoaded', () => {
    // 1. WhatsApp Link Logic
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    const whatsappUrl = `https://wa.me/${CONTACT_NUMBER}?text=${encodedMessage}`;

    const whatsappLinks = document.querySelectorAll('.whatsapp-link');
    whatsappLinks.forEach(link => {
        link.href = whatsappUrl;
        link.target = "_blank"; // Open in new tab
    });

    // 2. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // 3. Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. "Add to Plan" Animation Logic
    const addButtons = document.querySelectorAll('.service-footer .btn-secondary');

    addButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Prevent multiple rapid clicks
            if (btn.classList.contains('btn-success')) return;

            const originalText = btn.innerHTML;

            // Apply animation and success state
            btn.classList.add('btn-click-anim', 'btn-success');
            btn.innerHTML = '<i class="fas fa-check"></i> Added';

            // ADD TO CART LOGIC
            const card = btn.closest('.service-card');
            if (card) {
                const title = card.querySelector('h3').innerText;
                const price = card.querySelector('.price').innerText;
                addItemToCart(title, price);
            }

            // Increment Cart Count
            const cartCountElement = document.getElementById('cart-count');
            if (cartCountElement) {
                // Count is managed by addItemToCart now, but for visual update we can keep this or sync it.
                // Let's rely on the shared state to be safe, but since addItemToCart is new, 
                // we should update this logic to reflect the array length.
                updateCartUI();

                // Add a small bounce effect to cart icon if desired
                const cartIcon = document.getElementById('cart-icon');
                if (cartIcon) {
                    cartIcon.style.transform = 'scale(1.2)';
                    setTimeout(() => cartIcon.style.transform = 'scale(1)', 200);
                }
            }

            // Remove animation class after it plays
            setTimeout(() => {
                btn.classList.remove('btn-click-anim');
            }, 400);

            // Revert after feedback period
            setTimeout(() => {
                btn.classList.remove('btn-success');
                btn.innerHTML = originalText;
            }, 2000);
        });
    });

    // 5. Mobile Menu Logic
    const mobileToggle = document.getElementById('mobile-toggle');
    const nav = document.querySelector('.header .nav');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent document click from executing immediately
            nav.classList.toggle('nav-active');

            // Change icon
            const icon = mobileToggle.querySelector('i');
            if (nav.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('nav-active') && !nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                nav.classList.remove('nav-active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }


    // 6. Cart Data & Logic
    let cart = [];

    function addItemToCart(title, price) {
        cart.push({ title, price });
        updateCartUI();
    }

    function updateCartUI() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cart.length;
        }
    }

    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            let message = "Your Cart:\n\n";
            let total = 0;

            cart.forEach((item, index) => {
                message += `${index + 1}. ${item.title} - ${item.price}\n`;
                // Extract number from price string (e.g. ₹1,095 -> 1095)
                const priceValue = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
                total += priceValue;
            });

            message += `\nTotal: ₹${total}`;
            message += `\n\nProceed to checkout? (Demo)`;

            if (confirm(message)) {
                // meaningful action for demo
                const encodedMessage = encodeURIComponent(`Hello, I would like to book the following services:\n${cart.map(i => i.title).join(', ')}\nTotal: ₹${total}`);
                const whatsappUrl = `https://wa.me/${CONTACT_NUMBER}?text=${encodedMessage}`;
                window.open(whatsappUrl, '_blank');
            }
        });
    }
});
