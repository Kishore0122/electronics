const scriptURL = 'https://script.google.com/macros/s/AKfycbziWzUFrVnUVaodkOWac7TWRgrKUXUwCwI90G4G8CDpZyNtCYZbQhoWN0D9HvIIQdeB/exec';
const form = document.getElementById('contactForm');
const popup = document.getElementById('popup');
const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const cardWidth = 450;
let autoScrollInterval;

form.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = document.getElementById('submit');
    submitBtn.disabled = true;
    
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(() => {
            showPopup("Message sent successfully!");
            form.reset();
        })
        .catch(error => {
            console.error('Error!', error.message);
            showPopup("Error sending message. Please try again.");
        })
        .finally(() => submitBtn.disabled = false);
});

function showPopup(message) {
    popup.textContent = message;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 5000);
}

function setupInfiniteScroll() {
    const cards = slider.children;
    const firstCardClone = cards[0].cloneNode(true);
    const lastCardClone = cards[cards.length - 1].cloneNode(true);
    
    slider.appendChild(firstCardClone);
    slider.insertBefore(lastCardClone, cards[0]);
    slider.scrollLeft = cardWidth;
}

function handleInfiniteScroll() {
    const totalWidth = slider.scrollWidth;
    const currentScroll = slider.scrollLeft;
    const containerWidth = slider.clientWidth;
    
    if (currentScroll >= totalWidth - containerWidth - cardWidth/2) {
        slider.scrollLeft = cardWidth;
    } else if (currentScroll <= 0) {
        slider.scrollLeft = totalWidth - containerWidth - cardWidth * 2;
    }
}

const scrollNext = () => {
    slider.scrollLeft += cardWidth;
    handleInfiniteScroll();
};

const scrollPrev = () => {
    slider.scrollLeft -= cardWidth;
    handleInfiniteScroll();
};

const startAutoScroll = () => autoScrollInterval = setInterval(scrollNext, 5000);
const stopAutoScroll = () => clearInterval(autoScrollInterval);

prevBtn.addEventListener('click', () => {
    scrollPrev();
    stopAutoScroll();
});

nextBtn.addEventListener('click', () => {
    scrollNext();
    stopAutoScroll();
});

slider.addEventListener('mouseenter', stopAutoScroll);
slider.addEventListener('mouseleave', startAutoScroll);
slider.addEventListener('scroll', handleInfiniteScroll);

setupInfiniteScroll();
startAutoScroll();